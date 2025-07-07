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
import { academic } from '@/lib/data';

type Grade = (typeof academic.grades)[0];

export default function StudentGradesPage() {
  const [grades] = useState<Grade[]>(academic.grades);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Grading System</CardTitle>
          <CardDescription>View the official grading system for examinations, including grade points and percentage ranges.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Grade Name</TableHead>
              <TableHead>Grade Point</TableHead>
              <TableHead>Percentage From</TableHead>
              <TableHead>Percentage To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((grade) => (
              <TableRow key={grade.id}>
                <TableCell className="font-medium">{grade.gradeName}</TableCell>
                <TableCell>{grade.gradePoint}</TableCell>
                <TableCell>{grade.percentageFrom}%</TableCell>
                <TableCell>{grade.percentageTo}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
