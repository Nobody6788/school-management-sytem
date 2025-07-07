'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, CalendarCheck, ArrowRight } from 'lucide-react';
import { teachers, students, schedule, notices as allNotices } from '@/lib/data';

// Assuming logged-in teacher is Ms. Ava Davis
const teacher = teachers.find(t => t.id === 'T02');

// Data fetching and processing logic specific to this teacher
// In a real app, this would be based on the teacher's actual subject assignments
const teacherSubjects = ['Physics', 'Chemistry']; 

const getTeacherStudents = () => {
    if (!teacher) return [];
    const teacherClasses = new Set<string>();
    Object.entries(schedule).forEach(([grade, slots]) => {
        slots.forEach(slot => {
            Object.values(slot).forEach(subject => {
                if (typeof subject === 'string' && teacherSubjects.includes(subject)) {
                    teacherClasses.add(grade);
                }
            });
        });
    });

    return students.filter(s => teacherClasses.has(s.grade));
};

const teacherStudents = getTeacherStudents();

const getTodaysSchedule = (dayIndex: number) => {
    if (!teacher) return [];
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayIndex];
    const todaysClasses: { time: string; grade: string; subject: string }[] = [];

    Object.entries(schedule).forEach(([grade, slots]) => {
        slots.forEach(slot => {
            const subject = slot[dayOfWeek as keyof typeof slot];
            if (typeof subject === 'string' && teacherSubjects.includes(subject)) {
                todaysClasses.push({ time: slot.time, grade, subject });
            }
        });
    });
    return todaysClasses;
};

const relevantNotices = teacher ? allNotices.filter(n => 
    n.target === 'All Users' || n.target === 'All Teachers' || n.target.includes(teacher.name)
) : [];

export default function TeacherDashboardPage() {
    const [todaysSchedule, setTodaysSchedule] = useState<{ time: string; grade: string; subject: string }[]>([]);

    useEffect(() => {
        const dayIndex = new Date().getDay();
        setTodaysSchedule(getTodaysSchedule(dayIndex));
    }, []);

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

    const stats = {
        totalStudents: teacherStudents.length,
        subjectsTaught: teacherSubjects.length,
        classesToday: todaysSchedule.length
    };

    return (
        <div className="flex flex-col gap-6">
            <Card className="flex items-center p-6 gap-6">
                <Avatar className="h-24 w-24 border">
                    <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="teacher avatar" />
                    <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold">Welcome, {teacher.name}</h1>
                    <p className="text-muted-foreground">Here's your summary for today. Have a great day!</p>
                </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Across all your classes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subjects Taught</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.subjectsTaught}</div>
                        <p className="text-xs text-muted-foreground">{teacherSubjects.join(', ')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Classes Today</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.classesToday}</div>
                        <p className="text-xs text-muted-foreground">Scheduled for today</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Schedule</CardTitle>
                        <CardDescription>Your upcoming classes for the day.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {todaysSchedule.length > 0 ? (
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>Subject</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {todaysSchedule.sort((a, b) => a.time.localeCompare(b.time)).map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.time}</TableCell>
                                            <TableCell>{item.grade}</TableCell>
                                            <TableCell>{item.subject}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                <p>No classes scheduled for today. Enjoy your day off!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>My Students</CardTitle>
                        <CardDescription>A quick list of students in your classes.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Grade</TableHead>
                                    <TableHead>Email</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teacherStudents.slice(0, 5).map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>{student.grade}</TableCell>
                                        <TableCell>{student.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href="/teacher-dashboard/students">
                                View All Students <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Recent Announcements</CardTitle>
                    <CardDescription>Notices relevant to you from the noticeboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                       {relevantNotices.slice(0, 3).map(notice => (
                           <li key={notice.id} className="p-4 rounded-md border">
                               <div className="flex justify-between items-start">
                                   <div>
                                       <h4 className="font-semibold">{notice.title}</h4>
                                       <p className="text-sm text-muted-foreground">{notice.content}</p>
                                   </div>
                                   <Badge variant="outline">{notice.date}</Badge>
                               </div>
                           </li>
                       ))}
                    </ul>
                </CardContent>
            </Card>

        </div>
    );
}
