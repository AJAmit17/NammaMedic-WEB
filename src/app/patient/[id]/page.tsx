/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PatientData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Clock, User, Heart, Phone, MapPin, Pill, AlertTriangle } from 'lucide-react';

interface PageState {
    loading: boolean;
    data: PatientData | null;
    error: string | null;
    expiresAt: Date | null;
    timeLeft: number | null;
}

export default function PatientDataPage() {
    const params = useParams();
    const shareId = params?.shareId as string;

    const [state, setState] = useState<PageState>({
        loading: true,
        data: null,
        error: null,
        expiresAt: null,
        timeLeft: null,
    });

    useEffect(() => {
        if (!shareId) {
            setState(prev => ({ ...prev, loading: false, error: 'Invalid share ID' }));
            return;
        }

        fetchPatientData();
    }, [shareId]);

    useEffect(() => {
        if (!state.expiresAt) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expiry = state.expiresAt!.getTime();
            const timeLeft = expiry - now;

            if (timeLeft <= 0) {
                setState(prev => ({ ...prev, data: null, error: 'Data has expired', timeLeft: 0 }));
                clearInterval(interval);
            } else {
                setState(prev => ({ ...prev, timeLeft: Math.floor(timeLeft / 1000) }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [state.expiresAt]);

    const fetchPatientData = async () => {
        try {
            const response = await fetch(`/api/patient/${shareId}`);
            const result = await response.json();

            if (!result.success) {
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: result.error || 'Failed to fetch data'
                }));
                return;
            }

            setState(prev => ({
                ...prev,
                loading: false,
                data: result.data.patient,
                expiresAt: new Date(result.data.expiresAt),
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Network error occurred'
            }));
        }
    };

    const formatTimeLeft = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (state.loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Loading patient data...</p>
                </div>
            </div>
        );
    }

    if (state.error || !state.data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-600 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Access Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Alert>
                            <AlertDescription>
                                {state.error || 'Patient data not found or has expired.'}
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { personal, medical, emergency } = state.data;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header with timer */}
                <Card className="border-l-4 border-l-blue-600">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl text-gray-800">Patient Medical Record</CardTitle>
                                <p className="text-gray-600 mt-1">Secure temporary access</p>
                            </div>
                            {state.timeLeft !== null && state.timeLeft > 0 && (
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-orange-600">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-mono text-lg">{formatTimeLeft(state.timeLeft)}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">Time remaining</p>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">First Name</label>
                                    <p className="font-semibold">{personal.firstName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Last Name</label>
                                    <p className="font-semibold">{personal.lastName}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                                    <p className="font-semibold">{personal.dateOfBirth}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Gender</label>
                                    <p className="font-semibold capitalize">{personal.gender}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <p className="font-semibold">{personal.phone}</p>
                                </div>
                                {personal.email && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <p className="font-semibold">{personal.email}</p>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    Address
                                </label>
                                <p className="font-semibold">
                                    {personal.address.street}<br />
                                    {personal.address.city}, {personal.address.state} {personal.address.zipCode}<br />
                                    {personal.address.country}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Medical Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700">
                                <Heart className="h-5 w-5" />
                                Medical Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Patient ID</label>
                                    <p className="font-semibold">{medical.patientId}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Blood Type</label>
                                    <Badge variant="outline" className="font-semibold text-red-600">
                                        {medical.bloodType}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Last Visit</label>
                                <p className="font-semibold">{medical.lastVisit}</p>
                            </div>

                            {medical.allergies.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Allergies</label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {medical.allergies.map((allergy, index) => (
                                            <Badge key={index} variant="destructive" className="text-xs">
                                                {allergy}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {medical.conditions.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Medical Conditions</label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {medical.conditions.map((condition, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {condition}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {medical.notes && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Notes</label>
                                    <p className="text-sm bg-gray-50 p-2 rounded">{medical.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Medications */}
                {medical.medications.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-700">
                                <Pill className="h-5 w-5" />
                                Current Medications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {medical.medications.map((medication, index) => (
                                    <div key={index} className="bg-purple-50 p-3 rounded-lg">
                                        <h4 className="font-semibold text-purple-800">{medication.name}</h4>
                                        <p className="text-sm text-gray-600">Dosage: {medication.dosage}</p>
                                        <p className="text-sm text-gray-600">Frequency: {medication.frequency}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Emergency Contacts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700">
                            <Phone className="h-5 w-5" />
                            Emergency Contacts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-red-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-red-800 mb-2">Primary Contact</h4>
                                <p className="font-semibold">{emergency.primaryContact.name}</p>
                                <p className="text-sm text-gray-600">{emergency.primaryContact.relationship}</p>
                                <p className="text-sm font-medium">{emergency.primaryContact.phone}</p>
                            </div>

                            {emergency.secondaryContact && (
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-orange-800 mb-2">Secondary Contact</h4>
                                    <p className="font-semibold">{emergency.secondaryContact.name}</p>
                                    <p className="text-sm text-gray-600">{emergency.secondaryContact.relationship}</p>
                                    <p className="text-sm font-medium">{emergency.secondaryContact.phone}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <Card className="bg-gray-50">
                    <CardContent className="py-4">
                        <p className="text-center text-sm text-gray-500">
                            This data is automatically deleted after 5 minutes for security purposes.
                            <br />
                            Share ID: <code className="bg-white px-2 py-1 rounded text-xs">{shareId}</code>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}