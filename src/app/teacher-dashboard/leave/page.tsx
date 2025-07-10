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
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { teachers, leaveRequests as initialLeaveRequests } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

type LeaveRequest = (typeof initialLeaveRequests)[0];

// Mocking logged-in teacher
const loggedInTeacher = teachers.find((t) => t.id === 'T02');

export default function TeacherLeavePage() {
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [isModalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const myLeaveRequests = loggedInTeacher
    ? leaveRequests.filter((req) => req.teacherId === loggedInTeacher.id)
    : [];

  const handleSubmitRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loggedInTeacher) return;

    const formData = new FormData(event.currentTarget);
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const reason = formData.get('reason') as string;
    
    if (new Date(startDate) > new Date(endDate)) {
        toast({ variant: 'destructive', title: 'Invalid Dates', description: 'Start date cannot be after the end date.'});
        return;
    }

    const newRequest: LeaveRequest = {
      id: `LR${Date.now()}`,
      teacherId: loggedInTeacher.id,
      startDate,
      endDate,
      reason,
      status: 'Pending',
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);
    setModalOpen(false);
    toast({
      title: 'Leave Request Submitted',
      description: 'Your request has been sent to the admin for approval.',
    });
  };

  const getStatusVariant = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Rejected':
        return 'destructive';
      case 'Pending':
      default:
        return 'secondary';
    }
  };

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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>My Leave Requests</CardTitle>
              <CardDescription>
                View your leave history and submit new requests.
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Request Leave
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myLeaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{format(new Date(request.startDate), 'PPP')}</TableCell>
                  <TableCell>{format(new Date(request.endDate), 'PPP')}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {myLeaveRequests.length === 0 && (
            <p className="text-center text-muted-foreground py-8">You have not made any leave requests.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit a Leave Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitRequest}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" name="endDate" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Leave</Label>
                <Textarea id="reason" name="reason" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
