export type RiskCategory = 'Low' | 'Moderate' | 'High';

// Sankara Eye Hospital Bangalore — Clinical Risk Thresholds
// Source: Hospital protocol based on NABH guidelines
const THRESHOLDS = {
    IOP_HIGH: 21,        // IOP > 21 mmHg = Elevated (Glaucoma suspect)
    IOP_CRITICAL: 30,    // IOP > 30 mmHg = Critical, urgent referral
    CDR_WARNING: 0.6,    // Cup-Disc Ratio > 0.6 = Glaucoma risk
    CDR_HIGH: 0.8,       // Cup-Disc Ratio > 0.8 = High glaucoma risk
    LENS_MODERATE: 2,    // LOCS III Grade >= 2 = Moderate cataract
    LENS_SEVERE: 3,      // LOCS III Grade >= 3 = Surgical cataract
};

export interface GenerateRiskExplanationInput {
    patientId: string;
    visitDate: string;
    visualAcuityLeft: string;
    visualAcuityRight: string;
    iopLeft: number;
    iopRight: number;
    cupDiscRatioLeft?: number;
    cupDiscRatioRight?: number;
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
    let risk: RiskCategory = 'Low';
    const highFactors: string[] = [];
    const moderateFactors: string[] = [];
    const normalFindings: string[] = [];

    const maxIop = Math.max(input.iopLeft || 0, input.iopRight || 0);
    const maxLens = Math.max(input.lensGradeLeft || 0, input.lensGradeRight || 0);
    const maxCdr = Math.max(input.cupDiscRatioLeft || 0, input.cupDiscRatioRight || 0);

    // --- IOP Assessment (Sankara Protocol: > 21 mmHg is elevated) ---
    if (maxIop > THRESHOLDS.IOP_CRITICAL) {
        highFactors.push(`Critical IOP (${maxIop} mmHg) — Urgent glaucoma referral required`);
    } else if (maxIop > THRESHOLDS.IOP_HIGH) {
        moderateFactors.push(`Elevated IOP (${maxIop} mmHg) — Above the 21 mmHg glaucoma threshold`);
    } else if (maxIop > 0) {
        normalFindings.push(`IOP within normal range (${maxIop} mmHg)`);
    }

    // --- Cup-Disc Ratio Assessment (Sankara Protocol: > 0.6 = Glaucoma risk) ---
    if (maxCdr > THRESHOLDS.CDR_HIGH) {
        highFactors.push(`Critical Cup-Disc Ratio (${maxCdr}) — High glaucoma progression risk`);
    } else if (maxCdr > THRESHOLDS.CDR_WARNING) {
        moderateFactors.push(`Suspicious Cup-Disc Ratio (${maxCdr}) — Above 0.6 glaucoma threshold`);
    } else if (maxCdr > 0) {
        normalFindings.push(`Cup-Disc Ratio within normal limits (${maxCdr})`);
    }

    // --- Lens Opacity Assessment (LOCS III) ---
    if (maxLens >= THRESHOLDS.LENS_SEVERE) {
        highFactors.push(`Significant lens opacity (LOCS III Grade ${maxLens}) — Surgical review indicated`);
    } else if (maxLens >= THRESHOLDS.LENS_MODERATE) {
        moderateFactors.push(`Mild lens opacity present (LOCS III Grade ${maxLens})`);
    } else if (maxLens > 0) {
        normalFindings.push(`Lens clarity acceptable (Grade ${maxLens})`);
    }

    // --- Determine Final Risk ---
    if (highFactors.length > 0) {
        risk = 'High';
    } else if (moderateFactors.length > 0) {
        risk = 'Moderate';
    }

    const allFactors = [...highFactors, ...moderateFactors, ...normalFindings];
    const summary = allFactors.length > 0
        ? `Sankara Protocol Assessment: ${allFactors.join('. ')}.${risk === 'High' ? ' Immediate clinical review is strongly recommended.' : risk === 'Moderate' ? ' Close follow-up within 4 weeks advised.' : ' Routine follow-up as scheduled.'}`
        : 'Insufficient data to generate a full risk assessment. Please complete all clinical fields.';

    return {
        riskCategory: risk,
        explanationSummary: summary,
    };
}
