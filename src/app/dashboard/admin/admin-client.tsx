"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, ShieldAlert, Users, Loader2, Trash2, BadgeCheck, Stethoscope, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Staff {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    role: string;
}

export function AdminClient({ initialStaff }: { initialStaff: Staff[] }) {
    const [newStaff, setNewStaff] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'doctor',
        specialization: '',
    });
    const [isCreating, setIsCreating] = useState(false);
    const { toast } = useToast();

    const handleAuthorizeStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStaff.email) return;

        setIsCreating(true);
        try {
            // In a real app, this would be a Server Action or API call.
            // For now, we'll simulate it with a fetch to an API route we'll create.
            const response = await fetch('/api/admin/authorize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStaff),
            });

            if (!response.ok) throw new Error('Failed to authorize staff');

            toast({
                title: "Staff Authorized",
                description: `${newStaff.firstName} can now register at the portal with ${newStaff.email}.`,
            });

            setNewStaff({ firstName: '', lastName: '', email: '', role: 'doctor', specialization: '' });
            // In a real app, we'd trigger a router refresh or update the local state.
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Authorization Failed",
                description: error.message || "Could not authorize staff member.",
            });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-headline font-bold text-foreground">System Administration</h1>
                <p className="text-muted-foreground">Authorize clinical staff access via their email address.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 border-primary/20 bg-primary/5 shadow-md">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <UserPlus className="text-primary size-5" />
                            <CardTitle className="font-headline">Authorize Staff</CardTitle>
                        </div>
                        <CardDescription>
                            Grant access to a clinical role.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAuthorizeStaff} className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                                    <Input value={newStaff.firstName} onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                                    <Input value={newStaff.lastName} onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Work Email</Label>
                                <Input type="email" placeholder="staff@sankaraeye.com" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Designated Role</Label>
                                <Select value={newStaff.role} onValueChange={(val) => setNewStaff({ ...newStaff, role: val })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="doctor">Doctor</SelectItem>
                                        <SelectItem value="receptionist">Receptionist</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {newStaff.role === 'doctor' && (
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Specialization</Label>
                                    <Select value={newStaff.specialization} onValueChange={(val) => setNewStaff({ ...newStaff, specialization: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select specialty..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cataract & IOL Clinic">Cataract &amp; IOL Clinic</SelectItem>
                                            <SelectItem value="Glaucoma Diagnosis & Management">Glaucoma Diagnosis &amp; Management</SelectItem>
                                            <SelectItem value="Cornea & External Eye Disease">Cornea &amp; External Eye Disease</SelectItem>
                                            <SelectItem value="Retina & Vitreoretinal Services">Retina &amp; Vitreoretinal Services</SelectItem>
                                            <SelectItem value="Pediatric Ophthalmology & Strabismus">Pediatric Ophthalmology &amp; Strabismus</SelectItem>
                                            <SelectItem value="LASIK & Laser Vision Correction">LASIK &amp; Laser Vision Correction</SelectItem>
                                            <SelectItem value="Orbit & Oculoplasty">Orbit &amp; Oculoplasty</SelectItem>
                                            <SelectItem value="Low Vision & Rehabilitation">Low Vision &amp; Rehabilitation</SelectItem>
                                            <SelectItem value="Contact Lens Clinic">Contact Lens Clinic</SelectItem>
                                            <SelectItem value="General Ophthalmology">General Ophthalmology</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <Button type="submit" className="w-full mt-4" disabled={isCreating}>
                                {isCreating ? <Loader2 className="animate-spin mr-2 size-4" /> : <ShieldAlert className="mr-2 size-4" />}
                                Authorize Access
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="font-headline flex items-center gap-2">
                                    <BadgeCheck className="text-primary size-5" />
                                    Staff Directory
                                </CardTitle>
                                <CardDescription>Manage authorized clinical personnel.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Staff Member</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {initialStaff.map((s) => (
                                        <TableRow key={s.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold flex items-center gap-1">
                                                        {s.role === 'doctor' ? <Stethoscope size={14} className="text-primary" /> : <ClipboardList size={14} className="text-accent" />}
                                                        {s.firstName} {s.lastName}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">{s.email}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant={s.role === 'doctor' ? 'outline' : 'secondary'}>{s.role}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {!initialStaff.length && <TableRow><TableCell colSpan={3} className="text-center py-10 opacity-50 italic">No staff records.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
