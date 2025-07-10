
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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { MoreHorizontal, PlusCircle, Trash2, BookCopy } from 'lucide-react';
import { academic, onlineExams as initialOnlineExams, questionBank as initialQuestionBank } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type OnlineExam = (typeof initialOnlineExams)[0];
type Question = (typeof initialQuestionBank)[0];

export default function OnlineExamsPage() {
  const [onlineExams, setOnlineExams] = useState(initialOnlineExams);
  const [questionBank, setQuestionBank] = useState(initialQuestionBank);
  const { toast } = useToast();

  const [isExamModalOpen, setExamModalOpen] = useState(false);
  const [isQuestionModalOpen, setQuestionModalOpen] = useState(false);
  const [isQuestionSelectorOpen, setQuestionSelectorOpen] = useState(false);

  const [editingExam, setEditingExam] = useState<OnlineExam | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [managingQuestionsForExam, setManagingQuestionsForExam] = useState<OnlineExam | null>(null);
  
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'exam' | 'question'; id: string } | null>(null);
  
  const getSubjectName = (subjectId: string) => academic.subjects.find(s => s.id === subjectId)?.name || 'N/A';
  const getClassName = (classId: string) => academic.classes.find(c => c.id === classId)?.name || 'N/A';
  const getQuestionById = (id: string) => questionBank.find(q => q.id === id);


  // Exam handlers
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
      setOnlineExams([...onlineExams, { id: `OE${Date.now()}`, ...data, questionIds: [] }]);
    }
    setExamModalOpen(false);
  };

  // Question Bank handlers
  const handleOpenQuestionModal = (question: Question | null) => {
    setEditingQuestion(question);
    setQuestionModalOpen(true);
  };

  const handleQuestionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const questionText = formData.get('questionText') as string;
    const subjectId = formData.get('subjectId') as string;
    const options = [
        formData.get('option1') as string,
        formData.get('option2') as string,
        formData.get('option3') as string,
        formData.get('option4') as string,
    ];
    const correctAnswer = formData.get('correctAnswer') as string;

    if (options.includes(correctAnswer) && questionText && subjectId && options.every(o => o)) {
      if (editingQuestion) {
        setQuestionBank(questionBank.map(q => q.id === editingQuestion.id ? { ...q, questionText, subjectId, options, correctAnswer } : q));
      } else {
        setQuestionBank([...questionBank, { id: `QB${Date.now()}`, questionText, subjectId, options, correctAnswer }]);
      }
      setQuestionModalOpen(false);
      setEditingQuestion(null);
    } else {
        toast({ variant: 'destructive', title: 'Invalid Question', description: 'Please fill all fields and ensure the correct answer matches one of the options.'})
    }
  };
  
  // Exam Question Management
  const handleOpenQuestionSelector = (exam: OnlineExam) => {
      setManagingQuestionsForExam(exam);
      setSelectedQuestions([...exam.questionIds]);
      setQuestionSelectorOpen(true);
  };
  
  const handleSelectQuestion = (questionId: string, checked: boolean) => {
    setSelectedQuestions(prev => checked ? [...prev, questionId] : prev.filter(id => id !== questionId));
  };
  
  const handleAddQuestionsToExam = () => {
    if (!managingQuestionsForExam) return;
    setOnlineExams(exams => exams.map(exam => 
      exam.id === managingQuestionsForExam.id ? { ...exam, questionIds: selectedQuestions } : exam
    ));
    setQuestionSelectorOpen(false);
    toast({ title: "Exam Updated", description: "The questions for the exam have been updated." });
  }

  // Delete handlers
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'exam') {
      setOnlineExams(onlineExams.filter(e => e.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'question') {
      setQuestionBank(questionBank.filter(q => q.id !== deleteTarget.id));
      setOnlineExams(exams => exams.map(exam => ({
          ...exam,
          questionIds: exam.questionIds.filter(id => id !== deleteTarget.id)
      })));
    }
    setDeleteTarget(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Online Exams & Quizzes</CardTitle>
          <CardDescription>Create, manage, and assign online exams to different classes and subjects.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="exams">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="exams">Manage Exams</TabsTrigger>
              <TabsTrigger value="question-bank">Question Bank</TabsTrigger>
            </TabsList>
            
            <TabsContent value="exams">
               <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Exam List</CardTitle>
                    <Button size="sm" onClick={() => handleOpenExamModal(null)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Exam
                    </Button>
                  </div>
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
                          <TableCell>{exam.questionIds.length}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleOpenQuestionSelector(exam)}>
                                <BookCopy className="mr-2 h-4 w-4" /> Manage Questions
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenExamModal(exam)}>Edit Details</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'exam', id: exam.id })}>Delete Exam</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="question-bank">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Question Bank</CardTitle>
                            <Button size="sm" onClick={() => handleOpenQuestionModal(null)}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Question
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Question</TableHead><TableHead>Subject</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {questionBank.map(q => (
                                    <TableRow key={q.id}>
                                        <TableCell>
                                            <p className="font-medium">{q.questionText}</p>
                                            <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2">
                                                {q.options.map((opt, i) => (
                                                    <li key={i} className={opt === q.correctAnswer ? 'font-semibold text-primary' : ''}>{opt}</li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell>{getSubjectName(q.subjectId)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenQuestionModal(q)} className="mr-2">Edit</Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ type: 'question', id: q.id })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {questionBank.length === 0 && <p className="p-8 text-center text-muted-foreground">No questions in the bank yet.</p>}
                    </CardContent>
                </Card>
            </TabsContent>

          </Tabs>
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
      
      {/* Add/Edit Question Modal */}
      <Dialog open={isQuestionModalOpen} onOpenChange={setQuestionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question to Bank'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleQuestionSubmit} key={editingQuestion?.id || 'new-question'}>
            <div className="grid gap-4 py-4">
                <div className="space-y-2"><Label htmlFor="questionText">Question Text</Label><Textarea id="questionText" name="questionText" required defaultValue={editingQuestion?.questionText} /></div>
                 <div className="space-y-2"><Label htmlFor="subjectId">Subject</Label><Select name="subjectId" required defaultValue={editingQuestion?.subjectId}><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger><SelectContent>{academic.subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.className})</SelectItem>)}</SelectContent></Select></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="option1">Option 1</Label><Input id="option1" name="option1" required defaultValue={editingQuestion?.options[0]} /></div>
                    <div className="space-y-2"><Label htmlFor="option2">Option 2</Label><Input id="option2" name="option2" required defaultValue={editingQuestion?.options[1]} /></div>
                    <div className="space-y-2"><Label htmlFor="option3">Option 3</Label><Input id="option3" name="option3" required defaultValue={editingQuestion?.options[2]} /></div>
                    <div className="space-y-2"><Label htmlFor="option4">Option 4</Label><Input id="option4" name="option4" required defaultValue={editingQuestion?.options[3]} /></div>
                </div>
                <div><Label htmlFor="correctAnswer">Correct Answer</Label><Input id="correctAnswer" name="correctAnswer" required placeholder="Copy one of the options above exactly" defaultValue={editingQuestion?.correctAnswer} /></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setQuestionModalOpen(false)}>Cancel</Button><Button type="submit">Save Question</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Question Selector Dialog */}
      <Dialog open={isQuestionSelectorOpen} onOpenChange={setQuestionSelectorOpen}>
        <DialogContent className="sm:max-w-4xl">
            {managingQuestionsForExam && <>
                <DialogHeader>
                    <DialogTitle>Manage Questions for: {managingQuestionsForExam.title}</DialogTitle>
                    <CardDescription>Select questions from the bank for this exam. Only questions for '{getSubjectName(managingQuestionsForExam.subjectId)}' are shown.</CardDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="border rounded-md max-h-[60vh] overflow-y-auto">
                        <Table>
                            <TableHeader><TableRow>
                                <TableHead className="w-12"></TableHead>
                                <TableHead>Question</TableHead>
                            </TableRow></TableHeader>
                            <TableBody>
                                {questionBank.filter(q => q.subjectId === managingQuestionsForExam.subjectId).map(q => (
                                    <TableRow key={q.id}>
                                        <TableCell><Checkbox checked={selectedQuestions.includes(q.id)} onCheckedChange={(checked) => handleSelectQuestion(q.id, checked === true)} /></TableCell>
                                        <TableCell>
                                            <p className="font-medium">{q.questionText}</p>
                                            <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2">
                                                {q.options.map((opt, i) => (
                                                    <li key={i} className={opt === q.correctAnswer ? 'font-semibold text-primary' : ''}>{opt}</li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setQuestionSelectorOpen(false)}>Cancel</Button>
                    <Button type="button" onClick={handleAddQuestionsToExam}>Save Questions</Button>
                </DialogFooter>
            </>}
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
