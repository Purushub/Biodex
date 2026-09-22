export type ChassisTheme = 'ruby' | 'emerald' | 'gold' | 'slate' | 'beige';

export type NavTab = 'scanner' | 'biodex' | 'map' | 'predict' | 'chat' | 'reports';

export type GradeLevel = 'Field Naturalist' | 'Student' | 'Researcher' | 'Grade 6' | 'Grade 8' | 'Grade 9';

export type HumanDisturbanceLevel = 'LOW' | 'MED' | 'HIGH';

export type IUCNStatus = 
  | 'Least Concern'
  | 'Near Threatened'
  | 'Vulnerable'
  | 'Endangered'
  | 'Critically Endangered'
  | 'Extinct in the Wild'
  | 'Extinct';

export interface SpeciesTaxonomy {
  kingdom: string;
  order: string;
  family?: string;
  genusSpecies: string;
}

export interface GoogleLensVisualMatch {
  name: string;
  distinction: string;
}

export interface GoogleLensIdentification {
  commonName: string;
  scientificName: string;
  confidence: number;
  description: string;
  visualFeatures: string[];
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  iucnStatus?: string;
  habitatType?: string;
  keyThreats?: string;
  ecologicalRole?: string;
  googleLensFact?: string;
  similarVisualMatches?: GoogleLensVisualMatch[];
  tags?: string[];
  imageUrl?: string;
  source?: string;
  timestamp?: string;
}

export interface VitalityStats {
  populationHealthValue: string;
  populationHealthPercent: number;
  populationHealthStatus: 'CRITICAL' | 'LOW' | 'MODERATE' | 'STABLE';
  habitatIntegrityPercent: number;
  habitatIntegrityStatus: string;
  pollinatorDensityPercent: number;
  pollinatorDensityStatus: string;
  climateResiliencePercent: number;
  climateResilienceStatus: string;
  extinctionModelRiskPercent: number;
  extinctionHorizonYear: number;
}

export interface LimitingFactors {
  habitatFragmentation: number; // 0-100%
  pollinatorDensity: number; // 0-100%
  climateVolatility: number; // 0-100%
}

export interface ConservationLevers {
  prairieBufferExpansion: number; // 0-50%
  invasivePlantRemovalRate: number; // 10-95%/Mo
}

export interface SpeciesData {
  id: string;
  catalogNumber: string;
  slotNumber: string;
  level: number;
  category: 'Flora' | 'Fauna' | 'Insecta' | 'Reptilia' | 'Fruit & Crop' | 'Everyday Item';
  subType: string;
  commonName: string;
  scientificName: string;
  genderOrReproduction?: string;
  imageUrl: string;
  visionMatchConfidence: number; // e.g. 98.6
  biodiversityRank?: number; // e.g. 1 (Keystone rank)
  biodiversityScore?: number; // e.g. 98.6
  taxonomy: SpeciesTaxonomy;
  iucnStatus: IUCNStatus;
  iucnCriteria?: string;
  habitat: string;
  historicalPop2001: number;
  historicalPop2007: number;
  historicalPop2012: number;
  historicalPop2013: number;
  historicalPop2018: number;
  historicalPop2019: number;
  historicalPop2025?: number;
  currentPop2026: number;
  predictedPop2031: number;
  unmitigatedCollapseYear: number;
  collapseFloor: number;
  reboundGoal: number;
  neuralConfidence: number;
  vitalityStats: VitalityStats;
  limitingFactors: LimitingFactors;
  biologistMemo: {
    entryRef: string;
    reserveLocation: string;
    timeLogged: string;
    details: string;
  };
  curriculumDiscussion: string;
}

export interface Habitat {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  keySpecies: string[];
  integrityScore: number;
  description: string;
  mapsUrl?: string;
  targetSector: string;
  verifiedSurveysCount: number;
  recommendedTime: string;
  humanPressure: HumanDisturbanceLevel;
}

export interface SurveyRecord {
  recordId: string;
  studentGuestId: string;
  userId?: string;
  userEmail?: string;
  userDisplayName?: string;
  gradeLevel: GradeLevel;
  timestamp: string;
  speciesId: string;
  speciesCommon: string;
  speciesScientific: string;
  imageUrl: string;
  visionConfidence: string;
  observedCount: number;
  habitatType: string;
  humanDisturbance: HumanDisturbanceLevel;
  gpsCoordinates: string;
  sectorCoord: string;
  historicalPop2001: number;
  historicalPop2007: number;
  historicalPop2012: number;
  historicalPop2013: number;
  historicalPop2019: number;
  historicalPop2025?: number;
  currentPop2026: number;
  predictedPop2031: number;
  aiEndangeredStatus: IUCNStatus;
  aiExtinctionRiskPercentage: number;
  aiProjectedExtinctionYear: string;
  smartReportUrl: string;
  conservationLevers: ConservationLevers;
  aiAnalysis?: string;
  storedInFirebase?: boolean;

  // Exact requested field naming aliases
  Record_ID?: string;
  Student_Guest_ID?: string;
  Grade_Level?: string;
  Timestamp?: string;
  Species_Name_Common?: string;
  Species_Name_Scientific?: string;
  Image_URL?: string;
  AI_Vision_Match_Confidence?: number | string;
  Observed_Count?: number;
  Habitat_Type?: string;
  Historical_Pop_Baseline_2001?: number;
  Historical_Pop_Baseline_2007?: number;
  Historical_Pop_Baseline_2013?: number;
  Historical_Pop_Baseline_2019?: number;
  Historical_Pop_Baseline_2025?: number;
  Prediction_Pop_Baseline_2031?: number;
  AI_Endangered_Status?: string;
  AI_Extinction_Risk_Percentage?: number;
  AI_Projected_Extinction_Year?: string;
  Smart_Report_URL?: string;
  yearWiseTrend?: Array<{
    year: number;
    count: number;
    status?: string;
    note?: string;
  }>;
  aiFeedback?: string;
  studentSurveyNotes?: string;
  trendDirection?: 'rose' | 'dwindled' | 'fluctuating' | 'stable';
  percentChange?: string;
}

export interface StudentSession {
  guestId: string;
  classCode: string;
  gradeLevel: GradeLevel;
  sectorCoord: string;
  firebaseUid?: string;
  userEmail?: string;
  userDisplayName?: string;
  authProvider?: 'guest' | 'google' | 'manager';
  isManager?: boolean;
}

export type ChatRole = 'field_ecologist' | 'extinction_modeler' | 'taxonomy_expert';

export type GeminiModelId = 'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview';

export interface GroundingChunk {
  maps?: {
    uri?: string;
    title?: string;
  };
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  groundingChunks?: GroundingChunk[];
}

