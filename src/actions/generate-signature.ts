'use server';

import { generateWebhookSignature } from '@/lib/security';

export async function generateSignatureAction(payload: string): Promise<string> {
    try {
        const signature = generateWebhookSignature(payload);
        return signature;
    } catch (error) {
        console.error('Signature generation error:', error);
        throw new Error('Failed to generate signature');
    }
}
