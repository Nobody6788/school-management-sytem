
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
import { Contact } from 'lucide-react';
import { parents, students } from '@/lib/data';

// Mocking the logged-in parent
const loggedInParent = parents.find(p => p.id === 'P01');

export default function ParentDirectoryPage() {
  const [allParents] = useState(parents);

  const getStudentName = (studentId: string) => {
    return students.find((s) => s.id === studentId)?.name || 'N/A';
  };

  if (!loggedInParent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Parent profile not found. This is a demo page for a sample parent.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Contact className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Parent Directory</CardTitle>
              <CardDescription>A list of all parents in the school community.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parent Name</TableHead>
                <TableHead>Child's Name</TableHead>
                <TableHead>Child's Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allParents.map((parent) => {
                const child = students.find(s => s.id === parent.studentId);
                return (
                    <TableRow key={parent.id}>
                    <TableCell className="font-medium">{parent.name}</TableCell>
                    <TableCell>{child?.name || 'N/A'}</TableCell>
                    <TableCell>{child?.grade || 'N/A'}</TableCell>
                    </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
