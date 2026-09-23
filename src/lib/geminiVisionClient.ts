/**
 * Direct Client-side Google Gemini Vision API Client
 * Runs directly in the browser (supports Vercel SPA, mobile Safari/Chrome, and desktop).
 */

const DEFAULT_GEMINI_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) ||
  (typeof process !== 'undefined' && process.env && (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY)) ||
  (typeof localStorage !== 'undefined' && localStorage.getItem('biodex_gemini_api_key')) ||
  '';

export interface GeminiVisionResult {
  commonName: string;
  scientificName: string;
  confidence: number;
  description: string;
  visualFeatures: string[];
  kingdom: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  iucnStatus: string;
  endangeredStatus?: string;
  conservationStatus?: string;
  climateZone?: string;
  medicinalProperties?: string;
  commonUses?: string;
  predominantRegions?: string[];
  interestingFacts?: string[];
  habitatType: string;
  keyThreats?: string;
  educationalNotes?: string;
  ecologicalRole?: string;
  googleLensFact?: string;
  similarVisualMatches?: { name: string; distinction: string }[];
  tags: string[];
}

function cleanJsonResponse(rawText: string): any {
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }
    throw new Error(`Failed to parse JSON: ${cleaned.slice(0, 100)}`);
  }
}

export async function identifyWithGeminiDirect(
  imageBase64: string,
  commonNameHint: string = '',
  apiKey: string = DEFAULT_GEMINI_KEY
): Promise<GeminiVisionResult | null> {
  const cleanKey = (apiKey || DEFAULT_GEMINI_KEY).trim();
  if (!cleanKey) {
    console.warn('[Gemini Vision] No API key available for direct Gemini call.');
    return null;
  }

  // Extract pure base64 data and mime type
  let cleanBase64 = imageBase64;
  let mimeType = 'image/jpeg';
  const dataUrlMatch = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
  if (dataUrlMatch) {
    mimeType = dataUrlMatch[1];
    cleanBase64 = dataUrlMatch[2];
  }

  const prompt = `You are Google Lens, the world's most accurate biological optical recognition AI.
Examine this photograph specimen carefully.
CRITICAL INSTRUCTIONS:
1. Determine what organism, plant, flower, fruit, reptile, insect, bird, animal, or fungi is ACTUALLY depicted in this photograph.
   - If the user is showing a photo on a phone screen, laptop, or book, focus on the NATURAL SUBJECT (e.g. Aloe Vera, Orchid, Rose, Banana, Neem, Tulsi, Bear, Wolf, Tiger), NOT the screen or background!
   - Identify the exact species accurately with high confidence!
2. Provide authentic binomial scientific name (Genus species), taxonomic hierarchy (kingdom, phylum, class, order, family, genus), and IUCN conservation status.
3. Determine endangered risk: whether the species is endangered or likely to become endangered (e.g. "Endangered - High Risk of Extinction", "Vulnerable - In Decline", "Near Threatened - Under Monitoring", or "Secure / Least Concern").
4. Specify climate/biome classification (e.g., Tropical, Subtropical, Temperate, Arid/Desert, Alpine, Mediterranean).
5. Specify medicinal properties and therapeutic uses (e.g. active healing compounds, soothing properties, anti-inflammatory, digestive aid, or "Non-medicinal / Ornamental" if none).
6. Specify where and how the plant/specimen is commonly used (e.g. culinary spice, skincare cosmetics, herbal tea, indoor air purification, traditional craftsmanship, agroforestry).
7. List 2 to 4 major countries or geographic regions where it is predominantly found.
8. Provide 2-3 fascinating, memorable, and educational facts about the species.
9. Provide 4 specific visual diagnostic features visible in this photo.
10. Provide an engaging 2-sentence overview written for students in simple, fun language.

Return a valid JSON object ONLY with the following schema:
{
  "commonName": "string (Exact common name)",
  "scientificName": "string (Binomial name, e.g. Aloe vera, Platanthera praeclara)",
  "confidence": number (between 92.0 and 99.8),
  "description": "string (2-3 engaging sentences for students)",
  "endangeredStatus": "string (e.g. Endangered - High Risk of Extinction | Vulnerable | Near Threatened | Secure / Least Concern)",
  "conservationStatus": "string (e.g. IUCN Red List: Endangered (EN) | Vulnerable (VU) | Least Concern (LC))",
  "climateZone": "string (e.g. Tropical & Subtropical | Temperate Grassland | Arid & Semi-Desert | Mediterranean)",
  "medicinalProperties": "string (Detailed medicinal qualities, bioactive compounds, and therapeutic applications)",
  "commonUses": "string (Where and how the plant is commonly used: culinary, cosmetic, decorative, agroforestry, cultural)",
  "predominantRegions": ["string", "string", "string"],
  "interestingFacts": ["string", "string"],
  "visualFeatures": ["string", "string", "string", "string"],
  "kingdom": "string (e.g. PLANTAE or ANIMALIA)",
  "phylum": "string",
  "class": "string",
  "order": "string",
  "family": "string",
  "genus": "string",
  "iucnStatus": "Least Concern" | "Near Threatened" | "Vulnerable" | "Endangered" | "Critically Endangered",
  "habitatType": "string",
  "keyThreats": "string",
  "educationalNotes": "string",
  "ecologicalRole": "string",
  "googleLensFact": "string",
  "similarVisualMatches": [
    { "name": "string", "distinction": "string" },
    { "name": "string", "distinction": "string" }
  ],
  "tags": ["string", "string", "string"]
}
${commonNameHint ? `Hint from camera sensor: ${commonNameHint}` : ''}`;

  // Try verified, active Gemini models in order of capability and speed
  const models = ['gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];
  let lastError = '';

  for (const model of models) {
    try {
      console.log(`[Gemini Vision] Calling ${model} directly via Google REST API...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: cleanBase64,
                  },
                },
                { text: prompt },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.warn(`[Gemini Vision] ${model} HTTP ${response.status}:`, errBody);
        lastError = `HTTP ${response.status}: ${errBody}`;
        continue;
      }

      const json = await response.json();
      const rawCandidate = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawCandidate) {
        const parsed = cleanJsonResponse(rawCandidate);
        if (parsed && parsed.commonName) {
          console.log(`[Gemini Vision] Successfully identified with ${model}:`, parsed.commonName);
          return parsed as GeminiVisionResult;
        }
      }
    } catch (err: any) {
      lastError = err?.message || String(err);
      console.warn(`[Gemini Vision] ${model} attempt failed:`, lastError);
    }
  }

  console.error('[Gemini Vision] All Gemini models failed:', lastError);
  return null;
}
