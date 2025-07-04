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
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { parents, students } from '@/lib/data';

type Parent = (typeof parents)[0];

export default function ParentsPage() {
  const [parentsData, setParentsData] = useState(parents);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [viewingParent, setViewingParent] = useState<Parent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Parent | null>(null);

  const getStudentName = (studentId: string) => {
    return students.find((s) => s.id === studentId)?.name || 'N/A';
  };

  const handleAddParent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const newParent: Parent = {
      id: `P${(parentsData.length + 1).toString().padStart(2, '0')}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      studentId: formData.get('studentId') as string,
    };

    if (newParent.name && newParent.email && newParent.phone && newParent.studentId) {
      setParentsData([...parentsData, newParent]);
      setAddModalOpen(false);
    }
  };

  const handleOpenEditModal = (parent: Parent) => {
    setEditingParent(parent);
    setEditModalOpen(true);
  };

  const handleEditParent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingParent) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const updatedParent: Parent = {
      ...editingParent,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      studentId: formData.get('studentId') as string,
    };

    setParentsData(parentsData.map(p => p.id === editingParent.id ? updatedParent : p));
    setEditModalOpen(false);
    setEditingParent(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setParentsData(parentsData.filter(p => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleOpenViewModal = (parent: Parent) => {
    setViewingParent(parent);
    setViewModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Parent Management</CardTitle>
              <CardDescription>View, add, edit, and manage parent profiles.</CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={() => setAddModalOpen(true)}>
              <PlusCircle className="h-4 w-4" />
              Add Parent
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parent ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Child's Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parentsData.map((parent) => (
                <TableRow key={parent.id}>
                  <TableCell className="font-medium">{parent.id}</TableCell>
                  <TableCell>{parent.name}</TableCell>
                  <TableCell>{getStudentName(parent.studentId)}</TableCell>
                  <TableCell>{parent.email}</TableCell>
                  <TableCell>{parent.phone}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenEditModal(parent)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenViewModal(parent)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(parent)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Parent Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Parent</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddParent} key={isAddModalOpen ? 'add-parent-form' : 'closed'}>
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
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" name="phone" type="tel" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="studentId" className="text-right">Child</Label>
                <Select name="studentId" required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>Cancel</Button>
              <Button type="submit">Add Parent</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Parent Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Parent Information</DialogTitle>
          </DialogHeader>
          {editingParent && (
            <form onSubmit={handleEditParent} key={editingParent.id}>
              <div className="grid gap-4 py-4">
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name-edit" className="text-right">Name</Label>
                    <Input id="name-edit" name="name" className="col-span-3" required defaultValue={editingParent.name} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email-edit" className="text-right">Email</Label>
                    <Input id="email-edit" name="email" type="email" className="col-span-3" required defaultValue={editingParent.email} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone-edit" className="text-right">Phone</Label>
                    <Input id="phone-edit" name="phone" type="tel" className="col-span-3" required defaultValue={editingParent.phone} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="studentId-edit" className="text-right">Child</Label>
                    <Select name="studentId" required defaultValue={editingParent.studentId}>
                      <SelectTrigger id="studentId-edit" className="col-span-3">
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* View Parent Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Parent Details</DialogTitle>
            <DialogDescription>
              Full information for {viewingParent?.name}.
            </DialogDescription>
          </DialogHeader>
          {viewingParent && (
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Parent ID</div>
                <div className="col-span-2">{viewingParent.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Full Name</div>
                <div className="col-span-2">{viewingParent.name}</div>
              </div>
               <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Contact Email</div>
                <div className="col-span-2">{viewingParent.email}</div>
              </div>
               <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Contact Phone</div>
                <div className="col-span-2">{viewingParent.phone}</div>
              </div>
              <h3 className="font-semibold text-base mt-4 border-t pt-4">Child Information</h3>
               <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Child's Name</div>
                <div className="col-span-2">{getStudentName(viewingParent.studentId)}</div>
              </div>
               <div className="grid grid-cols-3 gap-2">
                <div className="font-semibold text-muted-foreground">Child's ID</div>
                <div className="col-span-2">{viewingParent.studentId}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this parent's information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
