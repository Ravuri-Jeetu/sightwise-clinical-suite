"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClipboardList, Search, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Visit {
    id: string;
    visitDate: Date;
    patientId: string;
    visualAcuityRight: string | null;
    visualAcuityLeft: string | null;
    iopRight: number | null;
    iopLeft: number | null;
    patient: {
        firstName: string;
        lastName: string;
    };
}

export function VisitsClient({ initialVisits }: { initialVisits: Visit[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVisits = initialVisits.filter(visit =>
        `${visit.patient.firstName} ${visit.patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-foreground">Clinical Visits</h1>
                    <p className="text-muted-foreground">Review recent patient consultations and clinical measurements.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <ClipboardList className="text-primary size-5" />
                                Visit History
                            </CardTitle>
                            <CardDescription>Recent clinical encounters across all patients.</CardDescription>
                        </div>
                        <div className="relative min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                            <Input
                                placeholder="Filter by patient name..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Visual Acuity (R/L)</TableHead>
                                <TableHead>IOP (R/L)</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredVisits.map((visit) => (
                                <TableRow key={visit.id}>
                                    <TableCell className="font-medium">
                                        {new Date(visit.visitDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{visit.patient.firstName} {visit.patient.lastName}</TableCell>
                                    <TableCell>{visit.visualAcuityRight || 'N/A'} / {visit.visualAcuityLeft || 'N/A'}</TableCell>
                                    <TableCell>{visit.iopRight || '--'} / {visit.iopLeft || '--'} mmHg</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/doctor/patient/${visit.patientId}`}>
                                                <Eye className="size-4 mr-2" />
                                                Review
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredVisits.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No visit records found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
