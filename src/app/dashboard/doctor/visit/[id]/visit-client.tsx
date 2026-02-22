"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Save,
    ArrowLeft,
    Clipboard,
    Eye,
    Activity,
    Layers,
    History,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { RiskAssessmentCard } from '@/components/dashboard/risk-assessment-card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date | null;
}

interface Visit {
    id: string;
    visitDate: Date;
    visualAcuityRight: string | null;
    notes: string | null;
}

export function VisitClient({ patient, history }: { patient: Patient, history: Visit[] }) {
    const { toast } = useToast();
    const router = useRouter();

    const [isSaving, setIsSaving] = useState(false);
    const [aiAssessment, setAiAssessment] = useState<any>(null);

    const [formData, setFormData] = useState({
        vaOD: '',
        vaOS: '',
        iopOD: '',
        iopOS: '',
        lensOD: '',
        lensOS: '',
        notes: ''
    });

    const handleSaveVisit = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/doctor/visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: patient.id,
                    ...formData,
                    riskCategory: aiAssessment?.riskCategory || 'Pending',
                    riskExplanationSummary: aiAssessment?.explanationSummary || '',
                }),
            });

            if (!response.ok) throw new Error('Failed to save visit');

            toast({ title: "Visit Saved", description: "The clinical report has been successfully recorded." });
            router.push(`/dashboard/doctor/patient/${patient.id}`);
            router.refresh();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Save Failed", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/doctor/patients">
                        <ArrowLeft size={20} />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-headline font-bold">New Clinical Visit</h1>
                    <p className="text-muted-foreground">Patient: {patient.firstName} {patient.lastName} ({patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'})</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Clipboard className="text-primary size-5" />
                                <CardTitle className="font-headline">Clinical Findings</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 font-bold text-sm border-b pb-1">
                                        <Eye size={16} className="text-primary" />
                                        Visual Acuity
                                    </div>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="va-od" className="text-right text-xs">OD (Right)</Label>
                                            <Input id="va-od" placeholder="20/20" value={formData.vaOD} onChange={e => setFormData({ ...formData, vaOD: e.target.value })} className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="va-os" className="text-right text-xs">OS (Left)</Label>
                                            <Input id="va-os" placeholder="20/20" value={formData.vaOS} onChange={e => setFormData({ ...formData, vaOS: e.target.value })} className="col-span-3" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 font-bold text-sm border-b pb-1">
                                        <Activity size={16} className="text-primary" />
                                        Intraocular Pressure (mmHg)
                                    </div>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="iop-od" className="text-right text-xs">OD (Right)</Label>
                                            <Input id="iop-od" type="number" value={formData.iopOD} onChange={e => setFormData({ ...formData, iopOD: e.target.value })} className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="iop-os" className="text-right text-xs">OS (Left)</Label>
                                            <Input id="iop-os" type="number" value={formData.iopOS} onChange={e => setFormData({ ...formData, iopOS: e.target.value })} className="col-span-3" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-2 font-bold text-sm border-b pb-1">
                                    <Layers size={16} className="text-primary" />
                                    Lens Grade (LOCS III)
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="lens-od" className="text-right text-xs">OD (Right)</Label>
                                        <Input id="lens-od" type="number" step="0.5" value={formData.lensOD} onChange={e => setFormData({ ...formData, lensOD: e.target.value })} className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="lens-os" className="text-right text-xs">OS (Left)</Label>
                                        <Input id="lens-os" type="number" step="0.5" value={formData.lensOS} onChange={e => setFormData({ ...formData, lensOS: e.target.value })} className="col-span-3" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <Label htmlFor="notes" className="font-bold text-sm">Clinical Observations & Plan</Label>
                                <Textarea id="notes" placeholder="Enter findings..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="min-h-[150px]" />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-6 flex justify-between">
                            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button onClick={handleSaveVisit} disabled={isSaving}>
                                {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                                Save Visit Record
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="space-y-6">
                    <RiskAssessmentCard
                        visit={{
                            patientId: patient.id,
                            date: new Date().toISOString(),
                            visualAcuityLeft: formData.vaOS,
                            visualAcuityRight: formData.vaOD,
                            iopLeft: parseFloat(formData.iopOS) || 0,
                            iopRight: parseFloat(formData.iopOD) || 0,
                            lensGradeLeft: parseFloat(formData.lensOS) || 0,
                            lensGradeRight: parseFloat(formData.lensOD) || 0,
                            notes: formData.notes
                        } as any}
                        onAssessed={(data) => setAiAssessment(data)}
                    />

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <History className="text-primary size-5" />
                                <CardTitle className="font-headline text-lg">Quick History</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {history.map((v) => (
                                    <div key={v.id} className="text-sm p-3 border rounded-lg">
                                        <div className="flex justify-between font-bold mb-1">
                                            <span>{new Date(v.visitDate).toLocaleDateString()}</span>
                                            <span className="text-xs opacity-70">R: {v.visualAcuityRight || 'N/A'}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{v.notes || 'No notes.'}</p>
                                    </div>
                                ))}
                                {history.length === 0 && <p className="text-xs text-center text-muted-foreground py-4">No previous records found.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
