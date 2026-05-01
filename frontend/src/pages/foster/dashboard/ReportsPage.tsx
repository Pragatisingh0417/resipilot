import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";

const reports = [
  { name: "Monthly Placement Report", type: "Placement", generated: "2024-01-15", status: "Ready" },
  { name: "Risk Assessment Summary", type: "Risk", generated: "2024-01-14", status: "Ready" },
  { name: "Case Worker Performance", type: "Performance", generated: "2024-01-13", status: "Ready" },
  { name: "Quarterly Compliance Report", type: "Compliance", generated: "2024-01-10", status: "Ready" },
  { name: "Foster Family Utilization", type: "Utilization", generated: "2024-01-08", status: "Generating" },
];

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" description="Generate and download reports" actions={<Button size="sm">Generate New Report</Button>} />
      <div className="p-6 space-y-3">
        {reports.map((r, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-primary/10 rounded-xl"><FileText className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="font-medium text-sm">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.type} · Generated {r.generated}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className={r.status === "Ready" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>{r.status}</Badge>
                <Button variant="ghost" size="icon" disabled={r.status !== "Ready"}><Download className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
