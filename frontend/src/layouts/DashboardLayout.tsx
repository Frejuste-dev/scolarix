import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    CalendarCheck,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react";

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Mock navigation - real world would filter by role
    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: Users, label: "Utilisateurs", href: "/dashboard/users" },
        { icon: BookOpen, label: "Classes & Matières", href: "/dashboard/classes" },
        { icon: CalendarCheck, label: "Présences", href: "/dashboard/attendance" },
        { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
    ];

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
                    !isSidebarOpen && "md:w-20", // Collapsed state for desktop
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100">
                    <div className={cn("font-bold text-xl text-primary flex items-center gap-2", !isSidebarOpen && "md:hidden")}>
                        {/* Logo placeholder */}
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">S</div>
                        <span>SCOLARIX</span>
                    </div>
                    {/* Logo icon only when collapsed */}
                    <div className={cn("hidden w-full justify-center", !isSidebarOpen && "md:flex")}>
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">S</div>
                    </div>

                    <button onClick={toggleSidebar} className="md:hidden">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            end={item.href === "/dashboard"}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                !isSidebarOpen && "md:justify-center md:px-0"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", !isSidebarOpen && "md:w-6 md:h-6")} />
                            <span className={cn("whitespace-nowrap", !isSidebarOpen && "md:hidden")}>
                                {item.label}
                            </span>

                            {/* Tooltip for collapsed state */}
                            {!isSidebarOpen && (
                                <div className="absolute left-16 hidden md:group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap">
                                    {item.label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-4 left-0 w-full px-4">
                    <button className={cn(
                        "flex items-center gap-3 w-full px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-md transition-colors",
                        !isSidebarOpen && "md:justify-center md:px-0"
                    )}>
                        <LogOut className="w-5 h-5" />
                        <span className={cn(!isSidebarOpen && "md:hidden")}>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-md text-gray-600">
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">Admin User</p>
                            <p className="text-xs text-gray-500">Administrateur</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                            {/* Avatar placeholder */}
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
