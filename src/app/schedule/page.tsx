import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { schedule } from '@/lib/data';

export default function SchedulePage() {
  const grades = Object.keys(schedule) as (keyof typeof schedule)[];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Schedules</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={grades[0]}>
          <TabsList>
            {grades.map((grade) => (
              <TabsTrigger key={grade} value={grade}>
                {grade}
              </TabsTrigger>
            ))}
          </TabsList>
          {grades.map((grade) => (
            <TabsContent key={grade} value={grade}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Time</TableHead>
                    <TableHead>Monday</TableHead>
                    <TableHead>Tuesday</TableHead>
                    <TableHead>Wednesday</TableHead>
                    <TableHead>Thursday</TableHead>
                    <TableHead>Friday</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule[grade].map((slot) => (
                    <TableRow key={slot.time}>
                      <TableCell className="font-medium">{slot.time}</TableCell>
                      <TableCell>{slot.monday}</TableCell>
                      <TableCell>{slot.tuesday}</TableCell>
                      <TableCell>{slot.wednesday}</TableCell>
                      <TableCell>{slot.thursday}</TableCell>
                      <TableCell>{slot.friday}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
