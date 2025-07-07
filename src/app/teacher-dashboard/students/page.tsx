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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { teachers, students, schedule } from '@/lib/data';

// Assuming logged-in teacher is Ms. Ava Davis
const teacher = teachers.find(t => t.id === 'T02');
const teacherSubjects = ['Physics', 'Chemistry']; 

const getTeacherStudents = () => {
    if (!teacher) return [];
    const teacherClasses = new Set<string>();
    Object.entries(schedule).forEach(([grade, slots]) => {
        slots.forEach(slot => {
            Object.values(slot).forEach(subject => {
                if (typeof subject === 'string' && teacherSubjects.includes(subject)) {
                    teacherClasses.add(grade);
                }
            });
        });
    });

    return students.filter(s => teacherClasses.has(s.grade));
};

type Student = (typeof students)[0];

export default function TeacherStudentsPage() {
  const [teacherStudents] = useState(getTeacherStudents());
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const handleOpenViewModal = (student: Student) => {
    setViewingStudent(student);
    setViewModalOpen(true);
  };
  
  if (!teacher) {
      return (
            <Card>
              <CardHeader>
                  <CardTitle>Error</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>Teacher profile not found. This is a demo page for a sample teacher.</p>
              </CardContent>
          </Card>
      );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>My Students</CardTitle>
            <CardDescription>A list of all students in your classes.</CardDescription>
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
              {teacherStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.parentName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleOpenViewModal(student)}>View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
