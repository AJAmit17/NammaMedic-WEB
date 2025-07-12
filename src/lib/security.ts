import crypto from 'crypto';

const WEBHOOK_SECRET = 'nammamedic';

export function verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
    );
}

export function sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
}

export function generateShareId(): string {
    return crypto.randomBytes(16).toString('hex');
}

export function isValidShareId(shareId: string): boolean {
    return /^[a-f0-9]{32}$/.test(shareId);
}