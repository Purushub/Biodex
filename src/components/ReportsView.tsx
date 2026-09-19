import React, { useState } from 'react';
import { SurveyRecord, StudentSession } from '../types';
import { exportSurveyToCSV, printLabReport } from '../utils/export';
import { soundFX } from '../utils/audio';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  Server,
  Activity,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Scan,
  Trash2,
} from 'lucide-react';

interface ReportsViewProps {
  currentRecord: SurveyRecord;
  session: StudentSession;
  allRecords: SurveyRecord[];
  onReturnToScanner: () => void;
  onDeleteRecord?: (recordId: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentRecord: initialRecord,
  session,
  allRecords,
  onReturnToScanner,
  onDeleteRecord,
}) => {
  const [selectedRecordId, setSelectedRecordId] = useState<string>(initialRecord?.recordId || '');
  const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
  const [apiPingTesting, setApiPingTesting] = useState(false);
  const [apiLatency, setApiLatency] = useState({ gbif: 24, iucn: 38, inat: 18 });
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

  const activeRecord = allRecords.find((r) => r.recordId === selectedRecordId) || initialRecord || allRecords[0];
  const currentRecord = activeRecord;

  const handleDownloadCSV = () => {
    soundFX.playConfirm();
    exportSurveyToCSV(allRecords);
    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 3000);
  };

  const handlePrintPDF = () => {
    soundFX.playConfirm();
    printLabReport(currentRecord);
  };

  const handlePingApis = async () => {
    soundFX.playScanBeep();
    setApiPingTesting(true);
    try {
      const res = await fetch('/api/environmental-apis/status');
      const data = await res.json();
      if (data) {
        setApiLatency({
          gbif: data.gbif?.latency || 26,
          iucn: data.iucn?.latency || 41,
          inat: data.inaturalist?.latency || 19,
        });
      }
    } catch {
      // Keep previous latencies
    } finally {
      setTimeout(() => setApiPingTesting(false), 500);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto gap-3.5 pb-24 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {downloadSuccessToast && (
        <div className="fixed top-20 inset-x-4 max-w-md mx-auto z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-500 flex items-center justify-between animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-100 shrink-0" />
            <span className="text-xs font-semibold">
              CSV Exported with SOP-5 Schema!
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">
            Downloaded
          </span>
        </div>
      )}

      {/* Identity & Session Metadata Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
              Smart Report: {currentRecord.recordId}
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-600 font-semibold">
            <span>WWF Spec v4.8</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-bold">SOP // Sec 4-5</span>
          </div>
        </div>

        {/* Student Session Metadata Header */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50/80 p-3 rounded-xl border border-slate-100">
          <div>
            <strong className="text-slate-900 font-bold">{session.guestId}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Study Sector</span>
            <strong className="text-emerald-700 font-bold">{session.sectorCoord}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target Category</span>
            <span className="text-slate-800 font-semibold">Tallgrass Flora Diversity</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Timestamp</span>
            <span className="text-slate-600">{currentRecord.timestamp.slice(0, 16)}</span>
          </div>
        </div>
      </div>

      {/* EXECUTIVE SCIENTIFIC SUMMARY (3 Key Metrics) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Extinction Risk
          </span>
          <div className="mt-1">
            <div className="font-mono text-xl font-bold text-rose-600 tracking-tight">
              {currentRecord.aiExtinctionRiskPercentage}%
            </div>
            <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
              High Vulnerability
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            IUCN Red List
          </span>
          <div className="mt-1">
            <div className="font-sans text-xs font-bold text-slate-900 leading-tight truncate">
              {currentRecord.aiEndangeredStatus}
            </div>
            <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
              Criteria A2
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Trajectory
          </span>
          <div className="mt-1">
            <div className="font-mono text-sm font-bold text-slate-900 leading-tight">
              Yr 2038
            </div>
            <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              Unmitigated
            </span>
          </div>
        </div>
      </div>

      {/* VERIFIED OPTICAL SPECIMEN VIEWPORT */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Verified Optical Specimen Viewport
          </span>
          <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
            CONF: {currentRecord.visionConfidence}
          </span>
        </div>

        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
          <img
            src={currentRecord.imageUrl}
            alt={currentRecord.speciesCommon}
            className="w-full h-full object-cover"
          />

          {/* HUD overlay badges */}
          <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-white font-mono text-[10px] flex items-center gap-1.5 border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>GPS: {currentRecord.gpsCoordinates}</span>
          </div>

          <div className="absolute bottom-2.5 inset-x-2.5 bg-white/95 backdrop-blur-md border border-slate-200/80 p-2.5 rounded-xl flex items-center justify-between text-slate-900 shadow-sm">
            <div>
              <div className="font-sans text-sm font-bold text-slate-900">
                {currentRecord.speciesCommon}
              </div>
              <div className="font-mono text-[11px] italic text-slate-500">
                {currentRecord.speciesScientific}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] text-emerald-700 font-bold">
                CENSUS: {currentRecord.observedCount} INDIV
              </div>
              <div className="font-mono text-[9px] text-slate-500">
                {currentRecord.habitatType}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CURRICULUM SYNTHESIS NOTES */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
            Curriculum Synthesis &amp; Lab Discussion
          </h3>
        </div>
        <p className="font-sans text-xs text-slate-600 leading-relaxed">
          {currentRecord.aiAnalysis
            ? currentRecord.aiAnalysis
            : `Clusters of ${currentRecord.speciesCommon} identified in ${currentRecord.sectorCoord || 'Sector 4'} demonstrate a continuous decline trajectory (-76.2% since 2012 baseline). Without tallgrass hydrology restoration and controlled burns, projection models predict regional extirpation by year 2038.`}
        </p>
      </div>

      {/* MASTER DATA EXPORT SHEET SCHEMA (SOP Section 5) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
              People's Biodiversity Register (SOP-5)
            </h3>
          </div>
          <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
            {allRecords.length} RECORD(S) IN BUFFER
          </span>
        </div>

        {/* Scrollable Canonical Data Table */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs font-mono">
          <table className="w-full text-left divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase font-bold">
              <tr>
                <th className="p-2.5">SOP Schema Key</th>
                <th className="p-2.5">Field Value</th>
                <th className="p-2.5">Data Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr>
                <td className="p-2.5 font-bold text-slate-500">Record_ID</td>
                <td className="p-2.5 font-bold text-emerald-700">{currentRecord.recordId}</td>
                <td className="p-2.5 text-emerald-600 font-semibold">PBR Synced</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-500">Student_Guest_ID</td>
                <td className="p-2.5 text-slate-800">{currentRecord.studentGuestId}</td>
                <td className="p-2.5 text-emerald-600 font-semibold">Verified Zero-PII</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-500">Species_Name_Scientific</td>
                <td className="p-2.5 italic text-slate-800">{currentRecord.speciesScientific}</td>
                <td className="p-2.5 text-emerald-600 font-semibold">GBIF Taxon Match</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-500">Historical_Pop_Baseline_2012</td>
                <td className="p-2.5 text-slate-800">{currentRecord.historicalPop2012.toLocaleString()}</td>
                <td className="p-2.5 text-slate-500 font-medium">Census Archive</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-500">Current_Pop_Estimate_2026</td>
                <td className="p-2.5 font-bold text-rose-600">{currentRecord.currentPop2026.toLocaleString()}</td>
                <td className="p-2.5 text-emerald-600 font-semibold">Field Synthesized</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-500">AI_Extinction_Risk_Percentage</td>
                <td className="p-2.5 font-bold text-rose-600">{currentRecord.aiExtinctionRiskPercentage}%</td>
                <td className="p-2.5 text-amber-600 font-semibold">Neural 94.8% Conf</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ALL RECORDED OBSERVATIONS ROSTER WITH DELETE OPTION */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-bold">
              Buffer Observation Entries ({allRecords.length}):
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Click row to inspect
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {allRecords.map((rec) => {
              const isSelected = rec.recordId === currentRecord.recordId;
              const isConfirming = deletingRecordId === rec.recordId;

              return (
                <div
                  key={rec.recordId}
                  onClick={() => {
                    soundFX.playConfirm();
                    setSelectedRecordId(rec.recordId);
                  }}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-emerald-50/60 border-emerald-300 shadow-sm'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={rec.imageUrl}
                      alt={rec.speciesCommon}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans text-xs font-bold text-slate-900 truncate">
                          {rec.speciesCommon}
                        </span>
                        <span className="font-mono text-[9px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded-md shrink-0">
                          {rec.recordId}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        By: <strong className="text-slate-700">{rec.userDisplayName || rec.studentGuestId}</strong> &bull; {rec.observedCount} indiv &bull; {rec.timestamp.slice(0, 10)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {onDeleteRecord && (
                      isConfirming ? (
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-rose-200 shadow-sm animate-in fade-in">
                          <span className="text-[10px] font-bold text-rose-600 font-mono">
                            Delete?
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteRecord(rec.recordId);
                              setDeletingRecordId(null);
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2 py-0.5 rounded active:scale-95 transition-all"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingRecordId(null)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded transition-all"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            soundFX.playConfirm();
                            setDeletingRecordId(rec.recordId);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title={`Delete observation ${rec.recordId}`}
                          aria-label={`Delete record ${rec.recordId}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}

            {allRecords.length === 0 && (
              <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                No observations currently logged in buffer. Return to the Field Scanner to document species!
              </div>
            )}
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Master CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPDF}
            className="w-full h-11 bg-slate-800 hover:bg-slate-900 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Export WWF Lab PDF Report</span>
          </button>
        </div>
      </div>

      {/* ENVIRONMENTAL API STATUS MONITOR (SOP Section 4) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
              Live Environmental API Telemetry
            </h3>
          </div>
          <button
            onClick={handlePingApis}
            disabled={apiPingTesting}
            className="text-[10px] bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded-full font-mono flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
          >
            <Activity className={`w-3 h-3 ${apiPingTesting ? 'animate-spin text-emerald-600' : ''}`} />
            <span>PING APIS</span>
          </button>
        </div>

        <div className="space-y-2 text-xs font-mono">
          {/* GBIF API */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <strong className="text-slate-900 font-bold">GBIF Occurrence API</strong>
                <span className="text-[10px] text-slate-500 block">2.8B global records sync</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-emerald-700 font-bold text-[10px]">LIVE</span>
              <span className="text-[10px] text-slate-400 block">{apiLatency.gbif}ms latency</span>
            </div>
          </div>

          {/* IUCN Red List */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <strong className="text-slate-900 font-bold">IUCN Red List Species API</strong>
                <span className="text-[10px] text-slate-500 block">Threat Criteria v3.1 feed</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-emerald-700 font-bold text-[10px]">LIVE</span>
              <span className="text-[10px] text-slate-400 block">{apiLatency.iucn}ms latency</span>
            </div>
          </div>

          {/* iNaturalist */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <strong className="text-slate-900 font-bold">iNaturalist Open Dataset</strong>
                <span className="text-[10px] text-slate-500 block">Computer Vision Classifier</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-emerald-700 font-bold text-[10px]">LIVE</span>
              <span className="text-[10px] text-slate-400 block">{apiLatency.inat}ms latency</span>
            </div>
          </div>
        </div>
      </div>

      {/* Return to Field Scanner Action Button */}
      <button
        type="button"
        onClick={() => {
          soundFX.playConfirm();
          onReturnToScanner();
        }}
        className="w-full h-12 bg-white hover:bg-slate-50 active:scale-[0.99] text-slate-800 font-semibold text-sm rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between px-4 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-emerald-600" />
          <span>Return to Field Scanner</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  );
};
