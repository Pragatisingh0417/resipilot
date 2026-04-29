import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Edit, Building2, Users, CreditCard, Calendar, Phone, Mail, MapPin, CheckCircle, Save, RefreshCw, Star, Activity, Shield } from "lucide-react";
import { toast } from "sonner";

const planConfig = {
  basic: { label: "Basic", price: 299, color: "bg-muted text-muted-foreground", maxUsers: 5, maxChildren: 50, features: ["Up to 50 children", "Basic reporting", "Email support", "5 user seats"] },
  pro: { label: "Pro", price: 799, color: "bg-primary/10 text-primary", maxUsers: 25, maxChildren: 200, features: ["Up to 200 children", "AI Risk Detection", "Smart Matching", "Priority support", "25 user seats", "Advanced analytics"] },
  enterprise: { label: "Enterprise", price: 1999, color: "bg-purple-100 text-purple-700", maxUsers: 100, maxChildren: 999999, features: ["Unlimited children", "All AI features", "Dedicated support", "100 user seats", "Custom integrations", "SLA guarantee", "API access"] },
};

const statusColors: Record<string, string> = { active: "bg-success/10 text-success", trial: "bg-warning/10 text-warning", suspended: "bg-destructive/10 text-destructive", cancelled: "bg-muted text-muted-foreground" };

type AgencyPlan = "basic" | "pro" | "enterprise";
type AgencyStatus = "active" | "trial" | "suspended" | "cancelled";

interface AgencyDetail {
  id: string; name: string; contact_name: string; contact_email: string; phone: string; address: string;
  plan: AgencyPlan; status: AgencyStatus;
  users: number; max_users: number; children: number; cases: number;
  subscription_start: string; subscription_end: string; monthly_revenue: number;
  last_active: string; created_date: string;
  billing_cycle: "monthly" | "annual"; auto_renew: boolean;
  payment_method: string; last_payment_date: string; last_payment_amount: number;
  team: { name: string; role: string; email: string; status: string; lastLogin: string }[];
  payment_history: { date: string; amount: number; status: string; invoice: string }[];
  activity: { action: string; date: string }[];
  notes: string;
}

