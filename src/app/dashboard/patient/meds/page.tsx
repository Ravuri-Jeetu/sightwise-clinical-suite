import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill, Info, AlertCircle, Clock } from 'lucide-react';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PatientMedsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
        include: {
            patientProfile: {
                include: {
                    medicationPrescriptions: {
                        where: { isActive: true },
                        orderBy: { prescribedDate: 'desc' },
                    },
                },
            },
        },
    });

    if (!user || user.role !== 'patient' || !user.patientProfile) {
        redirect("/dashboard/redirect");
    }

    const meds = user.patientProfile.medicationPrescriptions;

    return (
        <DashboardLayout role="patient">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-headline font-bold text-foreground">My Medications</h1>
                <p className="text-muted-foreground">Manage your eye drop schedule and prescription details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {meds.map((med) => (
                        <Card key={med.id} className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                        <Pill size={24} />
                                    </div>
                                    <div>
                                        <CardTitle className="font-headline text-2xl">{med.medicationName}</CardTitle>
                                        <Badge variant="secondary" className="mt-1">Active Prescription</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Dosage</p>
                                        <p className="font-medium">{med.dosage}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Frequency</p>
                                        <div className="flex items-center gap-2 text-primary font-bold">
                                            < Clock size={16} />
                                            {med.frequency}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex gap-3">
                                    <Info className="size-5 text-blue-500 shrink-0" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-bold mb-1">Usage Instructions:</p>
                                        <p>Wash your hands before use. Tilt your head back and gently pull down your lower eyelid. Place one drop in each eye and close your eyes for 1-2 minutes.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {meds.length === 0 && (
                        <Card>
                            <CardContent className="py-12 flex flex-col items-center text-muted-foreground">
                                <Pill size={48} className="mb-4 opacity-20" />
                                <p>You have no active medications prescribed at this time.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="border-amber-200 bg-amber-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="font-headline text-lg flex items-center gap-2 text-amber-800">
                                <AlertCircle size={20} />
                                Important Note
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-amber-900 leading-relaxed">
                            If you experience any unusual irritation, persistent redness, or blurred vision after using your medication, please contact your doctor immediately.
                            <br /><br />
                            <strong>Refill Reminder:</strong> Ensure you request a refill 1 week before your supply ends.
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Contact Pharmacy</CardTitle>
                            <CardDescription>Quick access to your provider's pharmacy details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="font-bold">SightWise In-House Pharmacy</p>
                                <p className="text-muted-foreground">555-0900 (ext. 4)</p>
                            </div>
                            <div className="pt-2">
                                <p className="font-bold">Hours</p>
                                <p className="text-muted-foreground">Mon-Fri: 8:00 AM - 6:00 PM</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
