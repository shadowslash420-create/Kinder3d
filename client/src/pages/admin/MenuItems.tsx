import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import RequireRole from "@/components/admin/RequireRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Image } from "lucide-react";
import { menuService, categoryService, type MenuItem, type Category } from "@/lib/firebase";

function MenuItemsContent() {
  const { toast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    isAvailable: true,
    isFeatured: false,
    preparationTime: "",
    ingredients: "",
  });

  useEffect(() => {
    const unsubMenu = menuService.subscribe((data) => {
      setItems(data);
      setLoading(false);
    });
    const unsubCat = categoryService.subscribe(setCategories);
    return () => {
      unsubMenu();
      unsubCat();
    };
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      categoryId: "",
      isAvailable: true,
      isFeatured: false,
      preparationTime: "",
      ingredients: "",
    });
    setDialogOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      imageUrl: item.imageUrl || "",
      categoryId: item.categoryId || "",
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
      preparationTime: item.preparationTime?.toString() || "",
      ingredients: item.ingredients || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      price: parseFloat(formData.price) || 0,
      imageUrl: formData.imageUrl || undefined,
      categoryId: formData.categoryId || undefined,
      isAvailable: formData.isAvailable,
      isFeatured: formData.isFeatured,
      preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : undefined,
      ingredients: formData.ingredients || undefined,
    };

    try {
      if (editingItem) {
        await menuService.update(editingItem.id, payload);
      } else {
        await menuService.create(payload);
      }
      toast({ title: "Success", description: `Menu item ${editingItem ? "updated" : "created"}` });
      setDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save menu item", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await menuService.delete(id);
      toast({ title: "Success", description: "Menu item deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete menu item", variant: "destructive" });
    }
  };

  const getCategoryName = (id: string | undefined) => {
    if (!id) return "Uncategorized";
    return categories.find((c) => c.id === id)?.name || "Unknown";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Menu Items</h1>
            <p className="text-slate-600">Manage your menu items</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video bg-slate-100 relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Image className="h-12 w-12 text-slate-300" />
                    </div>
                  )}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-medium">Unavailable</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-slate-500">{getCategoryName(item.categoryId)}</p>
                    </div>
                    <span className="font-bold text-red-600">DA {item.price.toFixed(2)}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {items.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500">
                No menu items yet. Click "Add Item" to create one.
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit" : "Add"} Menu Item</DialogTitle>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (DA) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId || "none"}
                  onValueChange={(val) => setFormData({ ...formData, categoryId: val === "none" ? "" : val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea
                id="ingredients"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                placeholder="List ingredients, separated by commas"
              />
            </div>
            <div>
              <Label htmlFor="prepTime">Preparation Time (minutes)</Label>
              <Input
                id="prepTime"
                type="number"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isAvailable}
                  onCheckedChange={(val) => setFormData({ ...formData, isAvailable: val })}
                />
                <Label>Available</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(val) => setFormData({ ...formData, isFeatured: val })}
                />
                <Label>Featured</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{editingItem ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function MenuItems() {
  return (
    <RequireRole allowedRoles={["admin"]}>
      <MenuItemsContent />
    </RequireRole>
  );
}
