import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import RequireRole from "@/components/admin/RequireRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supplementService, type Supplement } from "@/lib/firebase";

function SupplementsContent() {
  const { toast } = useToast();
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Supplement | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    isAvailable: true,
  });

  useEffect(() => {
    const unsubscribe = supplementService.subscribe((data) => {
      setSupplements(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      isAvailable: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (item: Supplement) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      description: item.description || "",
      isAvailable: item.isAvailable,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.price.trim()) {
      toast({ description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      if (editingItem) {
        await supplementService.update(editingItem.id, {
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          isAvailable: formData.isAvailable,
        });
        toast({ description: "Supplement updated successfully" });
      } else {
        await supplementService.create({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          isAvailable: formData.isAvailable,
        });
        toast({ description: "Supplement created successfully" });
      }
      setDialogOpen(false);
    } catch (error) {
      toast({ description: "Error saving supplement", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this supplement?")) return;
    
    try {
      await supplementService.delete(id);
      toast({ description: "Supplement deleted successfully" });
    } catch (error) {
      toast({ description: "Error deleting supplement", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">Supplements</h1>
          <Button onClick={openCreate} className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Supplement
          </Button>
        </div>

        <div className="grid gap-4">
          {supplements.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-500">No supplements found. Create one to get started.</p>
              </CardContent>
            </Card>
          ) : (
            supplements.map((supplement) => (
              <Card key={supplement.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{supplement.name}</h3>
                      {supplement.description && (
                        <p className="text-sm text-slate-600 mt-1">{supplement.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-lg font-bold text-red-600">{supplement.price} DA</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          supplement.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {supplement.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEdit(supplement)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(supplement.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Supplement" : "Create Supplement"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Supplement Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Extra Chocolate"
                />
              </div>

              <div>
                <Label htmlFor="price">Price (DA) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Supplement description"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isAvailable}
                  onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                />
                <Label>Available</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                {editingItem ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

export default function SupplementsPage() {
  return (
    <RequireRole allowedRoles={["admin"]}>
      <SupplementsContent />
    </RequireRole>
  );
}
