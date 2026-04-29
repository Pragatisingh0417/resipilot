import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, CreditCard, TrendingUp, Plus, Search, Eye, Edit, BarChart3, Shield, Settings, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";

interface Agency {
  id: string; name: string; contact_name: string; contact_email: string; phone: string;
  plan: "basic" | "pro" | "enterprise"; status: "active" | "trial" | "suspended" | "cancelled";
  users: number; max_users: number; children: number; cases: number;
  subscription_start: string; subscription_end: string; monthly_revenue: number;
  last_active: string;
}

const planConfig = {
  basic: { label: "Basic", price: 299, color: "bg-muted text-muted-foreground", maxUsers: 5, features: ["Up to 50 children", "Basic reporting", "Email support", "5 user seats"] },
  pro: { label: "Pro", price: 799, color: "bg-primary/10 text-primary", maxUsers: 25, features: ["Up to 200 children", "AI Risk Detection", "Smart Matching", "Priority support", "25 user seats", "Advanced analytics"] },
  enterprise: { label: "Enterprise", price: 1999, color: "bg-purple-100 text-purple-700", maxUsers: 100, features: ["Unlimited children", "All AI features", "Dedicated support", "100 user seats", "Custom integrations", "SLA guarantee", "API access"] },
};

const mockAgencies: Agency[] = [
  { id: "1", name: "Bright Futures Foster Agency", contact_name: "Jennifer Adams", contact_email: "jadams@brightfutures.org", phone: "(555) 100-2000", plan: "pro", status: "active", users: 12, max_users: 25, children: 87, cases: 34, subscription_start: "2025-01-15", subscription_end: "2026-01-15", monthly_revenue: 799, last_active: "2 hours ago" },
  { id: "2", name: "Safe Haven Children Services", contact_name: "Michael Torres", contact_email: "mtorres@safehaven.org", phone: "(555) 200-3000", plan: "enterprise", status: "active", users: 45, max_users: 100, children: 312, cases: 156, subscription_start: "2024-06-01", subscription_end: "2025-06-01", monthly_revenue: 1999, last_active: "30 minutes ago" },
  { id: "3", name: "Hearts & Homes Agency", contact_name: "Lisa Wang", contact_email: "lwang@heartshomes.org", phone: "(555) 300-4000", plan: "basic", status: "active", users: 3, max_users: 5, children: 28, cases: 12, subscription_start: "2025-09-01", subscription_end: "2026-09-01", monthly_revenue: 299, last_active: "1 day ago" },
  { id: "4", name: "Community Care Foster Network", contact_name: "Robert Kim", contact_email: "rkim@communitycare.org", phone: "(555) 400-5000", plan: "pro", status: "trial", users: 5, max_users: 25, children: 15, cases: 6, subscription_start: "2026-03-20", subscription_end: "2026-04-20", monthly_revenue: 0, last_active: "5 hours ago" },
  { id: "5", name: "New Beginnings Foster Care", contact_name: "Amanda Foster", contact_email: "afoster@newbeginnings.org", phone: "(555) 500-6000", plan: "basic", status: "suspended", users: 2, max_users: 5, children: 0, cases: 0, subscription_start: "2025-03-01", subscription_end: "2026-03-01", monthly_revenue: 0, last_active: "45 days ago" },
];

const statusColors: Record<string, string> = { active: "bg-success/10 text-success", trial: "bg-warning/10 text-warning", suspended: "bg-destructive/10 text-destructive", cancelled: "bg-muted text-muted-foreground" };
const emptyForm: { name: string; contact_name: string; contact_email: string; phone: string; plan: Agency["plan"]; status: Agency["status"] } = { name: "", contact_name: "", contact_email: "", phone: "", plan: "basic", status: "trial" };

