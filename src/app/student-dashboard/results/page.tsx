
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { academic, students } from '@/lib/data';

// Mocking the logged-in student
const loggedInStudent = students.find(s => s.id === 'S001');

type Result = (typeof academic.results)[0];

export default function StudentResultsPage() {
  const { exams, subjects, grades } = academic;

  // Filter results for the logged-in student that are published
  const studentResults = loggedInStudent
    ? academic.results.filter(
        (r) => r.studentId === loggedInStudent.id && r.status === 'Published'
      )
    : [];

  const [filteredResults, setFilteredResults] = useState<Result[]>(studentResults);
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('all');

  // --- Helper functions ---
  const getExamName = (examId: string) => exams.find((e) => e.id === examId)?.name || 'N/A';
  const getSubjectName = (subjectId: string) => subjects.find((s) => s.id === subjectId)?.name || 'N/A';
  const getGradeForMarks = (marks: number) => {
    const grade = grades.find((g) => marks >= g.percentageFrom && marks <= g.percentageTo);
    return grade ? grade.gradeName : 'N/A';
  };
  
  const handleFilterChange = (examId: string) => {
      setSelectedExamFilter(examId);
      if (examId === 'all') {
          setFilteredResults(studentResults);
      } else {
          setFilteredResults(studentResults.filter(r => r.examId === examId));
      }
  }

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
        <CardTitle>My Results</CardTitle>
        <CardDescription>
          Here are your published results for all examinations.
        </CardDescription>
         <div className="flex items-center gap-2 pt-4">
          <Select value={selectedExamFilter} onValueChange={handleFilterChange}>
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
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Marks Obtained</TableHead>
              <TableHead>Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{getExamName(result.examId)}</TableCell>
                  <TableCell>{getSubjectName(result.subjectId)}</TableCell>
                  <TableCell>{result.marks}</TableCell>
                  <TableCell>{getGradeForMarks(result.marks)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {selectedExamFilter === 'all'
                    ? 'No published results found.'
                    : `No published results found for ${getExamName(selectedExamFilter)}.`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/students/${loggedInStudent.id}/marksheet`}>
            <FileText className="mr-2 h-4 w-4" />
            View Official Mark Sheet
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
