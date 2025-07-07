'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, CalendarCheck, Megaphone } from 'lucide-react';
import { students, schedule, notices as allNotices } from '@/lib/data';

// Mocking the logged-in student
const loggedInStudent = students.find(s => s.id === 'S001');

// Helper functions
const getTodaysSchedule = (dayIndex: number) => {
    if (!loggedInStudent) return [];
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayIndex];
    const gradeSchedule = schedule[loggedInStudent.grade as keyof typeof schedule];
    if (!gradeSchedule) return [];

    return gradeSchedule.map(slot => ({
        time: slot.time,
        subject: slot[dayOfWeek as keyof typeof slot],
    })).filter(item => item.subject !== 'Study Hall' && item.subject !== 'Physical Ed.');
};

const getRelevantNotices = () => {
    if (!loggedInStudent) return [];
    return allNotices.filter(n =>
        n.target === 'All Users' ||
        n.target === 'All Students' ||
        n.target.includes(loggedInStudent.grade) ||
        n.target.includes(loggedInStudent.name)
    );
};

export default function StudentDashboardPage() {
    const [todaysSchedule, setTodaysSchedule] = useState<{ time: string; subject: string }[]>([]);

    useEffect(() => {
        const dayIndex = new Date().getDay();
        setTodaysSchedule(getTodaysSchedule(dayIndex));
    }, []);

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
    
    const relevantNotices = getRelevantNotices();
    const gradeSchedule = schedule[loggedInStudent.grade as keyof typeof schedule];
    const subjectsTaught = new Set<string>();
    if (gradeSchedule) {
        gradeSchedule.forEach(slot => {
            Object.values(slot).forEach(subject => {
                if (typeof subject === 'string' && subject !== slot.time && subject !== 'Study Hall' && subject !== 'Physical Ed.') {
                    subjectsTaught.add(subject);
                }
            })
        });
    }

    const stats = {
        classesToday: todaysSchedule.length,
        subjects: subjectsTaught.size
    };

    return (
        <div className="flex flex-col gap-6">
            <Card className="flex items-center p-6 gap-6">
                <Avatar className="h-24 w-24 border">
                    <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="student avatar" />
                    <AvatarFallback>{loggedInStudent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold">Welcome, {loggedInStudent.name}!</h1>
                    <p className="text-muted-foreground">Here's what's happening today. Let's make it a great one!</p>
                </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.subjects}</div>
                        <p className="text-xs text-muted-foreground">In your current grade</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Notices</CardTitle>
                        <Megaphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{relevantNotices.length}</div>
                        <p className="text-xs text-muted-foreground">Relevant to you</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {todaysSchedule.length > 0 ? (
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Subject</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {todaysSchedule.sort((a, b) => a.time.localeCompare(b.time)).map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.time}</TableCell>
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
                     <CardFooter>
                        <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href="/student-dashboard/schedule">
                                View Full Schedule <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Announcements</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ul className="space-y-4">
                           {relevantNotices.slice(0, 3).map(notice => (
                               <li key={notice.id} className="p-4 rounded-md border">
                                   <div className="flex items-start justify-between gap-4">
                                       <div className="min-w-0">
                                           <h4 className="font-semibold truncate">{notice.title}</h4>
                                           <p className="text-sm text-muted-foreground truncate">{notice.content}</p>
                                       </div>
                                       <Badge variant="outline" className="flex-shrink-0">{notice.date}</Badge>
                                   </div>
                               </li>
                           ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
