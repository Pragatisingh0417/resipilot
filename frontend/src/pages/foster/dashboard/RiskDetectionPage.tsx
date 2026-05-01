"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Eye } from "lucide-react";
import { api } from "@/lib/api";

const levelColors: Record<string, string> = {
  critical: "bg-purple-100 text-purple-700 border-purple-200",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20"
};

export default function RiskDetectionPage() {

  // ✅ MOVE HOOKS HERE
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ MOVE useEffect HERE
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get("/analytics/risk-alerts");
        setAlerts(res.alerts || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAlerts();
  }, []);

  // ✅ KEEP FUNCTION INSIDE
  const runAssessment = async () => {
    setLoading(true);

    try {
      const childrenRes = await api.get("/children");
      const children = childrenRes.data || [];

      const results = await Promise.all(
        children.map(async (child: any) => {
          try {
            const res = await api.post("/ai/risk-assessment", child);

            return {
              childId: child._id, // ✅ ADD THIS

              child: `${child.firstName} ${child.lastName}`,
              level: res.riskLevel || "low",
              factors: res.factors || [],
              action: res.recommendations?.[0] || "Monitor situation",
              time: "Just now",
            };
          } catch (err) {
            console.error("Child risk error:", err);
            return null;
          }
        })
      );

      setAlerts(results.filter(Boolean));

    } catch (err) {
      console.error(err);
      alert("Risk assessment failed");
    }

    setLoading(false);
  };

  return (
    <div>
      <PageHeader
        title="Risk Detection"
        description="AI-powered risk assessment and early warning"
        actions={
          <Button size="sm" onClick={runAssessment}>
            <Shield className="h-4 w-4 mr-1" /> Run Assessment
          </Button>
        }
      />

      <div className="p-6 space-y-4">

        {loading && (
          <p className="text-sm text-muted-foreground">
            AI is analyzing risk...
          </p>
        )}

        {alerts.map((alert, i) => (
          <Card key={i} className={`border-l-4 ${alert.level === "critical"
            ? "border-l-purple-500"
            : alert.level === "high"
              ? "border-l-destructive"
              : "border-l-warning"
            }`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className={`h-4 w-4 ${alert.level === "critical"
                      ? "text-purple-600"
                      : alert.level === "high"
                        ? "text-destructive"
                        : "text-warning"
                      }`} />
                    <span className="font-semibold">{alert.child}</span>
                    <Badge className={levelColors[alert.level]}>
                      {alert.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {alert.time}
                    </span>
                  </div>

                  <ul className="space-y-1 mb-3">
                    {alert.factors.map((f: string, j: number) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <p className="text-sm font-medium">{alert.action}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
onClick={() => navigate(`/dashboard/children/${alert.childId}`)}                              >
                  <Eye className="h-4 w-4 mr-1" /> Review
                </Button>
              </div>
            </CardContent>
          </Card>

        ))}
      </div>
    </div>
  );
}