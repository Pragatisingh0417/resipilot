import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Family = {
  _id: string;

  familyName: string;

  primaryContact?: {
    name?: string;
    phone?: string;
    email?: string;
  };

  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };

  status: string;
  capacity: number;
  currentPlacements: number;

  certificationDate?: string;
  certificationExpiry?: string;

  rating?: number;
  notes?: string;
};

const emptyForm = {
  family_name: "",
  contact_name: "",
  contact_phone: "",
  contact_email: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  status: "pending",
  capacity: 1,
  current_placements: 0,
  certification_date: "",
  certification_expiry: "",
  rating: 0,
  notes: "",
};

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  inactive: "bg-muted text-muted-foreground",
  suspended: "bg-destructive/10 text-destructive",
};

export default function FosterFamiliesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Family | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const qc = useQueryClient();

  // ✅ FETCH
  const { data: familiesData, isLoading } = useQuery({
    queryKey: ["foster_families"],
    queryFn: async () => {
      const res = await api.get("/foster-families");
      return res;
    },
  });

  const families: Family[] = familiesData?.data || [];

  // ✅ CREATE / UPDATE
  const upsert = useMutation({
    mutationFn: async (values: typeof emptyForm & { _id?: string }) => {
      const payload = {
  familyName: values.family_name,

  primaryContact: {
    name: values.contact_name,
    phone: values.contact_phone || null,
    email: values.contact_email || null,
  },

  address: {
    street: values.street || null,
    city: values.city || null,
    state: values.state || null,
    zip: values.zip || null,
  },

  status: values.status,
  capacity: Number(values.capacity),
  currentPlacements: Number(values.current_placements),

  certificationDate: values.certification_date || null,
  certificationExpiry: values.certification_expiry || null,

  rating: values.rating || 0,
  notes: values.notes || "",
};

      if (values._id) {
        return await api.put(`/foster-families/${values._id}`, payload);
      } else {
        return await api.post(`/foster-families`, payload);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["foster_families"] });
      toast({ title: editing ? "Family updated" : "Family added" });
      setDialogOpen(false);
    },
    onError: (e: any) =>
      toast({ variant: "destructive", title: "Error", description: e.message }),
  });

  // ✅ DELETE
  const remove = useMutation({
    mutationFn: async (id: string) => await api.del(`/foster-families/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["foster_families"] });
      toast({ title: "Family removed" });
    },
  });

  const filtered = families.filter((f) =>
    f.familyName.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (f: Family) => {
    setEditing(f);
    setForm({
  family_name: f.familyName,
  contact_name: f.primaryContact?.name || "",
  contact_phone: f.primaryContact?.phone || "",
  contact_email: f.primaryContact?.email || "",
  street: f.address?.street || "",
  city: f.address?.city || "",
  state: f.address?.state || "",
  zip: f.address?.zip || "",
  status: f.status,
  capacity: f.capacity,
  current_placements: f.currentPlacements,
  certification_date: f.certificationDate || "",
  certification_expiry: f.certificationExpiry || "",
  rating: f.rating || 0,
  notes: f.notes || "",
});
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.family_name || !form.contact_name) {
      toast({ variant: "destructive", title: "Required fields missing" });
      return;
    }
    upsert.mutate(editing ? { ...form, _id: editing._id } : form);
  };

  return (
    <div>
      <PageHeader
        title="Foster Families"
        description="Manage foster family profiles"
        actions={
          <Button onClick={openAdd} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Family
          </Button>
        }
      />

      <div className="p-6">
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search families..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Family Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.map((family) => (
                    <TableRow
                      key={family._id}
                      className="cursor-pointer"
                      onClick={() => openEdit(family)}
                    >
                      <TableCell className="font-medium">
                        {family.familyName}
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          {family.primaryContact?.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {family.primaryContact?.email}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={statusColors[family.status]}
                        >
                          {family.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {family.currentPlacements}/{family.capacity}
                      </TableCell>

                      <TableCell>
                        {Number(family.rating) > 0
                          ? `${family.rating} ★`
                          : "N/A"}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            remove.mutate(family._id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-8"
                      >
                        No families found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SAME FORM UI PRESERVED */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Family" : "Add New Family"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Family Name *</Label>
              <Input
                value={form.family_name}
                onChange={(e) =>
                  setForm({ ...form, family_name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Contact Name *</Label>
              <Input
                value={form.contact_name}
                onChange={(e) =>
                  setForm({ ...form, contact_name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={form.contact_phone}
                onChange={(e) =>
                  setForm({ ...form, contact_phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.contact_email}
                onChange={(e) =>
                  setForm({ ...form, contact_email: e.target.value })
                }
              />
            </div>

            {/* KEEPING YOUR FULL FORM EXACT */}

            {/* STATUS */}
<div className="space-y-2">
  <Label>Status</Label>
  <Select
    value={form.status}
    onValueChange={(v) => setForm({ ...form, status: v })}
  >
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="active">Active</SelectItem>
      <SelectItem value="pending">Pending</SelectItem>
      <SelectItem value="inactive">Inactive</SelectItem>
      <SelectItem value="suspended">Suspended</SelectItem>
    </SelectContent>
  </Select>
</div>

{/* STREET */}
<div className="space-y-2">
  <Label>Street</Label>
  <Input
    value={form.street}
    onChange={(e) =>
      setForm({ ...form, street: e.target.value })
    }
  />
</div>

{/* CITY */}
<div className="space-y-2">
  <Label>City</Label>
  <Input
    value={form.city}
    onChange={(e) =>
      setForm({ ...form, city: e.target.value })
    }
  />
</div>

{/* STATE */}
<div className="space-y-2">
  <Label>State</Label>
  <Input
    value={form.state}
    onChange={(e) =>
      setForm({ ...form, state: e.target.value })
    }
  />
</div>

{/* ZIP */}
<div className="space-y-2">
  <Label>ZIP</Label>
  <Input
    value={form.zip}
    onChange={(e) =>
      setForm({ ...form, zip: e.target.value })
    }
  />
</div>

{/* CAPACITY */}
<div className="space-y-2">
  <Label>Capacity</Label>
  <Input
    type="number"
    min={1}
    value={form.capacity}
    onChange={(e) =>
      setForm({
        ...form,
        capacity: parseInt(e.target.value) || 1,
      })
    }
  />
</div>

{/* CURRENT PLACEMENTS */}
<div className="space-y-2">
  <Label>Current Placements</Label>
  <Input
    type="number"
    min={0}
    value={form.current_placements}
    onChange={(e) =>
      setForm({
        ...form,
        current_placements: parseInt(e.target.value) || 0,
      })
    }
  />
</div>

{/* CERTIFICATION DATE */}
<div className="space-y-2">
  <Label>Certification Date</Label>
  <Input
    type="date"
    value={form.certification_date}
    onChange={(e) =>
      setForm({
        ...form,
        certification_date: e.target.value,
      })
    }
  />
</div>

{/* CERTIFICATION EXPIRY */}
<div className="space-y-2">
  <Label>Certification Expiry</Label>
  <Input
    type="date"
    value={form.certification_expiry}
    onChange={(e) =>
      setForm({
        ...form,
        certification_expiry: e.target.value,
      })
    }
  />
</div>

{/* RATING */}
<div className="space-y-2">
  <Label>Rating (0–5)</Label>
  <Input
    type="number"
    min={0}
    max={5}
    value={form.rating}
    onChange={(e) =>
      setForm({
        ...form,
        rating: parseInt(e.target.value) || 0,
      })
    }
  />
</div>

{/* NOTES */}
<div className="col-span-2 space-y-2">
  <Label>Notes</Label>
  <Textarea
    value={form.notes}
    onChange={(e) =>
      setForm({ ...form, notes: e.target.value })
    }
    rows={3}
  />
</div>
            {/* rest same as your code */}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editing ? "Update" : "Add"} Family
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}