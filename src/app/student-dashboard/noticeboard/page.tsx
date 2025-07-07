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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { notices as allNotices, students } from '@/lib/data';
import { Eye } from 'lucide-react';

type Notice = (typeof allNotices)[0];

// Mocking the logged-in student
const loggedInStudent = students.find(s => s.id === 'S001');

const getRelevantNotices = () => {
    if (!loggedInStudent) return [];
    return allNotices.filter(n =>
        n.target === 'All Users' ||
        n.target === 'All Students' ||
        n.target.includes(loggedInStudent.grade) ||
        n.target.includes(loggedInStudent.name)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};


export default function StudentNoticeboardPage() {
  const [notices] = useState(getRelevantNotices());
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);

  const handleViewNotice = (notice: Notice) => {
    setViewingNotice(notice);
  };
  
  if (!loggedInStudent) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Student profile not found. This is a demo page for a sample student.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
            <CardTitle>Noticeboard</CardTitle>
            <CardDescription>View announcements and notices from the school.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notices.length > 0 ? notices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell>{notice.date}</TableCell>
                  <TableCell className="font-medium">{notice.title}</TableCell>
                  <TableCell>{notice.author}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewNotice(notice)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No new notices for you right now.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Notice Modal */}
      <Dialog open={!!viewingNotice} onOpenChange={() => setViewingNotice(null)}>
        <DialogContent>
            {viewingNotice && (
                <>
                    <DialogHeader>
                        <DialogTitle>{viewingNotice.title}</DialogTitle>
                        <DialogDescription>
                            Posted on {viewingNotice.date} by {viewingNotice.author}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-sm text-foreground whitespace-pre-wrap">
                        {viewingNotice.content}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewingNotice(null)}>Close</Button>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
