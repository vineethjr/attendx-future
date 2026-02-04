import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Send, Trash2, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useMessages, useCreateMessage, useDeleteMessage, Message } from "@/hooks/useMessages";
import { format } from "date-fns";
import { z } from "zod";

const messageSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

const MessagesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState<Message | null>(null);
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: messages = [], isLoading } = useMessages();
  const createMessage = useCreateMessage();
  const deleteMessage = useDeleteMessage();

  const resetForm = () => {
    setFormData({ title: "", message: "" });
    setErrors({});
  };

  const validateForm = () => {
    try {
      messageSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await createMessage.mutateAsync(formData);
    setIsDialogOpen(false);
    resetForm();
  };

  const openDeleteDialog = (message: Message) => {
    setDeletingMessage(message);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deletingMessage) {
      await deleteMessage.mutateAsync(deletingMessage.id);
      setIsDeleteDialogOpen(false);
      setDeletingMessage(null);
    }
  };

  return (
    <div>
      <DashboardHeader title="Messages" subtitle="Send announcements to students" />

      {/* New Message Button */}
      <div className="mb-6">
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Announcement
        </Button>
      </div>

      {/* Messages List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6">
              <div className="h-6 w-48 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-full bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Messages Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            Create your first announcement to broadcast to all students.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Announcement
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Send className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold">{message.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-3 whitespace-pre-wrap">
                      {message.message}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Sent {format(new Date(message.sent_at), "PPp")}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => openDeleteDialog(message)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Message Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Announcement</DialogTitle>
            <DialogDescription>
              Create a new announcement to broadcast to all students.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Exam Schedule Update"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message *</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your announcement here..."
                rows={5}
                className={errors.message ? "border-destructive" : ""}
              />
              {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMessage.isPending} className="gap-2">
                <Send className="w-4 h-4" />
                Send Announcement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingMessage(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MessagesPage;
