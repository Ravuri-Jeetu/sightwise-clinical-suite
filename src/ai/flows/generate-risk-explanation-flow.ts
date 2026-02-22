export type RiskCategory = 'Low' | 'Moderate' | 'High';

export interface GenerateRiskExplanationInput {
    patientId: string;
    visitDate: string;
    visualAcuityLeft: string;
    visualAcuityRight: string;
    iopLeft: number;
    iopRight: number;
    lensGradeLeft: number;
    lensGradeRight: number;
    notes?: string;
}

export interface GenerateRiskExplanationOutput {
    riskCategory: RiskCategory;
    explanationSummary: string;
}

export async function generateRiskExplanation(
    input: GenerateRiskExplanationInput
): Promise<GenerateRiskExplanationOutput> {
    // Mock rule-based risk assessment
    let risk: RiskCategory = 'Low';
    const factors: string[] = [];

    const maxIop = Math.max(input.iopLeft, input.iopRight);
    const maxLens = Math.max(input.lensGradeLeft, input.lensGradeRight);

    if (maxIop > 25 || maxLens >= 3) {
        risk = 'High';
        if (maxIop > 25) factors.push(`High IOP detected (${maxIop} mmHg)`);
        if (maxLens >= 3) factors.push(`Advanced lens opacity (Grade ${maxLens})`);
    } else if (maxIop > 21 || maxLens >= 2) {
        risk = 'Moderate';
        if (maxIop > 21) factors.push(`Elevated IOP level (${maxIop} mmHg)`);
        if (maxLens >= 2) factors.push(`Early-stage lens opacity (Grade ${maxLens})`);
    } else {
        factors.push('All clinical parameters are within normal physiological ranges.');
    }

    return {
        riskCategory: risk,
        explanationSummary: `Analysis: ${factors.join('. ')}. Routine monitoring is recommended.`,
    };
}
