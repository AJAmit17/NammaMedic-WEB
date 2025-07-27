"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
    Loader2,
    Clock,
    User,
    Heart,
    Phone,
    AlertTriangle,
    Activity,
    Droplets,
    Thermometer,
    Calendar,
    Shield,
    Lock,
    Eye,
    Stethoscope,
    Clipboard,
    UserCheck,
    AlertCircle,
    CheckCircle2,
    Database,
    TestTube,
    TrendingUp,
} from "lucide-react"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Bar, Line } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    ChartTooltip,
    Legend,
    Filler,
    ChartDataLabels
)

// Mock data for demonstration
const generateMockData = () => ({
    firstName: "John",
    lastName: "Doe",
    age: 45,
    dateOfBirth: "01/15/1980",
    gender: "Male",
    height: 175,
    weight: 75,
    bloodType: "O+",
    allergies: ["Penicillin", "Shellfish"],
    medicalConditions: ["Hypertension", "Type 2 Diabetes"],
    emergencyContact: {
        name: "Jane Doe",
        phone: "555-0123",
        relationship: "Spouse",
    },
    doctor: {
        name: "Dr. Smith",
        phone: "555-0456",
        specialty: "Internal Medicine",
    },
    weeklySteps: [
        { date: "2025-07-20", dayName: "Mon", steps: 8500, isToday: false },
        { date: "2025-07-21", dayName: "Tue", steps: 9200, isToday: false },
        { date: "2025-07-22", dayName: "Wed", steps: 7800, isToday: false },
        { date: "2025-07-23", dayName: "Thu", steps: 10500, isToday: false },
        { date: "2025-07-24", dayName: "Fri", steps: 6900, isToday: false },
        { date: "2025-07-25", dayName: "Sat", steps: 12000, isToday: false },
        { date: "2025-07-26", dayName: "Sun", steps: 5500, isToday: true },
    ],
    weeklyHydration: [
        { date: "2025-07-20", dayName: "Mon", intake: 2.1, isToday: false },
        { date: "2025-07-21", dayName: "Tue", intake: 2.5, isToday: false },
        { date: "2025-07-22", dayName: "Wed", intake: 1.8, isToday: false },
        { date: "2025-07-23", dayName: "Thu", intake: 2.3, isToday: false },
        { date: "2025-07-24", dayName: "Fri", intake: 2.0, isToday: false },
        { date: "2025-07-25", dayName: "Sat", intake: 2.7, isToday: false },
        { date: "2025-07-26", dayName: "Sun", intake: 1.9, isToday: true },
    ],
    weeklyHealthData: {
        heartRate: [
            { date: "2025-07-20", value: 72, unit: "bpm" },
            { date: "2025-07-21", value: 75, unit: "bpm" },
            { date: "2025-07-22", value: 68, unit: "bpm" },
            { date: "2025-07-23", value: 78, unit: "bpm" },
            { date: "2025-07-24", value: 70, unit: "bpm" },
            { date: "2025-07-25", value: 73, unit: "bpm" },
            { date: "2025-07-26", value: 71, unit: "bpm" },
        ],
        temperature: [
            { date: "2025-07-20", value: 36.5, unit: "°C" },
            { date: "2025-07-21", value: 36.7, unit: "°C" },
            { date: "2025-07-22", value: 36.4, unit: "°C" },
            { date: "2025-07-23", value: 36.8, unit: "°C" },
            { date: "2025-07-24", value: 36.6, unit: "°C" },
            { date: "2025-07-25", value: 36.5, unit: "°C" },
            { date: "2025-07-26", value: 36.6, unit: "°C" },
        ],
    },
    healthSummary: {
        totalSteps: 60400,
        avgHeartRate: 72.4,
        totalHydration: 15.3,
        avgTemperature: 36.6,
    },
})

