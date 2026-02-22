"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Users, ChevronRight, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string | null;
    dateOfBirth: Date | null;
    registrationDate: Date;
}

export function PatientsClient({ initialPatients }: { initialPatients: Patient[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = initialPatients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-foreground">Patient Registry</h1>
                    <p className="text-muted-foreground">Manage and review your patient records and clinical history.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <Users className="text-primary size-5" />
                                Authorized Patients
                            </CardTitle>
                            <CardDescription>Browse all clinical records available to your profile.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1 min-w-[300px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                                <Input
                                    placeholder="Search by name or email..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter size={18} />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient Name</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Date of Birth</TableHead>
                                <TableHead>Registration Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPatients.map((patient) => (
                                <TableRow key={patient.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold">{patient.firstName} {patient.lastName}</span>
                                            <span className="text-xs text-muted-foreground">{patient.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="capitalize">{patient.gender || 'N/A'}</TableCell>
                                    <TableCell>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell>
                                        {new Date(patient.registrationDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/dashboard/doctor/patient/${patient.id}`}>
                                                Open Records
                                                <ChevronRight className="ml-2 size-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredPatients.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No patients found matching your search.
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
