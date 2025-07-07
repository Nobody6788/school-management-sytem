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
import { students, schedule } from '@/lib/data';

// Mocking the logged-in student
const loggedInStudent = students.find(s => s.id === 'S001');

export default function StudentSchedulePage() {
  const [studentSchedule] = useState(() => {
    if (!loggedInStudent) return null;
    return schedule[loggedInStudent.grade as keyof typeof schedule] || null;
  });

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

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Class Routine</CardTitle>
        <CardDescription>
          Here is your weekly class schedule for {loggedInStudent.grade}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {studentSchedule ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Time</TableHead>
                {days.map(day => <TableHead key={day}>{day}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentSchedule.map((slot, index) => (
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
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No schedule has been set for your class yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
