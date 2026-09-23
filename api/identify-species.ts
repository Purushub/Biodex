import { identifyWithGeminiDirect } from '../src/lib/geminiVisionClient';

export default async function handler(req: any, res: any) {
  // Handle CORS for Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64, commonNameHint, scanMode, customSpeciesCatalog } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64' });
    }

    // Check custom species catalog first
    if (Array.isArray(customSpeciesCatalog) && customSpeciesCatalog.length > 0) {
      const hintLower = (commonNameHint || '').toLowerCase();
      for (const cs of customSpeciesCatalog) {
        if (cs.commonName && hintLower.includes(cs.commonName.toLowerCase())) {
          return res.json({
            success: true,
            data: cs,
            source: 'CustomSpecies-Database',
          });
        }
      }
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      '';

    const result = await identifyWithGeminiDirect(imageBase64, commonNameHint, apiKey);

    if (result) {
      return res.json({
        success: true,
        data: result,
        source: 'Gemini-2.5-Flash-Vercel',
      });
    }

    // Fallback if Gemini rate-limited
    return res.json({
      success: true,
      data: {
        commonName: commonNameHint || 'Species not detected',
        scientificName: commonNameHint ? `${commonNameHint} sp.` : 'New species detected, please input name',
        confidence: 85.0,
        isNewSpecies: !commonNameHint,
        kingdom: 'EUKARYOTA',
        order: 'NEW_DISCOVERY',
        family: 'Field Discovery',
        iucnStatus: 'New Discovery',
        description: 'Species analyzed in field observation reticle.',
        visualFeatures: ['Observed in camera reticle'],
        tags: ['Field Observation'],
      },
      source: 'Taxonomy-Fallback',
    });
  } catch (err: any) {
    console.error('Vercel API error:', err);
    return res.status(500).json({ error: err?.message || 'Identification failed' });
  }
}
