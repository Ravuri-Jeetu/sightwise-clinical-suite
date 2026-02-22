"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Loader2, Info } from 'lucide-react';
import { generateRiskExplanation, GenerateRiskExplanationOutput } from '@/ai/flows/generate-risk-explanation-flow';

interface RiskAssessmentCardProps {
    visit: {
        patientId: string;
        date: string;
        visualAcuityLeft: string;
        visualAcuityRight: string;
        iopLeft: number;
        iopRight: number;
        lensGradeLeft: number;
        lensGradeRight: number;
        notes?: string;
    };
    onAssessed?: (assessment: GenerateRiskExplanationOutput) => void;
}

export function RiskAssessmentCard({ visit, onAssessed }: RiskAssessmentCardProps) {
    const [loading, setLoading] = useState(false);
    const [assessment, setAssessment] = useState<GenerateRiskExplanationOutput | null>(null);

    const handleAssessment = async () => {
        setLoading(true);
        try {
            const result = await generateRiskExplanation({
                patientId: visit.patientId,
                visitDate: visit.date,
                visualAcuityLeft: visit.visualAcuityLeft || 'N/A',
                visualAcuityRight: visit.visualAcuityRight || 'N/A',
                iopLeft: visit.iopLeft || 0,
                iopRight: visit.iopRight || 0,
                lensGradeLeft: visit.lensGradeLeft || 0,
                lensGradeRight: visit.lensGradeRight || 0,
                notes: visit.notes || '',
            });
            setAssessment(result);
            if (onAssessed) onAssessed(result);
        } catch (error) {
            console.error("Failed to generate risk assessment", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="text-primary size-5" />
                        <CardTitle className="font-headline">AI Clinical Insight</CardTitle>
                    </div>
                    {assessment && (
                        <Badge variant={
                            assessment.riskCategory === 'High' ? 'destructive' :
                                assessment.riskCategory === 'Moderate' ? 'default' : 'secondary'
                        }>
                            Risk: {assessment.riskCategory}
                        </Badge>
                    )}
                </div>
                <CardDescription>Automated risk calculation based on visual acuity, IOP, and clinical observations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!assessment && !loading ? (
                    <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground mb-4">Click below to generate a detailed clinical risk assessment for this visit.</p>
                        <Button onClick={handleAssessment} variant="default" className="w-full">
                            Run Risk Analysis
                        </Button>
                    </div>
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground animate-pulse">
                        <Loader2 className="animate-spin mb-2" />
                        <p className="text-sm">Analyzing clinical data points...</p>
                    </div>
                ) : (
                    <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-4 rounded-lg bg-background border border-border text-sm leading-relaxed">
                            <div className="flex gap-2 items-start text-foreground">
                                <Info className="size-4 mt-1 text-primary shrink-0" />
                                <p>{assessment?.explanationSummary}</p>
                            </div>
                        </div>
                        <Button onClick={handleAssessment} variant="outline" size="sm" className="w-full">
                            Recalculate Analysis
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
