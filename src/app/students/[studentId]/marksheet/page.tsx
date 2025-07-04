
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

import { students, academic } from '@/lib/data';

export default function MarksheetPage() {
    const params = useParams();
    const studentId = params.studentId as string;

    const student = students.find(s => s.id === studentId);
    const studentResults = academic.results.filter(r => r.studentId === studentId && r.status === 'Published');

    // Helper functions
    const getExamName = (examId: string) => academic.exams.find(e => e.id === examId)?.name || 'N/A';
    const getSubjectName = (subjectId: string) => academic.subjects.find(s => s.id === subjectId)?.name || 'N/A';
    const getGradeForMarks = (marks: number) => {
        const grade = academic.grades.find(g => marks >= g.percentageFrom && marks <= g.percentageTo);
        return grade ? grade.gradeName : 'N/A';
    };
    const getGradePointForMarks = (marks: number) => {
        const grade = academic.grades.find(g => marks >= g.percentageFrom && marks <= g.percentageTo);
        return grade ? grade.gradePoint : 'N/A';
    };

    if (!student) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Student not found.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    // Aggregate results
    const totalMarks = studentResults.reduce((acc, result) => acc + result.marks, 0);
    const totalSubjects = studentResults.length;
    const averageMarks = totalSubjects > 0 ? (totalMarks / totalSubjects) : 0;
    const averagePercentage = averageMarks.toFixed(2);
    const overallGrade = getGradeForMarks(averageMarks);

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Card className="max-w-4xl mx-auto print:shadow-none print:border-none">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                             <Avatar className="h-16 w-16 border">
                                <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="school logo" />
                                <AvatarFallback>SF</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-3xl">Mark Sheet</CardTitle>
                                <CardDescription>Official Academic Transcript</CardDescription>
                            </div>
                        </div>
                        <Button variant="outline" size="icon" onClick={handlePrint} className="print:hidden">
                            <Printer className="h-4 w-4" />
                            <span className="sr-only">Print</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm border-t border-b py-4 my-4">
                        <div><strong>Student Name:</strong> {student.name}</div>
                        <div><strong>Student ID:</strong> {student.id}</div>
                        <div><strong>Class:</strong> {student.grade}</div>
                        <div><strong>Section:</strong> {student.section}</div>
                    </div>

                    <div className="mt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Exam</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead className="text-center">Marks (100)</TableHead>
                                    <TableHead className="text-center">Grade</TableHead>
                                    <TableHead className="text-right">Grade Point</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentResults.length > 0 ? (
                                    studentResults.map(result => (
                                        <TableRow key={result.id}>
                                            <TableCell>{getExamName(result.examId)}</TableCell>
                                            <TableCell>{getSubjectName(result.subjectId)}</TableCell>
                                            <TableCell className="text-center">{result.marks}</TableCell>
                                            <TableCell className="text-center">{getGradeForMarks(result.marks)}</TableCell>
                                            <TableCell className="text-right">{getGradePointForMarks(result.marks)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">No published results found for this student.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            {studentResults.length > 0 && (
                                <TableFooter>
                                    <TableRow className="bg-muted/50 font-semibold">
                                        <TableCell colSpan={2}>Total</TableCell>
                                        <TableCell className="text-center">{totalMarks}</TableCell>
                                        <TableCell colSpan={2}></TableCell>
                                    </TableRow>
                                    <TableRow className="bg-muted/50 font-semibold">
                                        <TableCell colSpan={2}>Average Percentage</TableCell>
                                        <TableCell className="text-center">{averagePercentage}%</TableCell>
                                        <TableCell className="text-center">{overallGrade}</TableCell>
                                        <TableCell colSpan={1}></TableCell>
                                    </TableRow>
                                </TableFooter>
                            )}
                        </Table>
                    </div>
                    
                    <div className="mt-16 flex justify-between text-sm text-muted-foreground">
                        <div>
                            <p className="border-t-2 border-dashed w-32 pt-1 text-center">Date</p>
                        </div>
                        <div>
                            <p className="border-t-2 border-dashed w-32 pt-1 text-center">Principal's Signature</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
