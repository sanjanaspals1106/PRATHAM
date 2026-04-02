import { Priority, TriageInput, TriageScore, ExplainabilityData } from '../models/types';

export class ExplainabilityService {
  /**
   * Generate detailed reasoning from score breakdown
   */
  private generateReasoning(score: TriageScore): string[] {
    const reasoning: string[] = [];

    // Sort by points (highest first) to show most critical factors
    const sortedBreakdown = [...score.breakdown].sort((a, b) => b.points - a.points);

    // Add top contributing factors (up to 5)
    sortedBreakdown.slice(0, 5).forEach((item) => {
      reasoning.push(item.reason);
    });

    // Add summary statement
    reasoning.push(
      `Total risk score: ${score.totalScore}/100 (Vitals: ${score.vitalScore}, Symptoms: ${score.symptomScore})`
    );

    return reasoning;
  }

  /**
   * Generate "Why not RED?" explanation
   */
  private generateWhyNotRed(
    priority: Priority,
    score: TriageScore,
    input: TriageInput
  ): string {
    if (priority === 'RED') {
      return 'N/A - Patient assigned RED priority';
    }

    const reasons: string[] = [];

    // Check vitals that are within safe ranges
    if (input.vitals.spo2 >= 90) {
      reasons.push(`SpO₂ within acceptable range: ${input.vitals.spo2}% (≥90%)`);
    }

    if (input.vitals.pulse >= 50 && input.vitals.pulse <= 120) {
      reasons.push(`Heart rate stable: ${input.vitals.pulse} bpm (50-120 range)`);
    }

    if (
      input.vitals.bloodPressure.systolic >= 90 &&
      input.vitals.bloodPressure.systolic <= 180
    ) {
      reasons.push(
        `Blood pressure controlled: ${input.vitals.bloodPressure.systolic}/${input.vitals.bloodPressure.diastolic} mmHg`
      );
    }

    if (input.vitals.respiratoryRate >= 10 && input.vitals.respiratoryRate <= 24) {
      reasons.push(`Respiratory rate normal: ${input.vitals.respiratoryRate} breaths/min`);
    }

    // Check for absence of RED flag symptoms
    const redFlagSymptoms: string[] = [];
    if (!input.symptoms.unconscious) redFlagSymptoms.push('conscious');
    if (!input.symptoms.seizure) redFlagSymptoms.push('no seizure');
    if (!input.symptoms.chestPain) redFlagSymptoms.push('no chest pain');

    if (redFlagSymptoms.length > 0) {
      reasons.push(`No RED flag symptoms detected (${redFlagSymptoms.join(', ')})`);
    }

    // Score-based reason
    if (score.totalScore < 60) {
      reasons.push(
        `Risk score below RED threshold: ${score.totalScore}/100 (RED threshold: ≥60)`
      );
    }

    return reasons.length > 0
      ? reasons.join('. ')
      : 'Patient vitals and symptoms do not meet RED priority criteria.';
  }

  /**
   * Generate "Why not GREEN?" explanation
   */
  private generateWhyNotGreen(
    priority: Priority,
    score: TriageScore,
    input: TriageInput
  ): string {
    if (priority === 'GREEN') {
      return 'N/A - Patient assigned GREEN priority';
    }

    const reasons: string[] = [];

    // Check vitals that are abnormal
    if (input.vitals.spo2 < 94) {
      reasons.push(`Low SpO₂: ${input.vitals.spo2}% (GREEN threshold: ≥94%)`);
    }

    if (input.vitals.pulse > 100 || input.vitals.pulse < 60) {
      reasons.push(
        `Abnormal heart rate: ${input.vitals.pulse} bpm (GREEN range: 60-100)`
      );
    }

    if (
      input.vitals.bloodPressure.systolic > 140 ||
      input.vitals.bloodPressure.systolic < 100
    ) {
      reasons.push(
        `Elevated/low BP: ${input.vitals.bloodPressure.systolic}/${input.vitals.bloodPressure.diastolic} mmHg`
      );
    }

    if (input.vitals.temperature > 38 || input.vitals.temperature < 36) {
      reasons.push(`Abnormal temperature: ${input.vitals.temperature}°C`);
    }

    // Check for concerning symptoms
    const concerningSymptoms: string[] = [];
    if (input.symptoms.breathlessness) concerningSymptoms.push('breathlessness');
    if (input.symptoms.bleeding) concerningSymptoms.push('bleeding');
    if (input.symptoms.fever) concerningSymptoms.push('fever');
    if (input.symptoms.abdomenPain) concerningSymptoms.push('abdominal pain');
    if (input.symptoms.trauma) concerningSymptoms.push('trauma');

    if (concerningSymptoms.length > 0) {
      reasons.push(`Symptoms require medical attention: ${concerningSymptoms.join(', ')}`);
    }

    // Score-based reason
    if (score.totalScore >= 30) {
      reasons.push(
        `Risk score above GREEN threshold: ${score.totalScore}/100 (GREEN threshold: <30)`
      );
    }

    return reasons.length > 0
      ? reasons.join('. ')
      : 'Patient has symptoms or vital signs requiring medical evaluation.';
  }

  /**
   * Generate bias transparency note
   */
  private generateBiasNote(): string {
    return (
      'This triage decision is based solely on clinical vitals and symptoms. ' +
      'No demographic factors (age, gender, ethnicity, socioeconomic status) were used in the ' +
      'priority calculation to ensure equitable care. The AI algorithm treats all patients equally ' +
      'based on medical need alone.'
    );
  }

  /**
   * Generate complete explainability data
   */
  public generateExplainability(
    priority: Priority,
    score: TriageScore,
    input: TriageInput
  ): ExplainabilityData {
    return {
      reasoning: this.generateReasoning(score),
      whyNotRed: this.generateWhyNotRed(priority, score, input),
      whyNotGreen: this.generateWhyNotGreen(priority, score, input),
      biasNote: this.generateBiasNote(),
    };
  }
}

export const explainabilityService = new ExplainabilityService();
