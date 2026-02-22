import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return new NextResponse("Email and password are required.", { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    try {
        // 1. Check if the user is in PendingAuthorization (Staff)
        const pending = await prisma.pendingAuthorization.findUnique({
            where: { email: emailLower },
        });

        if (pending) {
            // Create the Staff User
            const user = await prisma.user.create({
                data: {
                    email: emailLower,
                    password: password, // In a real app, hash this!
                    role: pending.role,
                    firstName: pending.firstName,
                    lastName: pending.lastName,
                    specialization: pending.specialization,
                    ...(pending.role === 'doctor' ? {
                        doctorProfile: {
                            create: {
                                email: emailLower,
                                specialization: pending.specialization,
                            }
                        }
                    } : {})
                },
            });

            // Delete the pending authorization
            await prisma.pendingAuthorization.delete({
                where: { id: pending.id },
            });

            return NextResponse.json({ success: true, role: user.role });
        }

        // 2. Check if it's a Patient record created by a receptionist
        // These users already have a User record with role 'patient' but maybe no password
        const existingUser = await prisma.user.findUnique({
            where: { email: emailLower },
        });

        if (existingUser && existingUser.role === 'patient') {
            const updatedUser = await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    password: password, // Hash this!
                },
            });
            return NextResponse.json({ success: true, role: updatedUser.role });
        }

        return new NextResponse("This email address has not been authorized for access.", { status: 403 });
    } catch (error: any) {
        console.error("Registration error:", error);
        return new NextResponse(error.message || "An error occurred during registration.", { status: 500 });
    }
}
