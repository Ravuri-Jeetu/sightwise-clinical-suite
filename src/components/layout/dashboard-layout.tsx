"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Eye,
    Users,
    ClipboardList,
    Activity,
    Pill,
    Settings,
    LogOut,
    LayoutDashboard,
    Calendar,
    UserCircle,
    ShieldCheck,
    Loader2,
    PanelLeftClose,
    PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
    useSidebar,
} from '@/components/ui/sidebar';
import { useSession, signOut } from "next-auth/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

const ADMIN_NAV: NavItem[] = [
    { title: 'Admin Panel', href: '/dashboard/admin', icon: ShieldCheck },
];

const RECEPTIONIST_NAV: NavItem[] = [
    { title: 'Overview', href: '/dashboard/receptionist', icon: LayoutDashboard },
    { title: 'Patient Registration', href: '/dashboard/receptionist/register', icon: Users },
    { title: 'Appointments', href: '/dashboard/receptionist/appointments', icon: Calendar },
];

const DOCTOR_NAV: NavItem[] = [
    { title: 'Doctor Dashboard', href: '/dashboard/doctor', icon: LayoutDashboard },
    { title: 'Patient List', href: '/dashboard/doctor/patients', icon: Users },
    { title: 'Clinical Visits', href: '/dashboard/doctor/visits', icon: ClipboardList },
    { title: 'Analytics', href: '/dashboard/doctor/analytics', icon: Activity },
];

const PATIENT_NAV: NavItem[] = [
    { title: 'My Portal', href: '/dashboard/patient', icon: UserCircle },
    { title: 'Visit History', href: '/dashboard/patient/history', icon: ClipboardList },
    { title: 'Medications', href: '/dashboard/patient/meds', icon: Pill },
];

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: 'receptionist' | 'doctor' | 'patient' | 'admin';
}

function CollapseButton() {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === 'collapsed';
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={toggleSidebar}
                        className={cn(
                            "flex w-full items-center gap-2 rounded-md p-2 text-sm transition-colors",
                            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isCollapsed && "justify-center"
                        )}
                    >
                        {isCollapsed
                            ? <PanelLeftOpen className="size-5 shrink-0" />
                            : <><PanelLeftClose className="size-5 shrink-0" /><span>Collapse</span></>
                        }
                    </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    {isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();

    const isUserLoading = status === "loading";
    const user = session?.user;
    const userRole = (user as any)?.role;

    React.useEffect(() => {
        if (isUserLoading) return;

        if (!user) {
            router.replace('/');
            return;
        }

        if (userRole !== role) {
            router.replace('/dashboard/redirect');
        }
    }, [user, isUserLoading, userRole, role, router]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    const navItems =
        role === 'admin' ? ADMIN_NAV :
            role === 'receptionist' ? RECEPTIONIST_NAV :
                role === 'doctor' ? DOCTOR_NAV :
                    PATIENT_NAV;

    if (isUserLoading || !user || userRole !== role) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
                <Loader2 className="animate-spin size-10 text-primary" />
                <p className="text-sm text-muted-foreground">Verifying secure environment...</p>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader className="border-b py-4">
                    <div className="flex items-center gap-2 px-2 overflow-hidden">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                            <Eye className="size-5" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                            <span className="truncate font-headline font-bold">SightWise</span>
                            <span className="truncate text-xs opacity-70">Clinical Suite</span>
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu className="px-2 mt-4">
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === item.href}
                                    tooltip={item.title}
                                >
                                    <Link href={item.href}>
                                        <item.icon className="size-5" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className="border-t p-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Settings">
                                <Link href="/settings">
                                    <Settings className="size-5" />
                                    <span>Settings</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Logout"
                                className="text-destructive hover:text-destructive"
                                onClick={handleLogout}
                            >
                                <LogOut className="size-5" />
                                <span>Logout</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <CollapseButton />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset className="flex flex-col">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
                    <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
                    <div className="h-5 w-px bg-border" />
                    <div className="flex-1">
                        <h2 className="text-lg font-headline font-semibold capitalize">{role} Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary capitalize border border-primary/20">
                            {role} Account
                        </span>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl space-y-6">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
