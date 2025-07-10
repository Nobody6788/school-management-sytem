
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import { academic, onlineExams as initialOnlineExams } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type OnlineExam = (typeof initialOnlineExams)[0];
type Question = OnlineExam['questions'][0];

export default function OnlineExamsPage() {
  const [onlineExams, setOnlineExams] = useState(initialOnlineExams);
  const { toast } = useToast();

  const [isExamModalOpen, setExamModalOpen] = useState(false);
  const [isQuestionModalOpen, setQuestionModalOpen] = useState(false);

  const [editingExam, setEditingExam] = useState<OnlineExam | null>(null);
  const [managingQuestionsForExam, setManagingQuestionsForExam] = useState<OnlineExam | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'exam' | 'question'; examId: string; questionId?: string } | null>(null);
  
  const getSubjectName = (subjectId: string) => academic.subjects.find(s => s.id === subjectId)?.name || 'N/A';
  const getClassName = (classId: string) => academic.classes.find(c => c.id === classId)?.name || 'N/A';

  const handleOpenExamModal = (exam: OnlineExam | null) => {
    setEditingExam(exam);
    setExamModalOpen(true);
  };

  const handleExamSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get('title') as string,
      classId: formData.get('classId') as string,
      subjectId: formData.get('subjectId') as string,
    };

    if (editingExam) {
      setOnlineExams(onlineExams.map(e => e.id === editingExam.id ? { ...e, ...data } : e));
    } else {
      setOnlineExams([...onlineExams, { id: `OE${Date.now()}`, ...data, questions: [] }]);
    }
    setExamModalOpen(false);
  };

  const handleOpenQuestionManager = (exam: OnlineExam) => {
    setManagingQuestionsForExam(exam);
  };

  const handleOpenQuestionModal = (question: Question | null) => {
    setEditingQuestion(question);
    setQuestionModalOpen(true);
  };

  const handleQuestionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!managingQuestionsForExam) return;

    const formData = new FormData(event.currentTarget);
    const questionText = formData.get('questionText') as string;
    const options = [
        formData.get('option1') as string,
        formData.get('option2') as string,
        formData.get('option3') as string,
        formData.get('option4') as string,
    ];
    const correctAnswer = formData.get('correctAnswer') as string;

    if (options.includes(correctAnswer) && questionText && options.every(o => o)) {
      let updatedQuestion: Question;
      if (editingQuestion) {
        updatedQuestion = { ...editingQuestion, questionText, options, correctAnswer };
      } else {
        updatedQuestion = { id: `Q${Date.now()}`, questionText, options, correctAnswer };
      }

      setOnlineExams(prevExams => prevExams.map(exam => {
        if (exam.id === managingQuestionsForExam.id) {
          const newQuestions = editingQuestion
            ? exam.questions.map(q => q.id === editingQuestion.id ? updatedQuestion : q)
            : [...exam.questions, updatedQuestion];
          return { ...exam, questions: newQuestions };
        }
        return exam;
      }));

      setQuestionModalOpen(false);
      setEditingQuestion(null);
    } else {
        toast({ variant: 'destructive', title: 'Invalid Question', description: 'Please fill all fields and ensure the correct answer matches one of the options.'})
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'exam') {
      setOnlineExams(onlineExams.filter(e => e.id !== deleteTarget.examId));
    } else if (deleteTarget.type === 'question' && deleteTarget.questionId) {
      setOnlineExams(prevExams => prevExams.map(exam => {
        if (exam.id === deleteTarget.examId) {
          return { ...exam, questions: exam.questions.filter(q => q.id !== deleteTarget.questionId) };
        }
        return exam;
      }));
    }
    setDeleteTarget(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Online Exams & Quizzes</CardTitle>
            <Button size="sm" onClick={() => handleOpenExamModal(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Exam
            </Button>
          </div>
          <CardDescription>Create, manage, and assign online exams to different classes and subjects.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Class</TableHead><TableHead>Subject</TableHead><TableHead>Questions</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {onlineExams.map(exam => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell>{getClassName(exam.classId)}</TableCell>
                  <TableCell>{getSubjectName(exam.subjectId)}</TableCell>
                  <TableCell>{exam.questions.length}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleOpenQuestionManager(exam)}>Manage Questions</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenExamModal(exam)}>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'exam', examId: exam.id })}>Delete Exam</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add/Edit Exam Modal */}
      <Dialog open={isExamModalOpen} onOpenChange={setExamModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExam ? 'Edit Exam Details' : 'Add New Exam'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleExamSubmit} key={editingExam?.id || 'new-exam'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="title" className="text-right">Title</Label><Input id="title" name="title" className="col-span-3" required defaultValue={editingExam?.title} /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="classId" className="text-right">Class</Label><Select name="classId" required defaultValue={editingExam?.classId}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent>{academic.classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="subjectId" className="text-right">Subject</Label><Select name="subjectId" required defaultValue={editingExam?.subjectId}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select subject" /></SelectTrigger><SelectContent>{academic.subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.className})</SelectItem>)}</SelectContent></Select></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setExamModalOpen(false)}>Cancel</Button><Button type="submit">Save</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Question Manager Dialog */}
      <Dialog open={!!managingQuestionsForExam} onOpenChange={() => setManagingQuestionsForExam(null)}>
        <DialogContent className="sm:max-w-4xl">
            {managingQuestionsForExam && <>
                <DialogHeader>
                    <DialogTitle>Manage Questions for: {managingQuestionsForExam.title}</DialogTitle>
                    <CardDescription>{getClassName(managingQuestionsForExam.classId)} - {getSubjectName(managingQuestionsForExam.subjectId)}</CardDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="flex justify-end mb-4">
                        <Button size="sm" onClick={() => handleOpenQuestionModal(null)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Question
                        </Button>
                    </div>
                    <div className="border rounded-md max-h-[60vh] overflow-y-auto">
                        <Table>
                            <TableHeader><TableRow><TableHead>Question</TableHead><TableHead className="w-40 text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {managingQuestionsForExam.questions.map(q => (
                                    <TableRow key={q.id}>
                                        <TableCell>
                                            <p className="font-medium">{q.questionText}</p>
                                            <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2">
                                                {q.options.map((opt, i) => (
                                                    <li key={i} className={opt === q.correctAnswer ? 'font-semibold text-primary' : ''}>{opt}</li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenQuestionModal(q)} className="mr-2">Edit</Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ type: 'question', examId: managingQuestionsForExam.id, questionId: q.id })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {managingQuestionsForExam.questions.length === 0 && <p className="p-8 text-center text-muted-foreground">No questions added yet.</p>}
                    </div>
                </div>
            </>}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Question Modal */}
      <Dialog open={isQuestionModalOpen} onOpenChange={setQuestionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleQuestionSubmit} key={editingQuestion?.id || 'new-question'}>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="questionText">Question Text</Label>
                    <Textarea id="questionText" name="questionText" required defaultValue={editingQuestion?.questionText} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="option1">Option 1</Label><Input id="option1" name="option1" required defaultValue={editingQuestion?.options[0]} /></div>
                    <div className="space-y-2"><Label htmlFor="option2">Option 2</Label><Input id="option2" name="option2" required defaultValue={editingQuestion?.options[1]} /></div>
                    <div className="space-y-2"><Label htmlFor="option3">Option 3</Label><Input id="option3" name="option3" required defaultValue={editingQuestion?.options[2]} /></div>
                    <div className="space-y-2"><Label htmlFor="option4">Option 4</Label><Input id="option4" name="option4" required defaultValue={editingQuestion?.options[3]} /></div>
                </div>
                <div>
                    <Label htmlFor="correctAnswer">Correct Answer</Label>
                    <Input id="correctAnswer" name="correctAnswer" required placeholder="Copy one of the options above exactly" defaultValue={editingQuestion?.correctAnswer} />
                </div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setQuestionModalOpen(false)}>Cancel</Button><Button type="submit">Save Question</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone and will permanently delete the selected {deleteTarget?.type}.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
