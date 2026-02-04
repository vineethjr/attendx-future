import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent, Student, CreateStudentData } from "@/hooks/useStudents";
import { z } from "zod";

const departments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Information Technology"];
const semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  roll_number: z.string().min(1, "Roll number is required").max(50),
  department: z.string().min(1, "Department is required"),
  semester: z.number().min(1).max(10),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(15).optional().or(z.literal("")),
});

const StudentsPage = () => {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<CreateStudentData>({
    name: "",
    roll_number: "",
    department: "",
    semester: 1,
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: students = [], isLoading } = useStudents();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.roll_number.toLowerCase().includes(search.toLowerCase()) ||
      student.department.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ name: "", roll_number: "", department: "", semester: 1, email: "", phone: "" });
    setErrors({});
    setEditingStudent(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      roll_number: student.roll_number,
      department: student.department,
      semester: student.semester,
      email: student.email || "",
      phone: student.phone || "",
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (student: Student) => {
    setDeletingStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    try {
      studentSchema.parse(formData);
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

    const submitData = {
      ...formData,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
    };

    if (editingStudent) {
      await updateStudent.mutateAsync({ id: editingStudent.id, ...submitData });
    } else {
      await createStudent.mutateAsync(submitData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (deletingStudent) {
      await deleteStudent.mutateAsync(deletingStudent.id);
      setIsDeleteDialogOpen(false);
      setDeletingStudent(null);
    }
  };

  return (
    <div>
      <DashboardHeader title="Students" subtitle="Manage student records" />

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, roll number, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Student
        </Button>
      </div>

      {/* Students Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Roll Number</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Department</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Semester</th>
                <th className="text-left p-4 font-medium hidden xl:table-cell">Email</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-4"><div className="h-5 w-32 bg-muted animate-pulse rounded" /></td>
                    <td className="p-4"><div className="h-5 w-24 bg-muted animate-pulse rounded" /></td>
                    <td className="p-4 hidden md:table-cell"><div className="h-5 w-28 bg-muted animate-pulse rounded" /></td>
                    <td className="p-4 hidden lg:table-cell"><div className="h-5 w-12 bg-muted animate-pulse rounded" /></td>
                    <td className="p-4 hidden xl:table-cell"><div className="h-5 w-36 bg-muted animate-pulse rounded" /></td>
                    <td className="p-4"><div className="h-5 w-20 bg-muted animate-pulse rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>{search ? "No students found matching your search" : "No students registered yet"}</p>
                    <Button variant="link" onClick={openCreateDialog} className="mt-2">
                      Add your first student
                    </Button>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredStudents.map((student) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-t border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4 font-medium">{student.name}</td>
                      <td className="p-4">{student.roll_number}</td>
                      <td className="p-4 hidden md:table-cell">{student.department}</td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                          Sem {student.semester}
                        </span>
                      </td>
                      <td className="p-4 hidden xl:table-cell text-muted-foreground">
                        {student.email || "—"}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(student)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => openDeleteDialog(student)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Edit Student" : "Register New Student"}</DialogTitle>
            <DialogDescription>
              {editingStudent ? "Update the student's information below." : "Fill in the details to register a new student."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Roll Number *</label>
              <Input
                value={formData.roll_number}
                onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                placeholder="CS2024001"
                className={errors.roll_number ? "border-destructive" : ""}
              />
              {errors.roll_number && <p className="text-sm text-destructive">{errors.roll_number}</p>}
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
                {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
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
                      <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createStudent.isPending || updateStudent.isPending}>
                {editingStudent ? "Update" : "Register"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingStudent?.name}</strong>? This action cannot be undone and will also remove all their attendance records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingStudent(null)}>Cancel</AlertDialogCancel>
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

export default StudentsPage;
