'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, PlusCircle, Printer, FileText, Trash2, CheckCircle, DollarSign } from 'lucide-react';
import { teachers, payrolls as initialPayrolls } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';


type Payroll = (typeof initialPayrolls)[0];

const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState(initialPayrolls);
  const { toast } = useToast();

  const [isGenerateModalOpen, setGenerateModalOpen] = useState(false);
  const [isPayslipModalOpen, setPayslipModalOpen] = useState(false);
  
  const [viewingPayroll, setViewingPayroll] = useState<Payroll | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Payroll | null>(null);

  const getTeacher = (teacherId: string) => teachers.find(t => t.id === teacherId);
  const getTeacherName = (teacherId: string) => getTeacher(teacherId)?.name || 'N/A';

  const handleGeneratePayroll = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const month = formData.get('month') as string;
    const year = parseInt(formData.get('year') as string, 10);

    if (!month || !year) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a month and year.' });
        return;
    }
    
    const existingPayrolls = payrolls.filter(p => p.month === month && p.year === year);
    if (existingPayrolls.length > 0) {
        toast({ variant: 'destructive', title: 'Error', description: `Payroll for ${month} ${year} has already been generated.` });
        return;
    }
    
    const newPayrolls: Payroll[] = teachers.map(teacher => {
        const baseSalary = teacher.salary || 0;
        const bonus = 0; // Default bonus
        const deductions = baseSalary * 0.1; // Default 10% deduction
        const netSalary = baseSalary + bonus - deductions;

        return {
            id: `PAY${Date.now()}${teacher.id}`,
            teacherId: teacher.id,
            month,
            year,
            baseSalary,
            bonus,
            deductions,
            netSalary,
            status: 'Pending',
        }
    });

    setPayrolls([...payrolls, ...newPayrolls]);
    setGenerateModalOpen(false);
    toast({ title: 'Payroll Generated', description: `Payroll for ${month} ${year} has been successfully generated.` });
  };
  
  const handleMarkAsPaid = (payrollId: string) => {
    setPayrolls(payrolls.map(p => p.id === payrollId ? { ...p, status: 'Paid' } : p));
    toast({ title: 'Payroll Updated', description: 'The payroll record has been marked as paid.' });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setPayrolls(payrolls.filter(p => p.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast({ title: 'Payroll Deleted', description: 'The payroll record has been deleted.' });
  };
  
  const handleOpenPayslip = (payroll: Payroll) => {
    setViewingPayroll(payroll);
    setPayslipModalOpen(true);
  }

  const handlePrint = () => {
    window.print();
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Payroll Management</CardTitle>
              <CardDescription>Generate, manage, and process staff payroll.</CardDescription>
            </div>
            <Button size="sm" onClick={() => setGenerateModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Generate Payroll
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Base Salary</TableHead>
                <TableHead className="text-right">Bonus</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrolls.sort((a,b) => b.year - a.year || months.indexOf(b.month) - months.indexOf(a.month)).map(payroll => (
                <TableRow key={payroll.id}>
                  <TableCell className="font-medium">{getTeacherName(payroll.teacherId)}</TableCell>
                  <TableCell>{payroll.month} {payroll.year}</TableCell>
                  <TableCell className="text-right">${payroll.baseSalary.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${payroll.bonus.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${payroll.deductions.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold">${payroll.netSalary.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={payroll.status === 'Paid' ? 'default' : 'destructive'}
                           className={payroll.status === 'Paid' ? 'bg-green-600' : ''}>
                        {payroll.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenPayslip(payroll)}><FileText className="mr-2 h-4 w-4" /> View Payslip</DropdownMenuItem>
                        {payroll.status !== 'Paid' && (
                            <DropdownMenuItem onClick={() => handleMarkAsPaid(payroll.id)}><CheckCircle className="mr-2 h-4 w-4" /> Mark as Paid</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(payroll)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Generate Payroll Modal */}
      <Dialog open={isGenerateModalOpen} onOpenChange={setGenerateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Monthly Payroll</DialogTitle>
            <DialogDescription>Select the month and year to generate payroll for all staff.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGeneratePayroll}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="month" className="text-right">Month</Label>
                <Select name="month" required>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a month" /></SelectTrigger>
                    <SelectContent>{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">Year</Label>
                <Select name="year" required>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a year" /></SelectTrigger>
                    <SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setGenerateModalOpen(false)}>Cancel</Button>
                <Button type="submit">Generate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Payslip Modal */}
      <Dialog open={isPayslipModalOpen} onOpenChange={setPayslipModalOpen}>
        <DialogContent className="max-w-lg print:shadow-none print:border-none">
            <DialogHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border">
                            <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="school logo" />
                            <AvatarFallback>SF</AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-2xl">Salary Payslip</DialogTitle>
                            {viewingPayroll && <DialogDescription>For {viewingPayroll.month} {viewingPayroll.year}</DialogDescription>}
                        </div>
                    </div>
                    <Button variant="outline" size="icon" onClick={handlePrint} className="print:hidden">
                        <Printer className="h-4 w-4" />
                        <span className="sr-only">Print</span>
                    </Button>
                </div>
            </DialogHeader>
            {viewingPayroll && (() => {
                const teacher = getTeacher(viewingPayroll.teacherId);
                return (
                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div><strong>Teacher:</strong> {teacher?.name || 'N/A'}</div>
                            <div><strong>Teacher ID:</strong> {viewingPayroll.teacherId}</div>
                            <div><strong>Specialization:</strong> {teacher?.specialization || 'N/A'}</div>
                            <div><strong>Payslip ID:</strong> {viewingPayroll.id}</div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Earnings</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Base Salary</TableCell>
                                    <TableCell className="text-right">${viewingPayroll.baseSalary.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Bonus</TableCell>
                                    <TableCell className="text-right">${viewingPayroll.bonus.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Deductions</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Tax, etc.</TableCell>
                                    <TableCell className="text-right">${viewingPayroll.deductions.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Table>
                            <TableFooter>
                                <TableRow className="font-bold text-lg bg-muted/50">
                                    <TableCell>Net Salary</TableCell>
                                    <TableCell className="text-right">${viewingPayroll.netSalary.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                         <div className="text-center pt-8">
                            <p className="font-bold text-green-600 text-2xl tracking-widest uppercase">{viewingPayroll.status}</p>
                        </div>
                    </div>
                )
            })()}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This action will permanently delete this payroll record. This cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
          <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