const mockAgencies: Record<string, AgencyDetail> = {
  "1": {
    id: "1", name: "Bright Futures Foster Agency", contact_name: "Jennifer Adams", contact_email: "jadams@brightfutures.org",
    phone: "(555) 100-2000", address: "500 Main Street, Suite 200, Springfield, IL 62701",
    plan: "pro", status: "active", users: 12, max_users: 25, children: 87, cases: 34,
    subscription_start: "2025-01-15", subscription_end: "2026-01-15", monthly_revenue: 799,
    last_active: "2 hours ago", created_date: "2024-11-01",
    billing_cycle: "monthly", auto_renew: true,
    payment_method: "Visa ending 4242", last_payment_date: "2026-04-01", last_payment_amount: 799,
    team: [
      { name: "Jennifer Adams", role: "Agency Admin", email: "jadams@brightfutures.org", status: "Active", lastLogin: "2 hours ago" },
      { name: "Tom Richards", role: "Supervisor", email: "trichards@brightfutures.org", status: "Active", lastLogin: "4 hours ago" },
      { name: "Nancy Clark", role: "Social Worker", email: "nclark@brightfutures.org", status: "Active", lastLogin: "1 day ago" },
    ],
    payment_history: [
      { date: "2026-04-01", amount: 799, status: "Paid", invoice: "INV-2026-0401" },
      { date: "2026-03-01", amount: 799, status: "Paid", invoice: "INV-2026-0301" },
      { date: "2026-02-01", amount: 799, status: "Paid", invoice: "INV-2026-0201" },
      { date: "2026-01-01", amount: 799, status: "Paid", invoice: "INV-2026-0101" },
      { date: "2025-12-01", amount: 799, status: "Paid", invoice: "INV-2025-1201" },
    ],
    activity: [
      { action: "12 users active this week", date: "2026-04-05" },
      { action: "Subscription renewed automatically", date: "2026-04-01" },
      { action: "Added 3 new children records", date: "2026-03-28" },
      { action: "Jennifer Adams updated agency settings", date: "2026-03-20" },
    ],
    notes: "Long-term customer. Very active. Considering upgrade to Enterprise.",
  },
  "2": {
    id: "2", name: "Safe Haven Children Services", contact_name: "Michael Torres", contact_email: "mtorres@safehaven.org",
    phone: "(555) 200-3000", address: "1200 Oak Boulevard, Chicago, IL 60601",
    plan: "enterprise", status: "active", users: 45, max_users: 100, children: 312, cases: 156,
    subscription_start: "2024-06-01", subscription_end: "2025-06-01", monthly_revenue: 1999,
    last_active: "30 minutes ago", created_date: "2024-04-15",
    billing_cycle: "annual", auto_renew: true,
    payment_method: "Wire Transfer", last_payment_date: "2025-06-01", last_payment_amount: 23988,
    team: [
      { name: "Michael Torres", role: "Agency Admin", email: "mtorres@safehaven.org", status: "Active", lastLogin: "30 min ago" },
      { name: "Emily Watson", role: "Director", email: "ewatson@safehaven.org", status: "Active", lastLogin: "1 hour ago" },
    ],
    payment_history: [
      { date: "2025-06-01", amount: 23988, status: "Paid", invoice: "INV-2025-0601" },
      { date: "2024-06-01", amount: 23988, status: "Paid", invoice: "INV-2024-0601" },
    ],
    activity: [
      { action: "45 users active this week", date: "2026-04-05" },
      { action: "Custom API integration enabled", date: "2026-03-15" },
      { action: "Added 15 new children records", date: "2026-03-01" },
    ],
    notes: "Enterprise customer. Uses API integration. Annual billing via wire transfer.",
  },
  "3": {
    id: "3", name: "Hearts & Homes Agency", contact_name: "Lisa Wang", contact_email: "lwang@heartshomes.org",
    phone: "(555) 300-4000", address: "78 Elm Street, Peoria, IL 61602",
    plan: "basic", status: "active", users: 3, max_users: 5, children: 28, cases: 12,
    subscription_start: "2025-09-01", subscription_end: "2026-09-01", monthly_revenue: 299,
    last_active: "1 day ago", created_date: "2025-08-15",
    billing_cycle: "monthly", auto_renew: true,
    payment_method: "Mastercard ending 8888", last_payment_date: "2026-04-01", last_payment_amount: 299,
    team: [
      { name: "Lisa Wang", role: "Agency Admin", email: "lwang@heartshomes.org", status: "Active", lastLogin: "1 day ago" },
    ],
    payment_history: [
      { date: "2026-04-01", amount: 299, status: "Paid", invoice: "INV-2026-0401-HH" },
      { date: "2026-03-01", amount: 299, status: "Paid", invoice: "INV-2026-0301-HH" },
      { date: "2026-02-01", amount: 299, status: "Paid", invoice: "INV-2026-0201-HH" },
    ],
    activity: [
      { action: "Lisa Wang logged in", date: "2026-04-04" },
      { action: "Subscription renewed", date: "2026-04-01" },
    ],
    notes: "Small agency. May benefit from Pro upgrade as they grow.",
  },
  "4": {
    id: "4", name: "Community Care Foster Network", contact_name: "Robert Kim", contact_email: "rkim@communitycare.org",
    phone: "(555) 400-5000", address: "320 Walnut Ave, Champaign, IL 61820",
    plan: "pro", status: "trial", users: 5, max_users: 25, children: 15, cases: 6,
    subscription_start: "2026-03-20", subscription_end: "2026-04-20", monthly_revenue: 0,
    last_active: "5 hours ago", created_date: "2026-03-15",
    billing_cycle: "monthly", auto_renew: false,
    payment_method: "None — Trial", last_payment_date: "", last_payment_amount: 0,
    team: [
      { name: "Robert Kim", role: "Agency Admin", email: "rkim@communitycare.org", status: "Active", lastLogin: "5 hours ago" },
    ],
    payment_history: [],
    activity: [
      { action: "Trial started — Pro plan", date: "2026-03-20" },
      { action: "Account created", date: "2026-03-15" },
    ],
    notes: "Trial user. Follow up before trial ends on April 20.",
  },
  "5": {
    id: "5", name: "New Beginnings Foster Care", contact_name: "Amanda Foster", contact_email: "afoster@newbeginnings.org",
    phone: "(555) 500-6000", address: "901 Cedar Ln, Rockford, IL 61101",
    plan: "basic", status: "suspended", users: 2, max_users: 5, children: 0, cases: 0,
    subscription_start: "2025-03-01", subscription_end: "2026-03-01", monthly_revenue: 0,
    last_active: "45 days ago", created_date: "2025-02-10",
    billing_cycle: "monthly", auto_renew: false,
    payment_method: "Visa ending 1111", last_payment_date: "2026-01-01", last_payment_amount: 299,
    team: [
      { name: "Amanda Foster", role: "Agency Admin", email: "afoster@newbeginnings.org", status: "Inactive", lastLogin: "45 days ago" },
    ],
    payment_history: [
      { date: "2026-01-01", amount: 299, status: "Paid", invoice: "INV-2026-0101-NB" },
      { date: "2025-12-01", amount: 299, status: "Failed", invoice: "INV-2025-1201-NB" },
    ],
    activity: [
      { action: "Account suspended — payment failed", date: "2026-02-15" },
      { action: "Payment failed", date: "2025-12-01" },
    ],
    notes: "Suspended due to failed payment. Contact to resolve billing issues.",
  },
};

