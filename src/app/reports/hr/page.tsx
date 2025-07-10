
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { teachers, staffAttendances, leaveRequests, payrolls } from '@/lib/data';
import { differenceInDays, getMonth, getYear } from 'date-fns';

const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);


const chartConfig = {
  payroll: {
    label: 'Payroll',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function HrReportsPage() {
    
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const getAttendanceSummary = () => {
    return teachers.map(teacher => {
        const teacherAttendances = staffAttendances.filter(att => 
            att.teacherId === teacher.id &&
            getMonth(new Date(att.date)) === selectedMonth &&
            getYear(new Date(att.date)) === selectedYear
        );

        return {
            teacherId: teacher.id,
            teacherName: teacher.name,
            present: teacherAttendances.filter(a => a.status === 'Present').length,
            absent: teacherAttendances.filter(a => a.status === 'Absent').length,
            late: teacherAttendances.filter(a => a.status === 'Late').length,
            halfDay: teacherAttendances.filter(a => a.status === 'Half Day').length,
            total: teacherAttendances.length,
        }
    });
  }

  const getLeaveSummary = () => {
    return teachers.map(teacher => {
        const teacherLeaves = leaveRequests.filter(lr => lr.teacherId === teacher.id);
        
        let totalDays = 0;
        let approvedDays = 0;
        let pendingDays = 0;

        teacherLeaves.forEach(lr => {
            const days = differenceInDays(new Date(lr.endDate), new Date(lr.startDate)) + 1;
            totalDays += days;
            if (lr.status === 'Approved') {
                approvedDays += days;
            } else if (lr.status === 'Pending') {
                pendingDays += days;
            }
        });
        
        return {
            teacherId: teacher.id,
            teacherName: teacher.name,
            totalDays,
            approvedDays,
            pendingDays,
            requestCount: teacherLeaves.length,
        }
    })
  }
  
  const getPayrollSummary = () => {
    const summary = payrolls.reduce((acc, payroll) => {
        const period = `${payroll.month} ${payroll.year}`;
        if (!acc[period]) {
            acc[period] = {
                name: `${payroll.month.substring(0,3)} ${String(payroll.year).slice(-2)}`,
                total: 0,
            };
        }
        acc[period].total += payroll.netSalary;
        return acc;
    }, {} as Record<string, { name: string; total: number }>);

    return Object.values(summary).map(item => ({ ...item, payroll: item.total })).reverse();
  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>HR Reports</CardTitle>
        <CardDescription>
          View detailed reports on staff attendance, leave, and payroll.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="attendance">
          <TabsList>
            <TabsTrigger value="attendance">Attendance Report</TabsTrigger>
            <TabsTrigger value="leave">Leave Report</TabsTrigger>
            <TabsTrigger value="payroll">Payroll Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance">
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Attendance Summary</CardTitle>
                    <div className="flex items-center gap-2 pt-4">
                        <Select value={String(selectedMonth)} onValueChange={(val) => setSelectedMonth(Number(val))}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Month" /></SelectTrigger>
                            <SelectContent>
                                {months.map((m, i) => <SelectItem key={i} value={String(i)}>{m}</SelectItem>)}
                            </SelectContent>
                        </Select>
                         <Select value={String(selectedYear)} onValueChange={(val) => setSelectedYear(Number(val))}>
                            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Select Year" /></SelectTrigger>
                            <SelectContent>
                                {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Teacher</TableHead>
                                <TableHead>Total Days Recorded</TableHead>
                                <TableHead>Present</TableHead>
                                <TableHead>Absent</TableHead>
                                <TableHead>Late</TableHead>
                                <TableHead>Half Day</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {getAttendanceSummary().map(summary => (
                                <TableRow key={summary.teacherId}>
                                    <TableCell className="font-medium">{summary.teacherName}</TableCell>
                                    <TableCell>{summary.total}</TableCell>
                                    <TableCell>{summary.present}</TableCell>
                                    <TableCell>{summary.absent}</TableCell>
                                    <TableCell>{summary.late}</TableCell>
                                    <TableCell>{summary.halfDay}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leave">
              <Card>
                <CardHeader>
                    <CardTitle>Staff Leave Summary</CardTitle>
                    <CardDescription>An overview of leave taken by all staff members to date.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Teacher</TableHead>
                                <TableHead>Total Requests</TableHead>
                                <TableHead>Total Days Requested</TableHead>
                                <TableHead>Approved Days</TableHead>
                                <TableHead>Pending Days</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {getLeaveSummary().map(summary => (
                                <TableRow key={summary.teacherId}>
                                    <TableCell className="font-medium">{summary.teacherName}</TableCell>
                                    <TableCell>{summary.requestCount}</TableCell>
                                    <TableCell>{summary.totalDays}</TableCell>
                                    <TableCell>{summary.approvedDays}</TableCell>
                                    <TableCell>{summary.pendingDays}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="payroll">
             <Card>
                <CardHeader>
                    <CardTitle>Monthly Payroll Totals</CardTitle>
                    <CardDescription>Total net salary paid out each month.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <ResponsiveContainer>
                            <BarChart data={getPayrollSummary()} margin={{ top: 20 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => `$${value/1000}k`} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="payroll" fill="var(--color-payroll)" radius={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
             </Card>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}
