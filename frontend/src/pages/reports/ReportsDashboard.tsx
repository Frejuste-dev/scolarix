import { useState, useEffect } from "react";
import { reportService, type StudentReport } from "@/services/reportService";
import { classService, type ClassEntity } from "@/services/classService";
import { periodService, type AcademicPeriod } from "@/services/periodService";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Printer } from "lucide-react";

export default function ReportsDashboard() {
    const [classes, setClasses] = useState<ClassEntity[]>([]);
    const [periods, setPeriods] = useState<AcademicPeriod[]>([]);

    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedPeriod, setSelectedPeriod] = useState<string>("");

    const [reports, setReports] = useState<StudentReport[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        Promise.all([classService.getClasses(), periodService.getPeriods()]).then(([cls, per]) => {
            setClasses(cls);
            setPeriods(per);
            if (cls.length > 0) setSelectedClass(cls[0].id.toString());
            if (per.length > 0) setSelectedPeriod(per.find(p => p.is_active)?.id.toString() || per[0].id.toString());
        });
    }, []);

    const handleGenerate = async () => {
        if (!selectedClass || !selectedPeriod) return;
        setIsLoading(true);
        const data = await reportService.getClassReports(parseInt(selectedClass), parseInt(selectedPeriod));
        setReports(data);
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Bulletins & Rapports</h2>
                    <p className="text-gray-500">Générez les bulletins de notes par période.</p>
                </div>
            </div>

            <div className="flex gap-4 items-end bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Classe</label>
                    <select className="w-full border p-2 rounded" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Période</label>
                    <select className="w-full border p-2 rounded" value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}>
                        {periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <Button onClick={handleGenerate} disabled={isLoading}>
                    {isLoading ? "Génération..." : "Générer les bulletins"}
                </Button>
            </div>

            <div className="grid gap-6">
                {reports.length > 0 && reports.map((report) => (
                    <Card key={report.student.id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50 border-b flex flex-row justify-between items-center">
                            <div>
                                <CardTitle>{report.student.first_name} {report.student.last_name}</CardTitle>
                                <p className="text-sm text-gray-500">Moyenne Générale: <span className="font-bold text-primary text-lg">{report.global_average.toFixed(2)}/20</span></p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2" /> Imprimer</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-gray-600">
                                    <tr>
                                        <th className="p-3 text-left">Matière</th>
                                        <th className="p-3 text-center">Coeff</th>
                                        <th className="p-3 text-center">Moyenne</th>
                                        <th className="p-3 text-center">Rang</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {report.subject_grades.map((grade, idx) => (
                                        <tr key={idx}>
                                            <td className="p-3 font-medium">{grade.subject.name}</td>
                                            <td className="p-3 text-center">{grade.subject.coefficient}</td>
                                            <td className="p-3 text-center font-bold">{grade.average.toFixed(2)}</td>
                                            <td className="p-3 text-center text-gray-500">{grade.rank ?? '-'}e</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="p-4 bg-gray-50 border-t flex gap-6 text-sm">
                                <span>Présences: {report.class_presences}</span>
                                <span className="text-red-600">Absences: {report.class_absences}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {!isLoading && reports.length === 0 && (
                    <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-lg">
                        Sélectionnez une classe et une période pour voir les bulletins.
                    </div>
                )}
            </div>
        </div>
    );
}
