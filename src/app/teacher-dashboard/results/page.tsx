
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BookUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { teachers, students, academic, schedule } from '@/lib/data';

// Mocking logged-in teacher
const teacher = teachers.find(t => t.id === 'T02'); // Ms. Ava Davis
const teacherSubjects = ['Physics', 'Chemistry'];

// Helper to get classes and subjects for the teacher from schedule
const getTeacherClassAndSubjects = () => {
    const info = new Map<string, Set<string>>();
    Object.entries(schedule).forEach(([grade, slots]) => {
        slots.forEach(slot => {
            Object.values(slot).forEach(subjectName => {
                if (typeof subjectName === 'string' && teacherSubjects.includes(subjectName as string)) {
                    if (!info.has(grade)) {
                        info.set(grade, new Set());
                    }
                    info.get(grade)?.add(subjectName);
                }
            });
        });
    });

    return Array.from(info.entries()).map(([grade, subjects]) => ({
        grade,
        subjects: Array.from(subjects).sort(),
    }));
};

type StudentMark = {
    studentId: string;
    studentName: string;
    marks: string; // Use string for input field value
    status?: 'Pending' | 'Approved' | 'Published';
};

export default function TeacherSubmitResultsPage() {
    const [teacherClassesAndSubjects] = useState(getTeacherClassAndSubjects());
    const [resultsData, setResultsData] = useState(academic.results);

    const [selectedExam, setSelectedExam] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const [studentMarks, setStudentMarks] = useState<StudentMark[]>([]);
    
    const { toast } = useToast();
    
    const subjectsForSelectedClass = teacherClassesAndSubjects.find(c => c.grade === selectedClass)?.subjects || [];
    
    useEffect(() => {
        if (selectedClass && selectedExam && selectedSubject) {
            const classStudents = students.filter(s => s.grade === selectedClass);
            const subjectId = academic.subjects.find(s => s.name === selectedSubject && s.className === selectedClass)?.id;
            const classId = academic.classes.find(c => c.name === selectedClass)?.id;

            if (!subjectId || !classId) {
                setStudentMarks([]);
                return;
            }

            const marks = classStudents.map(student => {
                const existingResult = resultsData.find(r => 
                    r.studentId === student.id &&
                    r.examId === selectedExam &&
                    r.subjectId === subjectId &&
                    r.classId === classId
                );
                return {
                    studentId: student.id,
                    studentName: student.name,
                    marks: existingResult ? String(existingResult.marks) : '',
                    status: existingResult?.status as StudentMark['status'],
                };
            });
            setStudentMarks(marks);
        } else {
            setStudentMarks([]);
        }
    }, [selectedClass, selectedExam, selectedSubject, resultsData]);


    const handleClassChange = (grade: string) => {
        setSelectedClass(grade);
        setSelectedSubject('');
    };
    
    const handleMarkChange = (studentId: string, value: string) => {
        const parsedValue = parseInt(value, 10);
        if (value === '' || (parsedValue >= 0 && parsedValue <= 100)) {
            setStudentMarks(prev => 
                prev.map(sm => sm.studentId === studentId ? { ...sm, marks: value } : sm)
            );
        }
    };
    
    const handleSubmit = () => {
        if (!teacher) return;
        
        const subjectId = academic.subjects.find(s => s.name === selectedSubject && s.className === selectedClass)?.id;
        const classId = academic.classes.find(c => c.name === selectedClass)?.id;

        if (!subjectId || !classId) {
             toast({ variant: 'destructive', title: 'Error', description: 'Invalid class or subject.' });
             return;
        }

        const newResults = [...resultsData];
        let submittedCount = 0;

        studentMarks.forEach(sm => {
            if (sm.marks !== '' && !sm.status) { // Only submit new or unsaved marks
                const newResult = {
                    id: `RES${Date.now()}${sm.studentId}`,
                    studentId: sm.studentId,
                    examId: selectedExam,
                    classId,
                    subjectId,
                    marks: parseInt(sm.marks, 10),
                    status: 'Pending' as const,
                    submittedBy: teacher.id,
                };
                newResults.push(newResult);
                submittedCount++;
            }
        });
        
        setResultsData(newResults);
        
        if(submittedCount > 0){
            toast({
                title: 'Results Submitted',
                description: `${submittedCount} mark(s) have been submitted for approval.`
            });
        } else {
            toast({
                title: 'No New Marks',
                description: 'No new marks were entered to be submitted.'
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Submit Exam Results</CardTitle>
                <CardDescription>Enter student marks for a subject and submit them for admin approval.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-wrap items-end gap-4 mb-6">
                    <div className="grid gap-2">
                        <Label htmlFor="exam">Exam</Label>
                        <Select value={selectedExam} onValueChange={setSelectedExam}>
                            <SelectTrigger className="w-[220px]" id="exam">
                                <SelectValue placeholder="Select Exam" />
                            </SelectTrigger>
                            <SelectContent>
                                {academic.exams.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="class">Class</Label>
                        <Select value={selectedClass} onValueChange={handleClassChange}>
                            <SelectTrigger className="w-[180px]" id="class">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {teacherClassesAndSubjects.map(c => <SelectItem key={c.grade} value={c.grade}>{c.grade}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass}>
                            <SelectTrigger className="w-[180px]" id="subject">
                                <SelectValue placeholder="Select Subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjectsForSelectedClass.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {studentMarks.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead className="w-[120px]">Marks (100)</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {studentMarks.map(sm => (
                               <TableRow key={sm.studentId}>
                                   <TableCell>{sm.studentId}</TableCell>
                                   <TableCell className="font-medium">{sm.studentName}</TableCell>
                                   <TableCell>
                                       <Input 
                                           type="number" 
                                           value={sm.marks}
                                           onChange={e => handleMarkChange(sm.studentId, e.target.value)}
                                           disabled={!!sm.status}
                                           placeholder="Enter marks"
                                       />
                                   </TableCell>
                                   <TableCell>
                                       {sm.status ? (
                                           <Badge variant={sm.status === 'Published' ? 'default' : sm.status === 'Approved' ? 'outline' : 'secondary'}>
                                               {sm.status}
                                           </Badge>
                                       ) : (
                                           <Badge variant="secondary">Not Submitted</Badge>
                                       )}
                                   </TableCell>
                               </TableRow>
                           ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-muted-foreground py-8 border rounded-md">
                        <p>Please select an exam, class, and subject to show the student list.</p>
                    </div>
                )}
            </CardContent>
             {studentMarks.length > 0 && (
                <CardFooter className="justify-between">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        You can only submit new marks. Existing marks cannot be changed from this page.
                    </p>
                    <Button onClick={handleSubmit} disabled={!selectedExam || !selectedClass || !selectedSubject}>
                        <BookUp className="mr-2 h-4 w-4" />
                        Submit for Approval
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
