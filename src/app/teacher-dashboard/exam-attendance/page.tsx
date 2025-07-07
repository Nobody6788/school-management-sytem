
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { teachers, students, academic, schedule, examStudentAttendances as initialAttendances } from '@/lib/data';

// Mocking logged-in teacher
const teacher = teachers.find(t => t.id === 'T02'); // Ms. Ava Davis
const teacherSubjects = ['Physics', 'Chemistry'];

// Helper to get classes and subjects for the teacher
const getTeacherClassAndSubjects = () => {
    const info = new Map<string, Set<string>>();
    Object.entries(schedule).forEach(([grade, slots]) => {
        slots.forEach(slot => {
            Object.values(slot).forEach(subjectName => {
                if (typeof subjectName === 'string' && teacherSubjects.includes(subjectName as string)) {
                    if (!info.has(grade)) {
                        info.set(grade, new Set());
                    }
                    info.get(grade)?.add(subjectName as string);
                }
            });
        });
    });

    return Array.from(info.entries()).map(([grade, subjects]) => ({
        grade,
        subjects: Array.from(subjects).sort(),
    }));
};

type AttendanceStatus = 'Present' | 'Absent';
type AttendanceRecord = { studentId: string; status: AttendanceStatus };

export default function TeacherExamAttendancePage() {
    const [teacherClassesAndSubjects] = useState(getTeacherClassAndSubjects());
    const [attendances, setAttendances] = useState(initialAttendances);
    
    const [selectedExam, setSelectedExam] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    
    const [studentList, setStudentList] = useState<{ id: string, name: string }[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

    const { toast } = useToast();

    const subjectsForSelectedClass = teacherClassesAndSubjects.find(c => c.grade === selectedClass)?.subjects || [];
    
    useEffect(() => {
        if (selectedClass && selectedExam && selectedSubject) {
            const studentsInClass = students.filter(s => s.grade === selectedClass);
            setStudentList(studentsInClass.map(s => ({ id: s.id, name: s.name })));

            const subjectId = academic.subjects.find(s => s.name === selectedSubject && s.className === selectedClass)?.id;
            if (!subjectId) {
                setAttendanceRecords([]);
                return;
            }

            const loadedAttendances = studentsInClass.map(student => {
                const existingRecord = attendances.find(
                    att => att.studentId === student.id && att.examId === selectedExam && att.subjectId === subjectId
                );
                return {
                    studentId: student.id,
                    status: (existingRecord?.status as AttendanceStatus) || 'Present',
                };
            });
            setAttendanceRecords(loadedAttendances);

        } else {
            setStudentList([]);
            setAttendanceRecords([]);
        }
    }, [selectedClass, selectedExam, selectedSubject, attendances]);

    const handleClassChange = (grade: string) => {
        setSelectedClass(grade);
        setSelectedSubject('');
    };

    const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
        setAttendanceRecords(prev =>
            prev.map(att => (att.studentId === studentId ? { ...att, status } : att))
        );
    };

    const handleSaveAttendance = () => {
        const subjectId = academic.subjects.find(s => s.name === selectedSubject && s.className === selectedClass)?.id;

        if (!selectedExam || !selectedClass || !subjectId || attendanceRecords.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Cannot Save',
                description: 'Please select an exam, class, and subject first.',
            });
            return;
        }
        
        const otherAttendances = attendances.filter(att => 
            !(att.examId === selectedExam && att.subjectId === subjectId && studentList.some(s => s.id === att.studentId))
        );
        
        const newAttendanceRecords = attendanceRecords.map(att => ({
            id: `ESA${Date.now()}${att.studentId}`,
            studentId: att.studentId,
            examId: selectedExam,
            subjectId,
            status: att.status,
        }));
        
        setAttendances([...otherAttendances, ...newAttendanceRecords]);

        toast({
            title: 'Exam Attendance Saved',
            description: `Attendance for ${getExamName(selectedExam)} - ${selectedSubject} has been successfully saved.`,
        });
    };
    
    const getExamName = (examId: string) => academic.exams.find(e => e.id === examId)?.name || 'N/A';

    return (
        <Card>
            <CardHeader>
                <CardTitle>Exam Attendance</CardTitle>
                <CardDescription>Take and manage student attendance for examinations.</CardDescription>
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
                                {academic.exams.map(e => (
                                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                                ))}
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
                                {teacherClassesAndSubjects.map(c => (
                                    <SelectItem key={c.grade} value={c.grade}>{c.grade}</SelectItem>
                                ))}
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
                                {subjectsForSelectedClass.map(s => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                {studentList.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead className="text-right">Attendance Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentList.map(student => {
                                const attendance = attendanceRecords.find(a => a.studentId === student.id);
                                return (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.id}</TableCell>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell className="text-right">
                                            {attendance && (
                                                <RadioGroup 
                                                    value={attendance.status} 
                                                    onValueChange={(value) => handleAttendanceChange(student.id, value as AttendanceStatus)}
                                                    className="flex justify-end gap-4"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Present" id={`present-${student.id}`} />
                                                        <Label htmlFor={`present-${student.id}`}>Present</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Absent" id={`absent-${student.id}`} />
                                                        <Label htmlFor={`absent-${student.id}`}>Absent</Label>
                                                    </div>
                                                </RadioGroup>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-muted-foreground py-8 border rounded-md">
                        <p>Please select an exam, class, and subject to show the student list.</p>
                    </div>
                )}
            </CardContent>
            {studentList.length > 0 && (
                <CardFooter>
                    <Button onClick={handleSaveAttendance}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Save Exam Attendance
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
