
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
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, PlusCircle, Printer, FileText } from 'lucide-react';
import { accounting, students } from '@/lib/data';
import { format } from 'date-fns';

type AccountType = (typeof accounting.accountTypes)[0];
type AccountTitle = (typeof accounting.accountTitles)[0];
type Transaction = (typeof accounting.transactions)[0];

export default function AccountingPage() {
  const [accountTypes, setAccountTypes] = useState(accounting.accountTypes);
  const [accountTitles, setAccountTitles] = useState(accounting.accountTitles);
  const [transactions, setTransactions] = useState(accounting.transactions);

  const [isTypeModalOpen, setTypeModalOpen] = useState(false);
  const [isTitleModalOpen, setTitleModalOpen] = useState(false);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [isSlipModalOpen, setSlipModalOpen] = useState(false);

  const [editingType, setEditingType] = useState<AccountType | null>(null);
  const [editingTitle, setEditingTitle] = useState<AccountTitle | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'type' | 'title' | 'transaction'; id: string } | null>(null);

  const getTypeName = (typeId: string) => accountTypes.find(t => t.id === typeId)?.name || 'N/A';
  const getStudentName = (studentId: string) => students.find(s => s.id === studentId)?.name || 'N/A';
  const getStudentDetails = (studentId: string) => students.find(s => s.id === studentId);
  const getAccountTitleName = (titleId: string) => accountTitles.find(t => t.id === titleId)?.name || 'N/A';

  const incomeAccountTitles = accountTitles.filter(t => t.typeId === 'AT01');

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
  
  const handleOpenTransactionModal = (transaction: Transaction | null) => {
    setEditingTransaction(transaction);
    setTransactionModalOpen(true);
  };

  const handleTransactionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const studentId = formData.get('studentId') as string;
    const accountTitleId = formData.get('accountTitleId') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const description = formData.get('description') as string;
    
    if (studentId && accountTitleId && !isNaN(amount)) {
        if (editingTransaction) {
            const updatedTransaction = { ...editingTransaction, studentId, accountTitleId, amount, description };
            setTransactions(transactions.map(t => t.id === editingTransaction.id ? updatedTransaction : t));
        } else {
            const newTransaction: Transaction = {
                id: `TRN${(transactions.length + 1).toString().padStart(3, '0')}`,
                studentId,
                accountTitleId,
                amount,
                description,
                date: format(new Date(), 'yyyy-MM-dd'),
                status: 'Paid',
            };
            setTransactions([newTransaction, ...transactions]);
        }
        setTransactionModalOpen(false);
        setEditingTransaction(null);
    }
  };
  
  const handleOpenSlipModal = (transaction: Transaction) => {
    setViewingTransaction(transaction);
    setSlipModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'type') {
      setAccountTitles(accountTitles.filter(t => t.typeId !== deleteTarget.id));
      setAccountTypes(accountTypes.filter(t => t.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'title') {
      setAccountTitles(accountTitles.filter(t => t.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'transaction') {
        setTransactions(transactions.filter(t => t.id !== deleteTarget.id));
    }

    setDeleteTarget(null);
  };
  
  const getDeleteDescription = () => {
    if (!deleteTarget) return '';
    switch (deleteTarget.type) {
        case 'type': return 'This will permanently delete the account type and all associated account titles.';
        case 'title': return 'This action cannot be undone and will permanently delete this account title.';
        case 'transaction': return 'This action cannot be undone and will permanently delete this transaction record.';
        default: return 'This action is permanent.';
    }
  }

  const handlePrint = () => {
    window.print();
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="titles">Account Titles</TabsTrigger>
              <TabsTrigger value="types">Account Types</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Student Payments</CardTitle>
                    <Button size="sm" onClick={() => handleOpenTransactionModal(null)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Payment For</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map(transaction => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{getStudentName(transaction.studentId)}</TableCell>
                          <TableCell>{getAccountTitleName(transaction.accountTitleId)}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenSlipModal(transaction)}><FileText className="mr-2 h-4 w-4" /> View Slip</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenTransactionModal(transaction)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'transaction', id: transaction.id })}>Delete</DropdownMenuItem>
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

      {/* Add/Edit Transaction Modal */}
      <Dialog open={isTransactionModalOpen} onOpenChange={setTransactionModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle></DialogHeader>
          <form onSubmit={handleTransactionSubmit} key={editingTransaction ? editingTransaction.id : 'add-transaction'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="studentId" className="text-right">Student</Label><Select name="studentId" required defaultValue={editingTransaction?.studentId}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select a student" /></SelectTrigger><SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="accountTitleId" className="text-right">Payment For</Label><Select name="accountTitleId" required defaultValue={editingTransaction?.accountTitleId}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select a payment type" /></SelectTrigger><SelectContent>{incomeAccountTitles.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="amount" className="text-right">Amount</Label><Input id="amount" name="amount" type="number" step="0.01" className="col-span-3" required defaultValue={editingTransaction?.amount} /></div>
              <div className="grid grid-cols-4 items-start gap-4"><Label htmlFor="description" className="text-right pt-2">Description</Label><Textarea id="description" name="description" className="col-span-3" defaultValue={editingTransaction?.description} /></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setTransactionModalOpen(false)}>Cancel</Button><Button type="submit">Save Transaction</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Slip Modal */}
      <Dialog open={isSlipModalOpen} onOpenChange={setSlipModalOpen}>
        <DialogContent className="max-w-md print:shadow-none print:border-none">
            <DialogHeader>
                <div className="flex justify-between items-start">
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
            {viewingTransaction && (() => {
                const student = getStudentDetails(viewingTransaction.studentId);
                return (
                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div><strong>Student:</strong> {student?.name || 'N/A'}</div>
                            <div><strong>Student ID:</strong> {viewingTransaction.studentId}</div>
                            {student && (
                                <>
                                    <div><strong>Class:</strong> {student.grade}</div>
                                    <div><strong>Section:</strong> {student.section}</div>
                                </>
                            )}
                            <div><strong>Date:</strong> {format(new Date(viewingTransaction.date), 'MMMM dd, yyyy')}</div>
                            <div><strong>Transaction ID:</strong> {viewingTransaction.id}</div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{getAccountTitleName(viewingTransaction.accountTitleId)}</TableCell>
                                    <TableCell className="text-right">${viewingTransaction.amount.toFixed(2)}</TableCell>
                                </TableRow>
                                 {viewingTransaction.description && (
                                     <TableRow>
                                         <TableCell className="text-xs text-muted-foreground pt-0" colSpan={2}>{viewingTransaction.description}</TableCell>
                                     </TableRow>
                                 )}
                            </TableBody>
                            <TableFooter>
                                <TableRow className="font-bold text-base bg-muted/50">
                                    <TableCell>Total Paid</TableCell>
                                    <TableCell className="text-right">${viewingTransaction.amount.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                         <div className="text-center pt-8">
                            <p className="font-bold text-green-600 text-2xl tracking-widest">PAID</p>
                        </div>
                    </div>
                )
            })()}
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
