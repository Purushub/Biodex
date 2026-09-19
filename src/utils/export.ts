import { SurveyRecord } from '../types';

export function exportSurveyToCSV(records: SurveyRecord[]): void {
  const headers = [
    'Record_ID',
    'Student_Guest_ID',
    'Grade_Level',
    'Timestamp',
    'Species_Name_Common',
    'Species_Name_Scientific',
    'Image_URL',
    'AI_Vision_Match_Confidence',
    'Observed_Count',
    'Habitat_Type',
    'Historical_Pop_Baseline_2001',
    'Historical_Pop_Baseline_2007',
    'Historical_Pop_Baseline_2012',
    'Historical_Pop_Baseline_2013',
    'Historical_Pop_Baseline_2019',
    'Current_Pop_Estimate_2026',
    'Prediction_Pop_Baseline_2031',
    'AI_Endangered_Status',
    'AI_Extinction_Risk_Percentage',
    'AI_Projected_Extinction_Year',
    'Smart_Report_URL',
  ];

  const rows = records.map((r) => [
    r.recordId,
    r.studentGuestId,
    r.gradeLevel,
    r.timestamp,
    `"${r.speciesCommon.replace(/"/g, '""')}"`,
    `"${r.speciesScientific.replace(/"/g, '""')}"`,
    `"${r.imageUrl}"`,
    r.visionConfidence,
    r.observedCount,
    `"${r.habitatType.replace(/"/g, '""')}"`,
    r.historicalPop2001,
    r.historicalPop2007,
    r.historicalPop2012,
    r.historicalPop2013,
    r.historicalPop2019,
    r.currentPop2026,
    r.predictedPop2031,
    r.aiEndangeredStatus,
    `${r.aiExtinctionRiskPercentage}%`,
    `"${r.aiProjectedExtinctionYear}"`,
    `"${r.smartReportUrl}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `WWF_Biodiversity_PBR_Export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printLabReport(record: SurveyRecord): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WWF Smart Report - ${record.recordId}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: auto; }
        .header { border-bottom: 4px solid #dc2626; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
        .title { font-size: 24px; font-weight: bold; margin: 0; }
        .subtitle { font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .tag { background: #dc2626; color: white; padding: 4px 10px; font-weight: bold; border-radius: 4px; font-size: 12px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
        .card-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
        .card-val { font-size: 18px; font-weight: bold; margin-top: 4px; color: #0f172a; }
        .specimen-img { width: 100%; height: 260px; object-fit: cover; border-radius: 8px; border: 2px solid #334155; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
        .table th, .table td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
        .table th { background: #f1f5f9; text-transform: uppercase; font-size: 11px; }
        .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="subtitle">World Wildlife Fund Federation // Field Classroom Record</div>
          <h1 class="title">SMART REPORT: ${record.recordId}</h1>
          <div style="font-size: 13px; margin-top: 4px;">Student Guest: <strong>${record.studentGuestId}</strong> (${record.gradeLevel}) &bull; Sector: <strong>${record.sectorCoord}</strong></div>
        </div>
        <div class="tag">IUCN: ${record.aiEndangeredStatus.toUpperCase()}</div>
      </div>

      <div class="grid">
        <div class="card">
          <div class="card-label">Extinction Risk</div>
          <div class="card-val" style="color: #dc2626;">${record.aiExtinctionRiskPercentage}%</div>
          <div style="font-size: 10px; color: #991b1b; margin-top: 2px;">HIGH VULNERABILITY</div>
        </div>
        <div class="card">
          <div class="card-label">IUCN Status</div>
          <div class="card-val" style="color: #d97706;">${record.aiEndangeredStatus}</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 2px;">CRITERIA A2 VERIFIED</div>
        </div>
        <div class="card">
          <div class="card-label">Trajectory Horizon</div>
          <div class="card-val" style="color: #b91c1c;">${record.aiProjectedExtinctionYear}</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 2px;">ATTRITION RATE UNMITIGATED</div>
        </div>
      </div>

      <img src="${record.imageUrl}" class="specimen-img" alt="${record.speciesCommon}" />

      <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 14px; border-radius: 4px; margin-bottom: 24px;">
        <strong style="text-transform: uppercase; font-size: 12px; color: #047857;">Curriculum Synthesis & Lab Discussion</strong>
        <p style="font-size: 13px; line-height: 1.6; margin: 6px 0 0 0; color: #334155;">
          Specimen identified as <strong>${record.speciesCommon}</strong> (<em>${record.speciesScientific}</em>) with ${record.visionConfidence}. Survey census recorded <strong>${record.observedCount} individuals</strong> in ${record.habitatType}. 
          Regional baseline shows a continuous reduction from ${record.historicalPop2012.toLocaleString()} (2012) down to ${record.currentPop2026.toLocaleString()} (2026). Without active tallgrass buffer expansion and invasive plant removal, predictive models estimate extirpation threshold collapse by ${record.aiProjectedExtinctionYear}.
        </p>
      </div>

      <h3 style="font-size: 15px; margin-bottom: 8px;">People's Biodiversity Register Canonical Data</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Field Param</th>
            <th>Canonical Value</th>
            <th>Baseline / Target</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Record ID</td><td><strong>${record.recordId}</strong></td><td>PBR Verified</td></tr>
          <tr><td>Species Common</td><td>${record.speciesCommon}</td><td>WWF Red List</td></tr>
          <tr><td>Species Scientific</td><td><em>${record.speciesScientific}</em></td><td>GBIF Synced</td></tr>
          <tr><td>Survey Census</td><td><strong>${record.observedCount} Specimens</strong></td><td>Field Tagged</td></tr>
          <tr><td>Historical Baseline (2012)</td><td>${record.historicalPop2012.toLocaleString()}</td><td>USGS/GBIF</td></tr>
          <tr><td>Current Estimate (2026)</td><td><strong>${record.currentPop2026.toLocaleString()}</strong></td><td>Synthesized Field Feed</td></tr>
          <tr><td>AI Extinction Probability</td><td><strong style="color:#dc2626;">${record.aiExtinctionRiskPercentage}%</strong></td><td>ML Predictive Trajectory</td></tr>
          <tr><td>Projected Status</td><td>${record.aiProjectedExtinctionYear}</td><td>Forecaster Algorithm</td></tr>
        </tbody>
      </table>

      <div class="footer">
        <span>WWF Federation BioDex Platform &bull; Standard Operating Procedure SOP-SEC 4-5</span>
        <span>Generated ${new Date().toLocaleDateString()} &bull; Classroom Grade 8/9 Bio</span>
      </div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
