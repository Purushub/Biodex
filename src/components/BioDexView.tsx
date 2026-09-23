import React, { useState } from 'react';
import { SpeciesData, StudentSession, ChassisTheme, SurveyRecord } from '../types';
import { soundFX } from '../utils/audio';
import {
  Search,
  X,
  ChevronRight,
  ArrowLeft,
  Sliders,
  Sparkles,
  BookOpen,
  Camera,
  Calendar,
  Layers,
  MapPin,
  TrendingDown,
  Activity,
  Trash2,
  FileSpreadsheet,
  ArrowUpDown,
  User,
  Check,
  ShieldAlert,
  ShieldCheck,
  SunMedium,
  HeartPulse,
  Globe2,
  Compass,
  Leaf,
} from 'lucide-react';
import { YearWiseSurveyModal } from './YearWiseSurveyModal';
import { ScannedSpecimenFormModal } from './ScannedSpecimenFormModal';

import { INITIAL_SPECIES_CATALOG, enrichSpeciesWithEducationalData } from '../data/species';

interface BioDexViewProps {
  currentSpecies?: SpeciesData;
  catalog?: SpeciesData[];
  onSelectSpecies: (species: SpeciesData) => void;
  session: StudentSession;
  theme: ChassisTheme;
  onRunPredictor: () => void;
  onLogFieldEntry: () => void;
  onReturnToScanner: () => void;
  surveyRecords?: SurveyRecord[];
  onDeleteRecord?: (recordId: string) => void;
  onUpdateRecord?: (record: SurveyRecord) => void;
  onNavigateToTab?: (tab: string) => void;
  onSelectRecordForSimulation?: (rec: SurveyRecord) => void;
}