// Chart.js configuration objects
const getChartOptions = (title: string, yAxisLabel: string, suggestedMin?: number, suggestedMax?: number) => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    scales: {
        x: {
            display: true,
            title: {
                display: true,
                text: 'Days',
                color: '#64748b',
                font: {
                    size: 12,
                    weight: 'bold' as const,
                },
            },
            ticks: {
                color: '#64748b',
                font: {
                    size: 10,
                },
            },
            grid: {
                color: '#e2e8f0',
                drawBorder: false,
            },
        },
        y: {
            display: true,
            title: {
                display: true,
                text: yAxisLabel,
                color: '#64748b',
                font: {
                    size: 12,
                    weight: 'bold' as const,
                },
            },
            ticks: {
                color: '#64748b',
                font: {
                    size: 10,
                },
            },
            grid: {
                color: '#e2e8f0',
                drawBorder: false,
            },
            suggestedMin,
            suggestedMax,
        },
    },
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: title,
            color: '#1e293b',
            font: {
                size: 14,
                weight: 'bold' as const,
            },
        },
        datalabels: {
            display: true,
            color: '#1e293b',
            font: {
                size: 10,
                weight: 'bold' as const,
            },
            anchor: 'end' as const,
            align: 'top' as const,
            offset: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            borderRadius: 4,
            padding: {
                top: 2,
                bottom: 2,
                left: 4,
                right: 4,
            },
            formatter: (value: number) => {
                if (value < 10 && value % 1 !== 0) {
                    return value.toFixed(1);
                }
                return value.toLocaleString();
            },
        },
        tooltip: {
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#475569',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            titleFont: {
                size: 12,
                weight: 'bold' as const,
            },
            bodyFont: {
                size: 11,
            },
            padding: 12,
        },
    },
})

const getBarChartData = (labels: string[], data: number[], label: string, color: string) => ({
    labels,
    datasets: [
        {
            label,
            data,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 0,
            borderRadius: 4,
            borderSkipped: false,
        },
    ],
})

const getLineChartData = (labels: string[], data: number[], label: string, color: string) => ({
    labels,
    datasets: [
        {
            label,
            data,
            borderColor: color,
            backgroundColor: color + '20',
            borderWidth: 3,
            pointBackgroundColor: color,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.4,
            fill: true,
        },
    ],
})

