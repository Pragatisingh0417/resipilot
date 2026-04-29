"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  FileText,
  Download,
  Eye,
  Search,
  Trash2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Doc = {
  _id: string;
  title: string;
  type: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  createdAt?: string;
  tags?: string[];
};

const emptyForm = {
  title: "",
  type: "other",
  tags: "",
};

const typeColors: Record<string, string> = {
  report: "bg-primary/10 text-primary",
  legal: "bg-purple-100 text-purple-700",
  medical: "bg-destructive/10 text-destructive",
  education: "bg-success/10 text-success",
  other: "bg-muted text-muted-foreground",
};

export default function DocumentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const token = localStorage.getItem("token"); // ✅ ADD HERE


  const { toast } = useToast();
  const qc = useQueryClient();

  // ================= FETCH =================
  const { data: docs = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await fetch("/api/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });



      const data = await res.json();

      // ✅ FIX HERE
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.documents)) return data.documents;
      if (Array.isArray(data.data)) return data.data;

      return []; // fallback
    },
  });

  // ================= ADD =================
  const add = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("type", form.type);

      if (file) formData.append("file", file);

      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      formData.append("tags", JSON.stringify(tags));

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      return res.json();
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast({ title: "Document uploaded" });
      setDialogOpen(false);
      setFile(null);
    },

    onError: () =>
      toast({
        variant: "destructive",
        title: "Upload failed",
      }),
  });

  // ================= DELETE =================
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      const res = await fetch(`/api/documents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ REQUIRED
        },
      });

      if (!res.ok) throw new Error("Delete failed");
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      toast({ title: "Document removed" });
    },
  });

  const filtered = docs.filter((d: Doc) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title) {
      toast({ variant: "destructive", title: "Title is required" });
      return;
    }

    add.mutate();
  };

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Manage case documents and files"
        actions={
          <Button onClick={openAdd} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Upload Document
          </Button>
        }
      />

      <div className="p-6">
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search documents..."
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
          <div className="space-y-3">
            {filtered.map((doc: Doc) => (
              <Card key={doc._id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <p className="font-medium text-sm">{doc.title}</p>

                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={typeColors[doc.type]}
                        >
                          {doc.type}
                        </Badge>

                        <span className="text-xs text-muted-foreground">
                          {doc.fileSize
                            ? `${(doc.fileSize / 1024).toFixed(2)} KB`
                            : ""}
                          {doc.createdAt
                            ? ` · ${new Date(doc.createdAt).toLocaleDateString()}`
                            : ""}
                        </span>
                      </div>

                      {doc.tags && doc.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {doc.tags.map((t) => (
                            <Badge key={t} variant="outline" className="text-xs">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (doc.fileUrl) {
                          window.open(`http://localhost:5000${doc.fileUrl}`, "_blank");
                        }
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (!doc.fileUrl) return;

                        const filename = doc.fileUrl.split("/").pop();

                        window.open(
                          `http://localhost:5000/api/documents/download/${filename}`,
                          "_blank"
                        );
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove.mutate(doc._id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No documents found
              </p>
            )}
          </div>
        )}
      </div>

      {/* ================= DIALOG ================= */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>File</Label>
              <Input
                type="file"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                value={form.tags}
                onChange={(e) =>
                  setForm({ ...form, tags: e.target.value })
                }
                placeholder="case, urgent"
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

            <Button onClick={handleSave} disabled={add.isPending}>
              {add.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              )}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}