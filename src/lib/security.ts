import crypto from 'crypto';

const WEBHOOK_SECRET = 'nammamedic';

export function generateWebhookSignature(payload: string): string {
    return crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');
}

export function verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
        const expectedSignature = generateWebhookSignature(payload);

        // Remove any prefix like 'sha256=' if present
        const cleanSignature = signature.replace(/^sha256=/, '');

        console.log('Signature verification:', {
            expected: expectedSignature,
            received: cleanSignature,
            match: expectedSignature === cleanSignature
        });

        return expectedSignature === cleanSignature;
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}

export function generateShareId(): string {
    return crypto.randomBytes(16).toString('hex');
}

// export function isValidShareId(shareId: string): boolean {
//     // Check if shareId is a valid format (32 character hex string)
//     if (!shareId || typeof shareId !== 'string') {
//         console.log('ShareId validation failed: not a string or empty', { shareId, type: typeof shareId });
//         return false;
//     }

//     // Allow hex strings between 10-64 characters for flexibility
//     const hexPattern = /^[a-z0-9]$/i;
//     const isValid = hexPattern.test(shareId);

//     // Check for invalid characters to provide better error messages
//     const invalidChars = shareId.match(/[^a-z0-9]/gi);

//     console.log('ShareId validation:', {
//         shareId,
//         length: shareId.length,
//         pattern: hexPattern.toString(),
//         isValid,
//         invalidChars: invalidChars || 'none'
//     });

//     return isValid;
// }