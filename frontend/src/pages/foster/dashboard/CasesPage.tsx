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

/* ================= TYPES ================= */

type Case = {
_id: string;
caseNumber: string;
child: any;
status: string;
priority: string;
assignedWorker?: any;
description?: string;
};

type Child = {
_id: string;
firstName: string;
lastName: string;
};

/* ================= FORM ================= */

const emptyForm = {
case_number: "",
child_id: "",
status: "open",
priority: "medium",
assigned_worker: "",
description: "",
};

const priorityColors: Record<string, string> = {
low: "bg-success/10 text-success",
medium: "bg-warning/10 text-warning",
high: "bg-destructive/10 text-destructive",
urgent: "bg-purple-100 text-purple-700",
};

const statusColors: Record<string, string> = {
open: "bg-primary/10 text-primary",
in_progress: "bg-warning/10 text-warning",
review: "bg-purple-100 text-purple-700",
closed: "bg-muted text-muted-foreground",
};

/* ================= PAGE ================= */

export default function CasesPage() {
const [dialogOpen, setDialogOpen] = useState(false);
const [editing, setEditing] = useState<Case | null>(null);
const [form, setForm] = useState(emptyForm);
const [search, setSearch] = useState("");

const { toast } = useToast();
const qc = useQueryClient();

/* ================= FETCH CASES ================= */

const { data: casesData, isLoading } = useQuery({
queryKey: ["cases"],
queryFn: async () => {
const res = await api.get("/cases");
return res;
},
});

const cases: Case[] = casesData?.data || [];

/* ================= FETCH CHILDREN ================= */

const { data: childrenData } = useQuery({
queryKey: ["children"],
queryFn: async () => {
const res = await api.get("/children");
return res;
},
});

const children: Child[] = childrenData?.data || [];

/* ================= UPSERT ================= */

const upsert = useMutation({
  mutationFn: async (values: typeof emptyForm & { _id?: string }) => {
    const payload = {
      caseNumber: values.case_number,
      child: values.child_id, // ✅ required ObjectId
      status: values.status,
      priority: values.priority,
      assignedWorker: values.assigned_worker || null,
      description: values.description || null,
    };

    if (values._id) {
      return await api.put(`/cases/${values._id}`, payload);
    } else {
      return await api.post(`/cases`, payload);
    }
  },

  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["cases"] });
    toast({
      title: editing ? "Case updated" : "Case created",
    });
    setDialogOpen(false);
  },

  onError: (e: any) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: e.message,
    });
  },
});

/* ================= DELETE ================= */

const remove = useMutation({
mutationFn: async (id: string) => await api.del(`/cases/${id}`),
onSuccess: () => {
qc.invalidateQueries({ queryKey: ["cases"] });
toast({ title: "Case removed" });
},
});

/* ================= LOGIC ================= */

const filtered = cases.filter(
(c) =>
c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
`${c.child?.firstName} ${c.child?.lastName}`
.toLowerCase()
.includes(search.toLowerCase())
);

const openAdd = () => {
setEditing(null);
setForm({
...emptyForm,
case_number: `CS-${Date.now()}`,
});
setDialogOpen(true);
};

const openEdit = (c: Case) => {
  setEditing(c);

  setForm({
    case_number: c.caseNumber,
    child_id: c.child?._id || "",
    status: c.status,
    priority: c.priority,
    assigned_worker: c.assignedWorker?._id || "",
    description: c.description || "",
  });

  setDialogOpen(true);
};

const handleSave = () => {
  if (!form.case_number || !form.child_id) {
    toast({
      variant: "destructive",
      title: "Case number & child required",
    });
    return;
  }

  upsert.mutate(
    editing ? { ...form, _id: editing._id } : form
  );
};

/* ================= UI ================= */

return ( <div>
<PageHeader
title="Case Management"
description="Track and manage cases"
actions={ <Button onClick={openAdd} size="sm"> <Plus className="h-4 w-4 mr-1" /> New Case </Button>
}
/>
  <div className="p-6">
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <Input
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case #</TableHead>
                <TableHead>Child</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((c) => (
                <TableRow
                  key={c._id}
                  onClick={() => openEdit(c)}
                  className="cursor-pointer"
                >
                  <TableCell>{c.caseNumber}</TableCell>

                  <TableCell>
                    {c.child?.firstName} {c.child?.lastName}
                  </TableCell>

                  <TableCell>
                    <Badge className={statusColors[c.status]}>
                      {c.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge className={priorityColors[c.priority]}>
                      {c.priority}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove.mutate(c._id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No cases found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  </div>

  {/* ================= FORM ================= */}

 <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>
        {editing ? "Edit Case" : "New Case"}
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-4">

      {/* CASE NUMBER */}
      <div className="space-y-2">
        <Label>Case Number *</Label>
        <Input
          value={form.case_number}
          onChange={(e) =>
            setForm({ ...form, case_number: e.target.value })
          }
        />
      </div>

      {/* 🔥 CHILD DROPDOWN */}
      <div className="space-y-2">
        <Label>Select Child *</Label>
        <Select
          value={form.child_id}
          onValueChange={(v) =>
            setForm({ ...form, child_id: v })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            {children.map((child) => (
              <SelectItem key={child._id} value={child._id}>
                {child.firstName} {child.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* STATUS + PRIORITY */}
      <div className="grid grid-cols-2 gap-4">

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) =>
              setForm({ ...form, status: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={form.priority}
            onValueChange={(v) =>
              setForm({ ...form, priority: v })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      {/* ASSIGNED WORKER */}
      <div className="space-y-2">
        <Label>Assigned Worker</Label>
        <Input
          value={form.assigned_worker}
          onChange={(e) =>
            setForm({ ...form, assigned_worker: e.target.value })
          }
          placeholder="Worker ID (optional)"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          rows={3}
        />
      </div>

    </div>

    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => setDialogOpen(false)}
      >
        Cancel
      </Button>

      <Button onClick={handleSave}>
        {editing ? "Update" : "Create"} Case
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
</div>

);
}
