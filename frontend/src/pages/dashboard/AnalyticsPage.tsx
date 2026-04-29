"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { api } from "@/lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const res = await api.get("/analytics/dashboard");
      setData(res);
    } catch (err) {
      console.error("Dashboard API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);

  // ✅ KPI DATA
  const kpis = [
    { label: "Total Children", value: data?.totalChildren || 0 },
    { label: "Active Families", value: data?.totalFamilies || 0 },
    { label: "Open Cases", value: data?.openCases || 0 },
    { label: "Placement Rate", value: `${data?.placementRate || 0}%` },
  ];

  // ✅ CHART DATA (Risk Distribution)
  const chartData =
    data?.riskDistribution?.map((item: any) => ({
      name: item._id || "Unknown",
      value: item.count,
    })) || [];

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Real-time data insights from your system"
      />

      <div className="p-6 space-y-6">

        {/* 🔄 Loading State */}
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">
            Loading analytics...
          </div>
        ) : (
          <>
            {/* ✅ KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {kpis.map((k, i) => (
                <Card key={i}>
                  <CardContent className="p-5 text-center">
                    <p className="text-sm text-muted-foreground">
                      {k.label}
                    </p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {k.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ✅ CHART */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Risk Level Distribution
                </CardTitle>
              </CardHeader>

              <CardContent>
                {chartData.length === 0 ? (
                  <div className="text-center text-muted-foreground py-10">
                    No data available
                  </div>
                ) : (
                  <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "10px",
                            border: "1px solid #eee",
                          }}
                        />
                        <Legend />

                        <Bar
                          dataKey="value"
                          fill="#03228f" // your brand color
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}