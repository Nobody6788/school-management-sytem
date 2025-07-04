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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { academic, students, teachers } from '@/lib/data';
import { CheckCircle2 } from 'lucide-react';

type Result = (typeof academic.results)[0];

export default function ResultsPage() {
  const [resultsData, setResultsData] = useState(academic.results);
  const { classes, exams, subjects } = academic;

  // State for filters
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Helper functions
  const getStudentName = (studentId: string) => students.find(s => s.id === studentId)?.name || 'N/A';
  const getClassName = (classId: string) => classes.find(c => c.id === classId)?.name || 'N/A';
  const getExamName = (examId: string) => exams.find(e => e.id === examId)?.name || 'N/A';
  const getSubjectName = (subjectId: string) => subjects.find(s => s.id === subjectId)?.name || 'N/A';
  const getTeacherName = (teacherId: string) => teachers.find(t => t.id === teacherId)?.name || 'N/A';
  const getGradeForMarks = (marks: number) => {
    const grade = academic.grades.find(g => marks >= g.percentageFrom && marks <= g.percentageTo);
    return grade ? grade.gradeName : 'N/A';
  }

  const handleApproveResult = (resultId: string) => {
    setResultsData(resultsData.map(result =>
      result.id === resultId ? { ...result, status: 'Approved' } : result
    ));
  };

  const filteredResults = resultsData.filter(result => {
    const classMatch = selectedClassFilter === 'all' || result.classId === selectedClassFilter;
    const examMatch = selectedExamFilter === 'all' || result.examId === selectedExamFilter;
    const statusMatch = selectedStatusFilter === 'all' || result.status === selectedStatusFilter;
    return classMatch && examMatch && statusMatch;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Student Results</CardTitle>
        <CardDescription>
          Review, approve, and manage student result sheets submitted by teachers.
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
           <Select value={selectedStatusFilter} onValueChange={setSelectedStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
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
              <TableHead>Status</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell>
                    <Badge variant={result.status === 'Approved' ? 'default' : 'secondary'}>
                      {result.status}
                    </Badge>
                  </TableCell>
                   <TableCell>{getTeacherName(result.submittedBy)}</TableCell>
                  <TableCell className="text-right">
                    {result.status === 'Pending' && (
                       <Button size="sm" onClick={() => handleApproveResult(result.id)}>
                         <CheckCircle2 className="mr-2 h-4 w-4" />
                         Approve
                       </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No results found for the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
