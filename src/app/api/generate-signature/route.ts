import { NextRequest, NextResponse } from 'next/server';
import { generateWebhookSignature } from '@/lib/security';

export async function POST(request: NextRequest) {
    try {
        const { payload } = await request.json();

        if (!payload) {
            return NextResponse.json(
                { error: 'Payload is required' },
                { status: 400 }
            );
        }

        const signature = generateWebhookSignature(payload);

        return NextResponse.json({ signature });
    } catch (error) {
        console.error('Signature generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate signature' },
            { status: 500 }
        );
    }
}