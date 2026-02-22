import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { firstName, lastName, contactNumber } = await req.json();

    try {
        const user = await prisma.user.update({
            where: { email: session.user.email! },
            data: {
                firstName,
                lastName,
                patientProfile: {
                    update: {
                        contactNumber,
                    }
                }
            },
        });
        return NextResponse.json(user);
    } catch (error: any) {
        console.error("Profile update error:", error);
        return new NextResponse(error.message, { status: 500 });
    }
}
