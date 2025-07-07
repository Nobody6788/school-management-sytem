
'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { MessageSquare } from 'lucide-react';
import { teachers, parents } from '@/lib/data';

type Teacher = (typeof teachers)[0];

// Mocking the logged-in parent
const loggedInParent = parents.find(p => p.id === 'P01');

export default function ParentTeachersPage() {
  const [allTeachers] = useState(teachers);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);

  const handleOpenViewModal = (teacher: Teacher) => {
    setViewingTeacher(teacher);
    setViewModalOpen(true);
  };

  if (!loggedInParent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Parent profile not found. This is a demo page for a sample parent.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Teacher Directory</CardTitle>
            <CardDescription>View a list of all teachers and contact them.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.specialization}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/parent-dashboard/messaging">
                             <MessageSquare className="mr-2 h-4 w-4" /> Message
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleOpenViewModal(teacher)}>View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Teacher Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Teacher Details</DialogTitle>
            <DialogDescription>
              Information for {viewingTeacher?.name}.
            </DialogDescription>
          </DialogHeader>
          {viewingTeacher && (
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Teacher ID</div>
                <div className="col-span-2">{viewingTeacher.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Full Name</div>
                <div className="col-span-2">{viewingTeacher.name}</div>
              </div>
               <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Specialization</div>
                <div className="col-span-2">{viewingTeacher.specialization}</div>
              </div>
               <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Contact Email</div>
                <div className="col-span-2">{viewingTeacher.email}</div>
              </div>
               <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Phone</div>
                <div className="col-span-2">{viewingTeacher.phone}</div>
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
