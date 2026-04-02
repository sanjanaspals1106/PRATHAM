import { Parser } from 'json2csv';
import { TriageResult } from '../models/types';

export class CsvExporterService {
  /**
   * Convert triage results to CSV format
   */
  exportToCsv(records: TriageResult[]): string {
    // Define fields to include in CSV
    const fields = [
      { label: 'ID', value: 'id' },
      { label: 'Date/Time', value: 'createdAt' },
      { label: 'Priority', value: 'priority' },
      { label: 'Confidence (%)', value: 'confidence' },
      { label: 'Total Score', value: 'score.totalScore' },
      { label: 'Vital Score', value: 'score.vitalScore' },
      { label: 'Symptom Score', value: 'score.symptomScore' },
      { label: 'Patient Name', value: 'patient.name' },
      { label: 'Age', value: 'patient.age' },
      { label: 'Gender', value: 'patient.gender' },
      { label: 'BP Systolic', value: 'vitals.bloodPressure.systolic' },
      { label: 'BP Diastolic', value: 'vitals.bloodPressure.diastolic' },
      { label: 'Pulse (bpm)', value: 'vitals.pulse' },
      { label: 'Temperature (°C)', value: 'vitals.temperature' },
      { label: 'SpO₂ (%)', value: 'vitals.spo2' },
      { label: 'Respiratory Rate', value: 'vitals.respiratoryRate' },
      { label: 'Chest Pain', value: 'symptoms.chestPain' },
      { label: 'Breathlessness', value: 'symptoms.breathlessness' },
      { label: 'Bleeding', value: 'symptoms.bleeding' },
      { label: 'Unconscious', value: 'symptoms.unconscious' },
      { label: 'Seizure', value: 'symptoms.seizure' },
      { label: 'Fever', value: 'symptoms.fever' },
      { label: 'Abdomen Pain', value: 'symptoms.abdomenPain' },
      { label: 'Trauma', value: 'symptoms.trauma' },
      { label: 'Other Symptoms', value: 'symptoms.other' },
      { label: 'Deterioration Risk', value: 'riskAssessment.deteriorationRisk' },
      { label: 'Risk Timeframe', value: 'riskAssessment.riskTimeframe' },
      { label: 'Mode', value: 'mode' },
      { label: 'ETA (minutes)', value: 'etaMinutes' },
      { label: 'Operator', value: 'operatorName' },
      { label: 'Overridden', value: 'isOverridden' },
      { label: 'Override Reason', value: 'overrideReason' },
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(records);

    return csv;
  }

  /**
   * Generate filename with timestamp
   */
  generateFilename(): string {
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '-');
    return `triage-export-${date}-${time}.csv`;
  }
}

export const csvExporterService = new CsvExporterService();
