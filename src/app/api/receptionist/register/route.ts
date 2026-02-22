import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user || !['admin', 'receptionist'].includes((session.user as any).role)) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { firstName, lastName, email, dob, gender, phone, address } = await req.json();

    try {
        const emailLower = email.toLowerCase().trim();

        // First, check if a user with this email already exists
        let user = await prisma.user.findUnique({
            where: { email: emailLower },
        });

        if (!user) {
            // Create a skeleton user for the patient to later claim
            user = await prisma.user.create({
                data: {
                    email: emailLower,
                    role: 'patient',
                    firstName,
                    lastName,
                },
            });
        }

        // Create or update the patient profile
        const profile = await prisma.patientProfile.upsert({
            where: { email: emailLower },
            update: {
                firstName,
                lastName,
                dateOfBirth: dob ? new Date(dob) : null,
                gender,
                contactNumber: phone,
                address,
            },
            create: {
                userId: user.id,
                firstName,
                lastName,
                email: emailLower,
                dateOfBirth: dob ? new Date(dob) : null,
                gender,
                contactNumber: phone,
                address,
            },
        });

        return NextResponse.json(profile);
    } catch (error: any) {
        console.error("Registration error:", error);
        return new NextResponse(error.message, { status: 500 });
    }
}
