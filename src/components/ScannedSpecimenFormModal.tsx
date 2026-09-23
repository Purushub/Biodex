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
  ChevronRight,
  Hash,
  Activity,
  Droplets,
  Layers,
  Leaf,
  Sliders,
} from 'lucide-react';
import { SpecimenDossierModal } from './SpecimenDossierModal';
import { enrichSpeciesWithEducationalData } from '../data/species';
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
import { isUnidentifiedSpeciesName, saveCustomSpecies } from '../utils/customSpeciesDB';

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
  detectedKeywords?: string[];
  onRegisterCustomSpecies?: (species: SpeciesData) => void;
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
  detectedKeywords,
  onRegisterCustomSpecies,
  onSaveRecord,
  onNavigateToPva,
  onNavigateToBioDex,
  onRequireLogin,
}) => {
  const isLoggedIn = session.authProvider === 'google' && Boolean(session.firebaseUid);

  // Default fallback species if none provided
  const baseSpecies = species || {
    id: initialRecord?.speciesId || 'new-discovery',
    commonName: initialRecord?.speciesCommon || initialRecord?.Species_Name_Common || 'Species not detected',
    scientificName: initialRecord?.speciesScientific || initialRecord?.Species_Name_Scientific || 'New species detected, please input name',
    category: 'Flora',
    iucnStatus: (initialRecord?.aiEndangeredStatus || 'New Discovery') as IUCNStatus,
    imageUrl: initialRecord?.imageUrl || initialRecord?.Image_URL || 'https://lh3.googleusercontent.com/aida/AEtjO1WzoMeFgF_ac8rvYsTJ7AMAuuq2El2TVci5rChF8J8zoErMkfynJn3btYfXESfMplkY_5pyc33PqYJDhSqDY4pgGxsxCfFyZmmczpl9q8meSCuFOQ9VsZql4TieGANxZzQVYeXfQTmdh8i78p8ksCuHH6QZYzBFjDSse_rXl7Czy2xFRXPAZiXSJP-m9pv_XruZ57z6GCqjNo0oxHCvwFZ9P09CiP_o_vuSG_KJ3Z8qXbm1JdIhDHEIPKbV',
    visionMatchConfidence: 75.0,
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

  const initialCommon = initialRecord?.speciesCommon || initialRecord?.Species_Name_Common || lensData?.commonName || baseSpecies.commonName;
  const initialScientific = initialRecord?.speciesScientific || initialRecord?.Species_Name_Scientific || lensData?.scientificName || baseSpecies.scientificName;
  const initialIsUndetected = isUnidentifiedSpeciesName(initialCommon) || initialCommon === 'Species not detected';

  // 5. Species_Name_Common
  const [speciesCommon, setSpeciesCommon] = useState<string>(
    initialIsUndetected ? 'Species not detected' : initialCommon
  );

  // 6. Species_Name_Scientific
  const [speciesScientific, setSpeciesScientific] = useState<string>(
    initialIsUndetected ? 'New species detected, please input name' : initialScientific
  );

  // Interactive user name input and category
  const [customNameInput, setCustomNameInput] = useState<string>(
    initialIsUndetected ? '' : initialCommon
  );
  const [customScientificInput, setCustomScientificInput] = useState<string>(
    initialIsUndetected ? '' : initialScientific
  );
  const [category, setCategory] = useState<'Flora' | 'Fauna'>(
    (baseSpecies.category as 'Flora' | 'Fauna') || 'Flora'
  );

  const isDetectedUndetected = isUnidentifiedSpeciesName(speciesCommon) || speciesCommon === 'Species not detected';

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
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Computed specimen data enriched with comprehensive botanical & educational attributes
  const dossierSpecimen: SpeciesData = enrichSpeciesWithEducationalData({
    ...(species || baseSpecies),
    commonName: customNameInput.trim() || (isDetectedUndetected ? 'Species not detected' : speciesCommon),
    scientificName:
      customScientificInput.trim() ||
      (customNameInput.trim()
        ? `${customNameInput.trim()} sp.`
        : (isDetectedUndetected ? 'New species detected, please input name' : speciesScientific)),
    category: category,
    imageUrl: imageUrl,
    iucnStatus: isDetectedUndetected ? ('Least Concern' as IUCNStatus) : aiEndangeredStatus,
    visionMatchConfidence: visionConfidence,
  });

  useEffect(() => {
    if (species) {
      const isUndetected = isUnidentifiedSpeciesName(species.commonName) || species.commonName === 'Species not detected';
      const cleanCommon = isUndetected ? 'Species not detected' : species.commonName;
      const cleanSci = isUndetected ? 'New species detected, please input name' : species.scientificName;
      setSpeciesCommon(cleanCommon);
      setSpeciesScientific(cleanSci);
      setCustomNameInput(isUndetected ? '' : species.commonName);
      setCustomScientificInput(isUndetected ? '' : species.scientificName);
      setImageUrl(species.imageUrl);
      setVisionConfidence(species.visionMatchConfidence || (isUndetected ? 72 : 98.6));
      setAiEndangeredStatus(isUndetected ? ('New Discovery' as any) : species.iucnStatus);
      if (species.category === 'Flora' || species.category === 'Fauna') {
        setCategory(species.category);
      }
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

      const trimmedCustomName = customNameInput.trim();
      const isCustomDiscovery = isDetectedUndetected || trimmedCustomName.length > 0;
      const finalCommon = trimmedCustomName || (isDetectedUndetected ? 'Species not detected' : speciesCommon);
      const finalScientific = customScientificInput.trim() || (isDetectedUndetected ? (trimmedCustomName ? `${trimmedCustomName} sp.` : 'New species detected, please input name') : speciesScientific);
      const finalStatus: IUCNStatus = isDetectedUndetected ? ('Least Concern' as IUCNStatus) : aiEndangeredStatus;
      const customId = `custom-spec-${Date.now()}`;
      const finalSpeciesId = isCustomDiscovery && trimmedCustomName.length > 0 ? customId : (species?.id || baseSpecies.id);

      // If student input a custom name, save to the database so it will be matched next time!
      if (trimmedCustomName.length > 0) {
        const customSpeciesData: SpeciesData = {
          id: customId,
          catalogNumber: `CUST-${Math.floor(100 + Math.random() * 900)}`,
          slotNumber: `#CUST-${Math.floor(100 + Math.random() * 900)}`,
          level: 1,
          category: category,
          subType: 'Custom Discovery',
          commonName: finalCommon,
          scientificName: finalScientific,
          genderOrReproduction: category === 'Fauna' ? 'DIOECIOUS' : 'HERMAPHRODITIC',
          imageUrl: imageUrl,
          visionMatchConfidence: visionConfidence,
          biodiversityRank: 5,
          biodiversityScore: visionConfidence,
          taxonomy: {
            kingdom: category === 'Fauna' ? 'ANIMALIA' : 'PLANTAE',
            order: 'CUSTOM',
            family: 'Field Discovery',
            genusSpecies: finalScientific.toUpperCase(),
          },
          iucnStatus: 'Least Concern',
          iucnCriteria: 'CRITERIA A1',
          habitat: habitatType || 'Field Observation',
          historicalPop2001: 50000,
          historicalPop2007: 45000,
          historicalPop2012: 40000,
          historicalPop2013: 38000,
          historicalPop2019: 35000,
          historicalPop2025: 30000,
          currentPop2026: 30000,
          predictedPop2031: 28000,
          unmitigatedCollapseYear: 2045,
          collapseFloor: 10000,
          reboundGoal: 50000,
          neuralConfidence: visionConfidence,
          vitalityStats: {
            populationHealthValue: '30,000 INDIV',
            populationHealthPercent: 65,
            populationHealthStatus: 'STABLE',
            habitatIntegrityPercent: 70,
            habitatIntegrityStatus: '70% INTACT',
            pollinatorDensityPercent: 50,
            pollinatorDensityStatus: '50% ACTIVE',
            climateResiliencePercent: 75,
            climateResilienceStatus: '75% STABLE',
            extinctionModelRiskPercent: 15.0,
            extinctionHorizonYear: 2050,
          },
          limitingFactors: {
            habitatFragmentation: 20,
            pollinatorDensity: 40,
            climateVolatility: 30,
          },
          biologistMemo: {
            entryRef: `BIO-${recordId}`,
            reserveLocation: habitatType || 'Field Observation',
            timeLogged: timestamp,
            details: `Cataloged by naturalist ${studentGuestId}. New species registered to database.`,
          },
          curriculumDiscussion: `Field observation of ${finalCommon} recorded by naturalist ${studentGuestId}.`,
          tags: [category, 'Custom Discovery', ...(detectedKeywords || [])],
        };

        saveCustomSpecies(customSpeciesData, detectedKeywords || []);
        if (onRegisterCustomSpecies) {
          onRegisterCustomSpecies(customSpeciesData);
        }
      }

      const record: SurveyRecord = {
        recordId,
        studentGuestId,
        userId: session.firebaseUid,
        userEmail: session.userEmail,
        userDisplayName: session.userDisplayName,
        gradeLevel: gradeLevel as GradeLevel,
        timestamp,
        speciesId: finalSpeciesId,
        speciesCommon: finalCommon,
        speciesScientific: finalScientific,
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
        aiEndangeredStatus: finalStatus,
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
        Species_Name_Common: finalCommon,
        Species_Name_Scientific: finalScientific,
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
        AI_Endangered_Status: finalStatus,
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
                alt={customNameInput.trim() || speciesCommon}
                className="w-full h-full object-cover"
              />
              {/* Optical Badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200/80 shadow-xs flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isDetectedUndetected && !customNameInput.trim() ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <span className="font-mono text-[11px] font-semibold text-slate-800">
                  {isDetectedUndetected && !customNameInput.trim() ? 'NEW SPECIMEN' : `${visionConfidence}% MATCH`}
                </span>
              </div>
            </div>

            {/* Identity Details */}
            {(() => {
              const displayCommon = customNameInput.trim() || (isDetectedUndetected ? 'Species not detected' : speciesCommon);
              const displayScientific =
                customScientificInput.trim() ||
                (customNameInput.trim()
                  ? `${customNameInput.trim()} sp.`
                  : (speciesScientific === 'New species detected, please input name' || isUnidentifiedSpeciesName(speciesScientific)
                      ? 'New species detected, please input name'
                      : speciesScientific));
              const isDiscovery = isDetectedUndetected || aiEndangeredStatus === 'New Discovery' || aiEndangeredStatus === 'Not Evaluated';
              return (
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h1 className="font-bold text-slate-900 text-lg leading-tight">
                        {displayCommon}
                      </h1>
                      <p className="text-xs text-slate-500 italic mt-0.5">
                        {displayScientific}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 border ${
                      isDiscovery
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {isDiscovery ? 'New Discovery' : aiEndangeredStatus}
                    </span>
                  </div>

                  {/* Educational Attributes: Climate Zone & Predominant Region */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-sans pt-0.5">
                    {dossierSpecimen.climateZone && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 font-medium border border-amber-200/60 flex items-center gap-1">
                        <span>☀️</span>
                        <span className="truncate max-w-[150px]">{dossierSpecimen.climateZone}</span>
                      </span>
                    )}
                    {dossierSpecimen.predominantRegions && dossierSpecimen.predominantRegions.length > 0 && (
                      <span className="px-2 py-0.5 rounded-lg bg-sky-50 text-sky-800 font-medium border border-sky-200/60 flex items-center gap-1">
                        <span>🌍</span>
                        <span className="truncate max-w-[140px]">{dossierSpecimen.predominantRegions[0]}</span>
                      </span>
                    )}
                  </div>

                  {/* Botanical Dossier Quick Access Banner */}
                  <div
                    onClick={() => {
                      soundFX.playClick();
                      setIsDossierOpen(true);
                    }}
                    className="p-2.5 rounded-xl bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-200 flex items-center justify-between cursor-pointer transition-colors group mt-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 leading-tight">
                          <span>Botanical Dossier</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-200/60 text-emerald-800 font-semibold">Ready</span>
                        </p>
                        <p className="text-[11px] text-emerald-700 truncate mt-0.5">
                          {dossierSpecimen.medicinalProperties
                            ? 'Medicinal uses, climate zones & educational facts'
                            : 'Explore comprehensive botanical dossier'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0 ml-2">
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* STUDENT DISCOVERY / SPECIES NAME INPUT CARD */}
          <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-3.5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  {isDetectedUndetected ? 'New Species Detected — Name Your Discovery' : 'Species Classification'}
                </span>
              </div>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Auto-matches future scans
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {isDetectedUndetected ? 'Please input species name:' : 'Common Name:'}
              </label>
              <input
                type="text"
                value={customNameInput}
                onChange={(e) => {
                  setCustomNameInput(e.target.value);
                  if (e.target.value.trim()) {
                    setSpeciesCommon(e.target.value.trim());
                  }
                }}
                placeholder={isDetectedUndetected ? 'e.g. Painted Grasshopper, Prairie Indigo...' : 'Species common name...'}
                className="w-full h-10 px-3 rounded-xl border border-emerald-300/80 bg-white text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
              {isDetectedUndetected && !customNameInput.trim() && (
                <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                  💡 Type a name above to register this discovery to the database so future scans will recognize it.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
                <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => setCategory('Flora')}
                    className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${
                      category === 'Flora' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Flora (Plant)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('Fauna')}
                    className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${
                      category === 'Fauna' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Fauna (Animal)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Scientific / Nickname (Optional)</label>
                <input
                  type="text"
                  value={customScientificInput}
                  onChange={(e) => {
                    setCustomScientificInput(e.target.value);
                    if (e.target.value.trim()) {
                      setSpeciesScientific(e.target.value.trim());
                    }
                  }}
                  placeholder={customNameInput.trim() ? `${customNameInput.trim()} sp.` : 'Scientific tag...'}
                  className="w-full h-[34px] px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* SCANNABLE KEY TELEMETRY (2-col grid) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Species Identity */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-600 uppercase tracking-wider font-semibold">
                  Species Name
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {category || baseSpecies.category || 'Fauna'}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-base font-bold text-slate-900 block truncate" title={customNameInput.trim() || (isDetectedUndetected ? 'Species not detected' : speciesCommon)}>
                  {customNameInput.trim() || (isDetectedUndetected ? 'Species not detected' : speciesCommon)}
                </span>
              </div>
              <span className="text-xs text-slate-500 italic mt-0.5 block truncate" title={customScientificInput.trim() || (customNameInput.trim() ? `${customNameInput.trim()} sp.` : (speciesScientific === 'New species detected, please input name' || isUnidentifiedSpeciesName(speciesScientific) ? 'New species detected, please input name' : speciesScientific))}>
                {customScientificInput.trim() || (customNameInput.trim() ? `${customNameInput.trim()} sp.` : (speciesScientific === 'New species detected, please input name' || isUnidentifiedSpeciesName(speciesScientific) ? 'New species detected, please input name' : speciesScientific))}
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

            {/* Quick Actions Grid: Dossier, View BioDex, Predict Risk */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setIsDossierOpen(true);
                }}
                className="h-11 bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-200/90 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] cursor-pointer"
                title="Open comprehensive botanical dossier (medicinal uses, climate zones & educational facts)"
              >
                <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="truncate">Dossier</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave('biodex')}
                className="h-11 bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/80 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] cursor-pointer"
              >
                <Layers className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="truncate">BioDex</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave('pva')}
                className="h-11 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] shadow-xs cursor-pointer"
              >
                <LineChart className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Predict</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Botanical Specimen Dossier Modal */}
      <SpecimenDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        specimen={dossierSpecimen}
        onNavigateToBioDex={() => {
          setIsDossierOpen(false);
          handleSave('biodex');
        }}
        onNavigateToPredict={() => {
          setIsDossierOpen(false);
          handleSave('pva');
        }}
      />
    </div>
  );
};
