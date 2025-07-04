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
import { Button } from '@/components/ui/button';
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
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { students, academic } from '@/lib/data';

type Student = (typeof students)[0];

export default function StudentsPage() {
  const [studentsData, setStudentsData] = useState(students);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | undefined>();

  const handleAddStudent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newStudent: Student = {
      id: `S${(studentsData.length + 1).toString().padStart(3, '0')}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      grade: formData.get('grade') as string,
      section: formData.get('section') as string,
      dob: formData.get('dob') as string,
      parentName: formData.get('parentName') as string,
    };

    if (newStudent.name && newStudent.email && newStudent.grade && newStudent.section && newStudent.dob && newStudent.parentName) {
      setStudentsData([...studentsData, newStudent]);
      setAddModalOpen(false);
      setSelectedClass(undefined);
    }
  };
  
  const handleOpenAddModal = () => {
    setSelectedClass(undefined);
    setAddModalOpen(true);
  }

  const handleOpenViewModal = (student: Student) => {
    setViewingStudent(student);
    setViewModalOpen(true);
  };

  const availableSections = academic.sections.filter(s => s.className === selectedClass);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>View, add, and manage student profiles.</CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={handleOpenAddModal}>
              <PlusCircle className="h-4 w-4" />
              Add Student
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Parent Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.parentName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenViewModal(student)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Student Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Student Admission</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStudent} key={isAddModalOpen ? 'add-student-form' : 'closed'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" name="email" type="email" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parentName" className="text-right">Parent's Name</Label>
                <Input id="parentName" name="parentName" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dob" className="text-right">Date of Birth</Label>
                <Input id="dob" name="dob" type="date" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="grade" className="text-right">Class</Label>
                <Select name="grade" required onValueChange={setSelectedClass}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {academic.classes.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="section" className="text-right">Section</Label>
                <Select name="section" required disabled={!selectedClass}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select section after class" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSections.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>Cancel</Button>
              <Button type="submit">Add Student</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Student Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Full information for {viewingStudent?.name}.
            </DialogDescription>
          </DialogHeader>
          {viewingStudent && (
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Student ID</div>
                <div className="col-span-2">{viewingStudent.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Full Name</div>
                <div className="col-span-2">{viewingStudent.name}</div>
              </div>
               <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Date of Birth</div>
                <div className="col-span-2">{viewingStudent.dob}</div>
              </div>
               <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Class</div>
                <div className="col-span-2">{viewingStudent.grade}</div>
              </div>
               <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Section</div>
                <div className="col-span-2">{viewingStudent.section}</div>
              </div>

              <h3 className="font-semibold text-base mt-4 border-t pt-4">Parent Information</h3>
               <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Parent's Name</div>
                <div className="col-span-2">{viewingStudent.parentName}</div>
              </div>
               <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Contact Email</div>
                <div className="col-span-2">{viewingStudent.email}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
