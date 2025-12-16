import { useState, useEffect } from "react";
import { evaluationService, type Evaluation } from "@/services/evaluationService";
import { classService, type ClassEntity } from "@/services/classService";
import { periodService, type AcademicPeriod } from "@/services/periodService";
import { subjectService, type ClassSubject } from "@/services/subjectService";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Plus, FileText, Calendar, GraduationCap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function EvaluationsList() {
    const { user } = useAuth();

    // Filters
    const [periods, setPeriods] = useState<AcademicPeriod[]>([]);
    const [classes, setClasses] = useState<ClassEntity[]>([]);
    const [subjects, setSubjects] = useState<ClassSubject[]>([]);

    const [selectedPeriod, setSelectedPeriod] = useState<string>("");
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedSubject, setSelectedSubject] = useState<string>("");

    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load Filters
    useEffect(() => {
        async function loadData() {
            const [periodsData, classesData] = await Promise.all([
                periodService.getPeriods(),
                classService.getClasses() // In real app, filter classes by teacher if role is teacher
            ]);
            setPeriods(periodsData);
            setClasses(classesData);
            if (periodsData.length > 0) setSelectedPeriod(periodsData.find(p => p.is_active)?.id.toString() || periodsData[0].id.toString());
            if (classesData.length > 0) setSelectedClass(classesData[0].id.toString());
        }
        loadData();
    }, []);

    // Load Subjects when class changes
    useEffect(() => {
        if (selectedClass) {
            subjectService.getClassSubjects(parseInt(selectedClass)).then(data => {
                setSubjects(data);
                if (data.length > 0) setSelectedSubject(data[0].subject_id.toString());
                else setSelectedSubject("");
            });
        }
    }, [selectedClass]);

    // Load Evaluations
    useEffect(() => {
        if (selectedPeriod && selectedClass && selectedSubject) {
            loadEvaluations();
        }
    }, [selectedPeriod, selectedClass, selectedSubject]);

    const loadEvaluations = async () => {
        setIsLoading(true);
        // In real implementation, these dropdowns map to IDs
        const data = await evaluationService.getEvaluations(
            parseInt(selectedClass),
            parseInt(selectedSubject),
            parseInt(selectedPeriod)
        );
        setEvaluations(data);
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Évaluations</h2>
                    <p className="text-gray-500">Gérez les contrôles, examens et saisissez les notes.</p>
                </div>
                <Button><Plus className="w-4 h-4 mr-2" /> Nouvelle Évaluation</Button>
            </div>

            {/* Filters Bar */}
            <div className="p-4 bg-white rounded-lg border shadow-sm flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium text-gray-700 block mb-1">Période</label>
                    <select
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                        {periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium text-gray-700 block mb-1">Classe</label>
                    <select
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="text-sm font-medium text-gray-700 block mb-1">Matière</label>
                    <select
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                        {subjects.length === 0 && <option value="">Aucune matière</option>}
                        {subjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subject?.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Evaluations Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? <p>Chargement...</p> : evaluations.length === 0 ? (
                    <p className="text-gray-500 col-span-3 text-center py-8">Aucune évaluation trouvée pour cette sélection.</p>
                ) : (
                    evaluations.map((evalItem) => (
                        <Card key={evalItem.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-500" />
                                        {evalItem.type}
                                    </CardTitle>
                                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                        / {evalItem.max_score}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h4 className="font-semibold">{evalItem.title || "Sans titre"}</h4>
                                <div className="flex items-center text-sm text-gray-600 mt-2">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{evalItem.date}</span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Button size="sm" variant="outline" className="w-full">
                                        <GraduationCap className="w-4 h-4 mr-2" /> Notes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
