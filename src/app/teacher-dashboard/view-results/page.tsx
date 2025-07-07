
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
import { academic, students, teachers, schedule } from '@/lib/data';

// Mocking logged-in teacher
const teacher = teachers.find(t => t.id === 'T02'); // Ms. Ava Davis
const teacherSubjects = ['Physics', 'Chemistry'];

// Get students taught by this teacher
const getTeacherStudentIds = () => {
    if (!teacher) return [];
    const teacherClasses = new Set<string>();
    Object.entries(schedule).forEach(([grade, slots]) => {
        const hasTeacherSubject = slots.some(slot => 
            Object.values(slot).some(subject => typeof subject === 'string' && teacherSubjects.includes(subject as string))
        );
        if (hasTeacherSubject) {
            teacherClasses.add(grade);
        }
    });

    return students.filter(s => teacherClasses.has(s.grade)).map(s => s.id);
};


export default function TeacherViewResultsPage() {
  const [teacherStudentIds] = useState(getTeacherStudentIds());
  const [resultsData] = useState(academic.results);
  const { classes, exams, subjects } = academic;

  // State for filters
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('all');

  // Helper functions
  const getStudentName = (studentId: string) => students.find(s => s.id === studentId)?.name || 'N/A';
  const getClassName = (classId: string) => classes.find(c => c.id === classId)?.name || 'N/A';
  const getExamName = (examId: string) => exams.find(e => e.id === examId)?.name || 'N/A';
  const getSubjectName = (subjectId: string) => subjects.find(s => s.id === subjectId)?.name || 'N/A';
  const getGradeForMarks = (marks: number) => {
    const grade = academic.grades.find(g => marks >= g.percentageFrom && marks <= g.percentageTo);
    return grade ? grade.gradeName : 'N/A';
  }

  const filteredResults = resultsData.filter(result => {
    const isTeacherStudent = teacherStudentIds.includes(result.studentId);
    const isPublished = result.status === 'Published';
    const classMatch = selectedClassFilter === 'all' || result.classId === selectedClassFilter;
    const examMatch = selectedExamFilter === 'all' || result.examId === selectedExamFilter;
    return isTeacherStudent && isPublished && classMatch && examMatch;
  });

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

  return (
      <Card>
        <CardHeader>
          <CardTitle>View Published Results</CardTitle>
          <CardDescription>
            View published examination results for your students.
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
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{getStudentName(result.studentId)}</TableCell>
                    <TableCell>{getClassName(result.classId)}</TableCell>
                    <TableCell>{getExamName(result.examId)}</TableCell>
                    <TableCell>{getSubjectName(result.subjectId)}</TableCell>
                    <TableCell>{result.marks}</TableCell>
                    <TableCell>{getGradeForMarks(result.marks)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No published results found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  );
}
