"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

/**
 * DashboardRedirect handles role detection and initial setup.
 * In the new Prisma-based system, the user is already in the database if they signed in.
 */
export default function DashboardRedirect() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [statusMessage, setStatusMessage] = useState("Securing your session...");
    const isProcessing = useRef(false);

    useEffect(() => {
        async function setupUserContext() {
            if (status === 'loading' || isProcessing.current) return;

            if (status === 'unauthenticated') {
                router.push('/');
                return;
            }

            if (session?.user) {
                isProcessing.current = true;
                // @ts-ignore
                const role = (session.user.role || 'patient').toLowerCase();

                setStatusMessage(`Welcome back! Redirecting to your dashboard...`);

                // In this new version, we assume the user already has a record 
                // because NextAuth created it or matched it.
                // We'll redirect based on the role stored in the session.

                setTimeout(() => {
                    router.replace(`/dashboard/${role}`);
                }, 800);
            }
        }

        setupUserContext();
    }, [session, status, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
            <Loader2 className="animate-spin size-10 text-primary" />
            <div className="text-center space-y-2">
                <p className="text-lg font-headline font-bold text-foreground">
                    {statusMessage}
                </p>
                <p className="text-sm text-muted-foreground italic">
                    Preparing your clinical environment.
                </p>
            </div>
        </div>
    );
}
