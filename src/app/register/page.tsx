"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "Passwords do not match.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || "Account activation failed.");
            }

            toast({
                title: "Account Activated",
                description: "Your clinical profile has been linked. You can now log in.",
            });
            router.push('/');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: error.message || "Could not activate your account.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-body items-center justify-center p-6">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center bg-primary text-white p-3 rounded-xl mb-4 shadow-lg">
                        <Eye size={40} />
                    </div>
                    <h1 className="text-3xl font-headline font-bold text-foreground">SIGHTWISE</h1>
                    <p className="text-muted-foreground mt-2">Activate your authorized clinical account.</p>
                </div>

                <Card className="shadow-2xl border-none">
                    <CardHeader>
                        <CardTitle className="font-headline">Account Activation</CardTitle>
                        <CardDescription>
                            Enter the authorized email address provided by your administrator or receptionist.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase">Authorized Email :</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="name@clinic.com"
                                        className="pl-10 h-10 rounded-md bg-muted/20 border-muted"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase">Create Password :</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        className="pl-10 h-10 rounded-md bg-muted/20 border-muted"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase">Confirm Password :</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        className="pl-10 h-10 rounded-md bg-muted/20 border-muted"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full font-bold shadow-md h-10 mt-2" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin size-4" /> : 'ACTIVATE ACCOUNT'}
                            </Button>
                            <div className="text-center pt-4">
                                <Link href="/" className="text-xs text-muted-foreground hover:text-primary flex items-center justify-center gap-2">
                                    <ArrowLeft size={14} /> Back to Login
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-[11px] text-muted-foreground leading-relaxed px-4">
                    By activating your account, you agree to the SightWise Clinical Data Governance and Privacy Policies.
                </p>
            </div>
        </div>
    );
}
