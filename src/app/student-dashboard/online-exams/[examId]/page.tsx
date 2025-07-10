
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { onlineExams, questionBank, examSubmissions, students } from '@/lib/data';

// Mocking logged-in student
const loggedInStudent = students.find(s => s.id === 'S001');

type AnswerMap = { [questionId: string]: string };

export default function TakeExamPage() {
    const router = useRouter();
    const params = useParams();
    const examId = params.examId as string;

    const [exam, setExam] = useState<(typeof onlineExams)[0] | null>(null);
    const [questions, setQuestions] = useState<(typeof questionBank)[0][]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<AnswerMap>({});
    const [isConfirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        const foundExam = onlineExams.find(e => e.id === examId);
        if (foundExam) {
            setExam(foundExam);
            const examQuestions = questionBank.filter(q => foundExam.questionIds.includes(q.id));
            setQuestions(examQuestions);
        }
    }, [examId]);

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };
    
    const handleSubmit = () => {
        if (!exam || !loggedInStudent) return;

        let score = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                score++;
            }
        });

        const newSubmission = {
            submissionId: `SUBM${Date.now()}`,
            studentId: loggedInStudent.id,
            examId: exam.id,
            answers,
            score,
            totalQuestions: questions.length,
            submittedAt: new Date().toISOString(),
        };

        examSubmissions.push(newSubmission);

        router.push(`/student-dashboard/online-exams/${exam.id}/result?submissionId=${newSubmission.submissionId}`);
    };

    if (!exam || questions.length === 0) {
        return (
            <Card>
                <CardHeader><CardTitle>Loading...</CardTitle></CardHeader>
                <CardContent><p>Loading exam details...</p></CardContent>
            </Card>
        );
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <>
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription>Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
                    <Progress value={progress} className="mt-2" />
                </CardHeader>
                <CardContent className="min-h-[250px]">
                    <div key={currentQuestion.id}>
                        <p className="text-lg font-semibold mb-4">{currentQuestion.questionText}</p>
                        <RadioGroup
                            value={answers[currentQuestion.id] || ''}
                            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                        >
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                                    <RadioGroupItem value={option} id={`q${currentQuestion.id}-opt${index}`} />
                                    <Label htmlFor={`q${currentQuestion.id}-opt${index}`} className="flex-1 cursor-pointer">{option}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0}>
                        Previous
                    </Button>
                    {currentQuestionIndex === questions.length - 1 ? (
                        <Button onClick={() => setConfirmOpen(true)}>
                            Submit Exam
                        </Button>
                    ) : (
                        <Button onClick={handleNext}>
                            Next
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <AlertDialog open={isConfirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                        <AlertDialogDescription>
                           You cannot change your answers after submitting. Please review your answers before you proceed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
