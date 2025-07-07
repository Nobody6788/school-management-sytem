
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
import { notices as allNotices, students, parents } from '@/lib/data';
import { Eye, Megaphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Notice = (typeof allNotices)[0];

// Mocking the logged-in parent
const loggedInParent = parents.find(p => p.id === 'P01');
const child = loggedInParent ? students.find(s => s.id === loggedInParent.studentId) : null;

const getRelevantNotices = () => {
    if (!child || !loggedInParent) return [];
    return allNotices.filter(n =>
        n.target === 'All Users' ||
        n.target === 'All Students' ||
        n.target.includes(child.grade) ||
        n.target.includes(child.name) ||
        n.target.includes(loggedInParent.name)
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};


export default function ParentNoticeboardPage() {
  const [notices] = useState(getRelevantNotices());
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);

  const handleViewNotice = (notice: Notice) => {
    setViewingNotice(notice);
  };
  
  if (!loggedInParent || !child) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Parent or child profile not found. This is a demo page for a sample parent.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
            <div className="flex items-center gap-4">
                <Megaphone className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle>Noticeboard</CardTitle>
                    <CardDescription>View announcements and notices relevant to you and your child.</CardDescription>
                </div>
            </div>
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
                    No relevant notices at the moment.
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
                            Posted on {viewingNotice.date} by {viewingNotice.author} for <Badge variant="secondary">{viewingNotice.target}</Badge>
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
