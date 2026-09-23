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
1. Determine what organism, animal, bird, plant, flower, fruit, reptile, insect, or fungi is ACTUALLY depicted in this photograph.
   - If the user is showing a photo of an animal or plant on a phone, laptop screen, or book, focus on the NATURAL SUBJECT (e.g. Brown Bear, Grizzly Bear, Wolf, Orchid, Lily, Hawk, Leopard, Tiger), NOT the screen or background!
   - Identify the exact species accurately with high confidence!
2. Provide authentic binomial scientific name (Genus species), taxonomic hierarchy (kingdom, phylum, class, order, family, genus), and IUCN conservation status.
3. Provide 4 specific visual diagnostic features clearly visible in this photo.
4. Provide a rich 2-sentence overview written for students in simple, fun language.
5. Provide its ecological role, a "did-you-know" fun fact, and 2 lookalikes with distinctions.

Return a valid JSON object ONLY with the following schema:
{
  "commonName": "string (Exact common name, e.g. Brown Bear, Grizzly Bear, Red-Tailed Hawk, Stargazer Lily)",
  "scientificName": "string (Binomial name, e.g. Ursus arctos, Buteo jamaicensis)",
  "confidence": number (between 92.0 and 99.8),
  "description": "string (2-3 engaging sentences for students)",
  "visualFeatures": ["string", "string", "string", "string"],
  "kingdom": "string (e.g. ANIMALIA or PLANTAE)",
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

  // Try Gemini models in order of capability and speed
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
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
