import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/lib/types';
import { verifyWebhookSignature } from '@/lib/security';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
        const isAllowed = await checkRateLimit(clientIP);

        if (!isAllowed) {
            return NextResponse.json(
                { success: false, error: 'Rate limit exceeded', code: 'RATE_LIMIT' } as ApiResponse,
                { status: 429 }
            );
        }

        // Parse request body
        const rawBody = await request.text();
        let payload;

        try {
            payload = JSON.parse(rawBody);
        } catch (error) {
            await logWebhookAttempt('unknown', rawBody, false, 'Invalid JSON');
            return NextResponse.json(
                { success: false, error: 'Invalid JSON format', code: 'INVALID_JSON' } as ApiResponse,
                { status: 400 }
            );
        }

        const { shareId, source, signature, data } = payload;

        if (!shareId || !source || !signature || !data) {
            await logWebhookAttempt(source || 'unknown', payload, false, 'Missing required fields');
            return NextResponse.json(
                { success: false, error: 'Missing required fields', code: 'MISSING_FIELDS' } as ApiResponse,
                { status: 400 }
            );
        }

        // Verify webhook signature
        const { signature: _, ...payloadWithoutSignature } = payload;
        const payloadForVerification = JSON.stringify(payloadWithoutSignature);
        const isValidSignature = verifyWebhookSignature(payloadForVerification, signature);

        if (!isValidSignature) {
            console.log('Signature verification failed:', {
                receivedSignature: signature,
                payloadLength: payloadForVerification.length,
                source
            });
            await logWebhookAttempt(source, payload, false, 'Invalid signature');
            return NextResponse.json(
                { success: false, error: 'Invalid signature', code: 'INVALID_SIGNATURE' } as ApiResponse,
                { status: 401 }
            );
        }

        // Check if shareId already exists
        const existingData = await prisma.patientData.findUnique({
            where: { shareId }
        });

        if (existingData) {
            await logWebhookAttempt(source, payload, false, 'ShareId already exists');
            return NextResponse.json(
                { success: false, error: 'ShareId already exists', code: 'DUPLICATE_SHARE_ID' } as ApiResponse,
                { status: 409 }
            );
        }

        // Store patient data with automatic expiration
        const patientRecord = await prisma.patientData.create({
            data: {
                shareId,
                data: data,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            }
        });

        // Log success
        await logWebhookAttempt(source, payload, true);

        return NextResponse.json(
            {
                success: true,
                data: {
                    shareId,
                    expiresAt: patientRecord.expiresAt,
                    shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/patient/${shareId}`
                }
            } as ApiResponse,
            { status: 201 }
        );

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' } as ApiResponse,
            { status: 500 }
        );
    }
}

async function logWebhookAttempt(source: string, payload: any, success: boolean, error?: string) {
    try {
        await prisma.webhookLog.create({
            data: {
                source,
                payload,
                success,
                error,
            }
        });
    } catch (logError) {
        console.error('Failed to log webhook attempt:', logError);
    }
}

export async function GET() {
    return NextResponse.json(
        { success: false, error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' } as ApiResponse,
        { status: 405 }
    );
}
