import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";

// Pages
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import OnboardingPage from "@/pages/OnboardingPage";

import DashboardPage from "@/pages/dashboard/DashboardPage";
import ChildrenPage from "@/pages/dashboard/ChildrenPage";
import FosterFamiliesPage from "@/pages/dashboard/FosterFamiliesPage";
import CasesPage from "@/pages/dashboard/CasesPage";
import DocumentsPage from "@/pages/dashboard/DocumentsPage";
import AiAssistantPage from "@/pages/dashboard/AiAssistantPage";
import SmartMatchingPage from "@/pages/dashboard/SmartMatchingPage";
import RiskDetectionPage from "@/pages/dashboard/RiskDetectionPage";
import CommunicationsPage from "@/pages/dashboard/CommunicationsPage";
import ReportsPage from "@/pages/dashboard/ReportsPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import NotificationsPage from "@/pages/dashboard/NotificationsPage";
import UsersPage from "@/pages/dashboard/UsersPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import GuardianPortalPage from "@/pages/dashboard/GuardianPortal";
import CalendarPage from "@/pages/dashboard/CalendarPage";
import BehaviourPage from "@/pages/dashboard/BehaviourLogs";
import StaffManagemnetPage from "@/pages/dashboard/StaffManagement";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>

                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/dashboard/children" element={<ChildrenPage />} />
                    <Route path="/dashboard/foster-families" element={<FosterFamiliesPage />} />
                    <Route path="/dashboard/guardian-portal" element={<GuardianPortalPage />} />
                    <Route path="/dashboard/cases" element={<CasesPage />} />
                    <Route path="/dashboard/documents" element={<DocumentsPage />} />
                    <Route path="/dashboard/ai-assistant" element={<AiAssistantPage />} />
                    <Route path="/dashboard/smart-matching" element={<SmartMatchingPage />} />
                    <Route path="/dashboard/risk-detection" element={<RiskDetectionPage />} />
                    <Route path="/dashboard/communications" element={<CommunicationsPage />} />
                    <Route path="/dashboard/reports" element={<ReportsPage />} />
                    <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
                    <Route path="/dashboard/notifications" element={<NotificationsPage />} />
                    <Route path="/dashboard/calendar" element={<CalendarPage />} />
                    <Route path="/dashboard/behaviour-logs" element={<BehaviourPage />} />
                    <Route path="/dashboard/staff-management" element={<StaffManagemnetPage />} />
                    <Route path="/dashboard/users" element={<UsersPage />} />
                    <Route path="/dashboard/settings" element={<SettingsPage />} />

                </Route>
            </Route>

            {/* Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}