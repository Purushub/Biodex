/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  db,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
} from './firebase';
import { SurveyRecord, StudentSession } from '../types';

const SURVEYS_COLLECTION = 'surveys';
const USERS_COLLECTION = 'users';

/**
 * Delete a survey record from Firebase Firestore
 */
export async function deleteSurveyRecordFromFirestore(
  recordId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const recordDocRef = doc(db, SURVEYS_COLLECTION, recordId);
    await deleteDoc(recordDocRef);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown Firestore error';
    console.warn('Could not delete from Firestore (removing locally):', message);
    return { success: false, error: message };
  }
}

/**
 * Persist a survey record to Firebase Firestore
 */
export async function saveSurveyRecordToFirestore(
  record: SurveyRecord,
  session?: StudentSession
): Promise<{ success: boolean; id: string; error?: string }> {
  try {
    const recordDocRef = doc(db, SURVEYS_COLLECTION, record.recordId);
    
    // Clean record object ensuring no undefined fields
    const recordId = record.recordId || record.Record_ID || `REC-${Date.now()}`;
    const studentGuestId = record.studentGuestId || record.Student_Guest_ID || session?.guestId || 'GUEST-BIO';
    const gradeLevel = record.gradeLevel || record.Grade_Level || session?.gradeLevel || 'Grade 8';
    const timestamp = record.timestamp || record.Timestamp || new Date().toISOString();
    const speciesCommon = record.speciesCommon || record.Species_Name_Common || 'Western Prairie Fringed Orchid';
    const speciesScientific = record.speciesScientific || record.Species_Name_Scientific || 'Platanthera praeclara';
    const imageUrl = record.imageUrl || record.Image_URL || '';
    const visionConfidence = record.visionConfidence || record.AI_Vision_Match_Confidence || '98.6% Match';
    const observedCount = Number(record.observedCount ?? record.Observed_Count ?? 1);
    const habitatType = record.habitatType || record.Habitat_Type || 'Tallgrass Prairie';
    const hist2001 = Number(record.historicalPop2001 ?? record.Historical_Pop_Baseline_2001 ?? 0);
    const hist2007 = Number(record.historicalPop2007 ?? record.Historical_Pop_Baseline_2007 ?? 0);
    const hist2012 = Number(record.historicalPop2012 ?? 0);
    const hist2013 = Number(record.historicalPop2013 ?? record.Historical_Pop_Baseline_2013 ?? 0);
    const hist2019 = Number(record.historicalPop2019 ?? record.Historical_Pop_Baseline_2019 ?? 0);
    const hist2025 = Number(record.historicalPop2025 ?? record.Historical_Pop_Baseline_2025 ?? record.currentPop2026 ?? 0);
    const curr2026 = Number(record.currentPop2026 ?? hist2025 ?? 0);
    const pred2031 = Number(record.predictedPop2031 ?? record.Prediction_Pop_Baseline_2031 ?? 0);
    const endangeredStatus = record.aiEndangeredStatus || record.AI_Endangered_Status || 'Endangered';
    const riskPercent = Number(record.aiExtinctionRiskPercentage ?? record.AI_Extinction_Risk_Percentage ?? 50);
    const projectedYear = String(record.aiProjectedExtinctionYear || record.AI_Projected_Extinction_Year || 'Year 2038');
    const smartReportUrl = record.smartReportUrl || record.Smart_Report_URL || `https://app.wwf.org/reports/${recordId}.pdf`;

    const payload: Record<string, unknown> = {
      recordId,
      studentGuestId,
      userId: session?.firebaseUid || record.userId || null,
      userEmail: session?.userEmail || record.userEmail || null,
      userDisplayName: session?.userDisplayName || record.userDisplayName || null,
      gradeLevel,
      timestamp,
      speciesId: record.speciesId || 'pl-001',
      speciesCommon,
      speciesScientific,
      imageUrl,
      visionConfidence: String(visionConfidence),
      observedCount,
      habitatType,
      humanDisturbance: record.humanDisturbance || 'LOW',
      gpsCoordinates: record.gpsCoordinates || '44.8142° N, 93.3524° W',
      sectorCoord: record.sectorCoord || 'Prairie Quad Sector 4',
      historicalPop2001: hist2001,
      historicalPop2007: hist2007,
      historicalPop2012: hist2012,
      historicalPop2013: hist2013,
      historicalPop2019: hist2019,
      historicalPop2025: hist2025,
      currentPop2026: curr2026,
      predictedPop2031: pred2031,
      aiEndangeredStatus: endangeredStatus,
      aiExtinctionRiskPercentage: riskPercent,
      aiProjectedExtinctionYear: projectedYear,
      smartReportUrl,
      conservationLevers: record.conservationLevers || { prairieBufferExpansion: 25, invasivePlantRemovalRate: 60 },
      aiAnalysis: record.aiAnalysis || null,
      yearWiseTrend: record.yearWiseTrend || null,
      aiFeedback: record.aiFeedback || null,
      studentSurveyNotes: record.studentSurveyNotes || null,
      trendDirection: record.trendDirection || null,
      percentChange: record.percentChange || null,

      // Specific snake_case capitalized keys
      Record_ID: recordId,
      Student_Guest_ID: studentGuestId,
      Grade_Level: gradeLevel,
      Timestamp: timestamp,
      Species_Name_Common: speciesCommon,
      Species_Name_Scientific: speciesScientific,
      Image_URL: imageUrl,
      AI_Vision_Match_Confidence: visionConfidence,
      Observed_Count: observedCount,
      Habitat_Type: habitatType,
      Historical_Pop_Baseline_2001: hist2001,
      Historical_Pop_Baseline_2007: hist2007,
      Historical_Pop_Baseline_2013: hist2013,
      Historical_Pop_Baseline_2019: hist2019,
      Historical_Pop_Baseline_2025: hist2025,
      Prediction_Pop_Baseline_2031: pred2031,
      AI_Endangered_Status: endangeredStatus,
      AI_Extinction_Risk_Percentage: riskPercent,
      AI_Projected_Extinction_Year: projectedYear,
      Smart_Report_URL: smartReportUrl,
      
      createdAt: new Date().toISOString(),
    };

    await setDoc(recordDocRef, payload, { merge: true });
    return { success: true, id: record.recordId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown Firestore error';
    console.warn('Could not save to Firestore (fallback to local buffer):', message);
    return { success: false, id: record.recordId, error: message };
  }
}

function mapDocToSurveyRecord(docId: string, data: Record<string, unknown>): SurveyRecord {
  const recordId = (data.recordId as string) || (data.Record_ID as string) || docId;
  const studentGuestId = (data.studentGuestId as string) || (data.Student_Guest_ID as string) || 'GUEST-BIO';
  const gradeLevel = (data.gradeLevel || data.Grade_Level || 'Grade 8') as any;
  const timestamp = (data.timestamp as string) || (data.Timestamp as string) || new Date().toISOString();
  const speciesCommon = (data.speciesCommon as string) || (data.Species_Name_Common as string) || 'Western Prairie Fringed Orchid';
  const speciesScientific = (data.speciesScientific as string) || (data.Species_Name_Scientific as string) || 'Platanthera praeclara';
  const imageUrl = (data.imageUrl as string) || (data.Image_URL as string) || '';
  const visionConfidence = (data.visionConfidence as string) || (data.AI_Vision_Match_Confidence ? `${data.AI_Vision_Match_Confidence}%` : '98.6% Match');
  const observedCount = Number(data.observedCount ?? data.Observed_Count ?? 1);
  const habitatType = (data.habitatType as string) || (data.Habitat_Type as string) || 'Tallgrass Prairie';
  const hist2001 = Number(data.historicalPop2001 ?? data.Historical_Pop_Baseline_2001 ?? 0);
  const hist2007 = Number(data.historicalPop2007 ?? data.Historical_Pop_Baseline_2007 ?? 0);
  const hist2012 = Number(data.historicalPop2012 ?? 0);
  const hist2013 = Number(data.historicalPop2013 ?? data.Historical_Pop_Baseline_2013 ?? 0);
  const hist2019 = Number(data.historicalPop2019 ?? data.Historical_Pop_Baseline_2019 ?? 0);
  const hist2025 = Number(data.historicalPop2025 ?? data.Historical_Pop_Baseline_2025 ?? data.currentPop2026 ?? 0);
  const curr2026 = Number(data.currentPop2026 ?? hist2025 ?? 0);
  const pred2031 = Number(data.predictedPop2031 ?? data.Prediction_Pop_Baseline_2031 ?? 0);
  const endangeredStatus = (data.aiEndangeredStatus || data.AI_Endangered_Status || 'Endangered') as any;
  const riskPercent = Number(data.aiExtinctionRiskPercentage ?? data.AI_Extinction_Risk_Percentage ?? 50);
  const projectedYear = String(data.aiProjectedExtinctionYear || data.AI_Projected_Extinction_Year || 'Year 2038');
  const smartReportUrl = (data.smartReportUrl as string) || (data.Smart_Report_URL as string) || `https://app.wwf.org/reports/${recordId}.pdf`;

  return {
    ...data,
    recordId,
    studentGuestId,
    gradeLevel,
    timestamp,
    speciesId: (data.speciesId as string) || 'pl-001',
    speciesCommon,
    speciesScientific,
    imageUrl,
    visionConfidence: String(visionConfidence),
    observedCount,
    habitatType,
    humanDisturbance: (data.humanDisturbance || 'LOW') as any,
    gpsCoordinates: (data.gpsCoordinates as string) || '44.8142° N, 93.3524° W',
    sectorCoord: (data.sectorCoord as string) || 'Prairie Quad Sector 4',
    historicalPop2001: hist2001,
    historicalPop2007: hist2007,
    historicalPop2012: hist2012,
    historicalPop2013: hist2013,
    historicalPop2019: hist2019,
    historicalPop2025: hist2025,
    currentPop2026: curr2026,
    predictedPop2031: pred2031,
    aiEndangeredStatus: endangeredStatus,
    aiExtinctionRiskPercentage: riskPercent,
    aiProjectedExtinctionYear: projectedYear,
    smartReportUrl,
    conservationLevers: (data.conservationLevers || { prairieBufferExpansion: 25, invasivePlantRemovalRate: 60 }) as any,
    storedInFirebase: true,

    Record_ID: recordId,
    Student_Guest_ID: studentGuestId,
    Grade_Level: gradeLevel,
    Timestamp: timestamp,
    Species_Name_Common: speciesCommon,
    Species_Name_Scientific: speciesScientific,
    Image_URL: imageUrl,
    AI_Vision_Match_Confidence: visionConfidence,
    Observed_Count: observedCount,
    Habitat_Type: habitatType,
    Historical_Pop_Baseline_2001: hist2001,
    Historical_Pop_Baseline_2007: hist2007,
    Historical_Pop_Baseline_2013: hist2013,
    Historical_Pop_Baseline_2019: hist2019,
    Historical_Pop_Baseline_2025: hist2025,
    Prediction_Pop_Baseline_2031: pred2031,
    AI_Endangered_Status: endangeredStatus,
    AI_Extinction_Risk_Percentage: riskPercent,
    AI_Projected_Extinction_Year: projectedYear,
    Smart_Report_URL: smartReportUrl,
  } as SurveyRecord;
}

/**
 * Fetch all survey records from Firestore ordered by timestamp descending
 */
export async function fetchSurveyRecordsFromFirestore(): Promise<SurveyRecord[]> {
  try {
    const surveysCol = collection(db, SURVEYS_COLLECTION);
    const q = query(surveysCol, orderBy('timestamp', 'desc'), limit(50));
    const snapshot = await getDocs(q);

    const records: SurveyRecord[] = [];
    snapshot.forEach((docSnapshot) => {
      records.push(mapDocToSurveyRecord(docSnapshot.id, docSnapshot.data()));
    });
    return records;
  } catch (err: unknown) {
    console.warn('Error reading from Firestore surveys collection:', err);
    return [];
  }
}

/**
 * Subscribe to real-time survey updates from Firestore
 */
export function subscribeToSurveys(
  onRecordsUpdated: (records: SurveyRecord[]) => void
): () => void {
  try {
    const surveysCol = collection(db, SURVEYS_COLLECTION);
    const q = query(surveysCol, orderBy('timestamp', 'desc'), limit(30));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const records: SurveyRecord[] = [];
        snapshot.forEach((docSnap) => {
          records.push(mapDocToSurveyRecord(docSnap.id, docSnap.data()));
        });
        if (records.length > 0) {
          onRecordsUpdated(records);
        }
      },
      (error) => {
        console.warn('Firestore real-time subscription error:', error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to attach Firestore onSnapshot listener:', err);
    return () => {};
  }
}

/**
 * Sync user profile to Firestore
 */
export async function syncUserProfile(session: StudentSession): Promise<void> {
  if (!session.firebaseUid) return;
  try {
    const userDocRef = doc(db, USERS_COLLECTION, session.firebaseUid);
    await setDoc(
      userDocRef,
      {
        uid: session.firebaseUid,
        email: session.userEmail || null,
        displayName: session.userDisplayName || session.guestId,
        gradeLevel: session.gradeLevel,
        classCode: session.classCode,
        lastActive: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Error syncing user profile to Firestore:', err);
  }
}
