'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
            const testData = {
                shareId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                source: 'demo-system',
                signature: 'demo-signature-for-testing',
                data: {
                    personal: {
                        firstName: 'John',
                        lastName: 'Doe',
                        dateOfBirth: '1985-03-15',
                        gender: 'male' as const,
                        phone: '+1-555-0123',
                        email: 'john.doe@example.com',
                        address: {
                            street: '123 Main St',
                            city: 'Anytown',
                            state: 'NY',
                            zipCode: '12345',
                            country: 'USA'
                        }
                    },
                    medical: {
                        patientId: 'PAT-001234',
                        bloodType: 'O+' as const,
                        allergies: ['Penicillin', 'Nuts'],
                        medications: [
                            { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
                            { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
                        ],
                        conditions: ['Hypertension', 'Type 2 Diabetes'],
                        lastVisit: '2024-01-15',
                        notes: 'Patient reports feeling well. Blood pressure stable.'
                    },
                    emergency: {
                        primaryContact: {
                            name: 'Jane Doe',
                            relationship: 'Spouse',
                            phone: '+1-555-0124'
                        },
                        secondaryContact: {
                            name: 'Bob Smith',
                            relationship: 'Brother',
                            phone: '+1-555-0125'
                        }
                    }
                }
            };

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

                {/* Environment Setup */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Environment Setup</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium">Required Environment Variables</Label>
                                <Textarea
                                    readOnly
                                    className="mt-2 text-xs font-mono"
                                    value={`DATABASE_URL="mongodb://localhost:27017/medical-data-sharing"
WEBHOOK_SECRET="your-webhook-secret-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"`}
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Setup Commands</Label>
                                <Textarea
                                    readOnly
                                    className="mt-2 text-xs font-mono"
                                    value={`# Install dependencies
npm install

# Set up Prisma
npx prisma generate
npx prisma db push

# Run development server
npm run dev`}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}