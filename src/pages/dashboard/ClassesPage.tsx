import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useClasses, useCreateClass, useUpdateClass, useDeleteClass, Class, CreateClassData } from "@/hooks/useClasses";
import { format } from "date-fns";
import { z } from "zod";
import { cn } from "@/lib/utils";

const departments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Information Technology"];
const semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const classSchema = z.object({
  subject_name: z.string().min(2, "Subject name must be at least 2 characters"),
  department: z.string().min(1, "Department is required"),
  semester: z.number().min(1).max(10),
  class_date: z.string().min(1, "Date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
});

const ClassesPage = () => {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deletingClass, setDeletingClass] = useState<Class | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState<CreateClassData>({
    subject_name: "",
    department: "",
    semester: 1,
    class_date: "",
    start_time: "",
    end_time: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: classes = [], isLoading } = useClasses();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();

  const filteredClasses = classes.filter(
    (cls) =>
      cls.subject_name.toLowerCase().includes(search.toLowerCase()) ||
      cls.department.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ subject_name: "", department: "", semester: 1, class_date: "", start_time: "", end_time: "" });
    setErrors({});
    setEditingClass(null);
    setSelectedDate(undefined);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (cls: Class) => {
    setEditingClass(cls);
    setSelectedDate(new Date(cls.class_date));
    setFormData({
      subject_name: cls.subject_name,
      department: cls.department,
      semester: cls.semester,
      class_date: cls.class_date,
      start_time: cls.start_time,
      end_time: cls.end_time,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (cls: Class) => {
    setDeletingClass(cls);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    try {
      classSchema.parse(formData);
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

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData({ ...formData, class_date: format(date, "yyyy-MM-dd") });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingClass) {
      await updateClass.mutateAsync({ id: editingClass.id, ...formData });
    } else {
      await createClass.mutateAsync(formData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (deletingClass) {
      await deleteClass.mutateAsync(deletingClass.id);
      setIsDeleteDialogOpen(false);
      setDeletingClass(null);
    }
  };

  const isToday = (dateStr: string) => {
    return dateStr === format(new Date(), "yyyy-MM-dd");
  };

  const isPast = (dateStr: string) => {
    return new Date(dateStr) < new Date(format(new Date(), "yyyy-MM-dd"));
  };

  return (
    <div>
      <DashboardHeader title="Class Schedule" subtitle="Manage class timetables" />

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by subject or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Schedule Class
        </Button>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6">
              <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded mb-4" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
            </div>
          ))
        ) : filteredClasses.length === 0 ? (
          <div className="col-span-full glass-card rounded-xl p-8 text-center">
            <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50 text-muted-foreground" />
            <p className="text-muted-foreground">
              {search ? "No classes found matching your search" : "No classes scheduled yet"}
            </p>
            <Button variant="link" onClick={openCreateDialog} className="mt-2">
              Schedule your first class
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            {filteredClasses.map((cls) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "glass-card rounded-xl p-6 hover:shadow-lg transition-shadow relative overflow-hidden",
                  isToday(cls.class_date) && "ring-2 ring-primary",
                  isPast(cls.class_date) && "opacity-60"
                )}
              >
                {isToday(cls.class_date) && (
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Today
                  </span>
                )}

                <h3 className="font-semibold text-lg mb-1">{cls.subject_name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {cls.department} • Semester {cls.semester}
                </p>

                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span>{format(new Date(cls.class_date), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>{cls.start_time.slice(0, 5)} - {cls.end_time.slice(0, 5)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(cls)}
                    className="flex-1"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => openDeleteDialog(cls)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingClass ? "Edit Class" : "Schedule New Class"}</DialogTitle>
            <DialogDescription>
              {editingClass ? "Update the class details below." : "Fill in the details to schedule a new class."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject Name *</label>
              <Input
                value={formData.subject_name}
                onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                placeholder="Data Structures"
                className={errors.subject_name ? "border-destructive" : ""}
              />
              {errors.subject_name && <p className="text-sm text-destructive">{errors.subject_name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Department *</label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className={errors.department ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Semester *</label>
                <Select
                  value={formData.semester.toString()}
                  onValueChange={(value) => setFormData({ ...formData, semester: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>Sem {sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                      errors.class_date && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.class_date && <p className="text-sm text-destructive">{errors.class_date}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Time *</label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className={errors.start_time ? "border-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Time *</label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className={errors.end_time ? "border-destructive" : ""}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createClass.isPending || updateClass.isPending}>
                {editingClass ? "Update" : "Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingClass?.subject_name}</strong>? This will also remove all attendance records for this class.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingClass(null)}>Cancel</AlertDialogCancel>
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

export default ClassesPage;
