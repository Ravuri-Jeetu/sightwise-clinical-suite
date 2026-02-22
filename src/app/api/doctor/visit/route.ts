import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== 'doctor') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
        patientId,
        vaOD,
        vaOS,
        iopOD,
        iopOS,
        cdrOD,
        cdrOS,
        lensOD,
        lensOS,
        notes,
        riskCategory,
        riskExplanationSummary
    } = await req.json();

    try {
        const visit = await prisma.clinicalVisit.create({
            data: {
                patientId,
                doctorId: (session.user as any).id,
                visualAcuityRight: vaOD,
                visualAcuityLeft: vaOS,
                iopRight: parseFloat(iopOD) || 0,
                iopLeft: parseFloat(iopOS) || 0,
                cupDiscRatioRight: parseFloat(cdrOD) || null,
                cupDiscRatioLeft: parseFloat(cdrOS) || null,
                lensGradeRight: parseInt(lensOD) || 0,
                lensGradeLeft: parseInt(lensOS) || 0,
                notes,
                riskCategory,
                riskExplanationSummary,
            },
        });
        return NextResponse.json(visit);
    } catch (error: any) {
        console.error("Visit save error:", error);
        return new NextResponse(error.message, { status: 500 });
    }
}
