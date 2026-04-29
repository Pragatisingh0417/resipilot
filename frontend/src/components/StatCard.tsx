import { LucideIcon } from "lucide-react";

interface StatCardProps { title: string; value: number | string; change?: string; icon: LucideIcon; color?: "default" | "success" | "warning" | "danger"; }

const colorMap = {
  default: "bg-primary/10 text-primary",
  success: "bg-green-50 text-green-600",
  warning: "bg-yellow-50 text-yellow-600",
  danger: "bg-red-50 text-red-600",
};

export default function StatCard({ title, value, change, icon: Icon, color = "default" }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}><Icon className="h-4 w-4" /></div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {change && <p className="text-xs text-muted-foreground mt-1">{change}</p>}
    </div>
  );
}

