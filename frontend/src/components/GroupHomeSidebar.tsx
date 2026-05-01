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

export default function GroupHomeSidebar() {
  const base = "/group-home/dashboard";

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: base },
    { label: "Group Homes", icon: Briefcase, path: `${base}/group-homes` },

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
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}