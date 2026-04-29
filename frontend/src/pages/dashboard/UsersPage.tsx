import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

const users = [
  { name: "Sarah Miller", email: "sarah@resipilot.com", role: "social_worker", status: "Active", lastLogin: "2 hours ago" },
  { name: "John Davis", email: "john@resipilot.com", role: "social_worker", status: "Active", lastLogin: "4 hours ago" },
  { name: "Maria Garcia", email: "maria@resipilot.com", role: "supervisor", status: "Active", lastLogin: "1 day ago" },
  { name: "Admin User", email: "admin@resipilot.com", role: "admin", status: "Active", lastLogin: "Just now" },
  { name: "Jane Thompson", email: "jane@resipilot.com", role: "viewer", status: "Inactive", lastLogin: "30 days ago" },
];

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  supervisor: "bg-primary/10 text-primary",
  social_worker: "bg-success/10 text-success",
  viewer: "bg-muted text-muted-foreground",
};

export default function UsersPage() {
  return (
    <div>
      <PageHeader title="User Management" description="Manage team members and roles" actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add User</Button>} />
      <div className="p-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead>
                  <TableHead>Status</TableHead><TableHead>Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                    <TableCell><Badge variant="secondary" className={roleColors[u.role]}>{u.role.replace("_", " ")}</Badge></TableCell>
                    <TableCell><Badge variant="secondary" className={u.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>{u.status}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.lastLogin}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
