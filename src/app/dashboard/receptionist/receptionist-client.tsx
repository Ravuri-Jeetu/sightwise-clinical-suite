"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, Filter, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string | null;
    dateOfBirth: Date | null;
    contactNumber: string | null;
    registrationDate: Date;
}

export function ReceptionistClient({ initialPatients }: { initialPatients: Patient[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = initialPatients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold">Patient Management</h1>
                    <p className="text-muted-foreground">Central registry for patient administration and enrollment.</p>
                </div>
                <Button className="flex items-center gap-2" asChild>
                    <Link href="/dashboard/receptionist/register">
                        <UserPlus size={18} />
                        Register New Patient
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="font-headline">Hospital Registry</CardTitle>
                        <CardDescription>Access and manage all patient demographic records.</CardDescription>
                        <div className="flex flex-col md:flex-row gap-4 pt-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                                <Input
                                    placeholder="Search patients by name or email..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter size={16} />
                                Advanced Filters
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient Name</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Registration Date</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPatients.map((patient) => (
                                    <TableRow key={patient.id}>
                                        <TableCell className="font-bold">{patient.firstName} {patient.lastName}</TableCell>
                                        <TableCell className="capitalize">{patient.gender || 'N/A'}</TableCell>
                                        <TableCell>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs">
                                                <span>{patient.email}</span>
                                                <span className="text-muted-foreground">{patient.contactNumber || 'N/A'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{new Date(patient.registrationDate).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/dashboard/receptionist/appointments?patientId=${patient.id}`}>
                                                    <Calendar size={14} className="mr-2" />
                                                    Book
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" className="ml-2">Edit Profile</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredPatients.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                            No patient records found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