export const BioDexView: React.FC<BioDexViewProps> = ({
  currentSpecies,
  catalog = [],
  onSelectSpecies,
  session,
  onRunPredictor,
  onLogFieldEntry,
  onReturnToScanner,
  surveyRecords = [],
  onDeleteRecord,
  onUpdateRecord,
  onNavigateToTab,
  onSelectRecordForSimulation,
}) => {
  // Tabs: 'archive' (Observation Log) | 'dossier' (Species Specimen Card) | 'pbr' (SOP-5 Register)
  const [activeSegment, setActiveSegment] = useState<'archive' | 'dossier' | 'pbr'>('archive');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Flora' | 'Fauna' | 'Avian'>('All');
  const [isYearSurveyModalOpen, setIsYearSurveyModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SurveyRecord | null>(null);

  const safeCatalog = (Array.isArray(catalog) && catalog.length > 0 ? catalog : INITIAL_SPECIES_CATALOG).map(enrichSpeciesWithEducationalData);
  const activeSpecies = enrichSpeciesWithEducationalData(currentSpecies || safeCatalog[0] || INITIAL_SPECIES_CATALOG[0]);

  // Category counts
  const floraCount = safeCatalog.filter((s) => {
    const cat = (s?.category || '').toLowerCase();
    return cat.includes('flora') || cat.includes('plant');
  }).length;

  const faunaCount = safeCatalog.filter((s) => {
    const cat = (s?.category || '').toLowerCase();
    return cat.includes('fauna') || cat.includes('mammal') || cat.includes('reptil') || cat.includes('insect');
  }).length;

  const avianCount = safeCatalog.filter((s) => {
    const cat = (s?.category || '').toLowerCase();
    return cat.includes('avian') || cat.includes('bird');
  }).length;

  // Filtered Catalog
  const filteredCatalog = safeCatalog.filter((s) => {
    const common = (s?.commonName || '').toLowerCase();
    const scientific = (s?.scientificName || '').toLowerCase();
    const category = (s?.category || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = common.includes(query) || scientific.includes(query) || category.includes(query);
    if (!matchesSearch) return false;

    if (categoryFilter === 'Flora') {
      return category.includes('flora') || category.includes('plant');
    }
    if (categoryFilter === 'Fauna') {
      return category.includes('fauna') || category.includes('mammal') || category.includes('reptil') || category.includes('insect');
    }
    if (categoryFilter === 'Avian') {
      return category.includes('avian') || category.includes('bird');
    }
    return true;
  });

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    switch (status.toLowerCase()) {
      case 'endangered':
      case 'critically endangered':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'vulnerable':
      case 'threatened':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-white text-slate-900 pb-28 font-sans">
      {/* SEGMENTED CONTROL / VIEW SWITCHER */}
      <div className="pt-2 pb-3 px-1 flex items-center justify-center">
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200/80 shadow-xs">
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveSegment('archive');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSegment === 'archive'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Observation Log
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveSegment('dossier');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSegment === 'dossier'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Specimen Dossier
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setActiveSegment('pbr');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSegment === 'pbr'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            PBR Register
          </button>
        </div>
      </div>

      {/* SEGMENT 1: OBSERVATION LOG (Exact from biodex_history_catalog_bright_minimal) */}
      {activeSegment === 'archive' && (
        <div className="flex flex-col gap-4">
          {/* Title & Search Header */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono font-semibold text-emerald-600 uppercase tracking-wider">
                  Field Archive
                </span>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Observation Log</h1>
              </div>
              <span className="text-xs font-mono font-medium px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-slate-500">
                {catalog.length} Entries
              </span>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center w-full">
              <Search className="absolute left-3.5 text-slate-400 pointer-events-none w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specimens or location..."
                className="w-full h-10 pl-10 pr-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills (Bright Only) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
            {(['All', 'Flora', 'Fauna', 'Avian'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setCategoryFilter(cat);
                }}
                className={`filter-chip px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-400'
                }`}
              >
                <span>
                  {cat === 'All' && 'All'}
                  {cat === 'Flora' && '🌿 Flora'}
                  {cat === 'Fauna' && '🦋 Fauna'}
                  {cat === 'Avian' && '🦅 Avian'}
                </span>
                {cat !== 'All' && (
                  <span className={`font-mono text-[11px] ${categoryFilter === cat ? 'text-slate-300' : 'text-slate-400'}`}>
                    {cat === 'Flora' && floraCount}
                    {cat === 'Fauna' && faunaCount}
                    {cat === 'Avian' && avianCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Streamlined Observation Cards */}
          <div className="flex flex-col gap-3">
            {filteredCatalog.map((specimen) => (
              <article
                key={specimen.id}
                onClick={() => {
                  soundFX.playConfirm();
                  onSelectSpecies(specimen);
                  setActiveSegment('dossier');
                }}
                className="specimen-card bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex gap-3 items-center active:bg-slate-50 transition-colors cursor-pointer hover:border-slate-300"
              >
                {/* Thumbnail with Confidence Badge */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                  <img
                    src={specimen.imageUrl}
                    alt={specimen.commonName}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-white/90 text-emerald-700 font-mono text-[9px] font-bold shadow-xs">
                    {specimen.visionMatchConfidence || 98}%
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-col min-w-0 flex-1 gap-1">
                  <div className="flex items-start justify-between gap-1">
                    <h2 className="text-sm font-bold text-slate-900 truncate">
                      {specimen.commonName}
                    </h2>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                  <p className="text-xs italic text-slate-500 truncate">
                    {specimen.scientificName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[10px] font-semibold uppercase border border-emerald-100">
                      {specimen.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold uppercase border ${getStatusColor(
                        specimen.iucnStatus
                      )}`}
                    >
                      {specimen.iucnStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    Active Observation · {specimen.currentPop2026?.toLocaleString() || '28,500'} Wild Stems
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Action Button: Add New Specimen */}
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              onReturnToScanner();
            }}
            className="w-full h-11 mt-1 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-transform cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Add New Specimen</span>
          </button>
        </div>
      )}

      {/* SEGMENT 2: SPECIMEN DOSSIER (Detailed BioDex Card) */}
      {activeSegment === 'dossier' && (
        <div className="flex flex-col gap-4">
          {/* Top navigation back to archive */}
          <button
            type="button"
            onClick={() => setActiveSegment('archive')}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Observation Log</span>
          </button>

          {/* 4:3 Specimen Image Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="relative aspect-[4/3] w-full bg-slate-100">
              <img
                src={activeSpecies?.imageUrl}
                alt={activeSpecies?.commonName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200/80 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-[11px] font-semibold text-slate-800">
                  {activeSpecies?.visionMatchConfidence || 98.6}% MATCH
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="font-bold text-slate-900 text-lg leading-tight">
                    {activeSpecies?.commonName}
                  </h1>
                  <p className="text-xs text-slate-500 italic mt-0.5">
                    {activeSpecies?.scientificName}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border shrink-0 ${getStatusColor(
                    activeSpecies?.iucnStatus
                  )}`}
                >
                  {activeSpecies?.iucnStatus || 'Endangered'}
                </span>
              </div>
            </div>
          </div>

          {/* Scannable Key Telemetry Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Current Population</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-bold text-slate-900">
                  {activeSpecies?.currentPop2026?.toLocaleString() || '28,500'}
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-0.5">Census Year 2026</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Extinction Horizon</span>
              <div className="mt-1">
                <span className="font-mono text-base font-bold text-rose-600">
                  Year {activeSpecies?.vitalityStats?.extinctionHorizonYear || 2038}
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-0.5">Unmitigated Baseline</span>
            </div>
          </div>

          {/* 20-Year Baseline Trend Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  20-Year Demographic Baselines
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsYearSurveyModalOpen(true)}
                className="text-[11px] font-semibold text-emerald-600 hover:underline"
              >
                Inspect Data
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 block">2001</span>
                <span className="text-xs font-bold font-mono text-slate-800">
                  {activeSpecies?.historicalPop2001?.toLocaleString() || '150k'}
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 block">2013</span>
                <span className="text-xs font-bold font-mono text-slate-800">
                  {activeSpecies?.historicalPop2013?.toLocaleString() || '105k'}
                </span>
              </div>
              <div className="bg-emerald-50/70 p-2 rounded-xl text-center border border-emerald-200/60">
                <span className="text-[10px] font-mono text-emerald-700 font-semibold block">2026 Today</span>
                <span className="text-xs font-bold font-mono text-emerald-800">
                  {activeSpecies?.currentPop2026?.toLocaleString() || '28.5k'}
                </span>
              </div>
            </div>
          </div>

          {/* Comprehensive Botanical & Ecological Intelligence */}
          {/* 1. Conservation & Extinction Risk */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {(activeSpecies?.iucnStatus && activeSpecies.iucnStatus.toLowerCase().includes('endangered')) ? (
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                  Conservation & Extinction Status
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${getStatusColor(activeSpecies?.iucnStatus)} font-sans`}>
                {activeSpecies?.iucnStatus || 'Least Concern'}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
              <div className="flex items-baseline justify-between">
                <span className="text-slate-500 font-medium">Endangered Assessment:</span>
                <span className="font-bold text-slate-900">
                  {activeSpecies?.endangeredStatus || 'Monitored under biodiversity index'}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-slate-500 font-medium">Conservation Criteria:</span>
                <span className="font-mono text-slate-700">
                  {activeSpecies?.conservationStatus || `IUCN: ${activeSpecies?.iucnCriteria || 'Criteria A2'}`}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Climate & Biome */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <SunMedium className="w-4 h-4 text-amber-500 shrink-0" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                Climate Zone & Habitat Biome
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200/80 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                {activeSpecies?.climateZone || activeSpecies?.habitat || 'Tropical & Subtropical Biome'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans mt-0.5">
              Adapted to specialized hydrological patterns, temperature ranges, and sunlight conditions characteristic of {activeSpecies?.climateZone ? activeSpecies.climateZone.toLowerCase() : 'temperate and subtropical grasslands'}.
            </p>
          </div>

          {/* 3. Medicinal Properties & Uses */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-500 shrink-0" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                Medicinal Properties & Therapeutic Uses
              </h3>
            </div>
            <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100/80 text-xs text-slate-700 leading-relaxed font-sans">
              {typeof activeSpecies?.medicinalProperties === 'string' ? (
                activeSpecies.medicinalProperties
              ) : Array.isArray(activeSpecies?.medicinalProperties) ? (
                <ul className="list-disc pl-4 space-y-1">
                  {activeSpecies.medicinalProperties.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              ) : (
                'Contains natural secondary plant metabolites and antioxidants documented in herbal wellness and ecological studies.'
              )}
            </div>
          </div>

          {/* 4. Common & Practical Applications */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                Where & How It Is Commonly Used
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50 p-3 rounded-xl border border-slate-100">
              {typeof activeSpecies?.commonUses === 'string'
                ? activeSpecies.commonUses
                : Array.isArray(activeSpecies?.commonUses)
                ? activeSpecies.commonUses.join(', ')
                : 'Cultivated and utilized across culinary recipes, herbal wellness, pollinator corridors, and conservation biology.'}
            </p>
          </div>

          {/* 5. Geographic Distribution */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-sky-600 shrink-0" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                Predominant Countries & Regions (2–4 Major)
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {(activeSpecies?.predominantRegions || ['North America', 'Eurasia', 'Neotropical Zones']).map((region, idx) => (
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

          {/* 6. Fascinating Facts */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                Did You Know? (Interesting Facts)
              </h3>
            </div>
            <div className="space-y-2">
              {(activeSpecies?.interestingFacts || [
                activeSpecies?.curriculumDiscussion || 'Recorded in student field research ledger.',
                'Provides high biological value supporting native pollinator networks.',
              ]).map((fact, idx) => (
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

          {/* Actions */}
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                soundFX.playConfirm();
                onRunPredictor();
              }}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <span>Simulate Population Trajectory (PVA)</span>
            </button>

            <button
              type="button"
              onClick={() => onReturnToScanner()}
              className="w-full h-11 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-xs"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Scan New Field Specimen</span>
            </button>
          </div>
        </div>
      )}

      {/* SEGMENT 3: PBR REGISTER (Canonical SOP-5 Records) */}
      {activeSegment === 'pbr' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono font-semibold text-emerald-600 uppercase tracking-wider">
                People's Biodiversity Register
              </span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Verified Records</h1>
            </div>
            <span className="text-xs font-mono font-medium px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700">
              {surveyRecords.length} Stored
            </span>
          </div>

          {surveyRecords.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 space-y-2">
              <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold">No PBR surveys logged yet.</p>
              <p className="text-xs">Scan a specimen and confirm to populate the register.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {surveyRecords.map((record) => (
                <div
                  key={record.recordId}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={record.imageUrl || activeSpecies?.imageUrl}
                      alt={record.speciesCommon}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {record.speciesCommon}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500 truncate">
                        {record.recordId} · {record.observedCount} Specimen(s)
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {record.timestamp} · {record.habitatType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {onDeleteRecord && (
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(record.recordId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Year Wise Modal */}
      <YearWiseSurveyModal
        isOpen={isYearSurveyModalOpen}
        onClose={() => setIsYearSurveyModalOpen(false)}
        currentSpecies={activeSpecies}
        selectedHabitat="Tallgrass Prairie"
        censusCount={4}
        session={session}
        disturbanceLevel="LOW"
      />
    </div>
  );
};
