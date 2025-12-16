import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import UsersList from "@/pages/admin/UsersList";
import ClassesList from "@/pages/admin/ClassesList";
import PeriodsList from "@/pages/admin/PeriodsList";
import EvaluationsList from "@/pages/admin/EvaluationsList";
import AttendanceManager from "@/pages/admin/AttendanceManager";
import ReportsDashboard from "@/pages/reports/ReportsDashboard";
import Profile from "@/pages/shared/Profile";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        element: <ProtectedRoute />, // Protect all dashboard routes
        children: [
            {
                path: "/dashboard",
                element: <DashboardLayout />,
                children: [
                    {
                        path: "",
                        element: <DashboardHome />,
                    },
                    {
                        path: "users",
                        element: <UsersList />,
                    },
                    {
                        path: "classes",
                        element: <ClassesList />,
                    },
                    {
                        path: "periods",
                        element: <PeriodsList />,
                    },
                    {
                        path: "evaluations",
                        element: <EvaluationsList />,
                    },
                    {
                        path: "attendance",
                        element: <AttendanceManager />,
                    },
                    {
                        path: "reports",
                        element: <ReportsDashboard />,
                    },
                    {
                        path: "profile",
                        element: <Profile />,
                    },
                ],
            },
        ],
    },
]);
