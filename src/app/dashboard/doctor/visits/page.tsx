import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { VisitsClient } from "./visits-client";

export default async function DoctorVisitsPage() {
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

    const visits = await prisma.clinicalVisit.findMany({
        orderBy: { visitDate: 'desc' },
        include: {
            patient: true,
        },
        take: 50,
    });

    return (
        <DashboardLayout role="doctor">
            <VisitsClient initialVisits={JSON.parse(JSON.stringify(visits))} />
        </DashboardLayout>
    );
}
