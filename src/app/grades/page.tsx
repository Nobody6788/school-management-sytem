'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { academic } from '@/lib/data';

type Grade = (typeof academic.grades)[0];

export default function GradesPage() {
  const [grades, setGrades] = useState(academic.grades);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Grade | null>(null);

  const handleOpenModal = (grade: Grade | null) => {
    setEditingGrade(grade);
    setModalOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const gradeName = formData.get('gradeName') as string;
    const gradePoint = formData.get('gradePoint') as string;
    const percentageFrom = parseInt(formData.get('percentageFrom') as string, 10);
    const percentageTo = parseInt(formData.get('percentageTo') as string, 10);

    if (gradeName && gradePoint && !isNaN(percentageFrom) && !isNaN(percentageTo)) {
      if (editingGrade) {
        setGrades(grades.map((g) => (g.id === editingGrade.id ? { ...g, gradeName, gradePoint, percentageFrom, percentageTo } : g)));
      } else {
        setGrades([...grades, { id: `GR${(grades.length + 1).toString().padStart(2, '0')}`, gradeName, gradePoint, percentageFrom, percentageTo }]);
      }
      setModalOpen(false);
      setEditingGrade(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setGrades(grades.filter((g) => g.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Grade Management</CardTitle>
              <CardDescription>Define and manage the grading system for examinations.</CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={() => handleOpenModal(null)}>
              <PlusCircle className="h-4 w-4" />
              Add Grade
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grade Name</TableHead>
                <TableHead>Grade Point</TableHead>
                <TableHead>Percentage From</TableHead>
                <TableHead>Percentage To</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">{grade.gradeName}</TableCell>
                  <TableCell>{grade.gradePoint}</TableCell>
                  <TableCell>{grade.percentageFrom}%</TableCell>
                  <TableCell>{grade.percentageTo}%</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenModal(grade)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(grade)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Grade Modal */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingGrade ? 'Edit Grade' : 'Add New Grade'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} key={editingGrade ? editingGrade.id : 'add-grade'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gradeName" className="text-right">Grade Name</Label>
                <Input id="gradeName" name="gradeName" className="col-span-3" required defaultValue={editingGrade?.gradeName} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gradePoint" className="text-right">Grade Point</Label>
                <Input id="gradePoint" name="gradePoint" className="col-span-3" required defaultValue={editingGrade?.gradePoint} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="percentageFrom" className="text-right">Percentage From</Label>
                <Input id="percentageFrom" name="percentageFrom" type="number" className="col-span-3" required defaultValue={editingGrade?.percentageFrom} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="percentageTo" className="text-right">Percentage To</Label>
                <Input id="percentageTo" name="percentageTo" type="number" className="col-span-3" required defaultValue={editingGrade?.percentageTo} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this grade.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: 'destructive' })}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
