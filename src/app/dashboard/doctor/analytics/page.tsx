"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

const VISITS_DATA = [
    { month: 'Jan', visits: 45 },
    { month: 'Feb', visits: 52 },
    { month: 'Mar', visits: 48 },
    { month: 'Apr', visits: 61 },
    { month: 'May', visits: 55 },
    { month: 'Jun', visits: 67 },
];

const RISK_DATA = [
    { category: 'Low', count: 640 },
    { category: 'Moderate', count: 420 },
    { category: 'High', count: 188 },
];

export default function DoctorAnalyticsPage() {
    return (
        <DashboardLayout role="doctor">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-headline font-bold text-foreground">Clinical Analytics</h1>
                <p className="text-muted-foreground">High-level insights into patient population trends and clinical metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Avg. IOP" value="16.4" icon={Activity} trend="+0.2" />
                <MetricCard title="Acuity Stable" value="82%" icon={TrendingUp} trend="+5%" />
                <MetricCard title="New Registrations" value="24" icon={Users} trend="+12%" />
                <MetricCard title="High Risk Alerts" value="8" icon={AlertTriangle} trend="-2" isAlert />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Monthly Patient Visits</CardTitle>
                        <CardDescription>Volume of clinical consultations over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={VISITS_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Risk Category Distribution</CardTitle>
                        <CardDescription>Breakdown of current patient population by risk level.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={RISK_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

function MetricCard({ title, value, icon: Icon, trend, isAlert = false }: { title: string, value: string, icon: any, trend: string, isAlert?: boolean }) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-secondary/50 text-primary">
                        <Icon size={20} />
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isAlert ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {trend}
                    </span>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                </div>
            </CardContent>
        </Card>
    );
}
