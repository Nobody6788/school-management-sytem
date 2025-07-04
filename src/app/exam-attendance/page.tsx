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
import { academic } from '@/lib/data';
import { Progress } from '@/components/ui/progress';

export default function ExamAttendancePage() {
  const [examAttendances] = useState(academic.examAttendances);
  const { classes, exams, subjects } = academic;

  // State for filters
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('all');

  // --- Helper functions ---
  const getExamName = (examId: string) => exams.find(e => e.id === examId)?.name || 'N/A';
  const getClassName = (classId: string) => classes.find(c => c.id === classId)?.name || 'N/A';
  const getSubjectName = (subjectId: string) => subjects.find(s => s.id === subjectId)?.name || 'N/A';

  const filteredExamAttendances = examAttendances.filter(attendance => {
    const classMatch = selectedClassFilter === 'all' || attendance.classId === selectedClassFilter;
    const examMatch = selectedExamFilter === 'all' || attendance.examId === selectedExamFilter;
    return classMatch && examMatch;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Attendance</CardTitle>
        <CardDescription>
          View and track student attendance for different examinations.
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
              <TableHead>Total Students</TableHead>
              <TableHead>Present</TableHead>
              <TableHead>Absent</TableHead>
              <TableHead className="w-[200px]">Attendance</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExamAttendances.length > 0 ? (
              filteredExamAttendances.map((att) => {
                const percentage = Math.round((att.present / att.totalStudents) * 100);
                return (
                  <TableRow key={att.id}>
                    <TableCell>{getExamName(att.examId)}</TableCell>
                    <TableCell>{getClassName(att.classId)}</TableCell>
                    <TableCell>{getSubjectName(att.subjectId)}</TableCell>
                    <TableCell>{att.totalStudents}</TableCell>
                    <TableCell>{att.present}</TableCell>
                    <TableCell>{att.absent}</TableCell>
                    <TableCell>
                      <Progress value={percentage} aria-label={`${percentage}% attendance`} />
                    </TableCell>
                    <TableCell className="text-right font-semibold">{percentage}%</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No exam attendance data found for the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
