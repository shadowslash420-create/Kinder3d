import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Eye, Check, Trash2, Mail } from "lucide-react";
import { contactService, type ContactMessage } from "@/lib/firebase";

export default function Messages() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    const unsubscribe = contactService.subscribe((data) => {
      setMessages(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await contactService.markAsRead(id);
      toast({ title: "Success", description: "Marked as read" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const handleMarkAsResolved = async (id: string) => {
    try {
      await contactService.markAsResolved(id);
      toast({ title: "Success", description: "Marked as resolved" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await contactService.delete(id);
      toast({ title: "Success", description: "Message deleted" });
      setSelectedMessage(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const openMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      await handleMarkAsRead(msg.id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
          <p className="text-slate-600">View and manage customer inquiries</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-slate-500">
              No messages yet
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <Card key={msg.id} className={!msg.isRead ? "border-l-4 border-l-blue-500" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 cursor-pointer" onClick={() => openMessage(msg)}>
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className={`h-4 w-4 ${!msg.isRead ? "text-blue-500" : "text-slate-400"}`} />
                        <span className="font-semibold">{msg.name}</span>
                        <span className="text-sm text-slate-500">{msg.email}</span>
                        {!msg.isRead && <Badge className="bg-blue-100 text-blue-800">New</Badge>}
                        {msg.isResolved && <Badge className="bg-green-100 text-green-800">Resolved</Badge>}
                      </div>
                      <p className="font-medium text-slate-700">{msg.subject}</p>
                      <p className="text-sm text-slate-500 line-clamp-2 mt-1">{msg.message}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {msg.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openMessage(msg)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">From</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium">{selectedMessage.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="font-medium">{selectedMessage.createdAt.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-2">Message</p>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {!selectedMessage.isResolved && (
                  <Button
                    onClick={() => handleMarkAsResolved(selectedMessage.id)}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" /> Mark as Resolved
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
