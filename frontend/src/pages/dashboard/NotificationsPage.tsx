import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle, Clock } from "lucide-react";

const notifications = [
  { title: "Risk Alert: Olivia Brown", message: "Critical risk level detected. Immediate review required.", type: "urgent", time: "5 min ago", read: false },
  { title: "Case Update: CS-2024-002", message: "Status changed to In Progress by John Davis.", type: "info", time: "1 hour ago", read: false },
  { title: "Placement Match Found", message: "AI found a 94% match for Emma Johnson with Anderson Family.", type: "success", time: "2 hours ago", read: false },
  { title: "Document Uploaded", message: "Medical records uploaded for Liam Parker.", type: "info", time: "4 hours ago", read: true },
  { title: "Certification Expiring", message: "Thompson Family certification expires in 30 days.", type: "warning", time: "1 day ago", read: true },
];

const typeConfig: Record<string, { icon: typeof Info; color: string }> = {
  urgent: { icon: AlertTriangle, color: "text-destructive" },
  info: { icon: Info, color: "text-primary" },
  success: { icon: CheckCircle, color: "text-success" },
  warning: { icon: Clock, color: "text-warning" },
};

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader title="Notifications" description="Alerts and updates" actions={<Button variant="outline" size="sm">Mark all read</Button>} />
      <div className="p-6 space-y-3">
        {notifications.map((n, i) => {
          const cfg = typeConfig[n.type] || typeConfig.info;
          const Icon = cfg.icon;
          return (
            <Card key={i} className={n.read ? "opacity-60" : ""}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-muted ${cfg.color}`}><Icon className="h-4 w-4" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{n.title}</p>
                    {!n.read && <Badge className="bg-primary/10 text-primary text-xs">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