export default function SuperAdminPage() {
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState(mockAgencies);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailAgency, setDetailAgency] = useState<Agency | null>(null);
  const [editing, setEditing] = useState<Agency | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const filtered = agencies.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  const totalRevenue = agencies.filter(a => a.status === "active").reduce((s, a) => s + a.monthly_revenue, 0);
  const totalUsers = agencies.reduce((s, a) => s + a.users, 0);
  const totalChildren = agencies.reduce((s, a) => s + a.children, 0);
  const activeAgencies = agencies.filter(a => a.status === "active").length;

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (a: Agency) => {
    setEditing(a);
    setForm({ name: a.name, contact_name: a.contact_name, contact_email: a.contact_email, phone: a.phone, plan: a.plan, status: a.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.contact_email) return;
    const plan = form.plan as keyof typeof planConfig;
    if (editing) {
      setAgencies(prev => prev.map(a => a.id === editing.id ? {
        ...a, name: form.name, contact_name: form.contact_name, contact_email: form.contact_email,
        phone: form.phone, plan, status: form.status as Agency["status"],
        max_users: planConfig[plan].maxUsers,
        monthly_revenue: form.status === "active" ? planConfig[plan].price : 0,
      } : a));
      toast.success("Agency updated");
    } else {
      const newAgency: Agency = {
        id: crypto.randomUUID(), name: form.name, contact_name: form.contact_name,
        contact_email: form.contact_email, phone: form.phone, plan, status: "trial",
        users: 1, max_users: planConfig[plan].maxUsers, children: 0, cases: 0,
        subscription_start: new Date().toISOString().split("T")[0],
        subscription_end: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        monthly_revenue: 0, last_active: "Just now",
      };
      setAgencies(prev => [...prev, newAgency]);
      toast.success("Agency created with 30-day trial");
    }
    setDialogOpen(false);
  };

  const toggleStatus = (id: string, status: "active" | "suspended") => {
    setAgencies(prev => prev.map(a => {
      if (a.id !== id) return a;
      const newRevenue = status === "active" ? planConfig[a.plan].price : 0;
      return { ...a, status, monthly_revenue: newRevenue };
    }));
    toast.success(`Agency ${status === "active" ? "activated" : "suspended"}`);
  };

  return (
    <div>
      <PageHeader title="Super Admin Panel" description="Manage agencies, subscriptions, and platform overview" />

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10"><Building2 className="h-6 w-6 text-primary" /></div>
            <div><p className="text-2xl font-bold text-foreground">{activeAgencies}</p><p className="text-xs text-muted-foreground">Active Agencies</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10"><CreditCard className="h-6 w-6 text-success" /></div>
            <div><p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p><p className="text-xs text-muted-foreground">Monthly Revenue</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning/10"><Users className="h-6 w-6 text-warning" /></div>
            <div><p className="text-2xl font-bold text-foreground">{totalUsers}</p><p className="text-xs text-muted-foreground">Total Users</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100"><TrendingUp className="h-6 w-6 text-purple-700" /></div>
            <div><p className="text-2xl font-bold text-foreground">{totalChildren}</p><p className="text-xs text-muted-foreground">Children Managed</p></div>
          </CardContent></Card>
        </div>

        <Tabs defaultValue="agencies">
          <TabsList>
            <TabsTrigger value="agencies">Agencies</TabsTrigger>
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          {/* AGENCIES TAB */}
          <TabsContent value="agencies" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search agencies..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Agency</Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agency</TableHead><TableHead>Plan</TableHead><TableHead>Status</TableHead>
                      <TableHead>Users</TableHead><TableHead>Children</TableHead><TableHead>Revenue</TableHead>
                      <TableHead>Last Active</TableHead><TableHead className="w-32"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(a => (
                      <TableRow key={a.id}>
                        <TableCell>
                          <div><p className="font-medium text-sm">{a.name}</p><p className="text-xs text-muted-foreground">{a.contact_email}</p></div>
                        </TableCell>
                        <TableCell><Badge className={planConfig[a.plan].color}>{planConfig[a.plan].label}</Badge></TableCell>
                        <TableCell><Badge className={statusColors[a.status]}>{a.status}</Badge></TableCell>
                        <TableCell><span className="text-sm">{a.users}/{a.max_users}</span></TableCell>
                        <TableCell><span className="text-sm">{a.children}</span></TableCell>
                        <TableCell><span className="text-sm font-medium">{a.monthly_revenue > 0 ? `$${a.monthly_revenue}/mo` : "—"}</span></TableCell>
                        <TableCell><span className="text-xs text-muted-foreground">{a.last_active}</span></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/super-admin/agency/${a.id}`)}><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Edit className="h-4 w-4" /></Button>
                            {a.status === "active" || a.status === "trial" ? (
                              <Button variant="ghost" size="icon" onClick={() => toggleStatus(a.id, "suspended")}><XCircle className="h-4 w-4 text-destructive" /></Button>
                            ) : (
                              <Button variant="ghost" size="icon" onClick={() => toggleStatus(a.id, "active")}><CheckCircle className="h-4 w-4 text-success" /></Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PLANS TAB */}
          <TabsContent value="plans" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(Object.entries(planConfig) as [string, typeof planConfig.basic][]).map(([key, plan]) => {
                const count = agencies.filter(a => a.plan === key && a.status === "active").length;
                return (
                  <Card key={key} className={key === "pro" ? "ring-2 ring-primary" : ""}>
                    <CardHeader className="text-center pb-2">
                      <Badge className={`${plan.color} w-fit mx-auto mb-2`}>{key === "pro" ? "Most Popular" : plan.label}</Badge>
                      <CardTitle className="text-lg">{plan.label}</CardTitle>
                      <div className="text-3xl font-bold text-foreground">${plan.price}<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground text-center">{count} active {count === 1 ? "agency" : "agencies"}</p>
                      <div className="space-y-2">
                        {plan.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-success shrink-0" />
                            <span className="text-foreground">{f}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* REVENUE TAB */}
          <TabsContent value="revenue" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card><CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Monthly Recurring Revenue</p>
                <p className="text-3xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
              </CardContent></Card>
              <Card><CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Annual Run Rate</p>
                <p className="text-3xl font-bold text-foreground">${(totalRevenue * 12).toLocaleString()}</p>
              </CardContent></Card>
              <Card><CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Avg Revenue Per Agency</p>
                <p className="text-3xl font-bold text-foreground">${activeAgencies > 0 ? Math.round(totalRevenue / activeAgencies).toLocaleString() : 0}</p>
              </CardContent></Card>
            </div>
            <Card><CardHeader><CardTitle className="text-sm">Revenue by Plan</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {(Object.entries(planConfig) as [string, typeof planConfig.basic][]).map(([key, plan]) => {
                  const planRevenue = agencies.filter(a => a.plan === key && a.status === "active").reduce((s, a) => s + a.monthly_revenue, 0);
                  const pct = totalRevenue > 0 ? (planRevenue / totalRevenue) * 100 : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-foreground">{plan.label}</span>
                        <span className="text-sm text-muted-foreground">${planRevenue.toLocaleString()}/mo ({Math.round(pct)}%)</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Agency Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Agency" : "Add New Agency"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Agency Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Contact Name</Label><Input value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Contact Email *</Label><Input type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select value={form.plan} onValueChange={v => setForm({ ...form, plan: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic — $299/mo</SelectItem>
                    <SelectItem value="pro">Pro — $799/mo</SelectItem>
                    <SelectItem value="enterprise">Enterprise — $1,999/mo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editing && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Update" : "Create"} Agency</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Agency Detail Dialog */}
      <Dialog open={!!detailAgency} onOpenChange={() => setDetailAgency(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{detailAgency?.name}</DialogTitle></DialogHeader>
          {detailAgency && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">Contact</p>
                  <p className="text-sm font-medium text-foreground">{detailAgency.contact_name}</p>
                  <p className="text-xs text-muted-foreground">{detailAgency.contact_email}</p>
                  <p className="text-xs text-muted-foreground">{detailAgency.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">Subscription</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={planConfig[detailAgency.plan].color}>{planConfig[detailAgency.plan].label}</Badge>
                    <Badge className={statusColors[detailAgency.status]}>{detailAgency.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{detailAgency.subscription_start} to {detailAgency.subscription_end}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Card><CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{detailAgency.users}</p>
                  <p className="text-xs text-muted-foreground">Users</p>
                  <Progress value={(detailAgency.users / detailAgency.max_users) * 100} className="h-1.5 mt-1" />
                </CardContent></Card>
                <Card><CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{detailAgency.children}</p>
                  <p className="text-xs text-muted-foreground">Children</p>
                </CardContent></Card>
                <Card><CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{detailAgency.cases}</p>
                  <p className="text-xs text-muted-foreground">Cases</p>
                </CardContent></Card>
                <Card><CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{detailAgency.monthly_revenue > 0 ? `$${detailAgency.monthly_revenue}` : "—"}</p>
                  <p className="text-xs text-muted-foreground">Monthly</p>
                </CardContent></Card>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium mb-2">Plan Features</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {planConfig[detailAgency.plan].features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
