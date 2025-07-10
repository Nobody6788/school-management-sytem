
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { onlineExams, academic, students, examSubmissions } from '@/lib/data';
import { Laptop } from 'lucide-react';

// Mocking logged-in student
const loggedInStudent = students.find(s => s.id === 'S001');

export default function StudentOnlineExamsPage() {
    if (!loggedInStudent) {
        return <p>Student not found.</p>
    }

    const getSubjectName = (subjectId: string) => academic.subjects.find(s => s.id === subjectId)?.name || 'N/A';
    
    // Filter exams for the student's class
    const studentClassId = academic.classes.find(c => c.name === loggedInStudent.grade)?.id;
    const availableExams = onlineExams.filter(exam => exam.classId === studentClassId);

    const getSubmissionStatus = (examId: string) => {
        const submission = examSubmissions.find(s => s.examId === examId && s.studentId === loggedInStudent.id);
        return submission ? 'Completed' : 'Not Taken';
    }
    
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Laptop className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>Online Exams</CardTitle>
                        <CardDescription>Here are the online exams available for you.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Exam Title</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {availableExams.length > 0 ? availableExams.map(exam => {
                            const status = getSubmissionStatus(exam.id);
                            const isCompleted = status === 'Completed';

                            return (
                                <TableRow key={exam.id}>
                                    <TableCell className="font-medium">{exam.title}</TableCell>
                                    <TableCell>{getSubjectName(exam.subjectId)}</TableCell>
                                    <TableCell>
                                        <Badge variant={isCompleted ? 'default' : 'secondary'} className={isCompleted ? 'bg-green-600' : ''}>
                                            {status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild size="sm">
                                            <Link href={isCompleted ? `/student-dashboard/online-exams/${exam.id}/result` : `/student-dashboard/online-exams/${exam.id}`}>
                                                {isCompleted ? 'View Result' : 'Take Exam'}
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        }) : (
                             <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No online exams are currently available for your class.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
