import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
        include: {
            patientProfile: true,
            doctorProfile: true,
        }
    });

    if (!user) {
        redirect("/");
    }

    // Determine current profile data
    const profileData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        contactNumber: user.patientProfile?.contactNumber || '',
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <SettingsClient
                initialData={JSON.parse(JSON.stringify(profileData))}
                role={user.role as any}
            />
        </div>
    );
}
