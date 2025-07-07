
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
import { parents, students, schedule } from '@/lib/data';

// Mocking the logged-in parent
const loggedInParent = parents.find(p => p.id === 'P01');
const child = loggedInParent ? students.find(s => s.id === loggedInParent.studentId) : null;

export default function ParentSchedulePage() {
  const [childSchedule] = useState(() => {
    if (!child) return null;
    return schedule[child.grade as keyof typeof schedule] || null;
  });

  if (!loggedInParent || !child) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Parent or child profile not found. This is a demo page for a sample parent.</p>
        </CardContent>
      </Card>
    );
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Routine for {child.name}</CardTitle>
        <CardDescription>
          Here is the weekly class schedule for {child.grade}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {childSchedule ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Time</TableHead>
                {days.map(day => <TableHead key={day}>{day}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {childSchedule.map((slot, index) => (
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
            <p>No schedule has been set for your child's class yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
