
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Eye, Send, Trash2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { messages as initialMessages, teachers, students, parents, adminProfile } from '@/lib/data';
import type { ComboboxOption } from '@/components/ui/combobox';
import { Combobox } from '@/components/ui/combobox';

type Message = (typeof initialMessages)[0];

const loggedInAdmin = adminProfile;

export default function AdminMessagingPage() {
    const [messages, setMessages] = useState(initialMessages);
    const [activeTab, setActiveTab] = useState('inbox');
    const [viewingMessage, setViewingMessage] = useState<Message | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
    const { toast } = useToast();
    const [recipient, setRecipient] = useState('');

    const getParticipantName = (type: string, id: string): string => {
        switch (type) {
            case 'Admin': return adminProfile.name;
            case 'Teacher': return teachers.find(t => t.id === id)?.name || 'Unknown Teacher';
            case 'Student': return students.find(s => s.id === id)?.name || 'Unknown Student';
            case 'Parent': return parents.find(p => p.id === id)?.name || 'Unknown Parent';
            default: return 'Unknown';
        }
    };
    
    const getStudentNameForParent = (parentId: string) => {
        const studentId = parents.find(p => p.id === parentId)?.studentId;
        return students.find(s => s.id === studentId)?.name || 'Unknown';
    };

    const recipientOptions: ComboboxOption[] = [
        ...teachers.map(t => ({ value: `Teacher:${t.id}`, label: `${t.name} (Teacher)` })),
        ...students.map(s => ({ value: `Student:${s.id}`, label: `${s.name} (Student, ${s.grade})` })),
        ...parents.map(p => ({ value: `Parent:${p.id}`, label: `${p.name} (Parent of ${getStudentNameForParent(p.id)})` })),
    ].sort((a,b) => (a.label as string).localeCompare(b.label as string));

    const inboxMessages = messages
        .filter(m => m.recipientId === loggedInAdmin.id && m.recipientType === 'Admin')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
    const sentMessages = messages
        .filter(m => m.senderId === loggedInAdmin.id && m.senderType === 'Admin')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
    const unreadCount = inboxMessages.filter(m => !m.read).length;

    const handleViewMessage = (message: Message) => {
        setViewingMessage(message);
        if (inboxMessages.includes(message) && !message.read) {
            setMessages(prev => prev.map(m => m.id === message.id ? { ...m, read: true } : m));
        }
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        setMessages(messages.filter(m => m.id !== deleteTarget.id));
        setDeleteTarget(null);
        toast({ title: 'Message Deleted', description: 'The message has been removed.' });
    };
    
    const handleNewMessageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const recipientData = recipient?.split(':');
        
        if (!recipient || !recipientData || recipientData.length < 2) {
             toast({ variant: 'destructive', title: 'Error', description: 'Please select a valid recipient.' });
            return;
        }

        const [recipientType, recipientId] = recipientData;
        const subject = formData.get('subject') as string;
        const body = formData.get('body') as string;

        const newMessage: Message = {
            id: `MSG${Date.now()}`,
            senderId: loggedInAdmin.id,
            senderType: 'Admin',
            recipientType,
            recipientId,
            subject,
            body,
            date: new Date().toISOString(),
            read: false,
        };

        setMessages(prev => [newMessage, ...prev]);
        toast({ title: 'Message Sent!', description: `Your message to ${getParticipantName(recipientType, recipientId)} has been sent.` });
        
        (event.target as HTMLFormElement).reset();
        setRecipient('');
        setActiveTab('sent');
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <MessageSquare className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>Admin Messaging Center</CardTitle>
                            <CardDescription>Communicate with all users across the platform.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="inbox">
                                Inbox {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger value="sent">Sent</TabsTrigger>
                            <TabsTrigger value="compose">Compose</TabsTrigger>
                        </TabsList>

                        <TabsContent value="inbox">
                           <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">From</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead className="w-[200px]">Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inboxMessages.map(msg => (
                                        <TableRow key={msg.id} className={!msg.read ? 'font-bold' : ''}>
                                            <TableCell>{getParticipantName(msg.senderType, msg.senderId)}</TableCell>
                                            <TableCell>{msg.subject}</TableCell>
                                            <TableCell>{format(new Date(msg.date), 'PP p')}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" onClick={() => handleViewMessage(msg)} className="mr-2"><Eye className="mr-2 h-4 w-4" />View</Button>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(msg)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {inboxMessages.length === 0 && <p className="text-center text-muted-foreground p-8">Your inbox is empty.</p>}
                        </TabsContent>

                        <TabsContent value="sent">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">To</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead className="w-[200px]">Date</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sentMessages.map(msg => (
                                        <TableRow key={msg.id}>
                                            <TableCell>{getParticipantName(msg.recipientType, msg.recipientId)}</TableCell>
                                            <TableCell>{msg.subject}</TableCell>
                                            <TableCell>{format(new Date(msg.date), 'PP p')}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" onClick={() => handleViewMessage(msg)}><Eye className="mr-2 h-4 w-4" />View</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {sentMessages.length === 0 && <p className="text-center text-muted-foreground p-8">You haven't sent any messages.</p>}
                        </TabsContent>

                        <TabsContent value="compose">
                            <form onSubmit={handleNewMessageSubmit} className="space-y-4 pt-4">
                                <div className="grid grid-cols-6 items-center gap-4">
                                    <Label htmlFor="recipient" className="text-right">Recipient</Label>
                                    <div className="col-span-5">
                                        <Combobox
                                            options={recipientOptions}
                                            value={recipient}
                                            onValueChange={setRecipient}
                                            placeholder="Search for a recipient..."
                                            emptyMessage="No recipient found."
                                        />
                                    </div>
                                </div>
                                 <div className="grid grid-cols-6 items-center gap-4">
                                    <Label htmlFor="subject" className="text-right">Subject</Label>
                                    <Input id="subject" name="subject" className="col-span-5" required />
                                </div>
                                <div className="grid grid-cols-6 items-start gap-4">
                                    <Label htmlFor="body" className="text-right pt-2">Message</Label>
                                    <Textarea id="body" name="body" className="col-span-5" rows={8} required />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit"><Send className="mr-2 h-4 w-4" /> Send Message</Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Dialog open={!!viewingMessage} onOpenChange={() => setViewingMessage(null)}>
                <DialogContent>
                    {viewingMessage && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{viewingMessage.subject}</DialogTitle>
                                <DialogDescription>
                                    From: {getParticipantName(viewingMessage.senderType, viewingMessage.senderId)} | 
                                    To: {getParticipantName(viewingMessage.recipientType, viewingMessage.recipientId)}
                                    <br />
                                    Date: {format(new Date(viewingMessage.date), 'PPP p')}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 text-sm whitespace-pre-wrap">{viewingMessage.body}</div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setViewingMessage(null)}>Close</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

             <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action will permanently delete this message. It cannot be undone.</AlertDialogDescription>
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
