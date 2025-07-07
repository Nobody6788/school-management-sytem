
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
import { Badge } from '@/components/ui/badge';
import { academic, students } from '@/lib/data';

// Mocking the logged-in student
const loggedInStudent = students.find(s => s.id === 'S001');

export default function StudentExamRoutinePage() {
  const { classes, exams, subjects, examRoutines } = academic;

  // State for filters
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('all');

  // --- Helper functions ---
  const getExamName = (examId: string) => exams.find(e => e.id === examId)?.name || 'N/A';
  const getClassName = (classId: string) => classes.find(c => c.id === classId)?.name || 'N/A';
  const getSubjectName = (subjectId: string) => subjects.find(s => s.id === subjectId)?.name || 'N/A';
  const getStudentClassId = () => {
      if (!loggedInStudent) return null;
      return classes.find(c => c.name === loggedInStudent.grade)?.id || null;
  }

  const studentClassId = getStudentClassId();

  const filteredExamRoutines = examRoutines.filter(routine => {
    const classMatch = selectedClassFilter === 'all' || routine.classId === selectedClassFilter;
    const examMatch = selectedExamFilter === 'all' || routine.examId === selectedExamFilter;
    return classMatch && examMatch;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Examination Routine</CardTitle>
        <CardDescription>
          View schedules for all upcoming examinations. Your class routines are highlighted.
        </CardDescription>
        <div className="flex items-center gap-2 pt-4">
          <Select value={selectedExamFilter} onValueChange={setSelectedExamFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter by exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              {exams.map((e) => (
                <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedClassFilter} onValueChange={setSelectedClassFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Room</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExamRoutines.length > 0 ? (
              filteredExamRoutines.map((r) => {
                const isMyRoutine = r.classId === studentClassId;
                return (
                  <TableRow key={r.id} className={isMyRoutine ? 'bg-primary/10' : ''}>
                    <TableCell className="font-medium">{getExamName(r.examId)}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                           <span>{getClassName(r.classId)}</span>
                           {isMyRoutine && <Badge variant="default">My Class</Badge>}
                        </div>
                    </TableCell>
                    <TableCell>{getSubjectName(r.subjectId)}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.startTime} - {r.endTime}</TableCell>
                    <TableCell>{r.room}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No exam routines found for the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
