import { SpeciesData } from '../types';
import { INITIAL_SPECIES_CATALOG } from '../data/species';

export const CUSTOM_SPECIES_KEY = 'biodex_custom_species_catalog';

// Check if a species name indicates an undetected / unidentified placeholder
export function isUnidentifiedSpeciesName(name?: string | null): boolean {
  if (!name || !name.trim()) return true;
  const n = name.trim().toLowerCase();
  return (
    n.includes('unidentified') ||
    n.includes('species not detected') ||
    n.includes('new species detected') ||
    n.includes('pending identification') ||
    n.includes('not evaluated') ||
    n === 'unknown'
  );
}

// Retrieve saved custom species from localStorage
export function getCustomSpeciesCatalog(): SpeciesData[] {
  try {
    const raw = localStorage.getItem(CUSTOM_SPECIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[CustomSpeciesDB] Error reading custom catalog:', err);
    return [];
  }
}

// Get the full unified catalog: user-discovered species first, then initial catalog
export function getFullSpeciesCatalog(): SpeciesData[] {
  const custom = getCustomSpeciesCatalog();
  const map = new Map<string, SpeciesData>();
  // Custom user-discovered species FIRST so students see their saved species immediately
  custom.forEach((s) => map.set(s.id, { ...s, isCustomDiscovery: true, isUserSaved: true }));
  INITIAL_SPECIES_CATALOG.forEach((s) => {
    if (!map.has(s.id)) {
      map.set(s.id, s);
    }
  });
  return Array.from(map.values());
}

// Delete a custom species from localStorage
export function deleteCustomSpecies(idOrName: string): void {
  try {
    const clean = (idOrName || '').toLowerCase().trim();
    if (!clean) return;
    const current = getCustomSpeciesCatalog();
    const updated = current.filter(
      (s) => s.id.toLowerCase() !== clean && s.commonName.toLowerCase() !== clean
    );
    localStorage.setItem(CUSTOM_SPECIES_KEY, JSON.stringify(updated));
    console.log(`[CustomSpeciesDB] Deleted custom species "${idOrName}".`);
  } catch (err) {
    console.warn('[CustomSpeciesDB] Error deleting custom species:', err);
  }
}

// Save or update a custom species in localStorage
export function saveCustomSpecies(newSpecies: SpeciesData, keywords: string[] = []): void {
  try {
    if (!newSpecies || isUnidentifiedSpeciesName(newSpecies.commonName)) {
      return; // Do not persist placeholders
    }

    const current = getCustomSpeciesCatalog();
    const existingIndex = current.findIndex(
      (s) => s.id === newSpecies.id || s.commonName.toLowerCase() === newSpecies.commonName.toLowerCase()
    );

    // Attach detection keywords to tags so we can match them next time
    const cleanKeywords = Array.from(
      new Set([
        ...keywords.map((k) => k.toLowerCase().trim()),
        newSpecies.commonName.toLowerCase(),
        newSpecies.scientificName.toLowerCase(),
        newSpecies.category.toLowerCase(),
      ])
    ).filter(Boolean);

    const enrichedSpecies: SpeciesData = {
      ...newSpecies,
      tags: Array.from(new Set([...(newSpecies.tags || []), ...cleanKeywords, 'Custom Discovery'])),
    };

    let updated: SpeciesData[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = enrichedSpecies;
    } else {
      updated = [enrichedSpecies, ...current];
    }

    localStorage.setItem(CUSTOM_SPECIES_KEY, JSON.stringify(updated));
    console.log(`[CustomSpeciesDB] Saved species "${newSpecies.commonName}" to database with ${cleanKeywords.length} keywords.`);
  } catch (err) {
    console.warn('[CustomSpeciesDB] Error saving species:', err);
  }
}

// Match an incoming scan against previously registered custom species
export function findMatchingCustomSpecies(
  hintText: string,
  mobilenetPredictions?: { className: string; probability: number }[]
): SpeciesData | null {
  const customList = getCustomSpeciesCatalog();
  if (customList.length === 0) return null;

  const hintLower = (hintText || '').toLowerCase();
  const predictionNames = (mobilenetPredictions || []).map((p) => (p.className || '').toLowerCase());

  for (const species of customList) {
    const commonLower = species.commonName.toLowerCase();
    const scientificLower = species.scientificName.toLowerCase();

    // 1. Direct name match
    if (hintLower.includes(commonLower) || (commonLower.includes(hintLower) && hintLower.length > 3)) {
      return species;
    }
    if (hintLower.includes(scientificLower)) {
      return species;
    }

    // 2. MobileNet prediction keyword match
    if (species.tags && species.tags.length > 0) {
      for (const tag of species.tags) {
        const t = tag.toLowerCase();
        if (t.length < 3 || t === 'flora' || t === 'fauna' || t === 'custom discovery') continue;

        // Check if any MobileNet prediction matches this tag
        for (const pred of predictionNames) {
          if (pred.includes(t) || t.includes(pred)) {
            console.log(`[CustomSpeciesDB] Matched previously registered "${species.commonName}" via label "${pred}"!`);
            return species;
          }
        }

        // Check hint text
        if (hintLower.includes(t)) {
          console.log(`[CustomSpeciesDB] Matched previously registered "${species.commonName}" via hint "${t}"!`);
          return species;
        }
      }
    }
  }

  return null;
}
