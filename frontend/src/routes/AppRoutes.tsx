import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";

// Public
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import OnboardingPage from "@/pages/OnboardingPage";
import SelectCareTypePage from "@/pages/select-care-type/Index";

// ================= FOSTER =================
import FosterDashboard from "@/pages/foster/dashboard/DashboardPage";
import ChildrenPage from "@/pages/foster/dashboard/ChildrenPage";
import FosterFamiliesPage from "@/pages/foster/dashboard/FosterFamiliesPage";
import GuardianPortalPage from "@/pages/foster/dashboard/GuardianPortal";
import CasesPage from "@/pages/foster/dashboard/CasesPage";
import DocumentsPage from "@/pages/foster/dashboard/DocumentsPage";
import AiAssistantPage from "@/pages/foster/dashboard/AiAssistantPage";
import SmartMatchingPage from "@/pages/foster/dashboard/SmartMatchingPage";
import RiskDetectionPage from "@/pages/foster/dashboard/RiskDetectionPage";
import CommunicationsPage from "@/pages/foster/dashboard/CommunicationsPage";
import ReportsPage from "@/pages/foster/dashboard/ReportsPage";
import AnalyticsPage from "@/pages/foster/dashboard/AnalyticsPage";
import NotificationsPage from "@/pages/foster/dashboard/NotificationsPage";
import CalendarPage from "@/pages/foster/dashboard/CalendarPage";
import BehaviourLogsPage from "@/pages/foster/dashboard/BehaviourLogs";
import StaffManagementPage from "@/pages/foster/dashboard/StaffManagement";
import UsersPage from "@/pages/foster/dashboard/UsersPage";
import SettingsPage from "@/pages/foster/dashboard/SettingsPage";

// ================= GROUP HOME =================
import GroupHomeDashboard from "@/pages/group-home/dashboard/DashboardPage";
import GroupHomes from "@/pages/group-home/dashboard/Grouphomes";
// import GroupHomes from "@/pages/group-home/dashboard/Grouphomes";
// import GroupHomeStaff from "@/pages/group-home/dashboard/StaffManagement";

export default function AppRoutes() {
    return (
        <Routes>

            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Select */}
            <Route path="/select-care-type" element={<SelectCareTypePage />} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>

                    {/* ===== FOSTER ===== */}
                    <Route path="/foster/dashboard" element={<FosterDashboard />} />
                    <Route path="/foster/dashboard/children" element={<ChildrenPage />} />
                    <Route path="/foster/dashboard/foster-families" element={<FosterFamiliesPage />} />
                    <Route path="/foster/dashboard/guardian-portal" element={<GuardianPortalPage />} />

                    <Route path="/foster/dashboard/cases" element={<CasesPage />} />

                    <Route path="/foster/dashboard/documents" element={<DocumentsPage />} />
                    <Route path="/foster/dashboard/ai-assistant" element={<AiAssistantPage />} />
                    <Route path="/foster/dashboard/smart-matching" element={<SmartMatchingPage />} />
                    <Route path="/foster/dashboard/risk-detection" element={<RiskDetectionPage />} />
                    <Route path="/foster/dashboard/communications" element={<CommunicationsPage />} />
                    <Route path="/foster/dashboard/reports" element={<ReportsPage />} />
                    <Route path="/foster/dashboard/analytics" element={<AnalyticsPage />} />
                    <Route path="/foster/dashboard/notifications" element={<NotificationsPage />} />
                    <Route path="/foster/dashboard/calendar" element={<CalendarPage />} />
                    <Route path="/foster/dashboard/behaviour-logs" element={<BehaviourLogsPage />} />
                    <Route path="/foster/dashboard/staff-management" element={<StaffManagementPage />} />
                    <Route path="/foster/dashboard/users" element={<UsersPage />} />
                    <Route path="/foster/dashboard/settings" element={<SettingsPage />} />

                    {/* ===== GROUP HOME ===== */}
                    <Route path="/group-home/dashboard" element={<GroupHomeDashboard />} />
                    <Route path="/group-home/dashboard/group-homes" element={<GroupHomes />} />
                    {/* <Route path="/group-home/dashboard/staff" element={<GroupHomeStaff />} /> */}

                    {/* Shared */}

                    <Route path="/group-home/dashboard/documents" element={<DocumentsPage />} />
                    <Route path="/group-home/dashboard/ai-assistant" element={<AiAssistantPage />} />
                    <Route path="/group-home/dashboard/smart-matching" element={<SmartMatchingPage />} />
                    <Route path="/group-home/dashboard/risk-detection" element={<RiskDetectionPage />} />
                    <Route path="/group-home/dashboard/communications" element={<CommunicationsPage />} />
                    <Route path="/group-home/dashboard/analytics" element={<AnalyticsPage />} />
                    <Route path="/group-home/dashboard/notifications" element={<NotificationsPage />} />
                    <Route path="/group-home/dashboard/calendar" element={<CalendarPage />} />
                    <Route path="/group-home/dashboard/behaviour-logs" element={<BehaviourLogsPage />} />
                    <Route path="/group-home/dashboard/staff-management" element={<StaffManagementPage />} />
                    <Route path="/group-home/dashboard/users" element={<UsersPage />} />
                    <Route path="/group-home/dashboard/reports" element={<ReportsPage />} />
                    <Route path="/group-home/dashboard/settings" element={<SettingsPage />} />

                </Route>
            </Route>

            {/* Redirect */}
            <Route path="/" element={<Navigate to="/select-care-type" replace />} />
            <Route path="*" element={<Navigate to="/select-care-type" replace />} />
        </Routes>
    );
}