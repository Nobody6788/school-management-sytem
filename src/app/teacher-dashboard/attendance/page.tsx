
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CalendarIcon, CheckCircle } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { teachers, students, academic, schedule, studentAttendances as initialAttendances } from '@/lib/data';

// Mocking logged-in teacher
const teacher = teachers.find(t => t.id === 'T02');
const teacherSubjects = ['Physics', 'Chemistry'];

// Helper to get classes and sections for the teacher
const getTeacherClassInfo = () => {
    const classInfo = new Map<string, Set<string>>();
    
    Object.entries(schedule).forEach(([grade, slots]) => {
        const hasTeacherSubject = slots.some(slot => 
            Object.values(slot).some(subject => typeof subject === 'string' && teacherSubjects.includes(subject as string))
        );
        if (hasTeacherSubject) {
            classInfo.set(grade, new Set());
        }
    });

    students.forEach(student => {
        if (classInfo.has(student.grade)) {
            classInfo.get(student.grade)?.add(student.section);
        }
    });

    return Array.from(classInfo.entries()).map(([grade, sections]) => ({
        grade,
        sections: Array.from(sections).sort(),
    }));
};

type AttendanceStatus = 'Present' | 'Absent' | 'Late';
type AttendanceRecord = { studentId: string; status: AttendanceStatus };

export default function TeacherAttendancePage() {
    const [teacherClasses] = useState(getTeacherClassInfo());
    const [attendances, setAttendances] = useState(initialAttendances);
    
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    
    const [studentAttendance, setStudentAttendance] = useState<AttendanceRecord[]>([]);

    const { toast } = useToast();

    const sectionsForSelectedClass = teacherClasses.find(c => c.grade === selectedClass)?.sections || [];

    const loadAttendance = () => {
        if (!selectedClass || !selectedSection || !selectedDate) {
            setStudentAttendance([]);
            return;
        }

        const studentsInClass = students.filter(
            s => s.grade === selectedClass && s.section === selectedSection
        );

        const loadedAttendances = studentsInClass.map(student => {
            const existingRecord = attendances.find(
                att => att.studentId === student.id && isSameDay(new Date(att.date + 'T00:00:00'), selectedDate!)
            );
            return {
                studentId: student.id,
                status: (existingRecord?.status as AttendanceStatus) || 'Present',
            };
        });

        setStudentAttendance(loadedAttendances);
    };

    const handleClassChange = (grade: string) => {
        setSelectedClass(grade);
        setSelectedSection(''); // Reset section when class changes
        setStudentAttendance([]);
    };

    const handleSectionChange = (section: string) => {
        setSelectedSection(section);
        // Automatically fetch students when section is selected
        if(selectedClass && section && selectedDate) {
            loadAttendanceOnFilterChange(selectedClass, section, selectedDate);
        }
    };
    
    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
         if(selectedClass && selectedSection && date) {
            loadAttendanceOnFilterChange(selectedClass, selectedSection, date);
        }
    };

    const loadAttendanceOnFilterChange = (grade: string, section: string, date: Date) => {
        const studentsInClass = students.filter(
            s => s.grade === grade && s.section === section
        );

        const loadedAttendances = studentsInClass.map(student => {
            const existingRecord = attendances.find(
                att => att.studentId === student.id && isSameDay(new Date(att.date + 'T00:00:00'), date)
            );
            return {
                studentId: student.id,
                status: (existingRecord?.status as AttendanceStatus) || 'Present',
            };
        });

        setStudentAttendance(loadedAttendances);
    }

    const handleFetchStudents = () => {
        if (!selectedClass || !selectedSection || !selectedDate) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please select a class, section, and date.',
            });
            return;
        }
        loadAttendance();
    };

    const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
        setStudentAttendance(prev =>
            prev.map(att => (att.studentId === studentId ? { ...att, status } : att))
        );
    };

    const handleSaveAttendance = () => {
        if (!selectedDate || studentAttendance.length === 0) {
            toast({
                variant: 'destructive',
                title: 'No Data',
                description: 'No attendance data to save.',
            });
            return;
        }
        
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const classId = academic.classes.find(c => c.name === selectedClass)?.id || '';
        
        const otherAttendances = attendances.filter(att => {
          const attDate = new Date(att.date + 'T00:00:00');
          return !(att.classId === classId && att.section === selectedSection && isSameDay(attDate, selectedDate));
        });

        const newAttendanceRecords = studentAttendance.map(att => ({
            id: `ATT${Date.now()}${att.studentId}`,
            studentId: att.studentId,
            date: formattedDate,
            status: att.status,
            classId: classId,
            section: selectedSection,
        }));
        
        setAttendances([...otherAttendances, ...newAttendanceRecords]);

        toast({
            title: 'Attendance Saved',
            description: `Attendance for ${selectedClass} - ${selectedSection} on ${format(selectedDate, 'PPP')} has been saved.`,
        });
    };

    const getStudentName = (studentId: string) => students.find(s => s.id === studentId)?.name || 'N/A';

    return (
        <Card>
            <CardHeader>
                <CardTitle>Take Attendance</CardTitle>
                <CardDescription>Select class, section, and date to take or update student attendance.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap items-end gap-4 mb-6">
                    <div className="grid gap-2">
                        <Label htmlFor="class">Class</Label>
                        <Select value={selectedClass} onValueChange={handleClassChange}>
                            <SelectTrigger className="w-[180px]" id="class">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {teacherClasses.map(c => (
                                    <SelectItem key={c.grade} value={c.grade}>{c.grade}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="section">Section</Label>
                        <Select value={selectedSection} onValueChange={handleSectionChange} disabled={!selectedClass}>
                            <SelectTrigger className="w-[180px]" id="section">
                                <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent>
                                {sectionsForSelectedClass.map(s => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                         <Label htmlFor="date">Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={"w-[240px] justify-start text-left font-normal"}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateChange}
                                    initialFocus
                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button onClick={handleFetchStudents} disabled={!selectedClass || !selectedSection || !selectedDate}>Fetch Students</Button>
                </div>
                
                {studentAttendance.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Student Name</TableHead>
                                <TableHead className="text-right">Attendance Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentAttendance.map(att => (
                                <TableRow key={att.studentId}>
                                    <TableCell>{att.studentId}</TableCell>
                                    <TableCell className="font-medium">{getStudentName(att.studentId)}</TableCell>
                                    <TableCell className="text-right">
                                        <RadioGroup 
                                            value={att.status} 
                                            onValueChange={(value) => handleAttendanceChange(att.studentId, value as AttendanceStatus)}
                                            className="flex justify-end gap-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Present" id={`present-${att.studentId}`} />
                                                <Label htmlFor={`present-${att.studentId}`}>Present</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Absent" id={`absent-${att.studentId}`} />
                                                <Label htmlFor={`absent-${att.studentId}`}>Absent</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Late" id={`late-${att.studentId}`} />
                                                <Label htmlFor={`late-${att.studentId}`}>Late</Label>
                                            </div>
                                        </RadioGroup>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-muted-foreground py-8 border rounded-md">
                        <p>Please select a class, section, and date to fetch the student list.</p>
                    </div>
                )}
            </CardContent>
            {studentAttendance.length > 0 && (
                <CardFooter>
                    <Button onClick={handleSaveAttendance}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Save Attendance
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
