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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { academic, students, teachers } from '@/lib/data';
import { CheckCircle2, Megaphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Result = (typeof academic.results)[0];

export default function ResultsPage() {
  const [resultsData, setResultsData] = useState(academic.results);
  const { classes, exams, subjects } = academic;
  const { toast } = useToast();

  // State for filters
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // State for publish dialog
  const [isPublishDialogOpen, setPublishDialogOpen] = useState(false);

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
    toast({
      title: "Result Approved",
      description: "The result has been successfully approved.",
    });
  };

  const handlePublishResults = () => {
    // Determine the scope of results to check for approved status
    const resultsToConsider = resultsData.filter(result => {
        const examMatch = selectedExamFilter === 'all' || result.examId === selectedExamFilter;
        const classMatch = selectedClassFilter === 'all' || result.classId === selectedClassFilter;
        return examMatch && classMatch;
    });

    const hasApprovedResults = resultsToConsider.some(result => result.status === 'Approved');

    if (!hasApprovedResults) {
        let description = "No approved results found";
        if (selectedExamFilter !== 'all') {
            description += ` for ${getExamName(selectedExamFilter)}`;
            if (selectedClassFilter !== 'all') {
                description += ` in ${getClassName(selectedClassFilter)}`;
            }
        }
        description += " to publish.";
        
        toast({
            variant: "destructive",
            title: "Publishing Failed",
            description,
        });
        setPublishDialogOpen(false);
        return;
    }

    // Update the status of the relevant results
    setResultsData(resultsData.map(result => {
        const examMatch = selectedExamFilter === 'all' || result.examId === selectedExamFilter;
        const classMatch = selectedClassFilter === 'all' || result.classId === selectedClassFilter;
        
        if (examMatch && classMatch && result.status === 'Approved') {
            return { ...result, status: 'Published' };
        }
        return result;
    }));

    // Generate a descriptive toast message
    let toastDescription = `Results for ${getExamName(selectedExamFilter)}`;
    if (selectedClassFilter === 'all') {
        toastDescription += " for all classes have been published.";
    } else {
        toastDescription += ` for ${getClassName(selectedClassFilter)} have been published.`;
    }

    toast({
        title: "Results Published!",
        description: toastDescription,
    });

    setPublishDialogOpen(false);
  };

  const filteredResults = resultsData.filter(result => {
    const classMatch = selectedClassFilter === 'all' || result.classId === selectedClassFilter;
    const examMatch = selectedExamFilter === 'all' || result.examId === selectedExamFilter;
    const statusMatch = selectedStatusFilter === 'all' || result.status === selectedStatusFilter;
    return classMatch && examMatch && statusMatch;
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage Student Results</CardTitle>
          <CardDescription>
            Review, approve, and publish student result sheets.
          </CardDescription>
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
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
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => setPublishDialogOpen(true)}
              disabled={selectedExamFilter === 'all'}
            >
              <Megaphone className="mr-2 h-4 w-4" />
              Publish Results
            </Button>
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
                      <Badge variant={result.status === 'Published' ? 'default' : result.status === 'Approved' ? 'outline' : 'secondary'}>
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

      {/* Publish Confirmation Dialog */}
      <AlertDialog open={isPublishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to publish the results?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will publish all approved results for the selected exam and class scope. 
              Once published, this action cannot be easily undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublishResults}>
              Publish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
