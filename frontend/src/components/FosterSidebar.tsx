import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Home,
  Briefcase,
  FileText,
  Bot,
  Puzzle,
  ShieldAlert,
  Activity,
  MessageSquare,
  BarChart3,
  ChartPie,
  Bell,
  UserCog,
  Settings,
  Crown,
} from "lucide-react";

export default function FosterSidebar() {
  const base = "/foster/dashboard";

  const navItems = [
    // 🔹 Core
    { label: "Dashboard", icon: LayoutDashboard, path: base },
    { label: "Children", icon: Users, path: `${base}/children` },
    { label: "Foster Families", icon: Home, path: `${base}/foster-families` },
    { label: "Guardian Portal", icon: Home, path: `${base}/guardian-portal` },
    { label: "Cases", icon: Briefcase, path: `${base}/cases` },

    // 🔹 Operations
    { label: "Documents", icon: FileText, path: `${base}/documents` },
    { label: "AI Assistant", icon: Bot, path: `${base}/ai-assistant` },
    { label: "Smart Matching", icon: Puzzle, path: `${base}/smart-matching` },
    { label: "Risk Detection", icon: ShieldAlert, path: `${base}/risk-detection` },
    { label: "Communications", icon: MessageSquare, path: `${base}/communications` },

    // 🔹 Insights
    { label: "Reports", icon: BarChart3, path: `${base}/reports` },
    { label: "Analytics", icon: ChartPie, path: `${base}/analytics` },
    { label: "Notifications", icon: Bell, path: `${base}/notifications` },
    { label: "Calendar", icon: Activity, path: `${base}/calendar` },
    { label: "Behaviour Logs", icon: FileText, path: `${base}/behaviour-logs` },

    // 🔹 Admin
    { label: "Staff Management", icon: UserCog, path: `${base}/staff-management` },
    { label: "Users", icon: UserCog, path: `${base}/users` },

    // 🔹 Settings
    { label: "Settings", icon: Settings, path: `${base}/settings` },
    // { label: "Super Admin", icon: Crown, path: `${base}/super-admin` },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted"
            }`
          }
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}