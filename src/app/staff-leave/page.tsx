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
import { Badge } from '@/components/ui/badge';
import { teachers, leaveRequests as initialLeaveRequests } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import { format } from 'date-fns';

type LeaveRequest = (typeof initialLeaveRequests)[0];

export default function StaffLeavePage() {
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const { toast } = useToast();

  const getTeacherName = (teacherId: string) => {
    return teachers.find((t) => t.id === teacherId)?.name || 'N/A';
  };

  const handleUpdateRequest = (requestId: string, status: 'Approved' | 'Rejected') => {
    setLeaveRequests(
      leaveRequests.map((req) =>
        req.id === requestId ? { ...req, status } : req
      )
    );
    toast({
      title: `Request ${status}`,
      description: `The leave request has been successfully ${status.toLowerCase()}.`,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Leave Management</CardTitle>
        <CardDescription>
          Review and approve or reject leave requests from staff members.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {getTeacherName(request.teacherId)}
                </TableCell>
                <TableCell>{format(new Date(request.startDate), 'PPP')}</TableCell>
                <TableCell>{format(new Date(request.endDate), 'PPP')}</TableCell>
                <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(request.status)}>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {request.status === 'Pending' && (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateRequest(request.id, 'Approved')}
                        className="text-green-600 border-green-600 hover:bg-green-100 hover:text-green-700"
                      >
                        <Check className="mr-2 h-4 w-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateRequest(request.id, 'Rejected')}
                         className="text-red-600 border-red-600 hover:bg-red-100 hover:text-red-700"
                      >
                        <X className="mr-2 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
