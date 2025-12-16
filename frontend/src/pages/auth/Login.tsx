import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth(); // Use AuthContext

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(email, password);
            // Navigation handled by auth service success usually, but explicitly here:
            navigate("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Email ou mot de passe incorrect. Essayez 'admin@scolarix.com' / 'password'");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
            {/* Left Side - Visuals */}
            <div className="hidden md:flex flex-col justify-center items-center bg-primary text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1600x900/?school,university')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80"></div>

                <div className="relative z-10 max-w-lg text-center">
                    <img src="/logo.png" alt="SCOLARIX Logo" className="w-32 h-32 mx-auto mb-8 rounded-2xl shadow-2xl" />
                    <h1 className="text-4xl font-bold mb-4">Bienvenue sur SCOLARIX</h1>
                    <p className="text-lg text-blue-100">
                        La plateforme de gestion scolaire nouvelle génération.
                        Pilotez, apprenez et réussissez avec SCOLARIX.
                    </p>
                </div>

                <div className="absolute bottom-8 text-sm text-blue-200">
                    © {new Date().getFullYear()} SCOLARIX Enterprise. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div className="text-center mb-10 md:hidden">
                        <img src="/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-4 rounded-xl" />
                        <h2 className="text-2xl font-bold text-gray-900">SCOLARIX</h2>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h2>
                        <p className="text-gray-500 text-sm">Entrez vos identifiants pour accéder à votre espace.</p>
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nom@exemple.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none" htmlFor="password">
                                    Mot de passe
                                </label>
                                <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                                    Oublié ?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" size="lg" className="w-full text-base shadow-md" disabled={isLoading}>
                            {isLoading ? "Connexion..." : "Se connecter"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Pas encore de compte ? {" "}
                        <Link to="/register" className="font-medium text-primary hover:underline">
                            Contactez l'administration
                        </Link>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
                        <p>Comptes démo : admin@scolarix.com / teacher... / student...</p>
                        <p>Mot de passe : password</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
