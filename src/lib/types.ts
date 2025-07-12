import { z } from 'zod';

export const PatientDataSchema = z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    age: z.number().nonnegative().max(120),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Invalid date format, expected YYYY-MM-DD',
    }),
    gender: z.string().min(1),
    height: z.number().nonnegative(),
    weight: z.number().nonnegative(),
    bloodType: z.string().min(1),
    allergies: z.array(z.string()).default([]),
    medicalConditions: z.array(z.string()).default([]),

    emergencyContact: z.object({
        name: z.string().min(1),
        phone: z.string().min(1),
        relationship: z.string().min(1),
    }),

    doctor: z.object({
        name: z.string(),
        phone: z.string(),
        specialty: z.string(),
    }),

    weeklySteps: z.array(z.any()).default([]),
    weeklyHydration: z.array(z.any()).default([]),
    expiry: z.number().int().positive(),
});

export type PatientData = z.infer<typeof PatientDataSchema>;

export const WebhookPayloadSchema = z.object({
    shareId: z.string().min(10).max(100),
    source: z.string(),
    signature: z.string(),
    data: PatientDataSchema,
});

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    code?: string;
}
