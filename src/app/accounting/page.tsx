
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
  DropdownMenuSeparator,
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
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, PlusCircle, Printer, FileText, Trash2, BellRing, CheckCircle } from 'lucide-react';
import { accounting, students, parents } from '@/lib/data';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { sendEmail } from '@/ai/flows/send-email-flow';
import { Badge } from '@/components/ui/badge';


type AccountType = (typeof accounting.accountTypes)[0];
type AccountTitle = (typeof accounting.accountTitles)[0];
type Expense = (typeof accounting.expenses)[0];
type InvoiceItem = {
  id: string;
  accountTitleId: string;
  amount: number;
  description: string;
};
type Invoice = {
  id: string;
  studentId: string;
  date: string;
  status: 'Paid' | 'Due' | 'Overdue';
  items: InvoiceItem[];
};


export default function AccountingPage() {
  const [accountTypes, setAccountTypes] = useState(accounting.accountTypes);
  const [accountTitles, setAccountTitles] = useState(accounting.accountTitles);
  const [invoices, setInvoices] = useState(accounting.invoices);
  const [expenses, setExpenses] = useState(accounting.expenses);
  const { toast } = useToast();

  const [isTypeModalOpen, setTypeModalOpen] = useState(false);
  const [isTitleModalOpen, setTitleModalOpen] = useState(false);
  const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [isSlipModalOpen, setSlipModalOpen] = useState(false);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);

  const [editingType, setEditingType] = useState<AccountType | null>(null);
  const [editingTitle, setEditingTitle] = useState<AccountTitle | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  const [invoiceStudentId, setInvoiceStudentId] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'type' | 'title' | 'invoice' | 'expense'; id: string } | null>(null);

  const getTypeName = (typeId: string) => accountTypes.find(t => t.id === typeId)?.name || 'N/A';
  const getStudentDetails = (studentId: string) => students.find(s => s.id === studentId);
  const getStudentName = (studentId: string) => getStudentDetails(studentId)?.name || 'N/A';
  const getParentForStudent = (studentId: string) => parents.find(p => p.studentId === studentId);
  const getAccountTitleName = (titleId: string) => accountTitles.find(t => t.id === titleId)?.name || 'N/A';
  const getInvoiceTotal = (items: InvoiceItem[]) => items.reduce((total, item) => total + (item.amount || 0), 0);

  const incomeAccountTitles = accountTitles.filter(t => t.typeId === 'AT01');
  const expenseAccountTitles = accountTitles.filter(t => t.typeId === 'AT02');

  const handleOpenTypeModal = (type: AccountType | null) => {
    setEditingType(type);
    setTypeModalOpen(true);
  };

  const handleTypeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = (event.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
    if (name) {
      if (editingType) {
        setAccountTypes(accountTypes.map(t => (t.id === editingType.id ? { ...t, name } : t)));
      } else {
        setAccountTypes([...accountTypes, { id: `AT${(accountTypes.length + 1).toString().padStart(2, '0')}`, name }]);
      }
      setTypeModalOpen(false);
      setEditingType(null);
    }
  };

  const handleOpenTitleModal = (title: AccountTitle | null) => {
    setEditingTitle(title);
    setTitleModalOpen(true);
  };

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const typeId = formData.get('typeId') as string;
    if (name && typeId) {
      if (editingTitle) {
        setAccountTitles(accountTitles.map(t => (t.id === editingTitle.id ? { ...t, name, typeId } : t)));
      } else {
        setAccountTitles([...accountTitles, { id: `ATL${(accountTitles.length + 1).toString().padStart(2, '0')}`, name, typeId }]);
      }
      setTitleModalOpen(false);
      setEditingTitle(null);
    }
  };
  
  const handleOpenInvoiceModal = (invoice: Invoice | null) => {
    setEditingInvoice(invoice);
    if (invoice) {
        setInvoiceStudentId(invoice.studentId);
        setInvoiceItems(JSON.parse(JSON.stringify(invoice.items))); // Deep copy
    } else {
        setInvoiceStudentId('');
        setInvoiceItems([{ id: `new_${Date.now()}`, accountTitleId: '', amount: 0, description: '' }]);
    }
    setInvoiceModalOpen(true);
  };
  
  const handleItemChange = (index: number, field: keyof Omit<InvoiceItem, 'id'>, value: string | number) => {
    const newItems = [...invoiceItems];
    const item = newItems[index];
    if (field === 'amount') {
        item.amount = parseFloat(value as string) || 0;
    } else {
        // @ts-ignore
        item[field] = value;
    }
    setInvoiceItems(newItems);
  };

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { id: `new_${Date.now()}`, accountTitleId: '', amount: 0, description: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(newItems);
  };

  const handleInvoiceSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!invoiceStudentId || invoiceItems.some(item => !item.accountTitleId || item.amount <= 0)) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all required fields for the invoice.'});
        return;
    }

    if (editingInvoice) {
        const updatedInvoice: Invoice = {
            ...editingInvoice,
            studentId: invoiceStudentId,
            items: invoiceItems.map((item, index) => ({ ...item, id: item.id.startsWith('new_') ? `ITEM${Date.now()}${index}` : item.id })),
        };
        setInvoices(invoices.map(i => i.id === editingInvoice.id ? updatedInvoice : i));
    } else {
        const newInvoice: Invoice = {
            id: `INV${(invoices.length + 1).toString().padStart(3, '0')}`,
            studentId: invoiceStudentId,
            items: invoiceItems.map((item, index) => ({ ...item, id: `ITEM${Date.now()}${index}` })),
            date: format(new Date(), 'yyyy-MM-dd'),
            status: 'Due',
        };
        setInvoices([newInvoice, ...invoices]);
    }
    setInvoiceModalOpen(false);
    setEditingInvoice(null);
  };

  const handleOpenExpenseModal = (expense: Expense | null) => {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  const handleExpenseSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
        accountTitleId: formData.get('accountTitleId') as string,
        amount: parseFloat(formData.get('amount') as string),
        description: formData.get('description') as string,
        date: format(new Date(), 'yyyy-MM-dd')
    };

    if (data.accountTitleId && data.amount > 0) {
        if (editingExpense) {
            setExpenses(expenses.map(e => e.id === editingExpense.id ? { ...editingExpense, ...data } : e));
        } else {
            setExpenses([...expenses, { id: `EXP${(expenses.length + 1).toString().padStart(3, '0')}`, ...data }]);
        }
        setExpenseModalOpen(false);
        setEditingExpense(null);
    }
  };


  const handleOpenSlipModal = (invoice: Invoice) => {
    setViewingInvoice(invoice);
    setSlipModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'type') {
      setAccountTitles(accountTitles.filter(t => t.typeId !== deleteTarget.id));
      setAccountTypes(accountTypes.filter(t => t.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'title') {
      setAccountTitles(accountTitles.filter(t => t.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'invoice') {
        setInvoices(invoices.filter(t => t.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'expense') {
        setExpenses(expenses.filter(e => e.id !== deleteTarget.id));
    }

    setDeleteTarget(null);
  };
  
  const getDeleteDescription = () => {
    if (!deleteTarget) return '';
    switch (deleteTarget.type) {
        case 'type': return 'This will permanently delete the account type and all associated account titles.';
        case 'title': return 'This action cannot be undone and will permanently delete this account title.';
        case 'invoice': return 'This action cannot be undone and will permanently delete this invoice record.';
        case 'expense': return 'This action cannot be undone and will permanently delete this expense record.';
        default: return 'This action is permanent.';
    }
  }

  const handlePrint = () => {
    window.print();
  };

  const handleMarkAsPaid = (invoiceId: string) => {
      setInvoices(invoices.map(i => i.id === invoiceId ? { ...i, status: 'Paid' } : i));
      toast({ title: 'Invoice Updated', description: 'The invoice has been marked as paid.' });
  }

  const handleSendReminder = async (invoice: Invoice) => {
      const student = getStudentDetails(invoice.studentId);
      const parent = getParentForStudent(invoice.studentId);
      if (!student || !parent?.email) {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not find parent email for this student.' });
          return;
      }
      
      const total = getInvoiceTotal(invoice.items).toFixed(2);
      const subject = `Fee Reminder for ${student.name}`;
      const body = `Dear ${parent.name},\n\nThis is a friendly reminder that an invoice for your child, ${student.name}, is due. The total amount is $${total}.\n\nInvoice ID: ${invoice.id}\nDue Date: ${format(new Date(invoice.date), 'MMMM dd, yyyy')}\n\nPlease log in to the portal to view and pay the invoice. Thank you.\n\nSincerely,\nCampusFlow Administration`;

      try {
          await sendEmail({ to: parent.email, subject, body });
          toast({ title: 'Reminder Sent!', description: `A fee reminder email has been sent to ${parent.name}.` });
      } catch (error) {
          console.error("Reminder email failed to send", error);
          toast({ variant: 'destructive', title: 'Error', description: 'The reminder email could not be sent.' });
      }
  };
  
  const handleSendAllReminders = async () => {
    const overdueInvoices = invoices.filter(i => i.status === 'Due' || i.status === 'Overdue');
    if (overdueInvoices.length === 0) {
        toast({ title: 'No Overdue Invoices', description: 'There are no pending invoices to send reminders for.' });
        return;
    }

    toast({ title: 'Sending Reminders...', description: `Sending emails for ${overdueInvoices.length} overdue invoices.` });
    
    const reminderPromises = overdueInvoices.map(invoice => {
        const student = getStudentDetails(invoice.studentId);
        const parent = getParentForStudent(invoice.studentId);
        if (!student || !parent?.email) {
            return Promise.resolve({ success: false, invoiceId: invoice.id });
        }
        
        const total = getInvoiceTotal(invoice.items).toFixed(2);
        const subject = `Fee Reminder for ${student.name}`;
        const body = `Dear ${parent.name},\n\nThis is a friendly reminder that an invoice for your child, ${student.name}, is due. The total amount is $${total}.\n\nInvoice ID: ${invoice.id}\nDue Date: ${format(new Date(invoice.date), 'MMMM dd, yyyy')}\n\nPlease log in to the portal to view and pay the invoice. Thank you.\n\nSincerely,\nCampusFlow Administration`;

        return sendEmail({ to: parent.email, subject, body })
            .then(() => ({ success: true, invoiceId: invoice.id }))
            .catch(err => {
                console.error(`Failed to send reminder for invoice ${invoice.id}`, err);
                return ({ success: false, invoiceId: invoice.id });
            });
    });

    const results = await Promise.all(reminderPromises);
    const successfulCount = results.filter(r => r.success).length;

    toast({
        title: 'Reminders Sent!',
        description: `${successfulCount} out of ${overdueInvoices.length} reminders were sent successfully.`
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Accounting Management</CardTitle>
          <CardDescription>Manage transactions, account types, and titles for financial tracking.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="transactions">Invoices</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="titles">Account Titles</TabsTrigger>
              <TabsTrigger value="types">Account Types</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Student Invoices</CardTitle>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleSendAllReminders}>
                           <BellRing className="mr-2 h-4 w-4" /> Send All Reminders
                        </Button>
                        <Button size="sm" onClick={() => handleOpenInvoiceModal(null)}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Invoice
                        </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Payment For</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map(invoice => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{getStudentName(invoice.studentId)}</TableCell>
                          <TableCell>{invoice.items.map(item => getAccountTitleName(item.accountTitleId)).join(', ')}</TableCell>
                          <TableCell>{format(new Date(invoice.date + 'T00:00:00'), 'yyyy-MM-dd')}</TableCell>
                          <TableCell>
                            <Badge variant={invoice.status === 'Paid' ? 'default' : 'destructive'}
                                   className={invoice.status === 'Paid' ? 'bg-green-600' : ''}>
                                {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">${getInvoiceTotal(invoice.items).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenSlipModal(invoice)}><FileText className="mr-2 h-4 w-4" /> View Slip</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenInvoiceModal(invoice)}>Edit</DropdownMenuItem>
                                {invoice.status !== 'Paid' && (
                                    <>
                                        <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}><CheckCircle className="mr-2 h-4 w-4" /> Mark as Paid</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSendReminder(invoice)}><BellRing className="mr-2 h-4 w-4" /> Send Reminder</DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'invoice', id: invoice.id })}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
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

            <TabsContent value="expenses">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Expenses</CardTitle>
                            <Button size="sm" onClick={() => handleOpenExpenseModal(null)}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Paid For</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses.map(expense => (
                                    <TableRow key={expense.id}>
                                        <TableCell>{expense.date}</TableCell>
                                        <TableCell className="font-medium">{getAccountTitleName(expense.accountTitleId)}</TableCell>
                                        <TableCell>{expense.description}</TableCell>
                                        <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleOpenExpenseModal(expense)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'expense', id: expense.id })}>Delete</DropdownMenuItem>
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
            
            <TabsContent value="titles">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Account Titles</CardTitle>
                    <Button size="sm" onClick={() => handleOpenTitleModal(null)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Title
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account Title</TableHead>
                        <TableHead>Account Type</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountTitles.map(title => (
                        <TableRow key={title.id}>
                          <TableCell className="font-medium">{title.name}</TableCell>
                          <TableCell>{getTypeName(title.typeId)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenTitleModal(title)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'title', id: title.id })}>Delete</DropdownMenuItem>
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

            <TabsContent value="types">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Account Types</CardTitle>
                    <Button size="sm" onClick={() => handleOpenTypeModal(null)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Type
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account Type</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountTypes.map(type => (
                        <TableRow key={type.id}>
                          <TableCell className="font-medium">{type.name}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenTypeModal(type)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'type', id: type.id })}>Delete</DropdownMenuItem>
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
          </Tabs>
        </CardContent>
      </Card>

      {/* Add/Edit Invoice Modal */}
      <Dialog open={isInvoiceModalOpen} onOpenChange={setInvoiceModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader><DialogTitle>{editingInvoice ? 'Edit Invoice' : 'Add New Invoice'}</DialogTitle></DialogHeader>
          <form onSubmit={handleInvoiceSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-6 items-center gap-4">
                <Label htmlFor="studentId" className="text-right">Student</Label>
                <Select name="studentId" required value={invoiceStudentId} onValueChange={setInvoiceStudentId}>
                    <SelectTrigger className="col-span-5"><SelectValue placeholder="Select a student" /></SelectTrigger>
                    <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-4">
                <Label>Invoice Items</Label>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Payment For</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[120px]">Amount</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoiceItems.map((item, index) => (
                                <TableRow key={item.id} className="align-top">
                                    <TableCell className="p-1">
                                        <Select value={item.accountTitleId} onValueChange={(value) => handleItemChange(index, 'accountTitleId', value)} required>
                                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                            <SelectContent>{incomeAccountTitles.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="p-1">
                                        <Input value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} />
                                    </TableCell>
                                    <TableCell className="p-1">
                                        <Input type="number" step="0.01" value={item.amount} onChange={(e) => handleItemChange(index, 'amount', e.target.value)} required />
                                    </TableCell>
                                    <TableCell className="p-1">
                                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} disabled={invoiceItems.length <= 1}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 <Button type="button" size="sm" variant="outline" onClick={handleAddItem} className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>

            </div>
            <DialogFooter className="pt-4">
                <div className="flex-1 text-lg font-bold">
                    Total: ${getInvoiceTotal(invoiceItems).toFixed(2)}
                </div>
                <Button type="button" variant="outline" onClick={() => setInvoiceModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save Invoice</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Slip Modal */}
      <Dialog open={isSlipModalOpen} onOpenChange={setSlipModalOpen}>
        <DialogContent className="max-w-md print:shadow-none print:border-none">
            <DialogHeader>
                <div className="flex justify-between items-start pr-10">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border">
                            <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="school logo" />
                            <AvatarFallback>SF</AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-2xl">Transaction Slip</DialogTitle>
                            <DialogDescription>Official Payment Receipt</DialogDescription>
                        </div>
                    </div>
                    <Button variant="outline" size="icon" onClick={handlePrint} className="print:hidden">
                        <Printer className="h-4 w-4" />
                        <span className="sr-only">Print</span>
                    </Button>
                </div>
            </DialogHeader>
            {viewingInvoice && (() => {
                const student = getStudentDetails(viewingInvoice.studentId);
                return (
                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div><strong>Student:</strong> {student?.name || 'N/A'}</div>
                            <div><strong>Student ID:</strong> {viewingInvoice.studentId}</div>
                            {student && (
                                <>
                                    <div><strong>Class:</strong> {student.grade}</div>
                                    <div><strong>Section:</strong> {student.section}</div>
                                </>
                            )}
                            <div><strong>Date:</strong> {format(new Date(viewingInvoice.date + 'T00:00:00'), 'MMMM dd, yyyy')}</div>
                            <div><strong>Invoice ID:</strong> {viewingInvoice.id}</div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {viewingInvoice.items.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div>{getAccountTitleName(item.accountTitleId)}</div>
                                        {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                                    </TableCell>
                                    <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow className="font-bold text-base bg-muted/50">
                                    <TableCell>Total Paid</TableCell>
                                    <TableCell className="text-right">${getInvoiceTotal(viewingInvoice.items).toFixed(2)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                         <div className="text-center pt-8">
                            <p className="font-bold text-green-600 text-2xl tracking-widest uppercase">{viewingInvoice.status}</p>
                        </div>
                    </div>
                )
            })()}
        </DialogContent>
      </Dialog>
      
      {/* Add/Edit Expense Modal */}
      <Dialog open={isExpenseModalOpen} onOpenChange={setExpenseModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle></DialogHeader>
          <form onSubmit={handleExpenseSubmit} key={editingExpense?.id || 'add-expense'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accountTitleId" className="text-right">Expense For</Label>
                <Select name="accountTitleId" required defaultValue={editingExpense?.accountTitleId}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{expenseAccountTitles.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input id="amount" name="amount" type="number" step="0.01" className="col-span-3" required defaultValue={editingExpense?.amount} />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                <Textarea id="description" name="description" className="col-span-3" defaultValue={editingExpense?.description} />
              </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setExpenseModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save Expense</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Account Title Modal */}
      <Dialog open={isTitleModalOpen} onOpenChange={setTitleModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingTitle ? 'Edit Account Title' : 'Add New Account Title'}</DialogTitle></DialogHeader>
          <form onSubmit={handleTitleSubmit} key={editingTitle ? editingTitle.id : 'add-title'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Title Name</Label><Input id="name" name="name" className="col-span-3" required defaultValue={editingTitle?.name} /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="typeId" className="text-right">Account Type</Label><Select name="typeId" required defaultValue={editingTitle?.typeId}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select a type" /></SelectTrigger><SelectContent>{accountTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setTitleModalOpen(false)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add/Edit Account Type Modal */}
      <Dialog open={isTypeModalOpen} onOpenChange={setTypeModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingType ? 'Edit Account Type' : 'Add New Account Type'}</DialogTitle></DialogHeader>
          <form onSubmit={handleTypeSubmit} key={editingType ? editingType.id : 'add-type'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Type Name</Label><Input id="name" name="name" className="col-span-3" required defaultValue={editingType?.name} /></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setTypeModalOpen(false)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>{getDeleteDescription()}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
