import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReceptionistClient } from "./receptionist-client";

export default async function ReceptionistPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email!.toLowerCase() },
    });

    if (!user || user.role !== 'receptionist') {
        redirect("/dashboard/redirect");
    }

    const patients = await prisma.patientProfile.findMany({
        orderBy: { registrationDate: 'desc' },
    });

    return (
        <DashboardLayout role="receptionist">
            <ReceptionistClient initialPatients={JSON.parse(JSON.stringify(patients))} />
        </DashboardLayout>
    );
}
