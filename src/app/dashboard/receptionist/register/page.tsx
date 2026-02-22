"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPatientPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: 'male',
        email: '',
        phone: '',
        address: '',
    });

    const { toast } = useToast();
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email) return;

        setLoading(true);
        try {
            const response = await fetch('/api/receptionist/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to save patient profile.");
            }

            toast({
                title: "Registration Successful",
                description: `Patient ${formData.firstName} has been enrolled. They can log in with ${formData.email}.`,
            });

            router.push('/dashboard/receptionist');
            router.refresh();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: error.message || "Failed to save patient profile.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="receptionist">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/receptionist">
                        <ArrowLeft size={20} />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-headline font-bold text-foreground">Register New Patient</h1>
                    <p className="text-muted-foreground">Enroll a new patient into the hospital registry.</p>
                </div>
            </div>

            <form onSubmit={handleRegister}>
                <Card className="max-w-3xl mx-auto shadow-lg">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <UserPlus className="text-primary size-5" />
                            <CardTitle className="font-headline">Patient Information</CardTitle>
                        </div>
                        <CardDescription>Profiles are matched to users via their registered email address.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" placeholder="John" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input id="dob" type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val })}>
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Patient Email</Label>
                                <Input id="email" type="email" placeholder="john.doe@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" placeholder="555-0101" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Physical Address</Label>
                            <Input id="address" placeholder="123 Main St, Anytown, USA" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6 bg-muted/20">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/receptionist">Cancel</Link>
                        </Button>
                        <Button type="submit" className="flex items-center gap-2" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin size-4" /> : <UserPlus size={18} />}
                            Complete Enrollment
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </DashboardLayout>
    );
}