export default function AgencyProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState(mockAgencies);
  const [editOpen, setEditOpen] = useState(false);
  const [planEditOpen, setPlanEditOpen] = useState(false);

  const agency = agencies[id || ""];

  const [editForm, setEditForm] = useState({ name: "", contact_name: "", contact_email: "", phone: "", address: "", notes: "" });
  const [planForm, setPlanForm] = useState<{ plan: AgencyPlan; billing_cycle: "monthly" | "annual"; auto_renew: boolean; subscription_end: string; status: AgencyStatus }>({ plan: "basic", billing_cycle: "monthly", auto_renew: true, subscription_end: "", status: "active" });

  if (!agency) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Agency not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard/super-admin")}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
      </div>
    );
  }

  const openEditProfile = () => {
    setEditForm({ name: agency.name, contact_name: agency.contact_name, contact_email: agency.contact_email, phone: agency.phone, address: agency.address, notes: agency.notes });
    setEditOpen(true);
  };

  const openEditPlan = () => {
    setPlanForm({ plan: agency.plan, billing_cycle: agency.billing_cycle, auto_renew: agency.auto_renew, subscription_end: agency.subscription_end, status: agency.status });
    setPlanEditOpen(true);
  };

  const saveProfile = () => {
    if (!editForm.name) return;
    setAgencies(prev => ({ ...prev, [agency.id]: { ...prev[agency.id], ...editForm } }));
    setEditOpen(false);
    toast.success("Agency profile updated");
  };

  const savePlan = () => {
    const plan = planForm.plan;
    const newPrice = planForm.status === "active" ? planConfig[plan].price : 0;
    setAgencies(prev => ({
      ...prev,
      [agency.id]: {
        ...prev[agency.id],
        plan, billing_cycle: planForm.billing_cycle, auto_renew: planForm.auto_renew,
        subscription_end: planForm.subscription_end, status: planForm.status,
        max_users: planConfig[plan].maxUsers, monthly_revenue: newPrice,
      },
    }));
    setPlanEditOpen(false);
    toast.success("Subscription plan updated");
  };

  const daysUntilRenewal = Math.max(0, Math.ceil((new Date(agency.subscription_end).getTime() - Date.now()) / 86400000));

  return (
    <div>
      <PageHeader title={agency.name} description={`Created ${agency.created_date} • Last active ${agency.last_active}`}
        actions={<div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/super-admin")}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
          <Button variant="outline" size="sm" onClick={openEditPlan}><CreditCard className="h-4 w-4 mr-1" /> Manage Plan</Button>
          <Button size="sm" onClick={openEditProfile}><Edit className="h-4 w-4 mr-1" /> Edit Profile</Button>
        </div>}
      />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card><CardContent className="p-4 text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2"><Building2 className="h-7 w-7 text-primary" /></div>
            <p className="font-semibold text-foreground text-sm">{agency.name}</p>
            <Badge className={`${statusColors[agency.status]} mt-1`}>{agency.status}</Badge>
          </CardContent></Card>

          <Card><CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Plan & Billing</p>
            <Badge className={`${planConfig[agency.plan].color} text-sm`}>{planConfig[agency.plan].label}</Badge>
            <p className="text-lg font-bold text-foreground mt-1">${agency.monthly_revenue > 0 ? agency.monthly_revenue : planConfig[agency.plan].price}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
            <p className="text-xs text-muted-foreground">{agency.billing_cycle === "annual" ? "Billed annually" : "Billed monthly"}</p>
          </CardContent></Card>

          <Card><CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Renewal</p>
            <p className="text-lg font-bold text-foreground">{daysUntilRenewal} days</p>
            <p className="text-xs text-muted-foreground">{agency.subscription_end}</p>
            <Badge variant="outline" className={`text-xs mt-1 ${agency.auto_renew ? "border-success text-success" : "border-warning text-warning"}`}>
              {agency.auto_renew ? "Auto-renew ON" : "Auto-renew OFF"}
            </Badge>
          </CardContent></Card>

          <Card><CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Users</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">{agency.users}</span>
              <span className="text-xs text-muted-foreground">/ {agency.max_users}</span>
            </div>
            <Progress value={(agency.users / agency.max_users) * 100} className="h-2 mt-1" />
          </CardContent></Card>

          <Card><CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Usage</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Children</span><span className="font-medium text-foreground">{agency.children}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Cases</span><span className="font-medium text-foreground">{agency.cases}</span></div>
            </div>
          </CardContent></Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team ({agency.team.length})</TabsTrigger>
            <TabsTrigger value="billing">Billing History</TabsTrigger>
            <TabsTrigger value="plan">Plan Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> Contact Information</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm flex items-center gap-2 text-foreground"><Users className="h-3.5 w-3.5 text-muted-foreground" />{agency.contact_name}</p>
                  <p className="text-sm flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" />{agency.contact_email}</p>
                  <p className="text-sm flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{agency.phone}</p>
                  <p className="text-sm flex items-center gap-2 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{agency.address}</p>
                </CardContent>
              </Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Payment Information</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Payment Method</span><span className="font-medium text-foreground">{agency.payment_method}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Last Payment</span><span className="font-medium text-foreground">{agency.last_payment_date || "None"}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Last Amount</span><span className="font-medium text-foreground">{agency.last_payment_amount > 0 ? `$${agency.last_payment_amount}` : "—"}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Auto Renew</span><span className="font-medium text-foreground">{agency.auto_renew ? "Yes" : "No"}</span></div>
                </CardContent>
              </Card>
            </div>
            {agency.notes && (
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Admin Notes</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">{agency.notes}</p></CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="team" className="mt-4">
            <Card><CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {agency.team.map((m, i) => (
                    <tr key={i} className="hover:bg-muted/50">
                      <td className="px-6 py-3 text-sm font-medium text-foreground">{m.name}</td>
                      <td className="px-6 py-3"><Badge variant="secondary" className="text-xs">{m.role}</Badge></td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">{m.email}</td>
                      <td className="px-6 py-3"><Badge className={m.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"} variant="secondary">{m.status}</Badge></td>
                      <td className="px-6 py-3 text-xs text-muted-foreground">{m.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-4">
            <Card><CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {agency.payment_history.length > 0 ? agency.payment_history.map((p, i) => (
                    <tr key={i} className="hover:bg-muted/50">
                      <td className="px-6 py-3 text-sm text-foreground">{p.date}</td>
                      <td className="px-6 py-3 text-sm font-medium text-foreground">${p.amount.toLocaleString()}</td>
                      <td className="px-6 py-3"><Badge className={p.status === "Paid" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"} variant="secondary">{p.status}</Badge></td>
                      <td className="px-6 py-3 text-sm text-muted-foreground font-mono">{p.invoice}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No payment history</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="plan" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Current Plan: {planConfig[agency.plan].label}</CardTitle>
                <Button size="sm" variant="outline" onClick={openEditPlan}><Edit className="h-4 w-4 mr-1" /> Change Plan</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><p className="text-xs text-muted-foreground uppercase">Monthly Price</p><p className="text-lg font-bold text-foreground">${planConfig[agency.plan].price}</p></div>
                  <div><p className="text-xs text-muted-foreground uppercase">Billing Cycle</p><p className="text-sm font-medium text-foreground capitalize">{agency.billing_cycle}</p></div>
                  <div><p className="text-xs text-muted-foreground uppercase">Start Date</p><p className="text-sm font-medium text-foreground">{agency.subscription_start}</p></div>
                  <div><p className="text-xs text-muted-foreground uppercase">End/Renewal Date</p><p className="text-sm font-medium text-foreground">{agency.subscription_end}</p></div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium mb-2">Plan Features</p>
                  <div className="grid grid-cols-2 gap-2">
                    {planConfig[agency.plan].features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle className="h-4 w-4 text-success shrink-0" />{f}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card><CardContent className="p-6">
              <div className="space-y-0">
                {agency.activity.map((a, i) => (
                  <div key={i} className="flex gap-4 pb-4 last:pb-0 relative">
                    {i < agency.activity.length - 1 && <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />}
                    <div className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"><Activity className="h-4 w-4" /></div>
                    <div>
                      <p className="text-sm text-foreground">{a.action}</p>
                      <p className="text-xs text-muted-foreground">{a.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Agency Profile</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Agency Name *</Label><Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Contact Name</Label><Input value={editForm.contact_name} onChange={e => setEditForm({ ...editForm, contact_name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Contact Email</Label><Input type="email" value={editForm.contact_email} onChange={e => setEditForm({ ...editForm, contact_email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Address</Label><Input value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} /></div>
            <div className="space-y-2"><Label>Admin Notes</Label><Input value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveProfile}><Save className="h-4 w-4 mr-1" /> Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={planEditOpen} onOpenChange={setPlanEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Manage Subscription Plan</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={planForm.plan} onValueChange={v => setPlanForm({ ...planForm, plan: v as AgencyPlan })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic — $299/mo (5 users, 50 children)</SelectItem>
                  <SelectItem value="pro">Pro — $799/mo (25 users, 200 children)</SelectItem>
                  <SelectItem value="enterprise">Enterprise — $1,999/mo (100 users, unlimited)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Billing Cycle</Label>
                <Select value={planForm.billing_cycle} onValueChange={v => setPlanForm({ ...planForm, billing_cycle: v as "monthly" | "annual" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual (save 15%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={planForm.status} onValueChange={v => setPlanForm({ ...planForm, status: v as AgencyStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Renewal / End Date</Label>
              <Input type="date" value={planForm.subscription_end} onChange={e => setPlanForm({ ...planForm, subscription_end: e.target.value })} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="auto_renew" checked={planForm.auto_renew} onChange={e => setPlanForm({ ...planForm, auto_renew: e.target.checked })} className="rounded border-input" />
              <Label htmlFor="auto_renew">Auto-renew subscription</Label>
            </div>
            <Card className="bg-muted/30"><CardContent className="p-3">
              <p className="text-xs text-muted-foreground">New monthly price: <span className="font-bold text-foreground">${planConfig[planForm.plan].price}/mo</span>
              {planForm.billing_cycle === "annual" && <span> (${Math.round(planConfig[planForm.plan].price * 12 * 0.85)}/yr with 15% discount)</span>}
              </p>
            </CardContent></Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanEditOpen(false)}>Cancel</Button>
            <Button onClick={savePlan}><Save className="h-4 w-4 mr-1" /> Update Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
