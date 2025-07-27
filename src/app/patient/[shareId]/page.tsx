/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Loader2, Clock, User, Heart, Phone, AlertTriangle, Activity, Droplets
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function PatientDataPage() {
    const { shareId } = useParams() as { shareId: string };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                // const res = await fetch(`http://localhost:3000/api/patient/${shareId}`);
                const res = await fetch(`http://localhost:3000/api/patient/${shareId}`);
                const json = await res.json();

                if (!json.success) {
                    setError(json.error || 'Failed to fetch data');
                    setLoading(false);
                    return;
                }

                const { patient, expiresAt } = json.data;
                setData(patient);
                setExpiresAt(new Date(expiresAt));
            } catch {
                setError('Network error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [shareId]);

    useEffect(() => {
        if (!expiresAt) return;

        const interval = setInterval(() => {
            const seconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
            if (seconds <= 0) {
                setData(null);
                setError('Data has expired');
                setTimeLeft(0);
                clearInterval(interval);
            } else {
                setTimeLeft(seconds);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    const formatTimeLeft = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    const prepareStepsChartData = () => {
        if (!data?.weeklySteps || data.weeklySteps.length === 0) return null;

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        return {
            labels: days.slice(0, data.weeklySteps.length),
            datasets: [
                {
                    label: 'Daily Steps',
                    data: data.weeklySteps,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                }
            ]
        };
    };

    const prepareHydrationChartData = () => {
        if (!data?.weeklyHydration || data.weeklyHydration.length === 0) return null;

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        return {
            labels: days.slice(0, data.weeklyHydration.length),
            datasets: [
                {
                    label: 'Water Intake (Liters)',
                    data: data.weeklyHydration,
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }
            ]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 12,
                        weight: 'bold' as const
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart' as const,
        }
    };

    const stepsChartData = prepareStepsChartData();
    const hydrationChartData = prepareHydrationChartData();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Loading patient data...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
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
                            <AlertDescription>{error || 'Data not found or expired.'}</AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card className="border-l-4 border-l-blue-600">
                    <CardHeader className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl text-gray-800">Patient Medical Record</CardTitle>
                            <p className="text-gray-600 mt-1">Secure temporary access</p>
                        </div>
                        {timeLeft !== null && timeLeft > 0 && (
                            <div className="text-right">
                                <div className="flex items-center gap-2 text-orange-600">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-mono text-lg">{formatTimeLeft(timeLeft)}</span>
                                </div>
                                <p className="text-sm text-gray-500">Time remaining</p>
                            </div>
                        )}
                    </CardHeader>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-sm text-gray-500">First Name</label><p className="font-semibold">{data.firstName}</p></div>
                                <div><label className="text-sm text-gray-500">Last Name</label><p className="font-semibold">{data.lastName}</p></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-sm text-gray-500">Date of Birth</label><p className="font-semibold">{data.dateOfBirth}</p></div>
                                <div><label className="text-sm text-gray-500">Gender</label><p className="font-semibold capitalize">{data.gender}</p></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-sm text-gray-500">Age</label><p className="font-semibold">{data.age}</p></div>
                                <div><label className="text-sm text-gray-500">Blood Type</label><Badge variant="outline" className="text-red-600">{data.bloodType}</Badge></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-sm text-gray-500">Height</label><p className="font-semibold">{data.height} cm</p></div>
                                <div><label className="text-sm text-gray-500">Weight</label><p className="font-semibold">{data.weight} kg</p></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700">
                                <Heart className="h-5 w-5" />
                                Medical Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.allergies && data.allergies.length > 0 && (
                                <div>
                                    <label className="text-sm text-gray-500">Allergies</label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {data.allergies.map((allergy: string, i: number) => (
                                            <Badge key={i} variant="destructive" className="text-xs">{allergy}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data.medicalConditions && data.medicalConditions.length > 0 && (
                                <div>
                                    <label className="text-sm text-gray-500">Medical Conditions</label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {data.medicalConditions.map((condition: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-xs">{condition}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data.doctor && data.doctor.name && (
                                <div>
                                    <label className="text-sm text-gray-500">Doctor</label>
                                    <div className="bg-gray-50 p-2 rounded">
                                        <p className="font-semibold">{data.doctor.name}</p>
                                        {data.doctor.specialty && <p className="text-sm text-gray-600">{data.doctor.specialty}</p>}
                                        {data.doctor.phone && <p className="text-sm text-gray-600">{data.doctor.phone}</p>}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Health Analytics Charts */}
                {(stepsChartData || hydrationChartData) && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {stepsChartData && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-purple-700">
                                        <Activity className="h-5 w-5" />
                                        Weekly Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64">
                                        <Line data={stepsChartData} options={chartOptions} />
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-sm text-gray-500">
                                            Average: {Math.round(data.weeklySteps.reduce((a: number, b: number) => a + b, 0) / data.weeklySteps.length)} steps/day
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {hydrationChartData && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-cyan-700">
                                        <Droplets className="h-5 w-5" />
                                        Weekly Hydration
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64">
                                        <Bar data={hydrationChartData} options={chartOptions} />
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-sm text-gray-500">
                                            Average: {(data.weeklyHydration.reduce((a: number, b: number) => a + b, 0) / data.weeklyHydration.length).toFixed(1)} L/day
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700">
                            <Phone className="h-5 w-5" /> Emergency Contact
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.emergencyContact && (
                            <div className="bg-red-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-red-800 mb-2">Primary Contact</h4>
                                <p className="font-semibold">{data.emergencyContact.name}</p>
                                <p className="text-sm text-gray-600">{data.emergencyContact.relationship}</p>
                                <p className="text-sm font-medium">{data.emergencyContact.phone}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-gray-50">
                    <CardContent className="py-4">
                        <p className="text-center text-sm text-gray-500">
                            This data is automatically deleted after 5 minutes for patient&apos;s privacy and security purpose.
                            <br />
                            Share ID: <code className="bg-white px-2 py-1 rounded text-xs">{shareId}</code>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}