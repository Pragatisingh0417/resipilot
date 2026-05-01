import { useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import FosterMenu from "./FosterSidebar";
import GroupHomeMenu from "./GroupHomeSidebar";
import { LogOut } from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isGroupHome = location.pathname.startsWith("/group-home");

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      
      {/* Header */}
      <div className="p-5 border-b border-border">
        <h1 className="text-xl font-bold text-primary">ResiPilot</h1>
        <p className="text-xs text-muted-foreground">
          Care Management Platform
        </p>
      </div>

      {/* 🔥 SWITCH ONLY MENU */}
      <div className="flex-1 overflow-y-auto p-3">
        {isGroupHome ? <GroupHomeMenu /> : <FosterMenu />}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="mb-3">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>

        <button onClick={logout} className="flex items-center gap-2 text-sm">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}