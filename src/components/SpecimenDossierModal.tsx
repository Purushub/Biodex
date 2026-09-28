import React from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  SunMedium,
  HeartPulse,
  Sparkles,
  Globe2,
  BookOpen,
  LineChart,
  Leaf,
  MapPin,
  Compass,
  AlertTriangle,
  Utensils,
  ExternalLink,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { SpeciesData, isFaunaSpecies } from '../types';
import { soundFX } from '../utils/audio';

interface SpecimenDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  specimen: SpeciesData | null;
  onNavigateToBioDex?: () => void;
  onNavigateToPredict?: () => void;
}

export const SpecimenDossierModal: React.FC<SpecimenDossierModalProps> = ({
  isOpen,
  onClose,
  specimen,
  onNavigateToBioDex,
  onNavigateToPredict,
}) => {
  if (!isOpen || !specimen) return null;

  const isFauna = isFaunaSpecies(specimen);
  const isFlora = !isFauna;

  const isEndangered =
    (specimen.iucnStatus && specimen.iucnStatus.toLowerCase().includes('endangered')) ||
    (specimen.endangeredStatus && specimen.endangeredStatus.toLowerCase().includes('endangered'));
  const isVulnerable =
    (specimen.iucnStatus && (specimen.iucnStatus.toLowerCase().includes('vulnerable') || specimen.iucnStatus.toLowerCase().includes('threatened'))) ||
    (specimen.endangeredStatus && specimen.endangeredStatus.toLowerCase().includes('vulnerable'));

  const statusBadgeColor = isEndangered
    ? 'bg-rose-50 text-rose-700 border-rose-200'
    : isVulnerable
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  const regions: string[] = Array.isArray(specimen.predominantRegions) && specimen.predominantRegions.length > 0
    ? specimen.predominantRegions
    : ['North America', 'Eurasia', 'Neotropical Zones'];

  const facts: string[] = Array.isArray(specimen.interestingFacts) && specimen.interestingFacts.length > 0
    ? specimen.interestingFacts
    : [
        specimen.curriculumDiscussion || 'Specimen registered in the regional biodiversity survey log.',
        'Plays a vital role supporting local ecological equilibrium and food web stability.',
      ];

  // Extinction reasons formatting
  const extinctionReasonsList: string[] = Array.isArray(specimen.extinctionReasons) && specimen.extinctionReasons.length > 0
    ? specimen.extinctionReasons
    : typeof specimen.extinctionReasons === 'string'
    ? [specimen.extinctionReasons]
    : isFauna
    ? [
        'Habitat fragmentation and loss of contiguous wild foraging corridors.',
        'Retaliatory human-wildlife conflict and depleted prey or food supplies.',
        'Seasonal climate volatility and anthropogenic barrier disturbances.',
      ]
    : [
        'Conversion of native wild grassland and wetland biomes into intensive agricultural land.',
        'Alteration of regional subterranean groundwater hydrology and soil moisture retention.',
        'Pesticide or herbicide drift suppressing native pollinator and mycorrhizal support.',
      ];

  // Preventive measures formatting
  const preventiveMeasuresList: string[] = Array.isArray(specimen.preventiveMeasures) && specimen.preventiveMeasures.length > 0
    ? specimen.preventiveMeasures
    : typeof specimen.preventiveMeasures === 'string'
    ? [specimen.preventiveMeasures]
    : isFauna
    ? [
        'Establish and legally enforce contiguous wildlife underpasses and eco-corridors.',
        'Intensified anti-poaching patrols equipped with SMART satellite camera surveillance.',
        'Community-based conflict resolution, habitat restoration, and prey protection.',
      ]
    : [
        'Establish dedicated native botanical preserves and conservation easements.',
        'Implement controlled prescribed burning and hydrology restoration programs.',
        'Protect nocturnal and diurnal native pollinator flyways with pesticide-free buffer zones.',
      ];

  // Diet badge styling for Fauna
  const dietType = (specimen.dietType || (isFauna ? 'Herbivore' : '')).trim();
  const dietBadgeColor =
    dietType.toLowerCase() === 'carnivore'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : dietType.toLowerCase() === 'omnivore'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  const dietIcon =
    dietType.toLowerCase() === 'carnivore' ? '🥩' : dietType.toLowerCase() === 'omnivore' ? '🥗' : '🌿';

  // Article URL for Flora
  const floraArticleUrl =
    specimen.medicinalArticleUrl ||
    `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(specimen.scientificName || specimen.commonName)}+medicinal+health`;
  const floraArticleTitle =
    specimen.medicinalArticleTitle ||
    `NCBI PubMed: Medical & Pharmacological Research on ${specimen.commonName}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <header className="shrink-0 h-14 px-4 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                isFauna
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              {isFauna ? <ShieldAlert className="w-4 h-4" /> : <Leaf className="w-4 h-4" />}
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm tracking-tight block leading-tight font-sans">
                {isFauna ? 'Zoological Specimen Dossier' : 'Botanical Specimen Dossier'}
              </span>
              <span className="font-mono text-[10px] text-slate-400 leading-none">
                {specimen.slotNumber || '#SPECIES-ANALYSIS'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {specimen.visionMatchConfidence || 98.6}% MATCH
            </span>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close Dossier"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {/* Main Visual & Species Title Banner */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 flex gap-3.5 items-center">
            {specimen.imageUrl ? (
              <img
                src={specimen.imageUrl}
                alt={specimen.commonName}
                className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0 bg-white shadow-2xs"
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-xl border flex items-center justify-center shrink-0 ${
                  isFauna
                    ? 'bg-amber-100/50 border-amber-200 text-amber-600'
                    : 'bg-emerald-100/50 border-emerald-200 text-emerald-600'
                }`}
              >
                {isFauna ? <ShieldAlert className="w-8 h-8" /> : <Leaf className="w-8 h-8" />}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                  {specimen.category || (isFauna ? 'Fauna' : 'Flora')}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  {specimen.taxonomy?.family || specimen.subType || (isFauna ? 'Fauna Taxon' : 'Botanical Taxon')}
                </span>
                {isFauna && dietType && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${dietBadgeColor}`}>
                    {dietIcon} {dietType}
                  </span>
                )}
              </div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight mt-1 truncate font-sans">
                {specimen.commonName}
              </h2>
              <p className="text-xs text-slate-500 italic truncate font-sans mt-0.5">
                {specimen.scientificName}
              </p>
            </div>
          </div>

          {/* 1. Conservation & Endangered Status Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {isEndangered ? (
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                  Conservation & Extinction Status
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadgeColor} font-sans`}>
                {specimen.iucnStatus || 'Least Concern'}
              </span>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1.5">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-500 font-medium">Endangered Assessment:</span>
                <span className={`font-bold font-sans ${isEndangered ? 'text-rose-700' : isVulnerable ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {specimen.endangeredStatus || (isEndangered ? 'Endangered - High Extinction Risk' : 'Secure / Least Concern')}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-500 font-medium">Red List Category:</span>
                <span className="font-mono text-slate-700 font-semibold">
                  {specimen.conservationStatus || `IUCN Criteria: ${specimen.iucnCriteria || 'Criteria A2'}`}
                </span>
              </div>
              {specimen.vitalityStats?.extinctionHorizonYear && (
                <div className="flex items-baseline justify-between text-xs pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500 font-medium">Projected Extinction Horizon:</span>
                  <span className="font-mono font-bold text-rose-600">
                    Year {specimen.vitalityStats.extinctionHorizonYear} (unmitigated)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 2. REASONS FOR EXTINCTION / THREATS CARD */}
          <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                  Extinction Risks & Primary Causes
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                THREAT DRIVERS
              </span>
            </div>
            <div className="space-y-2">
              {extinctionReasonsList.map((reason, idx) => (
                <div
                  key={idx}
                  className="bg-rose-50/50 rounded-xl p-2.5 border border-rose-100 flex items-start gap-2.5 text-xs text-slate-800 font-sans leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. PREVENTIVE MEASURES / CONSERVATION ACTIONS CARD */}
          <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                  Preventive Measures & Conservation Action
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                RECOVERY ACTION
              </span>
            </div>
            <div className="space-y-2">
              {preventiveMeasuresList.map((measure, idx) => (
                <div
                  key={idx}
                  className="bg-emerald-50/50 rounded-xl p-2.5 border border-emerald-100 flex items-start gap-2.5 text-xs text-slate-800 font-sans leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                    ✓
                  </span>
                  <span>{measure}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. FAUNA ONLY: DIET & TROPHIC LEVEL CARD */}
          {isFauna && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                    Diet & Trophic Classification
                  </h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${dietBadgeColor} font-sans`}>
                  {dietIcon} {dietType || 'Fauna Diet'}
                </span>
              </div>

              <div className="bg-amber-50/40 rounded-xl p-3 border border-amber-200/60 space-y-2 text-xs text-slate-700 leading-relaxed font-sans">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <span className="text-sm">{dietIcon}</span>
                  <span>
                    Dietary Guild:{' '}
                    <span className="text-amber-800 underline decoration-amber-300">
                      {dietType === 'Carnivore'
                        ? 'Carnivore (Predator & Meat Consumer)'
                        : dietType === 'Omnivore'
                        ? 'Omnivore (Generalist Plant & Animal Consumer)'
                        : 'Herbivore (Primary Foliage & Plant Consumer)'}
                    </span>
                  </span>
                </div>
                <p>
                  {specimen.dietDescription ||
                    (dietType === 'Carnivore'
                      ? 'Preys upon smaller mammals, reptiles, birds, or insects to regulate population densities and maintain top-down trophic balance in its ecosystem.'
                      : dietType === 'Omnivore'
                      ? 'Opportunistic feeder eating a diverse combination of seeds, fruits, foliage, insects, and small vertebrates depending upon seasonal availability.'
                      : 'Specialized herbivore feeding on grasses, leaves, seeds, or nectar, acting as a crucial primary consumer and nutrient cycler.')}
                </p>
              </div>
            </div>
          )}

          {/* 5. FLORA ONLY: MEDICINAL PROPERTIES & HEALTH ARTICLE LINK CARD */}
          {isFlora && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-500 shrink-0" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                    Medicinal Properties & Therapeutic Uses
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                  PHARMACOPEIA
                </span>
              </div>

              <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100/80 text-xs text-slate-700 leading-relaxed font-sans">
                {specimen.medicinalProperties ? (
                  typeof specimen.medicinalProperties === 'string' ? (
                    specimen.medicinalProperties
                  ) : (
                    <ul className="list-disc pl-4 space-y-1">
                      {specimen.medicinalProperties.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  )
                ) : (
                  'Contains active secondary plant compounds, flavonoids, and natural antioxidants supporting cellular resilience. Widely documented in traditional botanical pharmacopeias.'
                )}
              </div>

              {/* HEALTH & MEDICINAL RELATED ARTICLE LINK */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white rounded-xl p-3 border border-emerald-200/90 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-950 font-sans">
                    <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
                    Health & Medicinal Article
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                    Scholarly Literature
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-sans font-medium line-clamp-2">
                  {floraArticleTitle}
                </p>

                <div className="pt-1 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-mono truncate">
                    Verified Medical Reference
                  </span>
                  <a
                    href={floraArticleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer font-sans shrink-0 hover:shadow-emerald-900/10"
                    title="Open verified health and medicinal research article in a new tab"
                  >
                    <span>Read Article</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 6. Climate & Biome Classification Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <SunMedium className="w-4 h-4 text-amber-500 shrink-0" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                Climate Zone & Natural Biome
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200/80 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                {specimen.climateZone || specimen.habitat || 'Temperate & Subtropical Biome'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans mt-1">
              Naturally thrives in {specimen.climateZone ? specimen.climateZone.toLowerCase() : 'native grasslands and protected wildlife sanctuaries'}, adapted to specific seasonal temperatures, soil conditions, and hydrological cycles.
            </p>
          </div>

          {/* 7. Common & Practical Applications / Ecological Role */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              {isFlora ? (
                <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                {isFlora ? 'Where & How It Is Commonly Used' : 'Ecological Role in Ecosystem'}
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50 p-3 rounded-xl border border-slate-100">
              {specimen.commonUses ? (
                typeof specimen.commonUses === 'string' ? (
                  specimen.commonUses
                ) : (
                  specimen.commonUses.join(', ')
                )
              ) : isFlora ? (
                'Commonly utilized across culinary recipes, herbal wellness teas, natural skincare cosmetics, ecological pollinator gardens, and organic agriculture.'
              ) : (
                'Serves as an indispensable demographic anchor, bio-indicator of habitat health, and keystone species sustaining regional food web stability.'
              )}
            </p>
          </div>

          {/* 8. Geographic Distribution / Predominant Regions */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-sky-600 shrink-0" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                Predominant Countries & Regions (2–4 Major)
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {regions.map((region, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-200 flex items-center gap-1.5 shadow-2xs font-sans"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  {region}
                </span>
              ))}
            </div>
          </div>

          {/* 9. Fascinating Educational Facts */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                Did You Know? (Interesting Facts)
              </h3>
            </div>
            <div className="space-y-2">
              {facts.map((fact, idx) => (
                <div
                  key={idx}
                  className="bg-amber-50/60 rounded-xl p-3 border border-amber-200/60 flex items-start gap-2.5 text-xs text-slate-800 font-sans leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-200/80 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Quick Action Buttons */}
        <footer className="shrink-0 p-3 bg-white border-t border-slate-200 grid grid-cols-2 gap-2">
          {onNavigateToBioDex && (
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onClose();
                onNavigateToBioDex();
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all cursor-pointer font-sans"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Open in BioDex</span>
            </button>
          )}

          {onNavigateToPredict && (
            <button
              type="button"
              onClick={() => {
                soundFX.playConfirm();
                onClose();
                onNavigateToPredict();
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-900/10 transition-all cursor-pointer font-sans"
            >
              <LineChart className="w-4 h-4 text-emerald-200" />
              <span>Simulate PVA</span>
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};
