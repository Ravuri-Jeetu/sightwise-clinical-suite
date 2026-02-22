import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AppointmentsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
    });

    if (!user || user.role !== 'receptionist') {
        redirect("/dashboard/redirect");
    }

    // Since we don't have an Appointment model yet, we'll use a local mock for the UI
    const mockAppointments = [
        { time: '09:00 AM', patient: 'Jane Smith', type: 'Follow-up', status: 'Confirmed' },
        { time: '10:30 AM', patient: 'Michael Jones', type: 'Initial Consultation', status: 'Pending' },
        { time: '01:15 PM', patient: 'Sarah Wilson', type: 'Eye Exam', status: 'Arrived' },
    ];

    return (
        <DashboardLayout role="receptionist">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-foreground">Appointments</h1>
                    <p className="text-muted-foreground">Manage patient schedules and clinical sessions.</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus size={18} />
                    New Appointment
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Calendar className="text-primary size-5" />
                        <CardTitle className="font-headline">Daily Schedule</CardTitle>
                    </div>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                        <Input placeholder="Search appointments..." className="pl-10" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockAppointments.map((appt, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{appt.time}</TableCell>
                                    <TableCell>{appt.patient}</TableCell>
                                    <TableCell>{appt.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={appt.status === 'Arrived' ? 'default' : 'secondary'}>
                                            {appt.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Modify</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
