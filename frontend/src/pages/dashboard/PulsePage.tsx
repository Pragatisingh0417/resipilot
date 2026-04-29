import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { week: "W1", wellbeing: 78, engagement: 82, stability: 90 },
  { week: "W2", wellbeing: 80, engagement: 79, stability: 88 },
  { week: "W3", wellbeing: 85, engagement: 84, stability: 91 },
  { week: "W4", wellbeing: 82, engagement: 88, stability: 87 },
];

const stats = [
  { label: "Avg Wellbeing", value: "81%", color: "text-success" },
  { label: "Avg Engagement", value: "83%", color: "text-primary" },
  { label: "Avg Stability", value: "89%", color: "text-purple-600" },
];

export default function PulsePage() {
  return (
    <div>
      <PageHeader title="Pulse System" description="Real-time wellbeing monitoring for children in care" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <Card key={i}>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className={`text-3xl font-bold mt-2 ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader><CardTitle className="text-base">Weekly Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" /><YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="wellbeing" stroke="hsl(142 71% 45%)" strokeWidth={2} />
                <Line type="monotone" dataKey="engagement" stroke="hsl(239 84% 67%)" strokeWidth={2} />
                <Line type="monotone" dataKey="stability" stroke="hsl(270 70% 50%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
