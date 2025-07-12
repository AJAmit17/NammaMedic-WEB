import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { shareId: string } }
) {
    try {
        const { shareId } = params;

        console.log('Fetching patient data for shareId:', shareId);
        console.log('ShareId type:', typeof shareId);
        console.log('ShareId length:', shareId?.length);

        const patientRecord = await prisma.patientData.findUnique({
            where: { shareId }
        });

        if (!patientRecord) {
            return new Response(
                JSON.stringify({ success: false, error: 'Patient data not found or expired', code: 'NOT_FOUND' }),
                {
                    status: 404,
                    headers: corsHeaders(),
                }
            );
        }

        if (new Date() > patientRecord.expiresAt) {
            await prisma.patientData.delete({
                where: { shareId }
            });

            return new Response(
                JSON.stringify({ success: false, error: 'Patient data has expired', code: 'EXPIRED' }),
                {
                    status: 410,
                    headers: corsHeaders(),
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    patient: patientRecord.data,
                    expiresAt: patientRecord.expiresAt,
                    createdAt: patientRecord.createdAt
                }
            }),
            {
                status: 200,
                headers: corsHeaders(),
            }
        );

    } catch (error) {
        console.error('Patient data fetch error:', error);

        return new Response(
            JSON.stringify({ success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' }),
            {
                status: 500,
                headers: corsHeaders(),
            }
        );
    }
}

// CORS headers helper
function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json',
    };
}

// Handle preflight OPTIONS request
export function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders(),
    });
}
