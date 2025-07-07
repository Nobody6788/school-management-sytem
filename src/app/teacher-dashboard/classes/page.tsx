
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
import { Badge } from '@/components/ui/badge';
import { teachers, students, schedule } from '@/lib/data';

// Assuming logged-in teacher is Ms. Ava Davis
const teacher = teachers.find(t => t.id === 'T02');
const teacherSubjects = ['Physics', 'Chemistry'];

const getTeacherClassesInfo = () => {
    if (!teacher) return [];
    
    const teacherClasses = new Map<string, {
        students: (typeof students)[0][];
        sections: Set<string>;
        schedule: (typeof schedule)['Grade 9'];
    }>();

    // Find which classes the teacher teaches
    Object.entries(schedule).forEach(([grade, slots]) => {
        const hasTeacherSubject = slots.some(slot => 
            Object.values(slot).some(subject => typeof subject === 'string' && teacherSubjects.includes(subject as string))
        );
        if (hasTeacherSubject) {
            teacherClasses.set(grade, {
                students: [],
                sections: new Set(),
                schedule: slots,
            });
        }
    });

    // Populate students and sections for those classes
    const teacherStudents = students.filter(s => teacherClasses.has(s.grade));
    teacherStudents.forEach(student => {
        const classInfo = teacherClasses.get(student.grade);
        if (classInfo) {
            classInfo.students.push(student);
            classInfo.sections.add(student.section);
        }
    });
    
    return Array.from(teacherClasses.entries()).map(([grade, info]) => ({
        grade,
        totalStudents: info.students.length,
        sections: Array.from(info.sections),
        schedule: info.schedule,
    }));
};

export default function TeacherClassesPage() {
    const [teacherClasses] = useState(getTeacherClassesInfo());

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
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <div className="flex flex-col gap-6">
             <Card>
                <CardHeader>
                    <CardTitle>My Classes</CardTitle>
                    <CardDescription>Detailed information about the classes you teach.</CardDescription>
                </CardHeader>
            </Card>
            {teacherClasses.map(classInfo => (
                <Card key={classInfo.grade}>
                    <CardHeader>
                        <CardTitle>{classInfo.grade}</CardTitle>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
                           <span>Total Students: <strong className="text-foreground">{classInfo.totalStudents}</strong></span>
                           <div className="flex items-center gap-2">
                            <span>Sections:</span>
                            <div className="flex flex-wrap gap-1">
                                {classInfo.sections.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                            </div>
                           </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardTitle className="text-lg mb-4">Class Routine</CardTitle>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">Time</TableHead>
                                    {days.map(day => <TableHead key={day}>{day}</TableHead>)}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classInfo.schedule.map((slot, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{slot.time}</TableCell>
                                        <TableCell>{slot.monday}</TableCell>
                                        <TableCell>{slot.tuesday}</TableCell>
                                        <TableCell>{slot.wednesday}</TableCell>
                                        <TableCell>{slot.thursday}</TableCell>
                                        <TableCell>{slot.friday}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
