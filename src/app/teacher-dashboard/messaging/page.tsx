
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
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

type Message = (typeof initialMessages)[0];

// Mocking logged-in teacher
const loggedInTeacher = teachers.find(t => t.id === 'T02');

export default function TeacherMessagingPage() {
    const [messages, setMessages] = useState(initialMessages);
    const [activeTab, setActiveTab] = useState('inbox');
    const [viewingMessage, setViewingMessage] = useState<Message | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
    const { toast } = useToast();

    if (!loggedInTeacher) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Teacher profile not found. This is a demo page for a sample teacher.</p>
                </CardContent>
            </Card>
        );
    }
    
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

    const inboxMessages = messages
        .filter(m => m.recipientId === loggedInTeacher.id && m.recipientType === 'Teacher')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
    const sentMessages = messages
        .filter(m => m.senderId === loggedInTeacher.id && m.senderType === 'Teacher')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
    const unreadCount = inboxMessages.filter(m => !m.read).length;

    const handleViewMessage = (message: Message) => {
        setViewingMessage(message);
        // Mark as read if it's in the inbox and unread
        if (inboxMessages.includes(message) && !message.read) {
            setMessages(prev => prev.map(m => m.id === message.id ? { ...m, read: true } : m));
        }
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        setMessages(messages.filter(m => m.id !== deleteTarget.id));
        setDeleteTarget(null);
        toast({ title: 'Message Deleted', description: 'The message has been removed from your inbox.' });
    };
    
    const handleNewMessageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const recipientData = (formData.get('recipient') as string)?.split(':');
        
        if (!recipientData || recipientData.length < 2) {
             toast({ variant: 'destructive', title: 'Error', description: 'Please select a valid recipient.' });
            return;
        }

        const [recipientType, recipientId] = recipientData;
        const subject = formData.get('subject') as string;
        const body = formData.get('body') as string;

        const newMessage: Message = {
            id: `MSG${Date.now()}`,
            senderId: loggedInTeacher.id,
            senderType: 'Teacher',
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
        setActiveTab('sent');
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <MessageSquare className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>Internal Messaging</CardTitle>
                            <CardDescription>Communicate with students, parents, teachers, and administration.</CardDescription>
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
                                    <Select name="recipient" required>
                                        <SelectTrigger className="col-span-5" id="recipient"><SelectValue placeholder="Select a recipient" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Admin</SelectLabel>
                                                <SelectItem value={`Admin:${adminProfile.id}`}>{adminProfile.name}</SelectItem>
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel>Teachers</SelectLabel>
                                                {teachers.filter(t => t.id !== loggedInTeacher.id).map(t => <SelectItem key={t.id} value={`Teacher:${t.id}`}>{t.name}</SelectItem>)}
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel>Students</SelectLabel>
                                                {students.map(s => <SelectItem key={s.id} value={`Student:${s.id}`}>{s.name} ({s.grade})</SelectItem>)}
                                            </SelectGroup>
                                            <SelectGroup>
                                                <SelectLabel>Parents</SelectLabel>
                                                {parents.map(p => <SelectItem key={p.id} value={`Parent:${p.id}`}>{p.name} (Parent of {getStudentNameForParent(p.id)})</SelectItem>)}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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
                        <AlertDialogDescription>This action will permanently delete this message from your inbox. It cannot be undone.</AlertDialogDescription>
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
