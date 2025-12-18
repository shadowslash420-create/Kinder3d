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
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import { categoryService, type Category } from "@/lib/firebase";

function CategoriesContent() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    displayOrder: "0",
    isActive: true,
  });

  useEffect(() => {
    const unsubscribe = categoryService.subscribe((data) => {
      setCategories(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      displayOrder: "0",
      isActive: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || "",
      displayOrder: (cat.displayOrder || 0).toString(),
      isActive: cat.isActive,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      displayOrder: parseInt(formData.displayOrder) || 0,
      isActive: formData.isActive,
    };

    try {
      console.log("Submitting category form:", { editingCategory: editingCategory?.id, payload });
      if (editingCategory) {
        await categoryService.update(editingCategory.id, payload);
      } else {
        await categoryService.create(payload);
      }
      toast({ title: "Success", description: `Category ${editingCategory ? "updated" : "created"}` });
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Error submitting category:", error.code, error.message, error);
      toast({ title: "Error", description: `Failed to save category: ${error.message || "Unknown error"}`, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await categoryService.delete(id);
      toast({ title: "Success", description: "Category deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
            <p className="text-slate-600">Organize your menu with categories</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Card key={cat.id} className={!cat.isActive ? "opacity-60" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{cat.name}</h3>
                        {!cat.isActive && (
                          <span className="text-xs bg-slate-200 px-2 py-1 rounded">Inactive</span>
                        )}
                      </div>
                      {cat.description && (
                        <p className="text-sm text-slate-600 mt-1">{cat.description}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-2">Order: {cat.displayOrder}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => openEdit(cat)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500">
                No categories yet. Click "Add Category" to create one.
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit" : "Add"} Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
              />
              <p className="text-xs text-slate-500 mt-1">Lower numbers appear first</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(val) => setFormData({ ...formData, isActive: val })}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{editingCategory ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function Categories() {
  return (
    <RequireRole allowedRoles={["admin"]}>
      <CategoriesContent />
    </RequireRole>
  );
}
