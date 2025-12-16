import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { User as UserIcon, Mail, Phone, MapPin, Calendar, Save } from "lucide-react";

export default function Profile() {
    const { user, login } = useAuth(); // login used to update context if needed, or we might need a refreshUser function
    const [formData, setFormData] = useState({
        phone: user?.phone || '',
        address: user?.address || '',
    });
    const [isSaving, setIsSaving] = useState(false);

    if (!user) return <p>Non connecté.</p>;

    const handleSave = async () => {
        setIsSaving(true);
        // Update user in backend
        const updated = await userService.updateUser(user.id, formData);
        // In a real app, we'd update the AuthContext state here too
        alert("Profil mis à jour !");
        setIsSaving(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Mon Profil</h2>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden mb-4">
                            {user.photo_url ? (
                                <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-16 h-16 text-gray-400" />
                            )}
                        </div>
                        <h3 className="text-xl font-bold">{user.first_name} {user.last_name}</h3>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1 mb-4">
                            {user.role}
                        </span>
                    </CardContent>
                </Card>

                {/* Details Form */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Informations Personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <div className="flex items-center mt-1 p-2 bg-gray-50 rounded border text-gray-500">
                                    <Mail className="w-4 h-4 mr-2" /> {user.email}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Date de naissance</label>
                                <div className="flex items-center mt-1 p-2 bg-gray-50 rounded border text-gray-500">
                                    <Calendar className="w-4 h-4 mr-2" /> {user.birthdate || 'Non renseignée'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Téléphone</label>
                                <div className="relative mt-1">
                                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        className="pl-9"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Adresse</label>
                                <div className="relative mt-1">
                                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        className="pl-9"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button onClick={handleSave} disabled={isSaving}>
                                <Save className="w-4 h-4 mr-2" /> Enregistrer les modifications
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
