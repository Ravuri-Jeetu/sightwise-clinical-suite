import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PatientsClient } from "./patients-client";

export default async function DoctorPatientsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
    });

    if (!user || user.role !== 'doctor') {
        redirect("/dashboard/redirect");
    }

    const patients = await prisma.patientProfile.findMany({
        orderBy: { lastName: 'asc' },
    });

    return (
        <DashboardLayout role="doctor">
            <PatientsClient initialPatients={JSON.parse(JSON.stringify(patients))} />
        </DashboardLayout>
    );
}
