import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== 'admin') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { email, role, firstName, lastName, specialization } = await req.json();

    try {
        const pending = await prisma.pendingAuthorization.create({
            data: {
                email: email.toLowerCase().trim(),
                role,
                firstName,
                lastName,
                specialization,
            },
        });
        return NextResponse.json(pending);
    } catch (error: any) {
        return new NextResponse(error.message, { status: 500 });
    }
}
