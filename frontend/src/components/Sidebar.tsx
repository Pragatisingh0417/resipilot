import { NavLink } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard, Users, Home, Briefcase, FileText, Bot, Puzzle, ShieldAlert,
  Activity, MessageSquare, BarChart3, ChartPie, Bell, UserCog, Settings, LogOut, Crown,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Children", icon: Users, path: "/dashboard/children" },
  { label: "Foster Families", icon: Home, path: "/dashboard/foster-families" },
  { label: "Guardian Portal", icon: Home, path: "/dashboard/guardian-portal" },
  { label: "Cases", icon: Briefcase, path: "/dashboard/cases" },
  { label: "Documents", icon: FileText, path: "/dashboard/documents" },
  { label: "AI Assistant", icon: Bot, path: "/dashboard/ai-assistant" },
  { label: "Smart Matching", icon: Puzzle, path: "/dashboard/smart-matching" },
  { label: "Risk Detection", icon: ShieldAlert, path: "/dashboard/risk-detection" },
  // { label: "Pulse", icon: Activity, path: "/dashboard/pulse" },
  { label: "Communications", icon: MessageSquare, path: "/dashboard/communications" },
  { label: "Reports", icon: BarChart3, path: "/dashboard/reports" },
  { label: "Analytics", icon: ChartPie, path: "/dashboard/analytics" },
  { label: "Notifications", icon: Bell, path: "/dashboard/notifications" },
  { label: "Calendar", icon: Activity, path: "/dashboard/calendar" },
  { label: "Behaviour Logs", icon: FileText, path: "/dashboard/behaviour-logs" },
  { label: "Staff Management", icon: UserCog, path: "/dashboard/staff-management" },
  { label: "Users", icon: UserCog, path: "/dashboard/users" },
  
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
  { label: "Super Admin", icon: Crown, path: "/dashboard/super-admin" },

];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-border">
        <h1 className="text-xl font-bold text-primary">ResiPilot</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Care Management Platform</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role || "social_worker"}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive w-full px-2 py-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
