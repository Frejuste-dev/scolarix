import { useState, useEffect } from "react";
import { classService, type Filiere, type ClassEntity } from "@/services/classService";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Plus, Trash2, BookOpen, Layers } from "lucide-react";

export default function ClassesList() {
    const [activeTab, setActiveTab] = useState<'CLASSES' | 'FILIERES'>('CLASSES');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Structure Académique</h2>
                    <p className="text-gray-500">Gérez les filières et les classes pour l'année en cours.</p>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 w-fit">
                <button
                    onClick={() => setActiveTab('CLASSES')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'CLASSES' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    <BookOpen className="w-4 h-4" /> Classes
                </button>
                <button
                    onClick={() => setActiveTab('FILIERES')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'FILIERES' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    <Layers className="w-4 h-4" /> Filières
                </button>
            </div>

            {activeTab === 'CLASSES' ? <ClassesManager /> : <FilieresManager />}
        </div>
    );
}

function ClassesManager() {
    const [classes, setClasses] = useState<ClassEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        setIsLoading(true);
        const data = await classService.getClasses();
        setClasses(data);
        setIsLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Supprimer cette classe ?")) {
            await classService.deleteClass(id);
            loadClasses();
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Liste des Classes</CardTitle>
                <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Nouvelle Classe</Button>
            </CardHeader>
            <CardContent>
                {isLoading ? <p>Chargement...</p> : (
                    <div className="space-y-2">
                        {classes.map((cls) => (
                            <div key={cls.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                        {cls.name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{cls.name}</h4>
                                        <p className="text-sm text-gray-500">{cls.filiere?.name} • {cls.level}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cls.id)}>
                                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function FilieresManager() {
    const [filieres, setFilieres] = useState<Filiere[]>([]);

    useEffect(() => {
        classService.getFilieres().then(setFilieres);
    }, []);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Filières & Niveaux</CardTitle>
                <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2" /> Ajouter Filière</Button>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    {filieres.map(f => (
                        <div key={f.id} className="p-4 border rounded-lg bg-gray-50">
                            <h3 className="font-bold text-lg">{f.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{f.description}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