export default function PatientDataPage() {
    const { shareId } = useParams() as { shareId: string }
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<any>(null)
    const [expiresAt, setExpiresAt] = useState<Date | null>(null)
    const [timeLeft, setTimeLeft] = useState<number | null>(null)
    const [useMockData, setUseMockData] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                if (useMockData) {
                    setData(generateMockData())
                    setExpiresAt(new Date(Date.now() + 5 * 60 * 1000)) // 5 minutes from now
                    setError(null) // Clear any previous errors
                    setLoading(false)
                    return
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/patient/${shareId}`)
                const json = await res.json()

                if (!json.success) {
                    setError(json.error || "Failed to fetch data")
                    setLoading(false)
                    return
                }

                const { patient, expiresAt } = json.data
                setData(patient)
                setExpiresAt(new Date(expiresAt))
                setError(null)
            } catch {
                setError("Network error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchPatientData()
    }, [shareId, useMockData])

    useEffect(() => {
        if (!expiresAt) return

        const interval = setInterval(() => {
            const seconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000)
            if (seconds <= 0) {
                setData(null)
                setError("Data has expired")
                setTimeLeft(0)
                clearInterval(interval)
            } else {
                setTimeLeft(seconds)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [expiresAt])

    const formatTimeLeft = useCallback((s: number) => {
        const minutes = Math.floor(s / 60)
        const seconds = s % 60
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }, [])

    const getHealthStatus = useCallback((value: number, type: "heartRate" | "temperature" | "bmi") => {
        switch (type) {
            case "heartRate":
                if (value < 60) return { status: "Low", color: "text-blue-600", bg: "bg-blue-50" }
                if (value > 100) return { status: "High", color: "text-red-600", bg: "bg-red-50" }
                return { status: "Normal", color: "text-green-600", bg: "bg-green-50" }
            case "temperature":
                if (value > 37.5) return { status: "Fever", color: "text-red-600", bg: "bg-red-50" }
                if (value < 36.1) return { status: "Low", color: "text-blue-600", bg: "bg-blue-50" }
                return { status: "Normal", color: "text-green-600", bg: "bg-green-50" }
            case "bmi":
                if (value < 18.5) return { status: "Underweight", color: "text-blue-600", bg: "bg-blue-50" }
                if (value > 25) return { status: "Overweight", color: "text-orange-600", bg: "bg-orange-50" }
                return { status: "Normal", color: "text-green-600", bg: "bg-green-50" }
            default:
                return { status: "Unknown", color: "text-gray-600", bg: "bg-gray-50" }
        }
    }, [])

    // Memoized chart data preparation
    const prepareStepsData = useMemo(() => {
        if (!data?.weeklySteps?.length) return []

        return data.weeklySteps.map((day: any) => ({
            day: day.dayName,
            steps: day.steps,
            date: day.date,
            isToday: day.isToday,
        }))
    }, [data?.weeklySteps])

    const prepareHydrationData = useMemo(() => {
        if (!data?.weeklyHydration?.length) return []

        return data.weeklyHydration.map((day: any) => ({
            day: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
            hydration: day.intake || 0,
            date: day.date,
            isToday: day.isToday,
        }))
    }, [data?.weeklyHydration])

    const prepareHeartRateData = useMemo(() => {
        const heartRateData = data?.weeklyHealthData?.heartRate?.filter((item: any) => item.value > 0) || []
        if (!heartRateData.length) return []

        return heartRateData.map((item: any) => ({
            day: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
            heartRate: item.value,
            date: item.date,
        }))
    }, [data?.weeklyHealthData?.heartRate])

    const prepareTemperatureData = useMemo(() => {
        const temperatureData = data?.weeklyHealthData?.temperature?.filter((item: any) => item.value > 0) || []
        if (!temperatureData.length) return []

        return temperatureData.map((item: any) => ({
            day: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
            temperature: item.value,
            date: item.date,
        }))
    }, [data?.weeklyHealthData?.temperature])

    // Custom tooltip component
    const CustomTooltip = useCallback(({ active, payload, label, unit, title }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg border border-slate-700">
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-slate-300 text-xs mb-2">{label}</p>
                    <p className="text-lg font-bold">
                        {payload[0].value.toLocaleString()} {unit}
                    </p>
                    {data.isToday && <p className="text-blue-400 text-xs mt-1">Today</p>}
                </div>
            )
        }
        return null
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="relative">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-blue-400 opacity-20"></div>
                        </div>
                        <h3 className="mt-6 text-lg font-semibold text-slate-900">Loading Patient Data</h3>
                        <p className="mt-2 text-sm text-slate-600">Retrieving secure medical records...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error || !data) {
        const isExpired = error && (error.includes("expired") || error.includes("Data has expired"))

        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-lg shadow-xl border-red-200">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            {isExpired ? (
                                <Clock className="h-8 w-8 text-red-600" />
                            ) : (
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            )}
                        </div>
                        <CardTitle className="text-red-700 text-xl">
                            {isExpired ? "Data Access Expired" : "Access Restricted"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <Alert className="border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700">
                                {error || "Patient data not found or access has expired."}
                            </AlertDescription>
                        </Alert>

                        {isExpired ? (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-600">
                                    The secure data link has expired for privacy protection. You can view sample data for demonstration
                                    purposes.
                                </p>
                                <Button
                                    onClick={() => {
                                        setUseMockData(true)
                                        setError(null)
                                        setLoading(true)
                                    }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <TestTube className="h-4 w-4 mr-2" />
                                    View Sample Data
                                </Button>
                                <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
                                    <Shield className="h-3 w-3" />
                                    <span>Sample data for demonstration only</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-600">Please contact the healthcare provider for a new access link.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    const bmi = data.height && data.weight ? Number.parseFloat((data.weight / (data.height / 100) ** 2).toFixed(1)) : null
    const bmiStatus = bmi ? getHealthStatus(bmi, "bmi") : null

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Mobile-Responsive Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Stethoscope className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-lg font-bold text-slate-900">NammaMedic - Doctor</h1>
                                    <p className="text-xs text-slate-500">Secure Medical Data</p>
                                </div>
                                <div className="sm:hidden">
                                    <h1 className="text-sm font-bold text-slate-900">NammaMedic</h1>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Mobile Data Source Toggle */}
                            <div className="hidden sm:flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                                <div className="flex items-center space-x-2">
                                    <Database className="h-4 w-4 text-slate-600" />
                                    <span className="text-sm font-medium text-slate-700">Real Data</span>
                                </div>
                                <Switch
                                    checked={useMockData}
                                    onCheckedChange={setUseMockData}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                                <div className="flex items-center space-x-2">
                                    <TestTube className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">Mock Data</span>
                                </div>
                            </div>

                            {/* Mobile Toggle */}
                            <div className="sm:hidden flex items-center space-x-2">
                                <Switch
                                    checked={useMockData}
                                    onCheckedChange={setUseMockData}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                                <TestTube className="h-4 w-4 text-blue-600" />
                            </div>

                            {/* Timer */}
                            {timeLeft !== null && timeLeft > 0 && !useMockData && (
                                <div
                                    className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg border text-xs sm:text-sm ${timeLeft <= 60
                                            ? "bg-red-50 border-red-200"
                                            : timeLeft <= 180
                                                ? "bg-yellow-50 border-yellow-200"
                                                : "bg-orange-50 border-orange-200"
                                        }`}
                                >
                                    <Clock
                                        className={`h-3 w-3 sm:h-4 sm:w-4 ${timeLeft <= 60 ? "text-red-600" : timeLeft <= 180 ? "text-yellow-600" : "text-orange-600"
                                            }`}
                                    />
                                    <span
                                        className={`font-mono font-semibold ${timeLeft <= 60 ? "text-red-700" : timeLeft <= 180 ? "text-yellow-700" : "text-orange-700"
                                            }`}
                                    >
                                        {formatTimeLeft(timeLeft)}
                                    </span>
                                    {timeLeft <= 60 && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setUseMockData(true)}
                                            className="ml-1 h-6 px-2 text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                        >
                                            <TestTube className="h-3 w-3 mr-1" />
                                            <span className="hidden sm:inline">Sample</span>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mock Data Notification Banner */}
            {useMockData && (
                <div className="bg-blue-50 border-b border-blue-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <Alert className="border-blue-200 bg-blue-50">
                            <TestTube className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-700 font-medium text-sm">
                                You are currently viewing sample data for demonstration purposes.
                                <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => setUseMockData(false)}
                                    className="ml-2 p-0 h-auto text-blue-600 hover:text-blue-800 underline text-sm"
                                >
                                    Switch back to real data
                                </Button>
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
                {/* Patient Overview - Mobile Responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Patient Info */}
                    <Card className="lg:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <CardTitle className="flex items-center space-x-2 text-slate-800 text-lg sm:text-xl">
                                    <UserCheck className="h-5 w-5 text-blue-600" />
                                    <span>Patient Information</span>
                                </CardTitle>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 w-fit">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Verified
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Full Name</label>
                                    <p className="text-base sm:text-lg font-semibold text-slate-900">
                                        {data.firstName} {data.lastName}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date of Birth</label>
                                    <p className="text-base sm:text-lg font-semibold text-slate-900">{data.dateOfBirth}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Age</label>
                                    <p className="text-base sm:text-lg font-semibold text-slate-900">{data.age} years</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Gender</label>
                                    <p className="text-base sm:text-lg font-semibold text-slate-900 capitalize">{data.gender}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Blood Type</label>
                                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 font-semibold">
                                        {data.bloodType || "Not specified"}
                                    </Badge>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Height</label>
                                    <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                                        {data.height} <span className="text-sm font-normal text-slate-600">cm</span>
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Weight</label>
                                    <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                                        {data.weight} <span className="text-sm font-normal text-slate-600">kg</span>
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${bmiStatus?.bg || "bg-slate-50"}`}>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">BMI</label>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-1">
                                        <p className="text-xl sm:text-2xl font-bold text-slate-900">{bmi || "N/A"}</p>
                                        {bmiStatus && (
                                            <Badge variant="outline" className={`${bmiStatus.color} border-current mt-1 sm:mt-0`}>
                                                {bmiStatus.status}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats - Mobile Responsive */}
                    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center space-x-2 text-slate-800 text-lg sm:text-xl">
                                <Activity className="h-5 w-5 text-green-600" />
                                <span>Health Summary</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 sm:space-y-4">
                            {data.healthSummary && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <Activity className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-900">Steps</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-base sm:text-lg font-bold text-blue-900">
                                                {Math.round((data.healthSummary.totalSteps || 0) / 7).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-blue-600">avg/day</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <Droplets className="h-4 w-4 text-cyan-600" />
                                            <span className="text-sm font-medium text-cyan-900">Hydration</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-base sm:text-lg font-bold text-cyan-900">
                                                {((data.healthSummary.totalHydration || 0) / 7).toFixed(1)}L
                                            </p>
                                            <p className="text-xs text-cyan-600">avg/day</p>
                                        </div>
                                    </div>
                                    {data.healthSummary.avgHeartRate && (
                                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <Heart className="h-4 w-4 text-red-600" />
                                                <span className="text-sm font-medium text-red-900">Heart Rate</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base sm:text-lg font-bold text-red-900">
                                                    {Math.round(data.healthSummary.avgHeartRate)}
                                                </p>
                                                <p className="text-xs text-red-600">BPM avg</p>
                                            </div>
                                        </div>
                                    )}
                                    {data.healthSummary.avgTemperature && data.healthSummary.avgTemperature > 0 && (
                                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <Thermometer className="h-4 w-4 text-purple-600" />
                                                <span className="text-sm font-medium text-purple-900">Temperature</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base sm:text-lg font-bold text-purple-900">
                                                    {data.healthSummary.avgTemperature.toFixed(1)}°C
                                                </p>
                                                <p className="text-xs text-purple-600">avg</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Medical Information - Mobile Responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Medical Conditions & Allergies */}
                    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-slate-800 text-lg sm:text-xl">
                                <Clipboard className="h-5 w-5 text-orange-600" />
                                <span>Medical History</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6">
                            {data.allergies && data.allergies.length > 0 && (
                                <div>
                                    <div className="flex items-center space-x-2 mb-3">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        <label className="text-sm font-semibold text-red-700 uppercase tracking-wide">
                                            Allergies ({data.allergies.length})
                                        </label>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {data.allergies.map((allergy: string, i: number) => (
                                            <Badge key={i} variant="destructive" className="text-xs font-medium">
                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                {allergy}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data.medicalConditions && data.medicalConditions.length > 0 && (
                                <div>
                                    <div className="flex items-center space-x-2 mb-3">
                                        <Heart className="h-4 w-4 text-orange-500" />
                                        <label className="text-sm font-semibold text-orange-700 uppercase tracking-wide">
                                            Medical Conditions ({data.medicalConditions.length})
                                        </label>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {data.medicalConditions.map((condition: string, i: number) => (
                                            <Badge
                                                key={i}
                                                variant="secondary"
                                                className="text-xs font-medium bg-orange-100 text-orange-800 border-orange-200"
                                            >
                                                {condition}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {(!data.allergies || data.allergies.length === 0) &&
                                (!data.medicalConditions || data.medicalConditions.length === 0) && (
                                    <div className="text-center py-6 sm:py-8">
                                        <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto mb-3" />
                                        <p className="text-sm text-slate-600">No known allergies or medical conditions</p>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {/* Emergency Contact - Mobile Responsive */}
                    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-slate-800 text-lg sm:text-xl">
                                <Phone className="h-5 w-5 text-red-600" />
                                <span>Emergency Contact</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {data.emergencyContact ? (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
                                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-red-900 text-base sm:text-lg">{data.emergencyContact.name}</h4>
                                            {data.emergencyContact.relationship && (
                                                <p className="text-red-700 text-sm font-medium">{data.emergencyContact.relationship}</p>
                                            )}
                                            {data.emergencyContact.phone && (
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <Phone className="h-4 w-4 text-red-600" />
                                                    <span className="text-red-800 font-medium">{data.emergencyContact.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                        <Badge variant="destructive" className="ml-0 sm:ml-4 w-fit">
                                            Emergency Only
                                        </Badge>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 sm:py-8">
                                    <Phone className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 mx-auto mb-3" />
                                    <p className="text-sm text-slate-600">No emergency contact information available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Daily Activity Overview - Mobile Responsive */}
                {data.weeklySteps && data.weeklySteps.length > 0 && (
                    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-slate-800 text-lg sm:text-xl">
                                <Calendar className="h-5 w-5 text-green-600" />
                                <span>Weekly Activity Overview</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                                {data.weeklySteps.map((day: any, index: number) => {
                                    const hydrationDay = data.weeklyHydration?.[index]
                                    const isToday = day.isToday
                                    const stepGoal = 10000
                                    const stepProgress = Math.min((day.steps / stepGoal) * 100, 100)
                                    return (
                                        <div
                                            key={day.date}
                                            className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${isToday
                                                    ? "bg-blue-50 border-blue-300 shadow-md"
                                                    : "bg-white border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            <div className="text-center space-y-2 sm:space-y-3">
                                                <div>
                                                    <h4
                                                        className={`font-bold text-xs sm:text-sm ${isToday ? "text-blue-700" : "text-slate-700"}`}
                                                    >
                                                        {day.dayName}
                                                    </h4>
                                                    {isToday && (
                                                        <Badge variant="outline" className="text-xs mt-1 bg-blue-100 text-blue-700 border-blue-300">
                                                            Today
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mx-auto mb-1" />
                                                        <p className="text-sm sm:text-lg font-bold text-blue-600">{day.steps.toLocaleString()}</p>
                                                        <Progress value={stepProgress} className="h-1.5 sm:h-2 mt-1" />
                                                        <p className="text-xs text-slate-500 mt-1">{Math.round(stepProgress)}% of goal</p>
                                                    </div>
                                                    <div>
                                                        <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-600 mx-auto mb-1" />
                                                        <p className="text-xs sm:text-sm font-bold text-cyan-600">{hydrationDay?.intake || 0}L</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Clinical Analytics - Mobile Responsive Charts */}
                <div className="space-y-4 sm:space-y-6">
                    <div className="text-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Clinical Analytics & Trends</h2>
                        <p className="text-sm sm:text-base text-slate-600">Essential health metrics for medical assessment</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Daily Steps Chart - Mobile Responsive */}
                        {prepareStepsData.length > 0 && (
                            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-slate-800 text-base sm:text-lg">
                                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                        <span>Daily Steps Analysis</span>
                                    </CardTitle>
                                    <p className="text-xs sm:text-sm text-slate-600">Physical activity tracking throughout the week</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 sm:h-80 mb-4">
                                        <Bar
                                            data={getBarChartData(
                                                prepareStepsData.map((d: any) => d.day),
                                                prepareStepsData.map((d: any) => d.steps),
                                                'Daily Steps',
                                                '#3b82f6'
                                            )}
                                            options={getChartOptions(
                                                'Daily Steps Analysis',
                                                'Steps',
                                                0,
                                                Math.max(...prepareStepsData.map((d: any) => d.steps)) + 2000
                                            )}
                                        />
                                    </div>
                                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
                                        <p className="text-xs sm:text-sm text-blue-600 font-medium">Weekly Total</p>
                                        <p className="text-lg sm:text-xl font-bold text-blue-800">
                                            {data.weeklySteps.reduce((a: number, b: any) => a + b.steps, 0).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-blue-600">
                                            Avg:{" "}
                                            {Math.round(data.weeklySteps.reduce((a: number, b: any) => a + b.steps, 0) / 7).toLocaleString()}
                                            /day
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Hydration Chart - Mobile Responsive */}
                        {prepareHydrationData.length > 0 && (
                            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-slate-800 text-base sm:text-lg">
                                        <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
                                        <span>Hydration Tracking</span>
                                    </CardTitle>
                                    <p className="text-xs sm:text-sm text-slate-600">Daily water intake monitoring</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 sm:h-80 mb-4">
                                        <Line
                                            data={getLineChartData(
                                                prepareHydrationData.map((d: any) => d.day),
                                                prepareHydrationData.map((d: any) => d.hydration),
                                                'Hydration',
                                                '#06b6d4'
                                            )}
                                            options={getChartOptions(
                                                'Hydration Tracking',
                                                'Liters (L)',
                                                0,
                                                Math.max(...prepareHydrationData.map((d: any) => d.hydration)) + 0.5
                                            )}
                                        />
                                    </div>
                                    <div className="bg-cyan-50 p-3 sm:p-4 rounded-lg text-center">
                                        <p className="text-xs sm:text-sm text-cyan-600 font-medium">Weekly Total</p>
                                        <p className="text-lg sm:text-xl font-bold text-cyan-800">
                                            {(data.weeklyHydration?.reduce((a: number, b: any) => a + (b.intake || 0), 0) || 0).toFixed(1)}L
                                        </p>
                                        <p className="text-xs text-cyan-600">
                                            Avg:{" "}
                                            {((data.weeklyHydration?.reduce((a: number, b: any) => a + (b.intake || 0), 0) || 0) / 7).toFixed(
                                                1,
                                            )}
                                            L/day
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Heart Rate Chart - Mobile Responsive */}
                        {prepareHeartRateData.length > 0 && (
                            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-slate-800 text-base sm:text-lg">
                                        <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                                        <span>Heart Rate Monitoring</span>
                                    </CardTitle>
                                    <p className="text-xs sm:text-sm text-slate-600">Cardiovascular health tracking</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 sm:h-80 mb-4">
                                        <Line
                                            data={getLineChartData(
                                                prepareHeartRateData.map((d: any) => d.day),
                                                prepareHeartRateData.map((d: any) => d.heartRate),
                                                'Heart Rate',
                                                '#dc2626'
                                            )}
                                            options={getChartOptions(
                                                'Heart Rate Monitoring',
                                                'BPM',
                                                Math.min(...prepareHeartRateData.map((d: any) => d.heartRate)) - 10,
                                                Math.max(...prepareHeartRateData.map((d: any) => d.heartRate)) + 10
                                            )}
                                        />
                                    </div>
                                    <div className="bg-red-50 p-3 sm:p-4 rounded-lg text-center">
                                        <p className="text-xs sm:text-sm text-red-600 font-medium">Average</p>
                                        <p className="text-lg sm:text-xl font-bold text-red-800">
                                            {data?.healthSummary?.avgHeartRate ? Math.round(data.healthSummary.avgHeartRate) : "N/A"} BPM
                                        </p>
                                        <p className="text-xs text-red-600">
                                            {data?.healthSummary?.avgHeartRate &&
                                                data.healthSummary.avgHeartRate >= 60 &&
                                                data.healthSummary.avgHeartRate <= 100
                                                ? "Normal Range"
                                                : "Review Required"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Temperature Chart - Mobile Responsive */}
                        {prepareTemperatureData.length > 0 && (
                            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-slate-800 text-base sm:text-lg">
                                        <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                                        <span>Body Temperature</span>
                                    </CardTitle>
                                    <p className="text-xs sm:text-sm text-slate-600">Body temperature monitoring</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 sm:h-80 mb-4">
                                        <Line
                                            data={getLineChartData(
                                                prepareTemperatureData.map((d: any) => d.day),
                                                prepareTemperatureData.map((d: any) => d.temperature),
                                                'Temperature',
                                                '#7c3aed'
                                            )}
                                            options={getChartOptions(
                                                'Body Temperature Monitoring',
                                                'Temperature (°C)',
                                                Math.min(...prepareTemperatureData.map((d: any) => d.temperature)) - 0.5,
                                                Math.max(...prepareTemperatureData.map((d: any) => d.temperature)) + 0.5
                                            )}
                                        />
                                    </div>
                                    <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
                                        <p className="text-xs sm:text-sm text-purple-600 font-medium">Average</p>
                                        <p className="text-lg sm:text-xl font-bold text-purple-800">
                                            {data?.healthSummary?.avgTemperature ? data.healthSummary.avgTemperature.toFixed(1) : "N/A"}°C
                                        </p>
                                        <p className="text-xs text-purple-600">
                                            {data?.healthSummary?.avgTemperature &&
                                                data.healthSummary.avgTemperature >= 36.1 &&
                                                data.healthSummary.avgTemperature <= 37.2
                                                ? "Normal Range"
                                                : "Abnormal"}
                                        </p>
                                    </div>
                                    {/* Clinical Alerts */}
                                    <div className="mt-4 space-y-2">
                                        {data?.weeklyHealthData?.temperature?.some((item: any) => item.value > 37.5) && (
                                            <Alert className="border-red-200 bg-red-50">
                                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                                <AlertDescription className="text-red-700 font-medium text-sm">
                                                    Fever episodes detected - requires medical attention
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        {data?.healthSummary?.avgHeartRate &&
                                            (data.healthSummary.avgHeartRate < 60 || data.healthSummary.avgHeartRate > 100) && (
                                                <Alert className="border-orange-200 bg-orange-50">
                                                    <Heart className="h-4 w-4 text-orange-600" />
                                                    <AlertDescription className="text-orange-700 font-medium text-sm">
                                                        Heart rate outside normal range - monitor closely
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Clinical Summary - Mobile Responsive */}
                    <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-blue-700 text-base sm:text-lg">
                                <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span>Clinical Summary & Recommendations</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-white p-3 sm:p-4 rounded-lg border border-blue-200 shadow-sm">
                                    <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Activity Level</h4>
                                    <div className="flex items-center space-x-2">
                                        <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                        <span className="text-xs sm:text-sm text-blue-700">
                                            {data?.weeklySteps
                                                ? data.weeklySteps.reduce((a: number, b: any) => a + b.steps, 0) / 7 >= 8000
                                                    ? "Active"
                                                    : "Low Activity"
                                                : "No Data"}
                                        </span>
                                    </div>
                                    {data?.weeklySteps && data.weeklySteps.reduce((a: number, b: any) => a + b.steps, 0) / 7 < 8000 && (
                                        <p className="text-xs text-blue-600 mt-1">Recommend increasing daily activity</p>
                                    )}
                                </div>
                                <div className="bg-white p-3 sm:p-4 rounded-lg border border-green-200 shadow-sm">
                                    <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Hydration Status</h4>
                                    <div className="flex items-center space-x-2">
                                        <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                        <span className="text-xs sm:text-sm text-green-700">
                                            {data?.weeklyHydration
                                                ? data.weeklyHydration.reduce((a: number, b: any) => a + (b.intake || 0), 0) / 7 >= 2
                                                    ? "Adequate"
                                                    : "Inadequate"
                                                : "No Data"}
                                        </span>
                                    </div>
                                    {data?.weeklyHydration &&
                                        data.weeklyHydration.reduce((a: number, b: any) => a + (b.intake || 0), 0) / 7 < 2 && (
                                            <p className="text-xs text-green-600 mt-1">Recommend increasing fluid intake</p>
                                        )}
                                </div>
                                <div className="bg-white p-3 sm:p-4 rounded-lg border border-red-200 shadow-sm">
                                    <h4 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">Health Alerts</h4>
                                    <div className="flex items-center space-x-2">
                                        <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                                        <span className="text-xs sm:text-sm text-red-700">
                                            {(data?.allergies?.length || 0) + (data?.medicalConditions?.length || 0)} Conditions
                                        </span>
                                    </div>
                                    <p className="text-xs text-red-600 mt-1">Review medical history before treatment</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Security Footer - Mobile Responsive */}
                <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-50 to-blue-50 border-t-4 border-t-blue-500">
                    <CardContent className="py-4 sm:py-6">
                        <div className="text-center space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-center space-x-2 text-blue-700">
                                <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                                <span className="font-bold text-base sm:text-lg">Secure Medical Data Sharing</span>
                            </div>
                            <p className="text-xs sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
                                This medical data is securely shared with end-to-end encryption and automatically expires after 5
                                minutes to ensure patient privacy and HIPAA compliance. All access is logged and monitored.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500">
                                <div className="flex items-center space-x-2">
                                    <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>256-bit Encryption</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>Auto-Expire</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>HIPAA Compliant</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>Audit Logged</span>
                                </div>
                            </div>
                            <div className="bg-white p-3 sm:p-4 rounded-lg border inline-block shadow-sm">
                                <p className="text-xs text-slate-500 mb-2 font-medium">Secure Share ID</p>
                                <code className="bg-slate-100 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-mono text-slate-700 border break-all">
                                    {shareId}
                                </code>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
