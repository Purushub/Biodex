import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  MapPin,
  Calendar,
  Sparkles,
  BookOpen,
  LineChart,
  Save,
  Lock,
  ChevronDown,
  ChevronUp,
  Hash,
  Activity,
  Droplets,
  Layers,
  Leaf,
  Sliders,
} from 'lucide-react';
import {
  SpeciesData,
  GoogleLensIdentification,
  StudentSession,
  HumanDisturbanceLevel,
  IUCNStatus,
  SurveyRecord,
  ChassisTheme,
  GradeLevel,
} from '../types';
import { soundFX } from '../utils/audio';
import { saveSurveyRecordToFirestore } from '../lib/firestoreService';

interface ScannedSpecimenFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  species?: SpeciesData;
  lensData?: GoogleLensIdentification | null;
  session: StudentSession;
  selectedHabitat?: string;
  censusCount?: number;
  disturbanceLevel?: HumanDisturbanceLevel;
  gpsCoords?: string;
  imageUrl?: string;
  theme?: ChassisTheme;
  initialRecord?: SurveyRecord | null;
  onSaveRecord: (record: SurveyRecord) => void;
  onNavigateToPva?: () => void;
  onNavigateToBioDex?: () => void;
  onRequireLogin?: () => void;
}

export const ScannedSpecimenFormModal: React.FC<ScannedSpecimenFormModalProps> = ({
  isOpen,
  onClose,
  species,
  lensData,
  session,
  selectedHabitat = 'Tallgrass Prairie',
  censusCount: initialCount = 1,
  disturbanceLevel: initialDisturbance = 'LOW',
  gpsCoords: initialGps,
  imageUrl: passedImageUrl,
  initialRecord,
  onSaveRecord,
  onNavigateToPva,
  onNavigateToBioDex,
  onRequireLogin,
}) => {
  const isLoggedIn = session.authProvider === 'google' && Boolean(session.firebaseUid);

  // Default fallback species if none provided
  const baseSpecies = species || {
    id: initialRecord?.speciesId || 'pl-001',
    commonName: initialRecord?.speciesCommon || initialRecord?.Species_Name_Common || 'Western Prairie Fringed Orchid',
    scientificName: initialRecord?.speciesScientific || initialRecord?.Species_Name_Scientific || 'Platanthera praeclara',
    category: 'Flora',
    iucnStatus: (initialRecord?.aiEndangeredStatus || 'Endangered') as IUCNStatus,
    imageUrl: initialRecord?.imageUrl || initialRecord?.Image_URL || 'https://lh3.googleusercontent.com/aida/AEtjO1WzoMeFgF_ac8rvYsTJ7AMAuuq2El2TVci5rChF8J8zoErMkfynJn3btYfXESfMplkY_5pyc33PqYJDhSqDY4pgGxsxCfFyZmmczpl9q8meSCuFOQ9VsZql4TieGANxZzQVYeXfQTmdh8i78p8ksCuHH6QZYzBFjDSse_rXl7Czy2xFRXPAZiXSJP-m9pv_XruZ57z6GCqjNo0oxHCvwFZ9P09CiP_o_vuSG_KJ3Z8qXbm1JdIhDHEIPKbV',
    visionMatchConfidence: 98.6,
    historicalPop2001: 150000,
    historicalPop2007: 135000,
    historicalPop2012: 120000,
    historicalPop2013: 105000,
    historicalPop2019: 68000,
    historicalPop2025: 28500,
    currentPop2026: 28500,
    predictedPop2031: 18500,
    vitalityStats: {
      extinctionModelRiskPercent: 74.2,
      extinctionHorizonYear: 2038,
      populationHealthValue: '28,500',
      populationHealthPercent: 32,
      populationHealthStatus: 'LOW',
      habitatIntegrityPercent: 24,
      habitatIntegrityStatus: '24%',
      pollinatorDensityPercent: 42,
      pollinatorDensityStatus: '42%',
      climateResiliencePercent: 68,
      climateResilienceStatus: '68%',
    },
  };

  // 1. Record_ID
  const [recordId, setRecordId] = useState<string>(
    initialRecord?.recordId || initialRecord?.Record_ID || `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`
  );

  // 2. Student_Guest_ID
  const [studentGuestId, setStudentGuestId] = useState<string>(
    initialRecord?.studentGuestId || initialRecord?.Student_Guest_ID || session.guestId || 'BIO-7842'
  );

  // 3. Grade_Level
  const [gradeLevel, setGradeLevel] = useState<string>(
    initialRecord?.gradeLevel || initialRecord?.Grade_Level || session.gradeLevel || 'Field Naturalist'
  );

  // 4. Timestamp
  const [timestamp, setTimestamp] = useState<string>(
    initialRecord?.timestamp || initialRecord?.Timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
  );

  // 5. Species_Name_Common
  const [speciesCommon, setSpeciesCommon] = useState<string>(
    initialRecord?.speciesCommon || initialRecord?.Species_Name_Common || lensData?.commonName || baseSpecies.commonName
  );

  // 6. Species_Name_Scientific
  const [speciesScientific, setSpeciesScientific] = useState<string>(
    initialRecord?.speciesScientific || initialRecord?.Species_Name_Scientific || lensData?.scientificName || baseSpecies.scientificName
  );

  // 7. Image_URL
  const [imageUrl, setImageUrl] = useState<string>(
    initialRecord?.imageUrl || initialRecord?.Image_URL || passedImageUrl || lensData?.previewImageUrl || baseSpecies.imageUrl
  );

  // 8. AI_Vision_Match_Confidence
  const [visionConfidence, setVisionConfidence] = useState<number>(
    typeof initialRecord?.AI_Vision_Match_Confidence === 'number'
      ? initialRecord.AI_Vision_Match_Confidence
      : parseFloat(String(initialRecord?.visionConfidence || '').replace('%', '')) ||
        lensData?.confidence ||
        baseSpecies.visionMatchConfidence ||
        98.6
  );

  // 9. Observed_Count
  const [observedCount, setObservedCount] = useState<number>(
    initialRecord?.observedCount ?? initialRecord?.Observed_Count ?? initialCount ?? 1
  );

  // 10. Habitat_Type
  const [habitatType, setHabitatType] = useState<string>(
    initialRecord?.habitatType || initialRecord?.Habitat_Type || selectedHabitat || 'Tallgrass Prairie'
  );

  // Historical baselines
  const [hist2001, setHist2001] = useState<number>(
    initialRecord?.historicalPop2001 ?? initialRecord?.Historical_Pop_Baseline_2001 ?? baseSpecies.historicalPop2001 ?? 150000
  );
  const [hist2007, setHist2007] = useState<number>(
    initialRecord?.historicalPop2007 ?? initialRecord?.Historical_Pop_Baseline_2007 ?? baseSpecies.historicalPop2007 ?? 135000
  );
  const [hist2013, setHist2013] = useState<number>(
    initialRecord?.historicalPop2013 ?? initialRecord?.Historical_Pop_Baseline_2013 ?? baseSpecies.historicalPop2013 ?? 105000
  );
  const [hist2019, setHist2019] = useState<number>(
    initialRecord?.historicalPop2019 ?? initialRecord?.Historical_Pop_Baseline_2019 ?? baseSpecies.historicalPop2019 ?? 68000
  );
  const [hist2025, setHist2025] = useState<number>(
    initialRecord?.historicalPop2025 ?? initialRecord?.Historical_Pop_Baseline_2025 ?? baseSpecies.currentPop2026 ?? 28500
  );
  const [pred2031, setPred2031] = useState<number>(
    initialRecord?.predictedPop2031 ?? initialRecord?.Prediction_Pop_Baseline_2031 ?? baseSpecies.predictedPop2031 ?? 18500
  );

  // Status & Risk
  const [aiEndangeredStatus, setAiEndangeredStatus] = useState<IUCNStatus>(
    (initialRecord?.aiEndangeredStatus || initialRecord?.AI_Endangered_Status || lensData?.iucnStatus || baseSpecies.iucnStatus || 'Endangered') as IUCNStatus
  );
  const [aiRiskPercentage, setAiRiskPercentage] = useState<number>(
    initialRecord?.aiExtinctionRiskPercentage ?? initialRecord?.AI_Extinction_Risk_Percentage ?? baseSpecies.vitalityStats?.extinctionModelRiskPercent ?? 74.2
  );
  const [aiExtinctionYear, setAiExtinctionYear] = useState<string>(
    initialRecord?.aiProjectedExtinctionYear || initialRecord?.AI_Projected_Extinction_Year || `Year ${baseSpecies.vitalityStats?.extinctionHorizonYear || 2038}`
  );

  // GPS & Telemetry
  const [gpsCoordinates, setGpsCoordinates] = useState<string>(
    initialRecord?.gpsCoordinates || initialRecord?.GPS_Coordinates || initialGps || '39.1031° N, 84.5120° W'
  );
  const [disturbanceLevel, setDisturbanceLevel] = useState<HumanDisturbanceLevel>(
    (initialRecord?.humanDisturbance || initialDisturbance || 'LOW') as HumanDisturbanceLevel
  );
  const [fieldNotes, setFieldNotes] = useState<string>(
    initialRecord?.studentSurveyNotes || 'Specimen observed in native prairie meadow. Healthy inflorescence.'
  );

  const [showAdvancedSOP, setShowAdvancedSOP] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (species) {
      setSpeciesCommon(species.commonName);
      setSpeciesScientific(species.scientificName);
      setImageUrl(species.imageUrl);
      setVisionConfidence(species.visionMatchConfidence || 98.6);
      setAiEndangeredStatus(species.iucnStatus);
      if (species.vitalityStats) {
        setAiRiskPercentage(species.vitalityStats.extinctionModelRiskPercent);
        setAiExtinctionYear(`Year ${species.vitalityStats.extinctionHorizonYear}`);
      }
    }
  }, [species]);

  if (!isOpen) return null;

  const handleSave = async (redirectTarget?: 'pva' | 'biodex') => {
    if (!isLoggedIn) {
      soundFX.playCancel();
      if (onRequireLogin) onRequireLogin();
      return;
    }

    try {
      setIsSubmitting(true);
      soundFX.playConfirm();

      const smartReportUrl = `https://biodex.app/report/${recordId}.pdf`;

      const record: SurveyRecord = {
        recordId,
        studentGuestId,
        userId: session.firebaseUid,
        userEmail: session.userEmail,
        userDisplayName: session.userDisplayName,
        gradeLevel: gradeLevel as GradeLevel,
        timestamp,
        speciesId: species?.id || baseSpecies.id,
        speciesCommon,
        speciesScientific,
        imageUrl,
        visionConfidence: `${visionConfidence}% Match`,
        observedCount: Number(observedCount),
        habitatType,
        humanDisturbance: disturbanceLevel,
        gpsCoordinates,
        sectorCoord: session.sectorCoord,
        historicalPop2001: Number(hist2001),
        historicalPop2007: Number(hist2007),
        historicalPop2012: 120000,
        historicalPop2013: Number(hist2013),
        historicalPop2019: Number(hist2019),
        currentPop2026: Number(hist2025),
        predictedPop2031: Number(pred2031),
        aiEndangeredStatus,
        aiExtinctionRiskPercentage: Number(aiRiskPercentage),
        aiProjectedExtinctionYear: aiExtinctionYear,
        smartReportUrl,
        conservationLevers: initialRecord?.conservationLevers || {
          prairieBufferExpansion: 25,
          invasivePlantRemovalRate: 60,
        },
        studentSurveyNotes: fieldNotes,
        storedInFirebase: true,

        // Exact 20 fields
        Record_ID: recordId,
        Student_Guest_ID: studentGuestId,
        Grade_Level: gradeLevel,
        Timestamp: timestamp,
        Species_Name_Common: speciesCommon,
        Species_Name_Scientific: speciesScientific,
        Image_URL: imageUrl,
        AI_Vision_Match_Confidence: visionConfidence,
        Observed_Count: Number(observedCount),
        Habitat_Type: habitatType,
        Historical_Pop_Baseline_2001: Number(hist2001),
        Historical_Pop_Baseline_2007: Number(hist2007),
        Historical_Pop_Baseline_2013: Number(hist2013),
        Historical_Pop_Baseline_2019: Number(hist2019),
        Historical_Pop_Baseline_2025: Number(hist2025),
        Prediction_Pop_Baseline_2031: Number(pred2031),
        AI_Endangered_Status: aiEndangeredStatus,
        AI_Extinction_Risk_Percentage: Number(aiRiskPercentage),
        AI_Projected_Extinction_Year: aiExtinctionYear,
        Smart_Report_URL: smartReportUrl,
      };

      await saveSurveyRecordToFirestore(record, session);
      onSaveRecord(record);
      onClose();

      if (redirectTarget === 'pva' && onNavigateToPva) {
        onNavigateToPva();
      } else if (redirectTarget === 'biodex' && onNavigateToBioDex) {
        onNavigateToBioDex();
      }
    } catch (err) {
      console.error('Error saving record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* BRIGHT MINIMAL HEADER - Exact from biodex_save_record_bright_minimal */}
        <header className="shrink-0 h-14 px-4 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight block leading-tight">BioDex</span>
              <span className="font-mono text-[11px] text-slate-400 leading-none">{studentGuestId}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              RECORDED
            </span>
            <button
              onClick={() => {
                soundFX.playCancel();
                onClose();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* SPECIMEN CARD - 4:3 Aspect Ratio with Optical Match Badge */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="relative aspect-[4/3] w-full bg-slate-100">
              <img
                src={imageUrl}
                alt={speciesCommon}
                className="w-full h-full object-cover"
              />
              {/* Optical Badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200/80 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-[11px] font-semibold text-slate-800">
                  {visionConfidence}% MATCH
                </span>
              </div>
            </div>

            {/* Identity Details */}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="font-bold text-slate-900 text-lg leading-tight">
                    {speciesCommon}
                  </h1>
                  <p className="text-xs text-slate-500 italic mt-0.5">
                    {speciesScientific}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                  {aiEndangeredStatus}
                </span>
              </div>
            </div>
          </div>

          {/* SCANNABLE KEY TELEMETRY (2-col grid) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Species Identity (Replaces Count as requested) */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-600 uppercase tracking-wider font-semibold">
                  Species Name
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {baseSpecies.category || 'Fauna'}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-base font-bold text-slate-900 block truncate" title={speciesCommon}>
                  {speciesCommon}
                </span>
              </div>
              <span className="text-xs text-slate-500 italic mt-0.5 block truncate" title={speciesScientific}>
                {speciesScientific}
              </span>
            </div>

            {/* Location */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Location</span>
              <div className="mt-1">
                <span className="font-mono text-xs font-semibold text-slate-900 block truncate">
                  {gpsCoordinates}
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-0.5 truncate">{habitatType}</span>
            </div>
          </div>

          {/* SOP-5 EXPANDABLE FIELD ATTRIBUTES */}
          <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/60">
            <button
              type="button"
              onClick={() => setShowAdvancedSOP(!showAdvancedSOP)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-700"
            >
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>Survey Parameters & SOP Details</span>
              </div>
              {showAdvancedSOP ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showAdvancedSOP && (
              <div className="mt-3 space-y-3 pt-2 border-t border-slate-200 text-xs">
                {/* Count and Disturbance Selectors */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">Adjust Count</label>
                    <input
                      type="number"
                      min={1}
                      max={999}
                      value={observedCount}
                      onChange={(e) => setObservedCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white font-mono text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 block mb-1">Disturbance Level</label>
                    <select
                      value={disturbanceLevel}
                      onChange={(e) => setDisturbanceLevel(e.target.value as HumanDisturbanceLevel)}
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-white font-sans text-xs text-slate-800"
                    >
                      <option value="LOW">Low (Pristine)</option>
                      <option value="MODERATE">Moderate (Trail Edge)</option>
                      <option value="HIGH">High (Urban Edge)</option>
                    </select>
                  </div>
                </div>

                {/* Field Notes */}
                <div>
                  <label className="text-[11px] font-medium text-slate-500 block mb-1">Field Notes</label>
                  <textarea
                    rows={2}
                    value={fieldNotes}
                    onChange={(e) => setFieldNotes(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white font-sans text-xs text-slate-800 resize-none"
                    placeholder="Ecological notes..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* ESSENTIAL ACTIONS */}
          <div className="pt-2 flex flex-col space-y-2.5">
            {/* Primary Action: Confirm & Save */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave()}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
            >
              {isLoggedIn ? (
                <>
                  <Save className="w-4 h-4 text-emerald-100" />
                  <span>{isSubmitting ? 'Saving to PBR...' : 'Confirm & Save to PBR Register'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-100" />
                  <span>Sign In with Google to Save Record</span>
                </>
              )}
            </button>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSave('biodex')}
                className="h-11 bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/80 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>View BioDex</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave('pva')}
                className="h-11 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-xs"
              >
                <LineChart className="w-4 h-4 text-emerald-600" />
                <span>Predict Risk</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
