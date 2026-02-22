import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PatientHistoryPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
        include: {
            patientProfile: {
                include: {
                    clinicalVisits: {
                        include: {
                            doctor: true,
                        },
                        orderBy: { visitDate: 'desc' },
                    },
                },
            },
        },
    });

    if (!user || user.role !== 'patient' || !user.patientProfile) {
        redirect("/dashboard/redirect");
    }

    const visits = user.patientProfile.clinicalVisits;

    return (
        <DashboardLayout role="patient">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-headline font-bold text-foreground">Clinical Visit History</h1>
                <p className="text-muted-foreground">Review your past examinations, measurements, and doctor reports.</p>
            </div>

            <div className="space-y-6">
                {visits.map((visit) => (
                    <Card key={visit.id} className="overflow-hidden border-l-4 border-l-primary">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/30">
                            <div>
                                <CardTitle className="font-headline">{new Date(visit.visitDate).toLocaleDateString()}</CardTitle>
                                <CardDescription>Attending: Dr. {visit.doctor.firstName} {visit.doctor.lastName}</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Download size={14} />
                                Report (PDF)
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Visual Acuity</p>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between text-sm">
                                            <span>Right Eye (OD):</span>
                                            <span className="font-bold">{visit.visualAcuityRight || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Left Eye (OS):</span>
                                            <span className="font-bold">{visit.visualAcuityLeft || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Eye Pressure (IOP)</p>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between text-sm">
                                            <span>Right Eye:</span>
                                            <span className="font-bold">{visit.iopRight ? `${visit.iopRight} mmHg` : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Left Eye:</span>
                                            <span className="font-bold">{visit.iopLeft ? `${visit.iopLeft} mmHg` : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-2">
                                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Doctor's Observations</p>
                                    <p className="text-sm italic text-foreground bg-muted/50 p-3 rounded-lg border">
                                        "{visit.notes || 'No notes recorded for this visit.'}"
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {visits.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center py-12 text-muted-foreground">
                            <ClipboardList size={48} className="mb-4 opacity-20" />
                            <p>No past visits recorded yet.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
