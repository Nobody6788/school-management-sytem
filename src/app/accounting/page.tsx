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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { accounting } from '@/lib/data';

type AccountType = (typeof accounting.accountTypes)[0];
type AccountTitle = (typeof accounting.accountTitles)[0];

export default function AccountingPage() {
  const [accountTypes, setAccountTypes] = useState(accounting.accountTypes);
  const [accountTitles, setAccountTitles] = useState(accounting.accountTitles);

  const [isTypeModalOpen, setTypeModalOpen] = useState(false);
  const [isTitleModalOpen, setTitleModalOpen] = useState(false);

  const [editingType, setEditingType] = useState<AccountType | null>(null);
  const [editingTitle, setEditingTitle] = useState<AccountTitle | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'type' | 'title'; id: string } | null>(null);

  const getTypeName = (typeId: string) => accountTypes.find(t => t.id === typeId)?.name || 'N/A';

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

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'type') {
      setAccountTitles(accountTitles.filter(t => t.typeId !== deleteTarget.id));
      setAccountTypes(accountTypes.filter(t => t.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'title') {
      setAccountTitles(accountTitles.filter(t => t.id !== deleteTarget.id));
    }

    setDeleteTarget(null);
  };
  
  const getDeleteDescription = () => {
    if (!deleteTarget) return '';
    if (deleteTarget.type === 'type') {
        return 'This will permanently delete the account type and all associated account titles.';
    }
    return 'This action cannot be undone and will permanently delete this account title.';
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Accounting Management</CardTitle>
          <CardDescription>Manage account types and titles for financial tracking.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="titles">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="titles">Account Titles</TabsTrigger>
              <TabsTrigger value="types">Account Types</TabsTrigger>
            </TabsList>
            
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
