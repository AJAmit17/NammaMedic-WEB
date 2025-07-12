import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/lib/types';
import { isValidShareId } from '@/lib/security';

export async function GET(
    request: NextRequest,
    { params }: { params: { shareId: string } }
) {
    try {
        const { shareId } = params;

        // Validate shareId format
        if (!isValidShareId(shareId)) {
            return NextResponse.json(
                { success: false, error: 'Invalid share ID format', code: 'INVALID_SHARE_ID' } as ApiResponse,
                { status: 400 }
            );
        }

        // Fetch patient data
        const patientRecord = await prisma.patientData.findUnique({
            where: { shareId }
        });

        if (!patientRecord) {
            return NextResponse.json(
                { success: false, error: 'Patient data not found or expired', code: 'NOT_FOUND' } as ApiResponse,
                { status: 404 }
            );
        }

        // Check if data has expired
        if (new Date() > patientRecord.expiresAt) {
            // Clean up expired data
            await prisma.patientData.delete({
                where: { shareId }
            });

            return NextResponse.json(
                { success: false, error: 'Patient data has expired', code: 'EXPIRED' } as ApiResponse,
                { status: 410 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    patient: patientRecord.data,
                    expiresAt: patientRecord.expiresAt,
                    createdAt: patientRecord.createdAt
                }
            } as ApiResponse,
            { status: 200 }
        );

    } catch (error) {
        console.error('Patient data fetch error:', error);

        return NextResponse.json(
            { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' } as ApiResponse,
            { status: 500 }
        );
    }
}