
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
import { notices as allNotices, teachers } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

type Notice = (typeof allNotices)[0];

// Mocking logged-in teacher
const teacher = teachers.find(t => t.id === 'T02');

const getRelevantNotices = () => {
    if (!teacher) return [];
    return allNotices.filter(n => 
        n.target === 'All Users' || 
        n.target === 'All Teachers' || 
        n.target.includes(teacher.name)
    );
};


export default function TeacherNoticeboardPage() {
  const [notices] = useState(getRelevantNotices());
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);

  const handleViewNotice = (notice: Notice) => {
    setViewingNotice(notice);
  };
  
  if (!teacher) {
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
            <CardTitle>Noticeboard</CardTitle>
            <CardDescription>View announcements and notices from the school.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Target Audience</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell>{notice.date}</TableCell>
                  <TableCell className="font-medium">{notice.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{notice.target}</Badge>
                  </TableCell>
                  <TableCell>{notice.author}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewNotice(notice)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
                            Posted on {viewingNotice.date} by {viewingNotice.author} for {viewingNotice.target}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-sm text-foreground prose dark:prose-invert">
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
