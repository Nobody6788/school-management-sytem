
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { MoreHorizontal, PlusCircle, BookCopy, Edit, Trash2 } from 'lucide-react';
import { academic } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

type Class = (typeof academic.classes)[0];
type Section = (typeof academic.sections)[0];
type Group = (typeof academic.groups)[0];
type Subject = (typeof academic.subjects)[0];
type Exam = (typeof academic.exams)[0];
type ExamRoutine = (typeof academic.examRoutines)[0];
type Syllabus = (typeof academic.syllabus)[0];


export default function AdminPage() {
  const [classes, setClasses] = useState(academic.classes);
  const [sections, setSections] = useState(academic.sections);
  const [groups, setGroups] = useState(academic.groups);
  const [subjects, setSubjects] = useState(academic.subjects);
  const [exams, setExams] = useState(academic.exams);
  const [examRoutines, setExamRoutines] = useState(academic.examRoutines);
  const [syllabus, setSyllabus] = useState(academic.syllabus);

  // Modal states for Add/Edit
  const [isClassModalOpen, setClassModalOpen] = useState(false);
  const [isSectionModalOpen, setSectionModalOpen] = useState(false);
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [isSubjectModalOpen, setSubjectModalOpen] = useState(false);
  const [isExamModalOpen, setExamModalOpen] = useState(false);
  const [isRoutineModalOpen, setRoutineModalOpen] = useState(false);
  const [isSyllabusManagerOpen, setSyllabusManagerOpen] = useState(false);
  const [isSyllabusItemModalOpen, setSyllabusItemModalOpen] = useState(false);


  // State for item being edited
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [editingRoutine, setEditingRoutine] = useState<ExamRoutine | null>(null);
  const [managingSyllabusFor, setManagingSyllabusFor] = useState<Subject | null>(null);
  const [editingSyllabusItem, setEditingSyllabusItem] = useState<Syllabus | null>(null);

  const [selectedClassForRoutine, setSelectedClassForRoutine] = useState<string | undefined>(editingRoutine?.classId);

  // State for delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);

  // State for routine filters
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('all');


  // --- Helper functions ---
  const getExamName = (examId: string) => exams.find(e => e.id === examId)?.name || 'N/A';
  const getClassName = (classId: string) => classes.find(c => c.id === classId)?.name || 'N/A';
  const getSubjectName = (subjectId: string) => subjects.find(s => s.id === subjectId)?.name || 'N/A';
  
  const syllabusForCurrentSubject = managingSyllabusFor
    ? syllabus.filter(s => s.subjectId === managingSyllabusFor.id)
    : [];

  const availableSubjectsForRoutine = selectedClassForRoutine
  ? subjects.filter(s => s.className === getClassName(selectedClassForRoutine))
  : [];

  const filteredExamRoutines = examRoutines.filter(routine => {
    const classMatch = selectedClassFilter === 'all' || routine.classId === selectedClassFilter;
    const examMatch = selectedExamFilter === 'all' || routine.examId === selectedExamFilter;
    return classMatch && examMatch;
  });

  // --- Handlers for Class ---
  const handleOpenClassModal = (cls: Class | null) => {
    setEditingClass(cls);
    setClassModalOpen(true);
  };

  const handleClassSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const capacity = parseInt(formData.get('capacity') as string, 10);

    if (name && capacity) {
      if (editingClass) {
        const oldClassName = editingClass.name;
        // Update class
        setClasses(classes.map((c) => (c.id === editingClass.id ? { ...c, name, capacity } : c)));
        // Update associated sections and subjects if class name changed
        if (oldClassName !== name) {
          setSections(sections.map(s => s.className === oldClassName ? { ...s, className: name } : s));
          setSubjects(subjects.map(s => s.className === oldClassName ? { ...s, className: name } : s));
        }
      } else {
        setClasses([...classes, { id: `C${(classes.length + 1).toString().padStart(2, '0')}`, name, capacity }]);
      }
      setClassModalOpen(false);
      setEditingClass(null);
    }
  };

  // --- Handlers for Section ---
  const handleOpenSectionModal = (sec: Section | null) => {
    setEditingSection(sec);
    setSectionModalOpen(true);
  };

  const handleSectionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const className = formData.get('className') as string;
    const capacity = parseInt(formData.get('capacity') as string, 10);

    if (name && className && capacity) {
      if (editingSection) {
        setSections(sections.map((s) => (s.id === editingSection.id ? { ...s, name, className, capacity } : s)));
      } else {
        setSections([...sections, { id: `S${(sections.length + 1).toString().padStart(2, '0')}`, name, className, capacity }]);
      }
      setSectionModalOpen(false);
      setEditingSection(null);
    }
  };

  // --- Handlers for Group ---
  const handleOpenGroupModal = (grp: Group | null) => {
    setEditingGroup(grp);
    setGroupModalOpen(true);
  };

  const handleGroupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;

    if (name) {
      if (editingGroup) {
        setGroups(groups.map((g) => (g.id === editingGroup.id ? { ...g, name } : g)));
      } else {
        setGroups([...groups, { id: `G${(groups.length + 1).toString().padStart(2, '0')}`, name }]);
      }
      setGroupModalOpen(false);
      setEditingGroup(null);
    }
  };

    // --- Handlers for Subject ---
    const handleOpenSubjectModal = (sub: Subject | null) => {
      setEditingSubject(sub);
      setSubjectModalOpen(true);
    };
  
    const handleSubjectSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const name = formData.get('name') as string;
      const className = formData.get('className') as string;
  
      if (name && className) {
        if (editingSubject) {
          setSubjects(subjects.map((s) => (s.id === editingSubject.id ? { ...s, name, className } : s)));
        } else {
          setSubjects([...subjects, { id: `SUB${(subjects.length + 1).toString().padStart(2, '0')}`, name, className }]);
        }
        setSubjectModalOpen(false);
        setEditingSubject(null);
      }
    };

    // --- Handlers for Exam ---
    const handleOpenExamModal = (exam: Exam | null) => {
        setEditingExam(exam);
        setExamModalOpen(true);
    };

    const handleExamSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('name') as string;

        if (name) {
            if (editingExam) {
                setExams(exams.map((e) => (e.id === editingExam.id ? { ...e, name } : e)));
            } else {
                setExams([...exams, { id: `EXM${(exams.length + 1).toString().padStart(2, '0')}`, name }]);
            }
            setExamModalOpen(false);
            setEditingExam(null);
        }
    };

    // --- Handlers for Exam Routine ---
    const handleOpenRoutineModal = (routine: ExamRoutine | null) => {
        setEditingRoutine(routine);
        setSelectedClassForRoutine(routine?.classId);
        setRoutineModalOpen(true);
    };

    const handleRoutineSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const examId = formData.get('examId') as string;
        const classId = formData.get('classId') as string;
        const subjectId = formData.get('subjectId') as string;
        const date = formData.get('date') as string;
        const startTime = formData.get('startTime') as string;
        const endTime = formData.get('endTime') as string;
        const room = formData.get('room') as string;

        if (examId && classId && subjectId && date && startTime && endTime && room) {
            if (editingRoutine) {
                const updatedRoutine = { ...editingRoutine, examId, classId, subjectId, date, startTime, endTime, room };
                setExamRoutines(examRoutines.map(r => r.id === editingRoutine.id ? updatedRoutine : r));
            } else {
                const newRoutine = { id: `ER${(examRoutines.length + 1).toString().padStart(2, '0')}`, examId, classId, subjectId, date, startTime, endTime, room };
                setExamRoutines([...examRoutines, newRoutine]);
            }
            setRoutineModalOpen(false);
            setEditingRoutine(null);
        }
    };
    
      // --- Handlers for Syllabus ---
    const handleOpenSyllabusManager = (subject: Subject) => {
        setManagingSyllabusFor(subject);
        setSyllabusManagerOpen(true);
    };

    const handleOpenSyllabusItemModal = (item: Syllabus | null) => {
        setEditingSyllabusItem(item);
        setSyllabusItemModalOpen(true);
    };

    const handleSyllabusItemSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!managingSyllabusFor) return;

        const formData = new FormData(event.currentTarget);
        const data = {
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            status: formData.get('status') as 'Pending' | 'In Progress' | 'Completed',
        };

        if (editingSyllabusItem) {
            setSyllabus(syllabus.map(s => s.id === editingSyllabusItem.id ? { ...s, ...data } : s));
        } else {
            setSyllabus([...syllabus, { id: `SYL${Date.now()}`, subjectId: managingSyllabusFor.id, ...data }]);
        }
        setSyllabusItemModalOpen(false);
        setEditingSyllabusItem(null);
    };


  // --- Handler for Deletion ---
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    switch (deleteTarget.type) {
      case 'class':
        const classToDelete = classes.find(c => c.id === deleteTarget.id);
        if (classToDelete) {
          // Cascade delete to sections and subjects
          setSections(sections.filter(s => s.className !== classToDelete.name));
          setSubjects(subjects.filter(s => s.className !== classToDelete.name));
        }
        setClasses(classes.filter((c) => c.id !== deleteTarget.id));
        break;
      case 'section':
        setSections(sections.filter((s) => s.id !== deleteTarget.id));
        break;
      case 'group':
        setGroups(groups.filter((g) => g.id !== deleteTarget.id));
        break;
      case 'subject':
        setSyllabus(syllabus.filter(s => s.subjectId !== deleteTarget.id));
        setSubjects(subjects.filter((s) => s.id !== deleteTarget.id));
        break;
      case 'exam':
        setExamRoutines(routines => routines.filter(r => r.examId !== deleteTarget.id));
        setExams(exams.filter((e) => e.id !== deleteTarget.id));
        break;
      case 'examRoutine':
        setExamRoutines(examRoutines.filter((r) => r.id !== deleteTarget.id));
        break;
      case 'syllabusItem':
        setSyllabus(syllabus.filter(s => s.id !== deleteTarget.id));
        break;
    }
    setDeleteTarget(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>
            Manage all aspects of the CampusFlow application from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="classes">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="exams">Exams</TabsTrigger>
              <TabsTrigger value="online-exams" asChild>
                <Link href="/admin/online-exams">Online Exams</Link>
              </TabsTrigger>
            </TabsList>

            {/* Classes Tab */}
            <TabsContent value="classes">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Manage Classes</CardTitle>
                    <Button size="sm" onClick={() => handleOpenClassModal(null)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Class
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class Name</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classes.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.name}</TableCell>
                          <TableCell>{c.capacity}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenClassModal(c)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'class', id: c.id })}>Delete</DropdownMenuItem>
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

            {/* Sections Tab */}
            <TabsContent value="sections">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Manage Sections</CardTitle>
                    <Button size="sm" onClick={() => handleOpenSectionModal(null)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Section Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sections.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>{s.name}</TableCell>
                          <TableCell>{s.className}</TableCell>
                          <TableCell>{s.capacity}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenSectionModal(s)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'section', id: s.id })}>Delete</DropdownMenuItem>
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

            {/* Groups Tab */}
            <TabsContent value="groups">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Manage Groups</CardTitle>
                    <Button size="sm" onClick={() => handleOpenGroupModal(null)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Group
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Group Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groups.map((g) => (
                        <TableRow key={g.id}>
                          <TableCell>{g.name}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenGroupModal(g)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'group', id: g.id })}>Delete</DropdownMenuItem>
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
            
            {/* Subjects Tab */}
            <TabsContent value="subjects">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Manage Subjects</CardTitle>
                    <Button size="sm" onClick={() => handleOpenSubjectModal(null)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Subject
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>{s.name}</TableCell>
                          <TableCell>{s.className}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleOpenSyllabusManager(s)}>
                                <BookCopy className="h-4 w-4 mr-2" />
                                Manage Syllabus
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenSubjectModal(s)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'subject', id: s.id })}>Delete</DropdownMenuItem>
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

            {/* Exams Tab */}
            <TabsContent value="exams">
                <Card>
                    <CardHeader>
                        <CardTitle>Exam Management</CardTitle>
                        <CardDescription>Manage exam types and their routines.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="exam-list">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="exam-list">Exam List</TabsTrigger>
                                <TabsTrigger value="exam-routine">Exam Routine</TabsTrigger>
                            </TabsList>
                            <TabsContent value="exam-list">
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>Exam Types</CardTitle>
                                            <Button size="sm" onClick={() => handleOpenExamModal(null)}>
                                                <PlusCircle className="h-4 w-4 mr-2" />
                                                Add Exam
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Exam Name</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {exams.map((e) => (
                                                    <TableRow key={e.id}>
                                                        <TableCell>{e.name}</TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button size="icon" variant="ghost">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent>
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuItem onClick={() => handleOpenExamModal(e)}>Edit</DropdownMenuItem>
                                                                    <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'exam', id: e.id })}>Delete</DropdownMenuItem>
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
                            <TabsContent value="exam-routine">
                               <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>Exam Routines</CardTitle>
                                            <Button size="sm" onClick={() => handleOpenRoutineModal(null)}>
                                                <PlusCircle className="h-4 w-4 mr-2" />
                                                Add Routine
                                            </Button>
                                        </div>
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
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Time</TableHead>
                                                    <TableHead>Room</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredExamRoutines.length > 0 ? (
                                                    filteredExamRoutines.map((r) => (
                                                        <TableRow key={r.id}>
                                                            <TableCell>{getExamName(r.examId)}</TableCell>
                                                            <TableCell>{getClassName(r.classId)}</TableCell>
                                                            <TableCell>{getSubjectName(r.subjectId)}</TableCell>
                                                            <TableCell>{r.date}</TableCell>
                                                            <TableCell>{r.startTime} - {r.endTime}</TableCell>
                                                            <TableCell>{r.room}</TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button size="icon" variant="ghost">
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent>
                                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                        <DropdownMenuItem onClick={() => handleOpenRoutineModal(r)}>Edit</DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'examRoutine', id: r.id })}>Delete</DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="text-center">
                                                            No exam routines found for the selected filters.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>

      {/* Class Modal */}
      <Dialog open={isClassModalOpen} onOpenChange={setClassModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClass ? 'Edit Class' : 'Add New Class'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleClassSubmit} key={editingClass ? editingClass.id : 'add-class'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required defaultValue={editingClass?.name} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">Capacity</Label>
                <Input id="capacity" name="capacity" type="number" className="col-span-3" required defaultValue={editingClass?.capacity} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setClassModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Section Modal */}
      <Dialog open={isSectionModalOpen} onOpenChange={setSectionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSection ? 'Edit Section' : 'Add New Section'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSectionSubmit} key={editingSection ? editingSection.id : 'add-section'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required defaultValue={editingSection?.name} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">Capacity</Label>
                <Input id="capacity" name="capacity" type="number" className="col-span-3" required defaultValue={editingSection?.capacity} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="className" className="text-right">Class</Label>
                <Select name="className" required defaultValue={editingSection?.className}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSectionModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Group Modal */}
      <Dialog open={isGroupModalOpen} onOpenChange={setGroupModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGroup ? 'Edit Group' : 'Add New Group'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGroupSubmit} key={editingGroup ? editingGroup.id : 'add-group'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required defaultValue={editingGroup?.name} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGroupModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Subject Modal */}
      <Dialog open={isSubjectModalOpen} onOpenChange={setSubjectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubjectSubmit} key={editingSubject ? editingSubject.id : 'add-subject'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required defaultValue={editingSubject?.name} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="className" className="text-right">Class</Label>
                <Select name="className" required defaultValue={editingSubject?.className}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSubjectModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Exam Modal */}
        <Dialog open={isExamModalOpen} onOpenChange={setExamModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingExam ? 'Edit Exam' : 'Add New Exam'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleExamSubmit} key={editingExam ? editingExam.id : 'add-exam'}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" name="name" className="col-span-3" required defaultValue={editingExam?.name} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setExamModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

      {/* Exam Routine Modal */}
      <Dialog open={isRoutineModalOpen} onOpenChange={setRoutineModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingRoutine ? 'Edit Routine' : 'Add New Routine'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRoutineSubmit} key={editingRoutine ? editingRoutine.id : 'add-routine'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="examId" className="text-right">Exam</Label>
                <Select name="examId" required defaultValue={editingRoutine?.examId}>
                  <SelectTrigger className="col-span-3"><SelectValue placeholder="Select an exam" /></SelectTrigger>
                  <SelectContent>{exams.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="classId" className="text-right">Class</Label>
                <Select name="classId" required onValueChange={setSelectedClassForRoutine} defaultValue={editingRoutine?.classId}>
                  <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a class" /></SelectTrigger>
                  <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subjectId" className="text-right">Subject</Label>
                <Select name="subjectId" required disabled={!selectedClassForRoutine} defaultValue={editingRoutine?.subjectId}>
                  <SelectTrigger className="col-span-3"><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>{availableSubjectsForRoutine.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input id="date" name="date" type="date" className="col-span-3" required defaultValue={editingRoutine?.date} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Time</Label>
                <div className="col-span-3 grid grid-cols-2 gap-2">
                    <Input id="startTime" name="startTime" type="time" required defaultValue={editingRoutine?.startTime} />
                    <Input id="endTime" name="endTime" type="time" required defaultValue={editingRoutine?.endTime} />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room" className="text-right">Room No.</Label>
                <Input id="room" name="room" className="col-span-3" required defaultValue={editingRoutine?.room} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRoutineModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Syllabus Manager Dialog */}
      <Dialog open={isSyllabusManagerOpen} onOpenChange={(isOpen) => { if (!isOpen) setManagingSyllabusFor(null); setSyllabusManagerOpen(isOpen); }}>
        <DialogContent className="sm:max-w-4xl">
            {managingSyllabusFor && <>
                <DialogHeader>
                    <DialogTitle>Manage Syllabus for: {managingSyllabusFor.name}</DialogTitle>
                    <CardDescription>{managingSyllabusFor.className}</CardDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="flex justify-end mb-4">
                        <Button size="sm" onClick={() => handleOpenSyllabusItemModal(null)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Syllabus Topic
                        </Button>
                    </div>
                    <div className="border rounded-md max-h-[60vh] overflow-y-auto">
                        <Table>
                            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {syllabusForCurrentSubject.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.content}</p>
                                        </TableCell>
                                        <TableCell><Badge variant="secondary">{item.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenSyllabusItemModal(item)} className="mr-2"><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ type: 'syllabusItem', id: item.id })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {syllabusForCurrentSubject.length === 0 && <p className="p-8 text-center text-muted-foreground">No syllabus topics added yet.</p>}
                    </div>
                </div>
            </>}
        </DialogContent>
      </Dialog>
      
      {/* Add/Edit Syllabus Item Modal */}
        <Dialog open={isSyllabusItemModalOpen} onOpenChange={setSyllabusItemModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingSyllabusItem ? 'Edit Syllabus Topic' : 'Add New Syllabus Topic'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSyllabusItemSubmit} key={editingSyllabusItem?.id || 'new-syllabus-item'}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Topic Title</Label>
                            <Input id="title" name="title" required defaultValue={editingSyllabusItem?.title} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content / Description</Label>
                            <Textarea id="content" name="content" required rows={4} defaultValue={editingSyllabusItem?.content} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" required defaultValue={editingSyllabusItem?.status || 'Pending'}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setSyllabusItemModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>


      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected item and any associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

