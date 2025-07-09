
'use client';

import { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CalendarIcon, CheckCircle } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { teachers, staffAttendances as initialAttendances } from '@/lib/data';

type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day';
type AttendanceRecord = { teacherId: string; status: AttendanceStatus };

export default function StaffAttendancePage() {
    const [attendances, setAttendances] = useState(initialAttendances);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [staffAttendance, setStaffAttendance] = useState<AttendanceRecord[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        if (selectedDate) {
            const loadedAttendances = teachers.map(teacher => {
                const existingRecord = attendances.find(
                    att => att.teacherId === teacher.id && isSameDay(new Date(att.date + 'T00:00:00'), selectedDate)
                );
                return {
                    teacherId: teacher.id,
                    status: (existingRecord?.status as AttendanceStatus) || 'Present',
                };
            });
            setStaffAttendance(loadedAttendances);
        } else {
            setStaffAttendance([]);
        }
    }, [selectedDate, attendances]);

    const handleAttendanceChange = (teacherId: string, status: AttendanceStatus) => {
        setStaffAttendance(prev =>
            prev.map(att => (att.teacherId === teacherId ? { ...att, status } : att))
        );
    };

    const handleSaveAttendance = () => {
        if (!selectedDate || staffAttendance.length === 0) {
            toast({
                variant: 'destructive',
                title: 'No Data',
                description: 'No attendance data to save.',
            });
            return;
        }

        const formattedDate = format(selectedDate, 'yyyy-MM-dd');

        // Filter out records for the selected date to replace them with the new ones
        const otherAttendances = attendances.filter(att => !isSameDay(new Date(att.date + 'T00:00:00'), selectedDate));
        
        const newAttendanceRecords = staffAttendance.map(att => ({
            id: `SATT${Date.now()}${att.teacherId}`,
            teacherId: att.teacherId,
            date: formattedDate,
            status: att.status,
        }));

        setAttendances([...otherAttendances, ...newAttendanceRecords]);

        toast({
            title: 'Attendance Saved',
            description: `Staff attendance for ${format(selectedDate, 'PPP')} has been successfully saved.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Staff Attendance</CardTitle>
                <CardDescription>Track and manage attendance for all staff members.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-6">
                    <Label htmlFor="date">Select Date:</Label>
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
                                onSelect={setSelectedDate}
                                initialFocus
                                disabled={(date) => date > new Date()}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Teacher ID</TableHead>
                            <TableHead>Teacher Name</TableHead>
                            <TableHead>Specialization</TableHead>
                            <TableHead className="text-right">Attendance Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staffAttendance.map(att => {
                            const teacher = teachers.find(t => t.id === att.teacherId);
                            if (!teacher) return null;
                            
                            return (
                                <TableRow key={att.teacherId}>
                                    <TableCell>{teacher.id}</TableCell>
                                    <TableCell className="font-medium">{teacher.name}</TableCell>
                                    <TableCell>{teacher.specialization}</TableCell>
                                    <TableCell className="text-right">
                                        <RadioGroup 
                                            value={att.status} 
                                            onValueChange={(value) => handleAttendanceChange(att.teacherId, value as AttendanceStatus)}
                                            className="flex justify-end gap-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Present" id={`present-${att.teacherId}`} />
                                                <Label htmlFor={`present-${att.teacherId}`}>Present</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Absent" id={`absent-${att.teacherId}`} />
                                                <Label htmlFor={`absent-${att.teacherId}`}>Absent</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Late" id={`late-${att.teacherId}`} />
                                                <Label htmlFor={`late-${att.teacherId}`}>Late</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Half Day" id={`halfday-${att.teacherId}`} />
                                                <Label htmlFor={`halfday-${att.teacherId}`}>Half Day</Label>
                                            </div>
                                        </RadioGroup>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSaveAttendance}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Save Attendance
                </Button>
            </CardFooter>
        </Card>
    );
}
