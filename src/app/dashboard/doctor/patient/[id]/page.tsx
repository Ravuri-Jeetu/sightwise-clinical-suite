import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    FileText,
    Plus,
    User,
    Phone,
    Mail,
    MapPin,
    ArrowLeft,
    Clock,
    Activity
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: patientId } = await params;
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email! },
    });

    if (!currentUser || currentUser.role !== 'doctor') {
        redirect("/dashboard/redirect");
    }

    const patient = await prisma.patientProfile.findUnique({
        where: { id: patientId },
        include: {
            user: true,
            clinicalVisits: {
                orderBy: { visitDate: 'desc' },
                include: {
                    doctor: true,
                }
            }
        }
    });

    if (!patient) {
        notFound();
    }

    return (
        <DashboardLayout role="doctor">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/doctor/patients">
                            <ArrowLeft size={20} />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-headline font-bold">Patient Records</h1>
                        <p className="text-muted-foreground">Comprehensive clinical history and profile.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Patient Profile Card */}
                    <Card className="lg:col-span-1 border-primary/20 bg-primary/5">
                        <CardHeader>
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="size-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                                    {patient.firstName[0]}{patient.lastName[0]}
                                </div>
                                <div>
                                    <CardTitle className="font-headline text-2xl">{patient.firstName} {patient.lastName}</CardTitle>
                                    <Badge variant="outline" className="mt-1 bg-background">Patient ID: {patient.id.slice(-8).toUpperCase()}</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="flex items-center gap-3 text-sm">
                                <User className="size-4 text-primary" />
                                <span>{patient.gender || 'Not specified'}, {patient.dateOfBirth ? `${new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years` : 'Age unknown'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="size-4 text-primary" />
                                <span>{patient.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="size-4 text-primary" />
                                <span>{patient.contactNumber || 'No contact number'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="size-4 text-primary" />
                                <span className="line-clamp-2">{patient.address || 'No address recorded'}</span>
                            </div>
                            <div className="pt-4 border-t">
                                <Button className="w-full flex items-center gap-2" asChild>
                                    <Link href={`/dashboard/doctor/patient/${patient.id}/new-visit`}>
                                        <Plus size={18} />
                                        New Clinical Report
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Visit History List */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="font-headline">Clinical History</CardTitle>
                                <CardDescription>All recorded examinations and reports.</CardDescription>
                            </div>
                            <Clock className="size-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {patient.clinicalVisits.map((visit) => (
                                    <div key={visit.id} className="p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Calendar size={16} className="text-primary" />
                                                    <span className="font-bold">{new Date(visit.visitDate).toLocaleDateString()}</span>
                                                    <Badge variant={visit.riskCategory === 'High' ? 'destructive' : 'secondary'}>
                                                        {visit.riskCategory || 'Low'} Risk
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Activity size={12} />
                                                    Attending: Dr. {visit.doctor.firstName} {visit.doctor.lastName}
                                                </p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8">Details</Button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                                            <div className="space-y-1">
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground">VA (OD)</span>
                                                <p className="font-medium">{visit.visualAcuityRight || '--'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground">VA (OS)</span>
                                                <p className="font-medium">{visit.visualAcuityLeft || '--'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground">IOP (OD)</span>
                                                <p className="font-medium">{visit.iopRight || '--'} mmHg</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground">IOP (OS)</span>
                                                <p className="font-medium">{visit.iopLeft || '--'} mmHg</p>
                                            </div>
                                        </div>
                                        {visit.notes && (
                                            <div className="mt-4 pt-3 border-t">
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Doctor's Note</span>
                                                <p className="text-sm italic line-clamp-2">"{visit.notes}"</p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {patient.clinicalVisits.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <FileText size={48} className="mb-4 opacity-20" />
                                        <p>No previous clinical reports found for this patient.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
