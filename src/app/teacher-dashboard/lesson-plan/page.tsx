
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
  DropdownMenuSeparator,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  PlusCircle,
  MoreHorizontal,
  Trash2,
  Copy,
  FileSpreadsheet,
  FileText,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { teachers, academic, schedule, lessonPlans as initialLessonPlans } from '@/lib/data';
import { format } from 'date-fns';
import { buttonVariants } from '@/components/ui/button';

// Mocking logged-in teacher
const teacher = teachers.find((t) => t.id === 'T02');
const teacherSubjects = ['Physics', 'Chemistry'];

const getTeacherSubjects = () => {
    if (!teacher) return [];
    
    const subjectNames = new Set<string>();
    
    Object.values(schedule).forEach(gradeSchedule => {
        gradeSchedule.forEach(slot => {
            Object.values(slot).forEach(subject => {
                if (typeof subject === 'string' && teacherSubjects.includes(subject)) {
                    subjectNames.add(subject);
                }
            });
        });
    });

    return academic.subjects.filter(s => subjectNames.has(s.name));
};

type LessonPlan = (typeof initialLessonPlans)[0];

export default function LessonPlanPage() {
  const [lessonPlans, setLessonPlans] = useState(initialLessonPlans);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LessonPlan | null>(null);
  const { toast } = useToast();
  const [teacherSubjectsList] = useState(getTeacherSubjects());

  const myLessonPlans = teacher ? lessonPlans.filter((lp) => lp.teacherId === teacher.id) : [];

  const handleOpenModal = (plan: LessonPlan | null) => {
    setEditingPlan(plan);
    setModalOpen(true);
  };
  
  const getSubjectName = (subjectId: string) => {
    return academic.subjects.find(s => s.id === subjectId)?.name || 'N/A';
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!teacher) return;
    
    const formData = new FormData(event.currentTarget);
    const data = {
        name: formData.get('name') as string,
        subjectId: formData.get('subjectId') as string,
        date: formData.get('date') as string,
        method: formData.get('method') as string,
        periods: parseInt(formData.get('periods') as string, 10),
        note: formData.get('note') as string,
        status: formData.get('status') as 'Pending' | 'Completed',
    };
    
    // Mock file handling
    const fileInput = formData.get('file') as File;
    const file = fileInput && fileInput.size > 0 ? fileInput.name : (editingPlan?.file || null);


    if (editingPlan) {
        setLessonPlans(lessonPlans.map(p => p.id === editingPlan.id ? { ...editingPlan, ...data, file } : p));
        toast({ title: 'Lesson Plan Updated', description: 'Your lesson plan has been successfully updated.' });
    } else {
        const newPlan: LessonPlan = {
            id: `LP${Date.now()}`,
            teacherId: teacher.id,
            ...data,
            file,
        };
        setLessonPlans([newPlan, ...lessonPlans]);
        toast({ title: 'Lesson Plan Created', description: 'Your new lesson plan has been added.' });
    }
    
    setModalOpen(false);
    setEditingPlan(null);
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setLessonPlans(lessonPlans.filter(p => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast({ title: 'Lesson Plan Deleted', description: 'The lesson plan has been removed.' });
  }

  const handleExport = (type: string) => {
    alert(`This is a placeholder for the "${type}" action.`);
  }

  if (!teacher) {
      return <p>Teacher not found.</p>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>My Lesson Plans</CardTitle>
              <CardDescription>Create, manage, and track your daily lesson plans.</CardDescription>
            </div>
            <div className="flex gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Export <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleExport('Copy')}><Copy /> Copy Table</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('Excel')}><FileSpreadsheet /> Export to Excel</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('CSV')}><FileText /> Export to CSV</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('PDF')}><FileText /> Export to PDF</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => window.print()}><Printer /> Print</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={() => handleOpenModal(null)}>
                    <PlusCircle className="mr-2" /> Add Lesson Plan
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SL</TableHead>
                <TableHead>Lesson Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>File</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myLessonPlans.map((plan, index) => (
                <TableRow key={plan.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{getSubjectName(plan.subjectId)}</TableCell>
                  <TableCell>{plan.method}</TableCell>
                  <TableCell>{format(new Date(plan.date), 'PPP')}</TableCell>
                  <TableCell>
                    <Badge variant={plan.status === 'Completed' ? 'default' : 'secondary'}>{plan.status}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{plan.note}</TableCell>
                  <TableCell>{plan.file ? plan.file : 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenModal(plan)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(plan)}><Trash2 className="mr-2"/>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {myLessonPlans.length === 0 && <p className="p-8 text-center text-muted-foreground">No lesson plans found.</p>}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Lesson Plan' : 'Add New Lesson Plan'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} key={editingPlan?.id || 'new'}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Lesson Name/Title</Label>
                        <Input id="name" name="name" required defaultValue={editingPlan?.name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subjectId">Subject</Label>
                        <Select name="subjectId" required defaultValue={editingPlan?.subjectId}>
                            <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                            <SelectContent>{teacherSubjectsList.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.className})</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="method">Teaching Method</Label>
                        <Input id="method" name="method" defaultValue={editingPlan?.method} placeholder="e.g., Lecture, Group Activity" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" required defaultValue={editingPlan?.date} />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="periods">Periods/Duration</Label>
                        <Input id="periods" name="periods" type="number" defaultValue={editingPlan?.periods} placeholder="e.g., 2" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" required defaultValue={editingPlan?.status || 'Pending'}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="note">Notes/Description</Label>
                    <Textarea id="note" name="note" rows={3} defaultValue={editingPlan?.note} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="file">Attach File (Optional)</Label>
                    <Input id="file" name="file" type="file" />
                    {editingPlan?.file && <p className="text-sm text-muted-foreground mt-1">Current file: {editingPlan.file}</p>}
                 </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete this lesson plan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
