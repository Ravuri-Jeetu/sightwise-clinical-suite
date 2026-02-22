"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Bell, Shield, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
}

export function SettingsClient({ initialData, role }: { initialData: ProfileData, role: 'admin' | 'doctor' | 'receptionist' | 'patient' }) {
    const { toast } = useToast();
    const router = useRouter();

    const [profileData, setProfileData] = useState(initialData);
    const [isUpdating, setIsUpdating] = useState(false);
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const handleUpdateProfile = async () => {
        setIsUpdating(true);
        try {
            const response = await fetch('/api/user/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            toast({ title: "Profile Updated", description: "Your changes have been saved." });
            router.refresh();
        } catch (e: any) {
            toast({ variant: "destructive", title: "Update Failed", description: e.message });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            toast({ variant: "destructive", title: "Error", description: "Passwords do not match." });
            return;
        }
        setIsUpdating(true);
        try {
            const response = await fetch('/api/user/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passwords),
            });

            if (!response.ok) throw new Error('Failed to update password');

            toast({ title: "Password Changed", description: "Your password has been updated successfully." });
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (e: any) {
            toast({ variant: "destructive", title: "Security Update Failed", description: e.message });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/redirect">
                        <ArrowLeft size={20} />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-headline font-bold">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your identity and clinical preferences.</p>
                </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="profile"><User className="mr-2 size-4" /> Profile</TabsTrigger>
                    <TabsTrigger value="notifications"><Bell className="mr-2 size-4" /> Notifications</TabsTrigger>
                    <TabsTrigger value="security"><Shield className="mr-2 size-4" /> Security</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Manage your name and contact details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input value={profileData.firstName} onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input value={profileData.lastName} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input
                                    value={profileData.email}
                                    disabled={role !== 'patient'}
                                    readOnly={role !== 'patient'}
                                />
                                {role !== 'patient' && <p className="text-[10px] text-muted-foreground">Clinical staff emails are managed by Administrators.</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Contact Number</Label>
                                <Input value={profileData.contactNumber} onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })} />
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end border-t pt-6">
                            <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                                {isUpdating && <Loader2 className="animate-spin mr-2 size-4" />}
                                <Save className="mr-2 size-4" /> Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                            <CardDescription>Control your alert and messaging settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <Label>Urgent Alerts</Label>
                                    <p className="text-xs text-muted-foreground">Receive push notifications for critical patient trends.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <Label>Daily Summary</Label>
                                    <p className="text-xs text-muted-foreground">Get an email summary of appointments.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Update your portal access password.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Current Password</Label>
                                <Input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <Input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm Password</Label>
                                    <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end border-t pt-6">
                            <Button onClick={handleUpdatePassword} disabled={isUpdating}>
                                {isUpdating && <Loader2 className="animate-spin mr-2 size-4" />}
                                Update Password
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
