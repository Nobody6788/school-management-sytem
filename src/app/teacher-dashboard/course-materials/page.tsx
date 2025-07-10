
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { teachers, academic, courseMaterials as initialCourseMaterials, schedule } from '@/lib/data';
import { PlusCircle, Download, Trash2, FolderKanban } from 'lucide-react';
import { format } from 'date-fns';
import { buttonVariants } from '@/components/ui/button';

// Mocking logged-in teacher
const teacher = teachers.find(t => t.id === 'T02');
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


type CourseMaterial = (typeof initialCourseMaterials)[0];

export default function TeacherCourseMaterialsPage() {
    const [materials, setMaterials] = useState(initialCourseMaterials);
    const [isModalOpen, setModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<CourseMaterial | null>(null);
    const [teacherSubjectsList] = useState(getTeacherSubjects());
    const { toast } = useToast();

    const myMaterials = teacher ? materials.filter(m => m.teacherId === teacher.id) : [];

    const getSubjectName = (subjectId: string) => {
        return academic.subjects.find(s => s.id === subjectId)?.name || 'N/A';
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };
    
    const handleUploadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!teacher) return;
        
        const formData = new FormData(event.currentTarget);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const subjectId = formData.get('subjectId') as string;
        const file = (formData.get('file') as File);
        
        if (!title || !subjectId || !file || file.size === 0) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields and select a file.' });
            return;
        }
        
        const newMaterial: CourseMaterial = {
            id: `CM${Date.now()}`,
            subjectId,
            teacherId: teacher.id,
            title,
            description,
            fileName: file.name,
            fileSize: `${(file.size / 1024).toFixed(1)}KB`,
            uploadDate: format(new Date(), 'yyyy-MM-dd'),
            fileUrl: '#', // Placeholder URL
        };
        
        setMaterials(prev => [newMaterial, ...prev]);
        setModalOpen(false);
        toast({ title: 'Upload Successful', description: `Material "${title}" has been uploaded.` });
    };
    
    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        setMaterials(materials.filter(m => m.id !== deleteTarget.id));
        setDeleteTarget(null);
        toast({ title: 'Material Deleted', description: 'The course material has been removed.' });
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
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <FolderKanban className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle>Course Materials</CardTitle>
                                <CardDescription>Manage and upload learning materials for your subjects.</CardDescription>
                            </div>
                        </div>
                        <Button size="sm" onClick={handleOpenModal}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Upload Material
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>File</TableHead>
                                <TableHead>Upload Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myMaterials.map(material => (
                                <TableRow key={material.id}>
                                    <TableCell>
                                        <div className="font-medium">{material.title}</div>
                                        <div className="text-sm text-muted-foreground">{material.description}</div>
                                    </TableCell>
                                    <TableCell>{getSubjectName(material.subjectId)}</TableCell>
                                    <TableCell>
                                        <div>{material.fileName}</div>
                                        <div className="text-xs text-muted-foreground">{material.fileSize}</div>
                                    </TableCell>
                                    <TableCell>{material.uploadDate}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button asChild variant="outline" size="sm">
                                            <a href={material.fileUrl} download={material.fileName}>
                                                <Download className="mr-2 h-4 w-4" /> Download
                                            </a>
                                        </Button>
                                         <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(material)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                         </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {myMaterials.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">You have not uploaded any materials yet.</TableCell>
                        </TableRow>
                     )}
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload New Course Material</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUploadSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="subjectId">Subject</Label>
                                <Select name="subjectId" required>
                                    <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                                    <SelectContent>
                                        {teacherSubjectsList.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.className})</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Material Title</Label>
                                <Input id="title" name="title" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="file">File</Label>
                                <Input id="file" name="file" type="file" required />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                            <Button type="submit">Upload</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete the course material. This action cannot be undone.</AlertDialogDescription>
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
