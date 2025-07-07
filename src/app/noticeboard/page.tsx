
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { notices, academic, students, teachers } from '@/lib/data';
import { format } from 'date-fns';

type Notice = (typeof notices)[0];

export default function NoticeboardPage() {
  const [noticesData, setNoticesData] = useState(notices);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  // For demonstration, we'll assume the logged-in user is 'Admin'.
  // In a real application, this would come from an authentication context.
  const currentAdmin = 'Admin';

  const handleOpenModal = (notice: Notice | null) => {
    setEditingNotice(notice);
    setModalOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const target = formData.get('target') as string;

    if (title && content && target) {
      if (editingNotice) {
        // Edit existing notice
        const updatedNotice = { ...editingNotice, title, content, target, date: format(new Date(), 'yyyy-MM-dd') };
        setNoticesData(noticesData.map((n) => (n.id === editingNotice.id ? updatedNotice : n)));
      } else {
        // Add new notice
        const newNotice: Notice = {
          id: `N${(noticesData.length + 1).toString().padStart(2, '0')}`,
          title,
          content,
          target,
          date: format(new Date(), 'yyyy-MM-dd'),
          author: currentAdmin, // Set the author to the current admin
        };
        setNoticesData([newNotice, ...noticesData]);
      }
      setModalOpen(false);
      setEditingNotice(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setNoticesData(noticesData.filter((n) => n.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Noticeboard</CardTitle>
              <CardDescription>Manage and publish notices for all users.</CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={() => handleOpenModal(null)}>
              <PlusCircle className="h-4 w-4" />
              Add Notice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {noticesData.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell>{notice.date}</TableCell>
                  <TableCell className="font-medium">{notice.title}</TableCell>
                  <TableCell>{notice.target}</TableCell>
                  <TableCell>{notice.author}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenModal(notice)}>Edit</DropdownMenuItem>
                        {notice.author === currentAdmin && (
                           <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(notice)}>
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Notice Modal */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingNotice ? 'Edit Notice' : 'Add New Notice'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} key={editingNotice ? editingNotice.id : 'add-notice'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" name="title" className="col-span-3" required defaultValue={editingNotice?.title} />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  Content
                </Label>
                <Textarea id="content" name="content" className="col-span-3" rows={5} required defaultValue={editingNotice?.content} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target" className="text-right">
                  Target
                </Label>
                <Select name="target" required defaultValue={editingNotice?.target || 'All Users'}>
                  <SelectTrigger className="col-span-3" id="target">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>General</SelectLabel>
                      <SelectItem value="All Users">All Users</SelectItem>
                      <SelectItem value="All Students">All Students</SelectItem>
                      <SelectItem value="All Teachers">All Teachers</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Classes</SelectLabel>
                      {academic.classes.map((c) => (
                        <SelectItem key={c.id} value={`Class: ${c.name}`}>
                          {`Class: ${c.name}`}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Sections</SelectLabel>
                      {academic.sections.map((s) => (
                         <SelectItem key={s.id} value={`Section: ${s.name} (${s.className})`}>
                            {`Section: ${s.name} (${s.className})`}
                         </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Groups</SelectLabel>
                      {academic.groups.map((g) => (
                        <SelectItem key={g.id} value={`Group: ${g.name}`}>
                          {`Group: ${g.name}`}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Students</SelectLabel>
                      {students.map((s) => (
                        <SelectItem key={s.id} value={`Student: ${s.name}`}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Teachers</SelectLabel>
                      {teachers.map((t) => (
                        <SelectItem key={t.id} value={`Teacher: ${t.name}`}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
              This action cannot be undone. This will permanently delete this notice.
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
