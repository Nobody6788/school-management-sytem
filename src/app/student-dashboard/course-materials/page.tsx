
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { students, academic, courseMaterials, teachers } from '@/lib/data';
import { FolderKanban, Download } from 'lucide-react';

// Mocking logged-in student
const loggedInStudent = students.find(s => s.id === 'S001');

// Get subjects for the student's class
const getStudentSubjects = () => {
    if (!loggedInStudent) return [];
    return academic.subjects.filter(s => s.className === loggedInStudent.grade);
};

export default function StudentCourseMaterialsPage() {
    const studentSubjects = getStudentSubjects();
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
    
    const getTeacherName = (teacherId: string) => {
        return teachers.find(t => t.id === teacherId)?.name || 'N/A';
    };

    const filteredMaterials = selectedSubjectId 
        ? courseMaterials.filter(m => m.subjectId === selectedSubjectId)
        : [];
        
    if (!loggedInStudent) {
      return (
            <Card>
              <CardHeader>
                  <CardTitle>Error</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>Student profile not found. This is a demo page for a sample student.</p>
              </CardContent>
          </Card>
      );
    }

    return (
        <Card>
            <CardHeader>
                 <div className="flex items-center gap-4">
                    <FolderKanban className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>Course Materials</CardTitle>
                        <CardDescription>Download study materials and notes for your subjects.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-6 grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="subject">Select a Subject</Label>
                    <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                        <SelectTrigger id="subject">
                            <SelectValue placeholder="Select a subject..." />
                        </SelectTrigger>
                        <SelectContent>
                            {studentSubjects.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedSubjectId && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Uploaded By</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMaterials.length > 0 ? filteredMaterials.map(material => (
                                <TableRow key={material.id}>
                                    <TableCell>
                                        <div className="font-medium">{material.title}</div>
                                        <div className="text-sm text-muted-foreground">{material.description}</div>
                                    </TableCell>
                                    <TableCell>{getTeacherName(material.teacherId)}</TableCell>
                                    <TableCell>{material.uploadDate}</TableCell>
                                    <TableCell className="text-right">
                                         <Button asChild variant="outline" size="sm">
                                            <a href={material.fileUrl} download={material.fileName}>
                                                <Download className="mr-2 h-4 w-4" /> Download ({material.fileSize})
                                            </a>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No materials have been uploaded for this subject yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
