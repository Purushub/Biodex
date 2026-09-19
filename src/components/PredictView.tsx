import React, { useState } from 'react';
import { SpeciesData, ConservationLevers, ChassisTheme, SurveyRecord } from '../types';
import { soundFX } from '../utils/audio';
import {
  Download,
  Camera,
  Share2,
  Sliders,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Leaf,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

interface PredictViewProps {
  currentSpecies: SpeciesData;
  levers: ConservationLevers;
  onUpdateLevers: (levers: ConservationLevers) => void;
  onGenerateReport: () => void;
  onReturnToDex: () => void;
  theme?: ChassisTheme;
  activeRecord?: SurveyRecord | null;
  surveyRecords?: SurveyRecord[];
  onSelectRecord?: (record: SurveyRecord) => void;
}

export const PredictView: React.FC<PredictViewProps> = ({
  currentSpecies,
  levers,
  onUpdateLevers,
  onGenerateReport,
  onReturnToDex,
  activeRecord,
  surveyRecords = [],
  onSelectRecord,
}) => {
  const { prairieBufferExpansion, invasivePlantRemovalRate } = levers;

  // Single unified intervention level (5% to 50%, default 25%)
  const [interventionLevel, setInterventionLevel] = useState<number>(
    prairieBufferExpansion || 25
  );

  // Demographic Data from Record or Catalog
  const currentPop = activeRecord?.Historical_Pop_Baseline_2025 || currentSpecies.currentPop2026 || 28500;
  const historical2012 = activeRecord?.Historical_Pop_Baseline_2013 || currentSpecies.historicalPop2012 || 52000;
  const unmitigatedRisk = activeRecord?.aiExtinctionRiskPercentage || currentSpecies.vitalityStats?.extinctionModelRiskPercent || 74;

  // Dynamic PVA calculation based on slider
  const growthMultiplier = 1 + (interventionLevel / 100) * 1.8;
  const targetPop = Math.round(currentPop * growthMultiplier);
  const reboundYear = 2034 - Math.round((interventionLevel - 25) / 10);
  const adjustedRisk = Math.max(12, Math.round(unmitigatedRisk - interventionLevel * 0.95));

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setInterventionLevel(val);
    onUpdateLevers({
      prairieBufferExpansion: val,
      invasivePlantRemovalRate: Math.min(100, val * 2.4),
    });
    soundFX.playClick();
  };

  // Dynamic SVG control point for forecast curve
  const curveControlY = Math.max(16, 75 - interventionLevel * 1.1);

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-white text-slate-900 pb-28 font-sans">
      {/* CRISP MINIMAL TOP HEADER - Exact from biodex_smart_report_bright_minimal */}
      <header className="h-14 px-1 flex items-center justify-between border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 font-mono font-bold text-sm">
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 text-base tracking-tight">BioDex</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-500">Report</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-600">
          <button
            type="button"
            aria-label="Share specimen report"
            onClick={() => {
              soundFX.playClick();
              if (navigator.share) {
                navigator.share({
                  title: `${currentSpecies.commonName} - BioDex Trajectory Report`,
                  text: `Population Viability Analysis indicates ${currentSpecies.commonName} can thrive by ${reboundYear} with active prairie restoration.`,
                  url: window.location.href,
                }).catch(() => {});
              }
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all text-slate-600 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT STACK */}
      <div className="flex flex-col gap-4">
        {/* SPECIMEN SUMMARY CARD */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
              <img
                alt={currentSpecies.commonName}
                className="w-full h-full object-cover"
                src={currentSpecies.imageUrl}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="font-bold text-slate-900 text-[15px] leading-tight truncate">
                {currentSpecies.commonName}
              </h1>
              <p className="text-xs text-slate-500 italic truncate">
                {currentSpecies.scientificName}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-[11px] font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {currentSpecies.iucnStatus}
            </span>
          </div>
        </div>

        {/* MASCOT GUIDE CARD (SPROUT) */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="relative shrink-0 w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden p-0.5">
            <img
              alt="Sprout EcoGuide"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1W4qTEabs3fIoSAGk41Nt0Z_nvwTeGBhRvkYijBHxtxXI27M4d2i-7ZiNIGyKB3DH9Mv3AJkPLHtLUhI_HMud2dituf2S2QliKBi66qsgGoFnxlQjMGZXv2c4czLPoZjCilv97-g9X5D65_sBBFgGpd4jfdKE-vEq3lsg30T4ffWzb2HKs8zxZBHRqFMKHOoIcpZwpiPAu5SNPLtlwyv3LJMPBsrgMebEOXLTHuMutgm6bKRw4fdfQdd4g1"
            />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-bold text-xs text-emerald-800">Sprout Verdict</span>
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 font-mono">
                <span className="text-rose-500">EN</span>
                <span className="text-slate-400">➔</span>
                <span className="text-emerald-700 font-bold">Thriving</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-snug">
              Can thrive by <span className="font-semibold text-slate-900 font-mono">{reboundYear}</span> with prairie restoration! 🌱
            </p>
          </div>
        </div>

        {/* TRAJECTORY FORECAST GRAPH CARD (Exact from biodex_smart_report_bright_minimal) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 rounded-full bg-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Trajectory Forecast</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium">
              <span className="inline-flex items-center gap-1 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Target
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Decline
              </span>
            </div>
          </div>

          {/* SVG Line Graph on Light Canvas */}
          <div className="w-full bg-slate-50/70 border border-slate-100 rounded-xl p-2.5 overflow-hidden">
            <svg
              className="w-full h-40 overflow-visible"
              fill="none"
              viewBox="0 0 320 150"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="targetArea" x1="150" x2="260" y1="85" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10b981" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="declineArea" x1="150" x2="300" y1="85" y2="132" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f43f5e" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Light Horizontal Grid Lines */}
              <line stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" x1="20" x2="305" y1="28" y2="28" />
              <line stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" x1="20" x2="305" y1="65" y2="65" />
              <line stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" x1="20" x2="305" y1="102" y2="102" />
              <line stroke="#cbd5e1" strokeWidth="1" x1="20" x2="305" y1="132" y2="132" />

              {/* Extinction Threshold Band */}
              <rect fill="#ffe4e6" height="8" opacity="0.6" rx="2" width="285" x="20" y="124" />
              <text fill="#e11d48" fontFamily="Space Grotesk" fontSize="7.5" fontWeight="700" x="24" y="130">
                EXTINCTION THRESHOLD
              </text>

              {/* Historical Trend */}
              <path d="M 25 48 Q 85 60 150 85" stroke="#64748b" strokeLinecap="round" strokeWidth="2.5" />

              {/* Area Shading */}
              <path d={`M 150 85 Q 205 ${curveControlY} 260 28 L 260 132 L 150 132 Z`} fill="url(#targetArea)" />
              <path d="M 150 85 Q 225 110 300 130 L 150 132 Z" fill="url(#declineArea)" />

              {/* Target Upward Curve */}
              <path
                d={`M 150 85 Q 205 ${curveControlY} 260 28`}
                id="forecastCurve"
                stroke="#059669"
                strokeLinecap="round"
                strokeWidth="2.5"
              />

              {/* Decline Downward Curve */}
              <path
                d="M 150 85 Q 225 110 300 130"
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeWidth="2"
              />

              {/* Today Vertical Line */}
              <line stroke="#94a3b8" strokeDasharray="2 2" strokeWidth="1" x1="150" x2="150" y1="18" y2="132" />

              {/* Nodes & Labels */}
              {/* 2012 */}
              <circle cx="25" cy="48" fill="#64748b" r="3" />
              <text fill="#64748b" fontFamily="Space Grotesk" fontSize="8.5" fontWeight="600" x="18" y="42">
                52k
              </text>

              {/* 2026 Today */}
              <circle cx="150" cy="85" fill="#059669" fillOpacity="0.2" r="5" />
              <circle cx="150" cy="85" fill="#059669" r="3.5" stroke="#ffffff" strokeWidth="1.5" />
              <text fill="#0f172a" fontFamily="Space Grotesk" fontSize="9" fontWeight="700" x="136" y="77">
                {(currentPop / 1000).toFixed(1)}k
              </text>

              {/* 2034 Goal */}
              <circle cx="260" cy="28" fill="#059669" fillOpacity="0.25" r="5.5" />
              <circle cx="260" cy="28" fill="#059669" r="4" stroke="#ffffff" strokeWidth="1.5" />
              <text fill="#047857" fontFamily="Space Grotesk" fontSize="9.5" fontWeight="700" x="246" y="20">
                +{(targetPop / 1000).toFixed(0)}k
              </text>

              {/* Decline Risk Point */}
              <circle cx="300" cy="130" fill="#f43f5e" r="3.5" stroke="#ffffff" strokeWidth="1" />
              <text fill="#e11d48" fontFamily="Space Grotesk" fontSize="8" fontWeight="600" x="282" y="124">
                &lt;2k
              </text>

              {/* X Axis Years */}
              <text fill="#94a3b8" fontFamily="Space Grotesk" fontSize="8" fontWeight="500" x="18" y="145">
                2012
              </text>
              <text fill="#0f172a" fontFamily="Space Grotesk" fontSize="8.5" fontWeight="700" x="135" y="145">
                Today
              </text>
              <text fill="#059669" fontFamily="Space Grotesk" fontSize="8.5" fontWeight="700" x="245" y="145">
                {reboundYear}
              </text>
              <text fill="#f43f5e" fontFamily="Space Grotesk" fontSize="8" fontWeight="600" x="285" y="145">
                2038
              </text>
            </svg>
          </div>
        </div>

        {/* KEY METRICS ROW (3 MINIMAL WHITE CARDS) */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Risk */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Risk</span>
            <div className="mt-1">
              <div className="font-mono text-xl font-bold text-rose-600 tracking-tight">{adjustedRisk}%</div>
              <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                {adjustedRisk > 50 ? 'High' : 'Managed'}
              </span>
            </div>
          </div>

          {/* Census */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Count</span>
            <div className="mt-1">
              <div className="font-mono text-xl font-bold text-slate-900 tracking-tight">
                {(currentPop / 1000).toFixed(1)}k
              </div>
              <span className="inline-block mt-0.5 text-[10px] font-medium text-slate-500">
                Wild Stems
              </span>
            </div>
          </div>

          {/* Target */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Target</span>
            <div className="mt-1">
              <div className="font-mono text-xl font-bold text-emerald-600 tracking-tight">
                +{(targetPop / 1000).toFixed(0)}k
              </div>
              <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                By {reboundYear}
              </span>
            </div>
          </div>
        </div>

        {/* ACTION SLIDER CARD (CONSERVATION LEVER) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Conservation Lever</span>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              +{interventionLevel}% Intervention
            </span>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={interventionLevel}
              onChange={handleSliderChange}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 px-0.5">
              <span>+5%</span>
              <span className="text-emerald-700 font-bold">Recommended (+25%)</span>
              <span>+50%</span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              soundFX.playConfirm();
              onGenerateReport();
            }}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Report (PDF / CSV)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              onReturnToDex();
            }}
            className="w-full h-11 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border border-slate-200/80 shadow-xs transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Scan Next Specimen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
