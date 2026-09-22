/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  NavTab,
  ChassisTheme,
  StudentSession,
  SpeciesData,
  HumanDisturbanceLevel,
  ConservationLevers,
  SurveyRecord,
  Habitat,
} from './types';
import {
  INITIAL_SPECIES_CATALOG,
  INITIAL_DEFAULT_SURVEY_RECORD,
} from './data/species';
import {
  getFullSpeciesCatalog,
  saveCustomSpecies,
  isUnidentifiedSpeciesName,
} from './utils/customSpeciesDB';
import { INITIAL_HABITATS } from './data/habitats';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ScannerView } from './components/ScannerView';
import { BioDexView } from './components/BioDexView';
import { HabitatsMapView } from './components/HabitatsMapView';
import { PredictView } from './components/PredictView';
import { BioChatView } from './components/BioChatView';
import { ReportsView } from './components/ReportsView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GuestAuthModal } from './components/GuestAuthModal';
import { TutorialModal } from './components/TutorialModal';
import { SplashScreen } from './components/SplashScreen';
import { LanguageSelectionModal } from './components/LanguageSelectionModal';
import { getThemeConfig } from './utils/theme';
import {
  saveSurveyRecordToFirestore,
  fetchSurveyRecordsFromFirestore,
  deleteSurveyRecordFromFirestore,
  subscribeToSurveys,
} from './lib/firestoreService';
import { soundFX } from './utils/audio';
import { calculateActualPVAPrediction } from './utils/pvaPredictionEngine';
import { CheckCircle2 } from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getSavedLanguage, saveLanguage } from './utils/i18n';

const DELETED_RECORDS_KEY = 'biodex_deleted_records';
const SURVEY_RECORDS_KEY = 'biodex_survey_records';

function getDeletedRecordIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_RECORDS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveDeletedRecordId(id: string) {
  try {
    const set = getDeletedRecordIds();
    set.add(id);
    localStorage.setItem(DELETED_RECORDS_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

function getStoredSurveyRecords(): SurveyRecord[] {
  const deleted = getDeletedRecordIds();
  try {
    const raw = localStorage.getItem(SURVEY_RECORDS_KEY);
    if (raw) {
      const records: SurveyRecord[] = JSON.parse(raw);
      const filtered = records.filter((r) => !deleted.has(r.recordId));
      if (filtered.length > 0) return filtered;
    }
  } catch {}
  if (deleted.has(INITIAL_DEFAULT_SURVEY_RECORD.recordId)) {
    return [];
  }
  return [INITIAL_DEFAULT_SURVEY_RECORD];
}

export default function App() {
  // Theme selection: ruby, emerald, gold, slate, beige
  const [theme, setTheme] = useState<ChassisTheme>('ruby');

  // Multi-language support (English, Spanish, French, German, Hindi, Chinese)
  const [language, setLanguage] = useState<SupportedLanguage>(getSavedLanguage);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    saveLanguage(newLang);
  };

  // Video Splash Screen State - disabled on startup so BioDex opens directly
  const [showSplash, setShowSplash] = useState(false);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('scanner');

  // Sound FX toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Student Session (guest or Google Auth) - Field Naturalist default
  const [session, setSession] = useState<StudentSession>({
    classCode: 'BIO-EXPEDITION-2026',
    gradeLevel: 'Field Naturalist',
    guestId: 'BIO-7842',
    sectorCoord: 'Prairie Quad Sector 4',
    authProvider: 'guest',
  });

  // Modal open states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isInitialAfterSplash, setIsInitialAfterSplash] = useState(false);

  // Species catalog and active specimen - loads built-in and custom registered species
  const [catalog, setCatalog] = useState<SpeciesData[]>(getFullSpeciesCatalog);
  const [currentSpecies, setCurrentSpecies] = useState<SpeciesData>(() => {
    const list = getFullSpeciesCatalog();
    return list[0] || INITIAL_SPECIES_CATALOG[0];
  });

  // Habitats & Map Geo-Spatial State
  const [habitats, setHabitats] = useState<Habitat[]>(INITIAL_HABITATS);
  const [activeHabitat, setActiveHabitat] = useState<Habitat>(INITIAL_HABITATS[0]);

  // Scanner field observation variables
  const [censusCount, setCensusCount] = useState<number>(4);
  const [selectedHabitat, setSelectedHabitat] = useState<string>('Tallgrass Prairie');
  const [disturbanceLevel, setDisturbanceLevel] = useState<HumanDisturbanceLevel>('LOW');

  // Conservation Levers (Simulation sandbox in Predict view)
  const [levers, setLevers] = useState<ConservationLevers>({
    prairieBufferExpansion: 25,
    invasivePlantRemovalRate: 60,
  });

  // Survey Records Buffer (PBR list for export and Firestore sync) - persistent & blacklist-filtered
  const [surveyRecords, setSurveyRecords] = useState<SurveyRecord[]>(getStoredSurveyRecords);

  // Sync surveyRecords to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SURVEY_RECORDS_KEY, JSON.stringify(surveyRecords));
    } catch {}
  }, [surveyRecords]);

  // Active Survey Record for PVA Simulation & Real-time Extinction Graph
  const [activeSimulationRecord, setActiveSimulationRecord] = useState<SurveyRecord | null>(
    () => surveyRecords[0] || null
  );

  // AI Specimen PVA Analysis state
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [specimenAnalysis, setSpecimenAnalysis] = useState<{
    extinctionRiskPercentage?: number;
    projectedExtinctionYear?: string;
    iucnStatus?: string;
    keyDrivers?: string[];
    immediateActions?: string[];
    summary?: string;
  } | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Initial Firestore synchronization & live real-time listener (filters out deleted items)
  useEffect(() => {
    let isMounted = true;

    // Fetch existing records from Firestore
    fetchSurveyRecordsFromFirestore().then((cloudRecords) => {
      if (isMounted && cloudRecords.length > 0) {
        const deleted = getDeletedRecordIds();
        setSurveyRecords((prev) => {
          const ids = new Set(prev.map((r) => r.recordId));
          const newUnique = cloudRecords.filter((r) => !ids.has(r.recordId) && !deleted.has(r.recordId));
          return [...newUnique, ...prev];
        });
      }
    });

    // Real-time listener for classroom multi-user surveys
    const unsubscribe = subscribeToSurveys((updatedSurveys) => {
      if (isMounted && updatedSurveys.length > 0) {
        const deleted = getDeletedRecordIds();
        setSurveyRecords((prev) => {
          const map = new Map<string, SurveyRecord>();
          updatedSurveys.forEach((r) => {
            if (!deleted.has(r.recordId)) map.set(r.recordId, r);
          });
          prev.forEach((r) => {
            if (!map.has(r.recordId) && !deleted.has(r.recordId)) map.set(r.recordId, r);
          });
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundFX.enabled = nextVal;
  };

  // Save to Firebase & Trigger Instant AI Analysis
  const handleSaveToFirebaseAndAnalyze = async () => {
    // User must be logged in to save species records to Firestore
    const isLoggedIn = session.authProvider === 'google' && Boolean(session.firebaseUid);
    if (!isLoggedIn) {
      soundFX.playCancel();
      showToast('Authentication Required: Please sign in with Google to save species records.');
      setIsAuthModalOpen(true);
      return;
    }

    try {
      soundFX.playConfirm();
      setIsAnalyzingAI(true);

      const newRecordId = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Request AI Specimen Analysis from Gemini server endpoint
      let analysisSummary = '';
      let riskPercent = currentSpecies.vitalityStats.extinctionModelRiskPercent;
      let projectedYear = `Year ${currentSpecies.vitalityStats.extinctionHorizonYear} (if unmitigated)`;

      try {
        const aiResponse = await fetch('/api/analyze-specimen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            commonName: currentSpecies.commonName,
            scientificName: currentSpecies.scientificName,
            habitatType: selectedHabitat,
            observedCount: censusCount,
            disturbanceLevel: disturbanceLevel,
            historicalPop2012: currentSpecies.historicalPop2012,
            currentPop2026: currentSpecies.currentPop2026,
            levers: levers,
          }),
        });

        const aiData = await aiResponse.json();
        if (aiData.success && aiData.analysis) {
          setSpecimenAnalysis(aiData.analysis);
          analysisSummary = aiData.analysis.summary || '';
          if (aiData.analysis.extinctionRiskPercentage) {
            riskPercent = aiData.analysis.extinctionRiskPercentage;
          }
          if (aiData.analysis.projectedExtinctionYear) {
            projectedYear = aiData.analysis.projectedExtinctionYear;
          }
        }
      } catch (aiErr) {
        console.warn('AI analysis endpoint warning:', aiErr);
      }

      // If server analysis was unavailable or fallback, use dynamic demographic PVA model
      if (!analysisSummary) {
        const dynamicPva = calculateActualPVAPrediction({
          speciesName: currentSpecies.commonName,
          scientificName: currentSpecies.scientificName,
          category: currentSpecies.category,
          observedCount: censusCount,
          habitatType: selectedHabitat,
          disturbanceLevel: disturbanceLevel,
        });

        riskPercent = dynamicPva.extinctionRiskPercentage;
        projectedYear = `Year ${dynamicPva.projectedCollapseYear} (if unmitigated)`;
        analysisSummary = dynamicPva.summary;
        setSpecimenAnalysis({
          extinctionRiskPercentage: dynamicPva.extinctionRiskPercentage,
          projectedExtinctionYear: `Year ${dynamicPva.projectedCollapseYear}`,
          iucnStatus: currentSpecies.iucnStatus,
          keyDrivers: [
            `Habitat Fragmentation: ${dynamicPva.limitingFactors.habitatFragmentation}%`,
            `Invasive Pressure: ${dynamicPva.limitingFactors.invasiveCompetition}%`,
            `Hydric & Soil Stress: ${dynamicPva.limitingFactors.climateAndSoilStress}%`,
          ],
          immediateActions: dynamicPva.immediateActions || [
            'Maintain vegetative buffer zones',
            'Conduct quarterly phenological transect surveys',
            'Implement invasive weed and pathogen containment',
          ],
          summary: dynamicPva.summary,
        });
      }

      // 2. Form survey record
      const newRecord: SurveyRecord = {
        recordId: newRecordId,
        studentGuestId: session.guestId,
        userId: session.firebaseUid,
        userEmail: session.userEmail,
        userDisplayName: session.userDisplayName,
        gradeLevel: session.gradeLevel,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        speciesId: currentSpecies.id,
        speciesCommon: currentSpecies.commonName,
        speciesScientific: currentSpecies.scientificName,
        imageUrl: currentSpecies.imageUrl,
        visionConfidence: `${currentSpecies.visionMatchConfidence}% Match`,
        observedCount: censusCount,
        habitatType: selectedHabitat,
        humanDisturbance: disturbanceLevel,
        gpsCoordinates: `${activeHabitat.latitude.toFixed(4)}° N, ${Math.abs(activeHabitat.longitude).toFixed(4)}° W`,
        sectorCoord: session.sectorCoord,
        historicalPop2001: currentSpecies.historicalPop2001,
        historicalPop2007: currentSpecies.historicalPop2007,
        historicalPop2012: currentSpecies.historicalPop2012,
        historicalPop2013: currentSpecies.historicalPop2013,
        historicalPop2019: currentSpecies.historicalPop2019,
        currentPop2026: currentSpecies.currentPop2026,
        predictedPop2031: currentSpecies.predictedPop2031,
        aiEndangeredStatus: currentSpecies.iucnStatus,
        aiExtinctionRiskPercentage: riskPercent,
        aiProjectedExtinctionYear: projectedYear,
        smartReportUrl: `https://app.wwf.org/reports/${newRecordId}.pdf`,
        conservationLevers: levers,
        aiAnalysis: analysisSummary,
        storedInFirebase: true,
      };

      // 3. Persist to Firebase Firestore
      const saveResult = await saveSurveyRecordToFirestore(newRecord, session);

      // 4. Update local state
      setSurveyRecords((prev) => [newRecord, ...prev]);

      // 5. Update Habitat verified counts
      setHabitats((prev) =>
        prev.map((h) =>
          h.id === activeHabitat.id
            ? { ...h, verifiedSurveysCount: h.verifiedSurveysCount + 1 }
            : h
        )
      );

      soundFX.playScanBeep();
      if (saveResult.success) {
        showToast(`Stored to Firebase Firestore & Analyzed with AI! (${newRecordId})`);
      } else {
        showToast(`Logged locally with AI Analysis (${newRecordId})`);
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast('Error saving observation.');
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // Log to Field PBR Protocol
  const handleLogFieldEntry = async (customRecord?: SurveyRecord) => {
    // User must be logged in to save species records to Firestore
    const isLoggedIn = session.authProvider === 'google' && Boolean(session.firebaseUid);
    if (!isLoggedIn) {
      soundFX.playCancel();
      showToast('Authentication Required: Please sign in with Google to save species records.');
      setIsAuthModalOpen(true);
      return;
    }

    soundFX.playConfirm();
    const newRecordId = customRecord?.recordId || `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: SurveyRecord = customRecord
      ? { ...customRecord, recordId: newRecordId, storedInFirebase: true }
      : {
          recordId: newRecordId,
          studentGuestId: session.guestId,
          userId: session.firebaseUid,
          userEmail: session.userEmail,
          userDisplayName: session.userDisplayName,
          gradeLevel: session.gradeLevel,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          speciesId: currentSpecies.id,
          speciesCommon: currentSpecies.commonName,
          speciesScientific: currentSpecies.scientificName,
          imageUrl: currentSpecies.imageUrl,
          visionConfidence: `${currentSpecies.visionMatchConfidence}% Match`,
          observedCount: censusCount,
          habitatType: selectedHabitat,
          humanDisturbance: disturbanceLevel,
          gpsCoordinates: `${activeHabitat.latitude.toFixed(4)}° N, ${Math.abs(activeHabitat.longitude).toFixed(4)}° W`,
          sectorCoord: session.sectorCoord,
          historicalPop2001: currentSpecies.historicalPop2001,
          historicalPop2007: currentSpecies.historicalPop2007,
          historicalPop2012: currentSpecies.historicalPop2012,
          historicalPop2013: currentSpecies.historicalPop2013,
          historicalPop2019: currentSpecies.historicalPop2019,
          currentPop2026: currentSpecies.currentPop2026,
          predictedPop2031: currentSpecies.predictedPop2031,
          aiEndangeredStatus: currentSpecies.iucnStatus,
          aiExtinctionRiskPercentage: currentSpecies.vitalityStats.extinctionModelRiskPercent,
          aiProjectedExtinctionYear: `Year ${currentSpecies.vitalityStats.extinctionHorizonYear} (if unmitigated)`,
          smartReportUrl: `https://app.wwf.org/reports/${newRecordId}.pdf`,
          conservationLevers: levers,
          storedInFirebase: true,
        };

    // Save to Firestore
    await saveSurveyRecordToFirestore(newRecord, session);
    setSurveyRecords((prev) => {
      const exists = prev.some((r) => r.recordId === newRecord.recordId);
      if (exists) {
        return prev.map((r) => (r.recordId === newRecord.recordId ? newRecord : r));
      }
      return [newRecord, ...prev];
    });

    // Directly bind this submitted survey data to the dynamic PVA extinction simulator
    setActiveSimulationRecord(newRecord);
    const matched = catalog.find(
      (s) =>
        s.id === newRecord.speciesId ||
        s.commonName.toLowerCase() === (newRecord.Species_Name_Common || newRecord.speciesCommon || '').toLowerCase()
    );
    if (matched) {
      setCurrentSpecies(matched);
    }

    showToast(`Stored in database & PBR Register: ${newRecordId}`);
  };

  // When user selects a habitat from the Map and wants to go there and capture
  const handleGoToHabitatAndScan = (targetHab: Habitat) => {
    setActiveHabitat(targetHab);
    setSelectedHabitat(targetHab.type);
    setSession((prev) => ({ ...prev, sectorCoord: targetHab.targetSector }));
    setActiveTab('scanner');
    showToast(`Navigated to ${targetHab.name}. Ready to capture diversity!`);
  };

  // When a student classifies or names a species
  const handleSpeciesIdentified = (newSpeciesData: SpeciesData) => {
    setCurrentSpecies(newSpeciesData);
    setCatalog((prev) => {
      const exists = prev.find((s) => s.id === newSpeciesData.id);
      if (exists) {
        return prev.map((s) => (s.id === newSpeciesData.id ? newSpeciesData : s));
      }
      return [newSpeciesData, ...prev];
    });

    // If it's a real species name (not undetected placeholder), persist to custom species database
    if (!isUnidentifiedSpeciesName(newSpeciesData.commonName)) {
      saveCustomSpecies(newSpeciesData, newSpeciesData.tags || []);
    }

    showToast(`Computer Vision Verified: ${newSpeciesData.commonName} (${newSpeciesData.visionMatchConfidence}% Conf)`);
  };

  // Delete survey record from Firestore, localStorage & state buffer
  const handleDeleteSurveyRecord = async (recordId: string) => {
    soundFX.playCancel();
    saveDeletedRecordId(recordId);
    setSurveyRecords((prev) => {
      const next = prev.filter((r) => r.recordId !== recordId);
      try {
        localStorage.setItem(SURVEY_RECORDS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    if (activeSimulationRecord?.recordId === recordId) {
      setActiveSimulationRecord(null);
    }
    showToast(`Removed observation ${recordId} from Biodiversity Register.`);
    try {
      await deleteSurveyRecordFromFirestore(recordId);
    } catch (err) {
      console.warn('Could not delete from Firestore:', err);
    }
  };

  const themeCfg = getThemeConfig(theme);

  return (
    <div
      data-theme={theme}
      className={`min-h-screen ${themeCfg.chassisBg} ${themeCfg.chassisText} ${themeCfg.fontClass} flex flex-col transition-colors duration-300 select-none overflow-x-hidden`}
    >
      {/* Video Splash Screen with custom video and audio start */}
      {showSplash && (
        <SplashScreen
          onStart={() => {
            setShowSplash(false);
            setIsInitialAfterSplash(true);
            setIsLanguageModalOpen(true);
          }}
          soundEnabled={soundEnabled}
        />
      )}

      {/* Top Header - Rendered on non-scanner tabs (Scanner has its own integrated top HUD bar) */}
      {activeTab !== 'scanner' && (
        <Header
          theme={theme}
          onThemeChange={setTheme}
          session={session}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onReplaySplash={() => setShowSplash(true)}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          language={language}
          onLanguageChange={handleLanguageChange}
          onOpenLanguageModal={() => {
            setIsInitialAfterSplash(false);
            setIsLanguageModalOpen(true);
          }}
        />
      )}

      {/* Main Content Viewport Container */}
      <main className={`flex-1 w-full max-w-2xl mx-auto flex flex-col items-center ${activeTab === 'scanner' ? 'pt-1 pb-1 px-1 sm:px-2' : 'pt-16 sm:pt-20 pb-20 sm:pb-24 px-2 sm:px-4'}`}>
        {/* Toast Feedback Notification */}
        {toastMessage && (
          <div className="fixed top-16 inset-x-4 max-w-md mx-auto z-50 bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 border border-slate-700/80">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold leading-tight">
                {toastMessage}
              </span>
            </div>
            <span className="font-mono text-[9px] uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              PBR Log
            </span>
          </div>
        )}

        {/* View Switcher Router */}
        <ErrorBoundary key={activeTab} onReset={() => setActiveTab('scanner')}>
        {activeTab === 'scanner' && (
          <ScannerView
            currentSpecies={currentSpecies}
            session={session}
            censusCount={censusCount}
            onUpdateCensusCount={setCensusCount}
            selectedHabitat={selectedHabitat}
            onUpdateHabitat={setSelectedHabitat}
            disturbanceLevel={disturbanceLevel}
            onUpdateDisturbance={setDisturbanceLevel}
            onAnalyzeAI={() => {
              setActiveTab('predict');
            }}
            onLogPBR={handleLogFieldEntry}
            onSpeciesIdentified={handleSpeciesIdentified}
            activeHabitat={activeHabitat}
            onSaveToFirebaseAndAnalyze={handleSaveToFirebaseAndAnalyze}
            isAnalyzingAI={isAnalyzingAI}
            specimenAnalysis={specimenAnalysis}
            onNavigateToTab={setActiveTab}
            surveyRecords={surveyRecords}
            catalog={catalog}
            onDeleteRecord={handleDeleteSurveyRecord}
            theme={theme}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            onRequireLogin={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'biodex' && (
          <BioDexView
            currentSpecies={currentSpecies}
            catalog={catalog}
            onSelectSpecies={setCurrentSpecies}
            session={session}
            theme={theme}
            onRunPredictor={() => {
              setActiveTab('predict');
            }}
            onLogFieldEntry={handleLogFieldEntry}
            onReturnToScanner={() => {
              setActiveTab('scanner');
            }}
            surveyRecords={surveyRecords}
            onDeleteRecord={handleDeleteSurveyRecord}
            onUpdateRecord={handleLogFieldEntry}
            onNavigateToTab={setActiveTab}
            onSelectRecordForSimulation={(rec) => {
              setActiveSimulationRecord(rec);
            }}
          />
        )}

        {activeTab === 'map' && (
          <HabitatsMapView
            habitats={habitats}
            activeHabitat={activeHabitat}
            onSelectHabitat={setActiveHabitat}
            onGoToHabitatAndScan={handleGoToHabitatAndScan}
            session={session}
            surveyRecords={surveyRecords}
            catalog={catalog}
            theme={theme}
            onSelectRecordForSimulation={(rec) => {
              setActiveSimulationRecord(rec);
              setActiveTab('predict');
            }}
            onSelectSpecies={(sp) => {
              setCurrentSpecies(sp);
              setActiveTab('biodex');
            }}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'predict' && (
          <PredictView
            currentSpecies={currentSpecies}
            levers={levers}
            onUpdateLevers={setLevers}
            onGenerateReport={() => {
              setActiveTab('reports');
            }}
            onReturnToDex={() => {
              setActiveTab('biodex');
            }}
            theme={theme}
            activeRecord={activeSimulationRecord}
            surveyRecords={surveyRecords}
            onSelectRecord={(rec) => {
              setActiveSimulationRecord(rec);
              const matched = catalog.find(
                (s) =>
                  s.id === rec.speciesId ||
                  s.commonName.toLowerCase() === (rec.Species_Name_Common || rec.speciesCommon || '').toLowerCase()
              );
              if (matched) {
                setCurrentSpecies(matched);
              }
            }}
          />
        )}

        {activeTab === 'chat' && (
          <BioChatView
            session={session}
            currentSpecies={currentSpecies}
            surveyRecords={surveyRecords}
            theme={theme}
            onThemeChange={setTheme}
            onNavigateToTab={setActiveTab}
            onSelectSpecies={setCurrentSpecies}
            catalog={catalog}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            currentRecord={surveyRecords[0] || null}
            session={session}
            allRecords={surveyRecords}
            onReturnToScanner={() => {
              setActiveTab('scanner');
            }}
            onDeleteRecord={handleDeleteSurveyRecord}
          />
        )}
        </ErrorBoundary>
      </main>

      {/* Guest Authentication Modal (Step 1 Onboarding & PII protection) */}
      <GuestAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        session={session}
        onSaveSession={(newSession) => {
          setSession(newSession);
          showToast(`Student Session Updated: ${newSession.guestId}`);
        }}
      />

      {/* Persistent Bottom Navigation Bar - on non-scanner tabs (Scanner has integrated camera dock navigation) */}
      {activeTab !== 'scanner' && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} theme={theme} language={language} />
      )}

      {/* BioDex Interactive Naturalist Tutorial & Field Guide with Arrows & Labels */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        theme={theme}
        onNavigateToTab={setActiveTab}
      />

      {/* 4 Regional + 2 International Language Selection Screen (triggered right after splash or from header) */}
      <LanguageSelectionModal
        isOpen={isLanguageModalOpen}
        currentLanguage={language}
        onSelectLanguage={handleLanguageChange}
        onConfirm={() => {
          setIsLanguageModalOpen(false);
          setIsInitialAfterSplash(false);
          const sel = SUPPORTED_LANGUAGES.find((l) => l.code === language);
          showToast(`Expedition language: ${sel?.flag} ${sel?.name}`);
        }}
        theme={theme}
        isInitialAfterSplash={isInitialAfterSplash}
      />
    </div>
  );
}
