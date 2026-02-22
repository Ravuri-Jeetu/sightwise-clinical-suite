import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    Activity,
    TrendingUp,
    Bell,
    ArrowRight,
    Stethoscope,
    ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DoctorDashboard() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email!.toLowerCase() },
    });

    if (!user || user.role !== 'doctor') {
        redirect("/dashboard/redirect");
    }

    // Fetch recent visits and patient counts
    const recentVisits = await prisma.clinicalVisit.findMany({
        take: 5,
        orderBy: { visitDate: 'desc' },
        include: {
            patient: true,
        },
    });

    const totalPatients = await prisma.patientProfile.count();
    const pendingAssessments = recentVisits.length; // Simplified logic

    return (
        <DashboardLayout role="doctor">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Clinical Overview</h1>
                    <p className="text-muted-foreground">Monitor patient status and clinical progression trends.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Patients" value={totalPatients.toString()} icon={Users} color="bg-blue-500" />
                    <StatCard title="Recent Visits" value={pendingAssessments.toString()} icon={Stethoscope} color="bg-amber-500" />
                    <StatCard title="Decline Alerts" value="0" icon={Bell} color="bg-rose-500" />
                    <StatCard title="Active Protocols" value="0" icon={Activity} color="bg-emerald-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="font-headline">Recent Clinical Visits</CardTitle>
                                <CardDescription>Latest patient interactions and measurements.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/dashboard/doctor/visits">View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentVisits.map((visit) => (
                                    <div key={visit.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground">
                                                {visit.patient.firstName[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium">{visit.patient.firstName} {visit.patient.lastName}</p>
                                                <p className="text-xs text-muted-foreground">Last visit: {new Date(visit.visitDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant={visit.riskCategory === 'High' ? 'destructive' : 'secondary'}>
                                                {visit.riskCategory || 'Low'} Risk
                                            </Badge>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/dashboard/doctor/patient/${visit.patientId}`}>
                                                    <ChevronRight size={18} />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {recentVisits.length === 0 && (
                                    <p className="text-center py-10 text-muted-foreground italic">No recent visits recorded.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="text-primary size-5" />
                                    <CardTitle className="font-headline">Progression Alerts</CardTitle>
                                </div>
                                <CardDescription>AI-detected visual acuity declines.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground italic">No active alerts detected.</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="link" size="sm" className="w-full text-primary">Manage All Alerts</Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="flex flex-col h-auto py-3 gap-2" asChild>
                                    <Link href="/dashboard/doctor/patients">
                                        <Users size={20} className="text-primary" />
                                        <span className="text-xs">Patients</span>
                                    </Link>
                                </Button>
                                <Button variant="outline" className="flex flex-col h-auto py-3 gap-2">
                                    <Bell size={20} className="text-primary" />
                                    <span className="text-xs">Reminders</span>
                                </Button>
                                <Button variant="outline" className="flex flex-col h-auto py-3 gap-2">
                                    <ArrowRight size={20} className="text-primary" />
                                    <span className="text-xs">Referral</span>
                                </Button>
                                <Button variant="outline" className="flex flex-col h-auto py-3 gap-2">
                                    <Activity size={20} className="text-primary" />
                                    <span className="text-xs">Reporting</span>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="flex items-center p-4 gap-4">
                    <div className={cn("size-12 rounded-xl flex items-center justify-center text-white shadow-sm", color)}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h3 className="text-2xl font-bold">{value}</h3>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
