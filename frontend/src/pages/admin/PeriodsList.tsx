import { useState, useEffect } from "react";
import { periodService, type AcademicPeriod } from "@/services/periodService";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Plus, Calendar, CheckCircle, Circle } from "lucide-react";

export default function PeriodsList() {
    const [periods, setPeriods] = useState<AcademicPeriod[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPeriods();
    }, []);

    const loadPeriods = async () => {
        setIsLoading(true);
        const data = await periodService.getPeriods();
        setPeriods(data);
        setIsLoading(false);
    };

    const toggleActive = async (period: AcademicPeriod) => {
        // In a real app, logic might ensure only one period is active at a time
        await periodService.updatePeriod(period.id, { is_active: !period.is_active });
        loadPeriods();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Périodes Académiques</h2>
                    <p className="text-gray-500">Définissez les trimestres ou semestres pour l'année.</p>
                </div>
                <Button><Plus className="w-4 h-4 mr-2" /> Nouvelle Période</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? <p>Chargement...</p> : periods.map((period) => (
                    <Card key={period.id} className={`border-l-4 ${period.is_active ? 'border-l-green-500 shadow-md' : 'border-l-gray-300'}`}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{period.name}</CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => toggleActive(period)}>
                                    {period.is_active ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{period.start_date} - {period.end_date}</span>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <span className={`text-xs px-2 py-1 rounded-full ${period.is_active ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>
                                    {period.is_active ? 'EN COURS' : 'INACTIF'}
                                </span>
                                <p className="text-xs text-gray-400">Année 2024-2025</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
