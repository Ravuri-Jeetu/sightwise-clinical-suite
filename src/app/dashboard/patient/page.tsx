import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    Pill,
    Calendar,
    Download,
} from 'lucide-react';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PatientPortal() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email!.toLowerCase() },
        include: {
            patientProfile: {
                include: {
                    clinicalVisits: {
                        include: {
                            doctor: true,
                        },
                        orderBy: { visitDate: 'desc' },
                        take: 3,
                    },
                    medicationPrescriptions: {
                        where: { isActive: true },
                    },
                },
            },
        },
    });

    if (!user || user.role !== 'patient' || !user.patientProfile) {
        redirect("/dashboard/redirect");
    }

    const patient = user.patientProfile;
    const visits = patient.clinicalVisits;
    const meds = patient.medicationPrescriptions;
    const latestVisit = visits[0];

    return (
        <DashboardLayout role="patient">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-headline font-bold text-foreground">My Health Portal</h1>
                        <p className="text-muted-foreground">Monitor your clinical progression and prescriptions.</p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download size={18} />
                        Download Health Summary
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 border-primary/20 bg-primary/5">
                        <CardHeader className="text-center">
                            <CardTitle className="font-headline">Eye Health Status</CardTitle>
                            <CardDescription>Your latest clinical risk assessment.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-6 gap-4">
                            <div className="relative size-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
                                <div className="text-center px-4">
                                    <span className="block text-xl font-bold truncate">
                                        {latestVisit?.riskCategory || 'No Data'}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Risk Level</span>
                                </div>
                            </div>
                            <div className="text-center max-w-[200px]">
                                <p className="text-sm text-muted-foreground">
                                    {latestVisit?.riskExplanationSummary || "Your risk level will appear after your next examination."}
                                </p>
                            </div>
                            {latestVisit && (
                                <Badge variant="outline" className="mt-2 bg-background">
                                    Last Exam: {new Date(latestVisit.visitDate).toLocaleDateString()}
                                </Badge>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <Pill size={20} className="text-primary" />
                                Current Medications
                            </CardTitle>
                            <CardDescription>Active eye drop protocols prescribed by your doctor.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {meds.map(med => (
                                    <div key={med.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-lg bg-secondary flex items-center justify-center">
                                                <Pill size={20} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{med.medicationName}</p>
                                                <p className="text-sm text-muted-foreground">{med.dosage} - {med.frequency}</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">Active</Badge>
                                    </div>
                                ))}
                                {meds.length === 0 && <p className="text-center py-10 text-muted-foreground">No active medications found.</p>}
                                <Button variant="link" className="w-full text-sm">Request Prescription Refill</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <Calendar size={20} className="text-primary" />
                                Recent Ocular Examinations
                            </CardTitle>
                            <CardDescription>Your detailed clinical history and visual acuity results.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {visits.map(visit => (
                                    <div key={visit.id} className="p-4 border rounded-xl hover:border-primary/40 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-lg">{new Date(visit.visitDate).toLocaleDateString()}</p>
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest">Attending: Dr. {visit.doctor.firstName} {visit.doctor.lastName}</p>
                                                <p className="text-sm text-muted-foreground">Full Ocular Assessment</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="group-hover:text-primary">
                                                <FileText size={20} />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                                            <div className="bg-muted/50 p-2 rounded">
                                                <span className="text-xs text-muted-foreground block">Vision (OD)</span>
                                                <span className="font-medium">{visit.visualAcuityRight || 'N/A'}</span>
                                            </div>
                                            <div className="bg-muted/50 p-2 rounded">
                                                <span className="text-xs text-muted-foreground block">Vision (OS)</span>
                                                <span className="font-medium">{visit.visualAcuityLeft || 'N/A'}</span>
                                            </div>
                                            <div className="bg-muted/50 p-2 rounded col-span-2">
                                                <span className="text-xs text-muted-foreground block">Eye Pressure (IOP)</span>
                                                <span className="font-medium">R: {visit.iopRight || '--'} | L: {visit.iopLeft || '--'} mmHg</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {visits.length === 0 && <p className="col-span-full text-center py-20 text-muted-foreground">No visit records available.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
