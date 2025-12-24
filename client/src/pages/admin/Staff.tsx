import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import RequireRole from "@/components/admin/RequireRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, User } from "lucide-react";
import { staffService, type StaffMember, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function StaffContent() {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "Staff A" as "Staff A" | "Staff B",
  });

  useEffect(() => {
    const unsubscribe = staffService.subscribe((data) => {
      setStaff(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openCreate = () => {
    setFormData({
      email: "",
      name: "",
      role: "Staff A",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.name) {
      toast({ title: "Error", description: "Email and name are required", variant: "destructive" });
      return;
    }

    try {
      await setDoc(doc(db, "staff", formData.email), {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        createdAt: serverTimestamp(),
      });
      toast({ title: "Success", description: "Staff member added" });
      setDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to add staff member", variant: "destructive" });
    }
  };

  const handleDelete = async (email: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;

    try {
      await staffService.delete(email);
      toast({ title: "Success", description: "Staff member removed" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove staff member", variant: "destructive" });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Staff A":
        return "bg-blue-100 text-blue-800";
      case "Staff B":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
            <p className="text-slate-600">Manage staff members and their roles</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" /> Add Staff
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-800">Staff A</h3>
              <p className="text-sm text-blue-600">Can manage orders (view and update status)</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-purple-800">Staff B</h3>
              <p className="text-sm text-purple-600">Can manage reviews and contact messages</p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : staff.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-slate-500">
              No staff members yet. Click "Add Staff" to add one.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-slate-500">{member.email}</p>
                      <Badge className={`mt-2 ${getRoleBadgeColor(member.role)}`}>
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(member.email)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="staff@example.com"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                This must match the email they use to sign in with Google
              </p>
            </div>
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val as "Staff A" | "Staff B" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Staff A">Staff A (Orders)</SelectItem>
                  <SelectItem value="Staff B">Staff B (Reviews/Messages)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add Staff</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function Staff() {
  return (
    <RequireRole allowedRoles={["admin"]}>
      <StaffContent />
    </RequireRole>
  );
}