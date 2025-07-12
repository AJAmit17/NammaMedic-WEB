import { z } from 'zod';

// Patient data validation schema
export const PatientDataSchema = z.object({
    personal: z.object({
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
        dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        gender: z.string().min(1),
        phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/),
        email: z.string().email().optional(),
        address: z.object({
            street: z.string(),
            city: z.string(),
            state: z.string(),
            zipCode: z.string(),
            country: z.string(),
        }),
    }),
    medical: z.object({
        patientId: z.string(),
        bloodType: z.string().min(1),
        allergies: z.array(z.string()).default([]),
        medications: z.array(z.object({
            name: z.string(),
            dosage: z.string(),
            frequency: z.string(),
        })).default([]),
        conditions: z.array(z.string()).default([]),
        lastVisit: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        notes: z.string().optional(),
    }),
    emergency: z.object({
        primaryContact: z.object({
            name: z.string(),
            relationship: z.string(),
            phone: z.string(),
        }),
        secondaryContact: z.object({
            name: z.string(),
            relationship: z.string(),
            phone: z.string(),
        }).optional(),
    }),
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