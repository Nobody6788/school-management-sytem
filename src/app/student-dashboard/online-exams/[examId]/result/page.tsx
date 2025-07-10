
'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { onlineExams, questionBank, examSubmissions } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Question = (typeof questionBank)[0];
type Submission = (typeof examSubmissions)[0];

export default function ExamResultPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const examId = params.examId as string;
    const submissionId = searchParams.get('submissionId');
    
    const [exam, setExam] = useState<(typeof onlineExams)[0] | null>(null);
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        const foundExam = onlineExams.find(e => e.id === examId);
        const foundSubmission = examSubmissions.find(s => s.submissionId === submissionId);
        
        if (foundExam && foundSubmission) {
            setExam(foundExam);
            setSubmission(foundSubmission);
            const examQuestions = questionBank.filter(q => foundExam.questionIds.includes(q.id));
            setQuestions(examQuestions);
        } else {
             // Handle case where exam or submission is not found
            // For now, redirecting back to exams list
            router.push('/student-dashboard/online-exams');
        }
    }, [examId, submissionId, router]);
    
    if (!exam || !submission) {
        return (
            <Card>
                <CardHeader><CardTitle>Loading Results...</CardTitle></CardHeader>
                <CardContent><p>Please wait while we fetch your results.</p></CardContent>
            </Card>
        );
    }
    
    const percentage = ((submission.score / submission.totalQuestions) * 100).toFixed(2);
    
    return (
        <div className="flex flex-col items-center gap-6">
            <Card className="w-full max-w-2xl text-center">
                <CardHeader>
                    <CardTitle className="text-3xl">Exam Result</CardTitle>
                    <CardDescription>{exam.title}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">You scored</p>
                    <p className="text-6xl font-bold text-primary">{submission.score} / {submission.totalQuestions}</p>
                    <p className="text-2xl font-semibold mt-2">{percentage}%</p>
                </CardContent>
                 <CardFooter className="flex-col gap-4">
                     <p className="text-sm text-muted-foreground">Review your answers below.</p>
                    <Button asChild variant="outline">
                        <Link href="/student-dashboard/online-exams">Back to Exams List</Link>
                    </Button>
                </CardFooter>
            </Card>

            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Answer Review</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {questions.map((question, index) => {
                            const studentAnswer = submission.answers[question.id];
                            const isCorrect = studentAnswer === question.correctAnswer;
                            return (
                                <AccordionItem value={`item-${index}`} key={question.id}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-2">
                                            {isCorrect ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-destructive" />}
                                            <span className="text-left">Question {index + 1}: {question.questionText.substring(0, 50)}...</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-2">
                                        <p><strong>Your Answer:</strong> <span className={cn(isCorrect ? 'text-green-600' : 'text-destructive')}>{studentAnswer || 'Not Answered'}</span></p>
                                        {!isCorrect && <p><strong>Correct Answer:</strong> <span className="text-green-600">{question.correctAnswer}</span></p>}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
