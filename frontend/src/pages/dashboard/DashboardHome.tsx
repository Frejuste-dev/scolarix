import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, GraduationCap, BookOpen, TrendingUp, Calendar, CheckCircle, Clock } from "lucide-react";

// Mock Role - change to "TEACHER" or "STUDENT" to test views
const CURRENT_ROLE = "ADMIN";

export default function DashboardHome() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Tableau de bord</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline">Télécharger rapport</Button>
                    <Button>Nouvelle action</Button>
                </div>
            </div>

            {CURRENT_ROLE === "ADMIN" && <AdminDashboard />}
            {CURRENT_ROLE === "TEACHER" && <TeacherDashboard />}
            {CURRENT_ROLE === "STUDENT" && <StudentDashboard />}
        </div>
    );
}

function AdminDashboard() {
    const stats = [
        { title: "Étudiants", value: "1,234", icon: Users, change: "+12%", desc: "vs mois dernier" },
        { title: "Enseignants", value: "56", icon: GraduationCap, change: "+2", desc: "nouveaux recrutés" },
        { title: "Classes", value: "32", icon: BookOpen, change: "Stable", desc: "actives cette année" },
        { title: "Taux de présence", value: "94.2%", icon: TrendingUp, change: "+4.1%", desc: "moyenne globale" },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-green-600 font-medium">{stat.change}</span> {stat.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Aperçu des Inscriptions</CardTitle>
                        <CardDescription>Nombre d'élèves par niveau</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2 h-[300px] flex items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-200 m-4">
                        <p className="text-gray-400 italic">Graphique d'inscription (Chart.js / Recharts placeholder)</p>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Activités Récentes</CardTitle>
                        <CardDescription>Dernières actions sur la plateforme</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">Nouveau cours ajouté</p>
                                        <p className="text-xs text-muted-foreground">Il y a 2 heures par Mr. Professeur</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function TeacherDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-primary text-white border-none shadow-lg bg-gradient-to-br from-primary to-blue-700">
                    <CardHeader>
                        <CardTitle>Prochain Cours</CardTitle>
                        <CardDescription className="text-blue-100">Démarre dans 15 min</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Mathématiques - 6ème A</div>
                        <div className="mt-4 flex gap-2">
                            <Button variant="secondary" size="sm" className="w-full">Faire l'appel</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Copies à corriger</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">12</div>
                        <p className="text-sm text-gray-500">Devoir de Géométrie (5ème B)</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StudentDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader><CardTitle>Moyenne Générale</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">15.4/20</div>
                        <p className="text-sm text-green-600">+0.5 vs trimestre dernier</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
