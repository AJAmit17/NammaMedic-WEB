'use client';

import { useState } from 'react';
import { generateSignatureAction } from '@/actions/generate-signature';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Database, Clock, Lock, CheckCircle, Copy } from 'lucide-react';

export default function Home() {
    const [shareUrl, setShareUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const testWebhook = async () => {
        setIsLoading(true);
        try {
            const testPayload = {
                firstName: 'Amit',
                lastName: 'Achari',
                age: 21,
                dateOfBirth: '07/24/2025',
                gender: 'Male',
                height: 173,
                weight: 71,
                bloodType: 'Not specified',
                allergies: ['Soy', 'Latex', 'Dust mites', 'Trst4'],
                medicalConditions: ['Diabetes Type 1', 'Arthritis', 'Test'],
                emergencyContact: {
                    name: 'Test',
                    relationship: 'Relation',
                    phone: '8989898989'
                },
                doctor: {
                    name: 'Test doc',
                    phone: '9898989898',
                    specialty: 'Multi'
                },
                weeklySteps: [
                    { date: '2025-07-20', dayName: 'Mon', steps: 1075, isToday: false },
                    { date: '2025-07-21', dayName: 'Tue', steps: 1270, isToday: false },
                    { date: '2025-07-22', dayName: 'Wed', steps: 1625, isToday: false },
                    { date: '2025-07-23', dayName: 'Thu', steps: 1592, isToday: false },
                    { date: '2025-07-24', dayName: 'Fri', steps: 649, isToday: false },
                    { date: '2025-07-25', dayName: 'Sat', steps: 942, isToday: false },
                    { date: '2025-07-26', dayName: 'Sun', steps: 390, isToday: true }
                ],
                weeklyHydration: [
                    { date: '2025-07-20', dayName: 'Mon', intake: 0, isToday: false },
                    { date: '2025-07-21', dayName: 'Tue', intake: 0, isToday: false },
                    { date: '2025-07-22', dayName: 'Wed', intake: 0, isToday: false },
                    { date: '2025-07-23', dayName: 'Thu', intake: 0, isToday: false },
                    { date: '2025-07-24', dayName: 'Fri', intake: 0, isToday: false },
                    { date: '2025-07-25', dayName: 'Sat', intake: 0, isToday: false },
                    { date: '2025-07-26', dayName: 'Sun', intake: 0.25, isToday: true }
                ],
                weeklyHealthData: {
                    steps: [
                        { date: '2025-07-20', value: 1075, unit: 'steps' },
                        { date: '2025-07-21', value: 1270, unit: 'steps' },
                        { date: '2025-07-22', value: 1625, unit: 'steps' },
                        { date: '2025-07-23', value: 1592, unit: 'steps' },
                        { date: '2025-07-24', value: 649, unit: 'steps' },
                        { date: '2025-07-25', value: 942, unit: 'steps' },
                        { date: '2025-07-26', value: 390, unit: 'steps' }
                    ],
                    heartRate: [
                        { date: '2025-07-20', value: 0, unit: 'bpm' },
                        { date: '2025-07-21', value: 0, unit: 'bpm' },
                        { date: '2025-07-22', value: 0, unit: 'bpm' },
                        { date: '2025-07-23', value: 0, unit: 'bpm' },
                        { date: '2025-07-24', value: 0, unit: 'bpm' },
                        { date: '2025-07-25', value: 0, unit: 'bpm' },
                        { date: '2025-07-26', value: null, unit: 'bpm' }
                    ],
                    water: [
                        { date: '2025-07-20', value: 0, unit: 'L' },
                        { date: '2025-07-21', value: 0, unit: 'L' },
                        { date: '2025-07-22', value: 0, unit: 'L' },
                        { date: '2025-07-23', value: 0, unit: 'L' },
                        { date: '2025-07-24', value: 0, unit: 'L' },
                        { date: '2025-07-25', value: 0, unit: 'L' },
                        { date: '2025-07-26', value: 0.25, unit: 'L' }
                    ],
                    temperature: [
                        { date: '2025-07-20', value: 38.30000114440918, unit: '°C' },
                        { date: '2025-07-21', value: 0, unit: '°C' },
                        { date: '2025-07-22', value: 0, unit: '°C' },
                        { date: '2025-07-23', value: 0, unit: '°C' },
                        { date: '2025-07-24', value: 0, unit: '°C' },
                        { date: '2025-07-25', value: 0, unit: '°C' },
                        { date: '2025-07-26', value: 36.4, unit: '°C' }
                    ]
                },
                healthSummary: {
                    totalSteps: 7543,
                    avgHeartRate: null,
                    totalHydration: 0.25,
                    avgTemperature: 10.7
                },
                expiry: 300
            };

            const shareId = "test123123";

            const testData = {
                shareId,
                source: 'demo-system',
                signature: '',
                data: testPayload
            };

            const { signature, ...payloadWithoutSignature } = testData;
            const payloadForSigning = JSON.stringify(payloadWithoutSignature);

            const generatedSignature = await generateSignatureAction(payloadForSigning);

            testData.signature = generatedSignature;

            const response = await fetch('/api/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            });

            const result = await response.json();

            if (result.success) {
                setShareUrl(result.data.shareUrl);
            } else {
                console.error('Webhook test failed:', result.error);
            }
        } catch (error) {
            console.error('Test error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Secure Medical Data Sharing System
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        A HIPAA-compliant platform for temporary and secure sharing of patient data between healthcare providers.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                            <h3 className="font-semibold text-gray-800">Secure</h3>
                            <p className="text-sm text-gray-600">End-to-end encryption</p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <Clock className="h-12 w-12 text-green-600 mx-auto mb-2" />
                            <h3 className="font-semibold text-gray-800">Temporary</h3>
                            <p className="text-sm text-gray-600">5-minute auto-expiry</p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <Database className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                            <h3 className="font-semibold text-gray-800">Validated</h3>
                            <p className="text-sm text-gray-600">Schema validation</p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <Lock className="h-12 w-12 text-red-600 mx-auto mb-2" />
                            <h3 className="font-semibold text-gray-800">Compliant</h3>
                            <p className="text-sm text-gray-600">HIPAA standards</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* API Documentation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">API Documentation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Webhook Endpoint</h4>
                                <Badge variant="secondary" className="mb-2">POST /api/webhook</Badge>
                                <p className="text-sm text-gray-600">
                                    Submit patient data with required signature verification.
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Patient Data Access</h4>
                                <Badge variant="secondary" className="mb-2">GET /patient/[shareId]</Badge>
                                <p className="text-sm text-gray-600">
                                    Access patient data using the unique share ID before expiration.
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Security Features</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• HMAC signature verification</li>
                                    <li>• Rate limiting protection</li>
                                    <li>• Automatic data expiration</li>
                                    <li>• Input validation and sanitization</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Demo Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Demo Test</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Test the webhook endpoint with sample patient data to see how the system works.
                            </p>

                            <Button
                                onClick={testWebhook}
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? 'Creating Test Data...' : 'Test Webhook with Sample Data'}
                            </Button>

                            {shareUrl && (
                                <Alert>
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="space-y-2">
                                            <p className="font-semibold">Test successful! Share URL created:</p>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={shareUrl}
                                                    readOnly
                                                    className="text-xs"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={copyToClipboard}
                                                >
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                This link will expire in 5 minutes for security.
                                            </p>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}