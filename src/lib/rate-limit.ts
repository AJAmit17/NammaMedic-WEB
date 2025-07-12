import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
    points: 10, // Number of requests
    duration: 60, // Per 60 seconds
});

export async function checkRateLimit(identifier: string): Promise<boolean> {
    try {
        await rateLimiter.consume(identifier);
        return true;
    } catch {
        return false;
    }
}