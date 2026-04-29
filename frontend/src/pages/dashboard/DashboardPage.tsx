"use client";

import { useEffect, useState } from "react";
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import { Users, Home, Briefcase, ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from "@/lib/api";

// KEEP STATIC (no backend yet)
const barData = [
  { month: 'Jan', placements: 12 }, { month: 'Feb', placements: 19 },
  { month: 'Mar', placements: 15 }, { month: 'Apr', placements: 22 },
  { month: 'May', placements: 18 }, { month: 'Jun', placements: 25 },
];

const activity = [
  { action: 'New child profile created', user: 'Sarah Johnson', time: '2 hours ago', icon: Users },
  { action: 'Case #1234 status updated', user: 'Mike Chen', time: '4 hours ago', icon: Briefcase },
  { action: 'Risk alert triggered', user: 'System', time: '5 hours ago', icon: AlertTriangle },
  { action: 'Placement match found', user: 'AI System', time: '6 hours ago', icon: TrendingUp },
];

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/analytics/dashboard");
        setData(res); // ✅ correct
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  // ✅ Dynamic KPI values
  const pieData =
    data?.riskDistribution?.map((item: any) => {
      const colors: any = {
        low: '#22c55e',
        medium: '#f59e0b',
        high: '#ef4444',
        critical: '#8b5cf6',
      };

      return {
        name: item._id || "Unknown",
        value: item.count,
        color: colors[item._id] || "#ccc",
      };
    }) || [];

  return (
    <div>
      <Header title="Dashboard" description="Overview of your care management system" />

      <div className="p-6 space-y-6">

        {/* ✅ KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Children"
            value={data?.totalChildren || 0}
            change="+ live"
            icon={Users}
          />
          <StatCard
            title="Foster Families"
            value={data?.totalFamilies || 0}
            change="+ live"
            icon={Home}
            color="success"
          />
          <StatCard
            title="Active Cases"
            value={data?.openCases || 0}
            change="live"
            icon={Briefcase}
            color="warning"
          />
          <StatCard
            title="Placement Rate"
            value={`${data?.placementRate || 0}%`}
            change="live"
            icon={ShieldAlert}
            color="danger"
          />
        </div>

        {/* ✅ CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* KEEP STATIC BAR CHART */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold mb-4">Monthly Placements</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="placements" fill="#6366f1" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ✅ DYNAMIC PIE CHART */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-semibold mb-4">Risk Distribution</h3>

            {pieData.length === 0 ? (
              <div className="text-center text-gray-400 py-20">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* KEEP ACTIVITY STATIC */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activity.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                <div className="p-2 bg-brand-50 rounded-lg">
                  <item.icon className="h-4 w-4 text-brand-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-gray-500">by {item.user}</p>
                </div>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}