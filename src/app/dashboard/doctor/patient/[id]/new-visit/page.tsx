import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { VisitForm } from "@/components/dashboard/doctor/visit-form";

export default async function NewVisitPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: patientId } = await params;
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

    const patient = await prisma.patientProfile.findUnique({
        where: { id: patientId },
        include: {
            clinicalVisits: {
                orderBy: { visitDate: 'desc' },
                take: 5,
            }
        }
    });

    if (!patient) {
        notFound();
    }

    return (
        <DashboardLayout role="doctor">
            <VisitForm
                patient={JSON.parse(JSON.stringify(patient))}
                history={JSON.parse(JSON.stringify(patient.clinicalVisits))}
            />
        </DashboardLayout>
    );
}
