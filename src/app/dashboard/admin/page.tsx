import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminClient } from "./admin-client";

export default async function AdminDashboard() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email!.toLowerCase() },
    });

    if (!user || user.role !== 'admin') {
        redirect("/dashboard/redirect");
    }

    const staff = await prisma.user.findMany({
        where: {
            role: { in: ['doctor', 'receptionist'] }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <DashboardLayout role="admin">
            <AdminClient initialStaff={JSON.parse(JSON.stringify(staff))} />
        </DashboardLayout>
    );
}
