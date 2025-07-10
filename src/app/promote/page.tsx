
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { students as initialStudents, academic, promotions as initialPromotions } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { format } from 'date-fns';

type Student = (typeof initialStudents)[0];
type Promotion = (typeof initialPromotions)[0];

export default function PromoteStudentsPage() {
  const [students, setStudents] = useState(initialStudents);
  const [promotions, setPromotions] = useState(initialPromotions);
  const { toast } = useToast();

  const [fromClass, setFromClass] = useState('');
  const [fromSection, setFromSection] = useState('');
  const [toClass, setToClass] = useState('');
  const [toSection, setToSection] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const fromSections = academic.sections.filter(s => s.className === fromClass).map(s => s.name);
  const toSections = academic.sections.filter(s => s.className === toClass).map(s => s.name);
  
  const studentsToPromote = students.filter(s => s.grade === fromClass && s.section === fromSection);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(studentsToPromote.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handlePromotionConfirm = () => {
    if (selectedStudents.length === 0 || !fromClass || !fromSection || !toClass || !toSection) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields and select students.'});
      return;
    }
    setConfirmOpen(true);
  };
  
  const handlePromotion = () => {
    const updatedStudents = students.map(student => {
      if (selectedStudents.includes(student.id)) {
        return { ...student, grade: toClass, section: toSection };
      }
      return student;
    });

    const newPromotion: Promotion = {
      id: `PROM${promotions.length + 1}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      fromClass,
      fromSection,
      toClass,
      toSection,
      studentIds: selectedStudents,
    };

    setStudents(updatedStudents);
    setPromotions(prev => [newPromotion, ...prev]);
    toast({
      title: 'Success!',
      description: `${selectedStudents.length} student(s) have been promoted from ${fromClass} - ${fromSection} to ${toClass} - ${toSection}.`
    });
    
    // Reset form
    setSelectedStudents([]);
    setConfirmOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Promote Students</CardTitle>
          <CardDescription>
            Move students from one class and section to another for the new academic session.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Current Class</h3>
            <div className="space-y-2">
              <Label htmlFor="from-class">Class</Label>
              <Select onValueChange={setFromClass}>
                <SelectTrigger id="from-class"><SelectValue placeholder="Select Class" /></SelectTrigger>
                <SelectContent>{academic.classes.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="from-section">Section</Label>
              <Select onValueChange={setFromSection} disabled={!fromClass}>
                <SelectTrigger id="from-section"><SelectValue placeholder="Select Section" /></SelectTrigger>
                <SelectContent>{fromSections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <ArrowRight className="h-8 w-8 text-muted-foreground hidden md:block" />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Promote To</h3>
            <div className="space-y-2">
              <Label htmlFor="to-class">Class</Label>
              <Select onValueChange={setToClass}>
                <SelectTrigger id="to-class"><SelectValue placeholder="Select Class" /></SelectTrigger>
                <SelectContent>{academic.classes.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="to-section">Section</Label>
              <Select onValueChange={setToSection} disabled={!toClass}>
                <SelectTrigger id="to-section"><SelectValue placeholder="Select Section" /></SelectTrigger>
                <SelectContent>{toSections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <Button onClick={handlePromotionConfirm} disabled={selectedStudents.length === 0}>
                Promote {selectedStudents.length} Student(s)
            </Button>
        </CardFooter>
      </Card>

      {fromClass && fromSection && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Students in {fromClass} - {fromSection}</CardTitle>
            <CardDescription>Select students to promote from the list below.</CardDescription>
          </CardHeader>
          <CardContent>
            {studentsToPromote.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    onCheckedChange={(checked) => handleSelectAll(checked === true)}
                                    checked={selectedStudents.length > 0 && selectedStudents.length === studentsToPromote.length}
                                    aria-label="Select all"
                                />
                            </TableHead>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Parent Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentsToPromote.map(student => (
                            <TableRow key={student.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedStudents.includes(student.id)}
                                        onCheckedChange={(checked) => handleSelectStudent(student.id, checked === true)}
                                        aria-label={`Select ${student.name}`}
                                    />
                                </TableCell>
                                <TableCell>{student.id}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.parentName}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-center text-muted-foreground py-8">No students found in this class/section.</p>
            )}
          </CardContent>
        </Card>
      )}
      
      <AlertDialog open={isConfirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Promotion</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to promote <span className="font-bold">{selectedStudents.length}</span> student(s) from 
              <span className="font-bold"> {fromClass} - {fromSection}</span> to <span className="font-bold">{toClass} - {toSection}</span>. This action will update their class records and cannot be easily undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePromotion} className={buttonVariants({ variant: 'default' })}>
                <BadgeCheck className="mr-2" /> Confirm & Promote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

