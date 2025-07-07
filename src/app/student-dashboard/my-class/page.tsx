
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { students, teachers, schedule } from '@/lib/data';

// Mocking the logged-in student
const loggedInStudent = students.find(s => s.id === 'S001');

// Helper to get class details for the student
const getClassDetails = () => {
    if (!loggedInStudent) return null;

    // Get subjects from schedule
    const gradeSchedule = schedule[loggedInStudent.grade as keyof typeof schedule];
    const subjectSet = new Set<string>();
    if (gradeSchedule) {
        gradeSchedule.forEach(slot => {
            Object.values(slot).forEach(subject => {
                if (typeof subject === 'string' && subject !== slot.time && subject !== 'Study Hall' && subject !== 'Physical Ed.') {
                    subjectSet.add(subject);
                }
            });
        });
    }
    const subjects = Array.from(subjectSet).sort();

    // Map subjects to teachers (best effort)
    const subjectsAndTeachers = subjects.map(subject => {
        const teacher = teachers.find(t => t.specialization.includes(subject));
        return {
            subject,
            teacherName: teacher ? teacher.name : 'N/A',
        };
    });

    // Get classmates
    const classmates = students.filter(
        s => s.grade === loggedInStudent.grade && s.section === loggedInStudent.section && s.id !== loggedInStudent.id
    );

    return {
        subjectsAndTeachers,
        classmates,
    };
};

export default function StudentMyClassPage() {
    const [classDetails] = useState(getClassDetails());

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

    if (!classDetails) {
         return (
            <Card>
                <CardHeader>
                    <CardTitle>No Class Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>No class details could be found for you.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Subjects & Teachers</CardTitle>
                        <CardDescription>
                            Your subjects and the teachers who teach them for {loggedInStudent.grade}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Teacher</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classDetails.subjectsAndTeachers.map(({ subject, teacherName }) => (
                                    <TableRow key={subject}>
                                        <TableCell className="font-medium">{subject}</TableCell>
                                        <TableCell>{teacherName}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>My Class</CardTitle>
                        <CardDescription>{loggedInStudent.grade} - {loggedInStudent.section}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-md font-semibold mb-4">Classmates ({classDetails.classmates.length})</h3>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {classDetails.classmates.map(classmate => (
                                <div key={classmate.id} className="flex items-center gap-4">
                                    <Avatar className="h-9 w-9 border">
                                        <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="student avatar" />
                                        <AvatarFallback>{classmate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{classmate.name}</div>
                                        <div className="text-sm text-muted-foreground">{classmate.email}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
