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
import { academic, schedule } from '@/lib/data';

export default function SchedulePage() {
  const grades = academic.classes.map((c) => c.name);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Schedules</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={grades.length > 0 ? grades[0] : ''}>
          <TabsList>
            {grades.map((grade) => (
              <TabsTrigger key={grade} value={grade}>
                {grade}
              </TabsTrigger>
            ))}
          </TabsList>
          {grades.map((grade) => (
            <TabsContent key={grade} value={grade}>
              {schedule[grade as keyof typeof schedule] ? (
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
                    {schedule[grade as keyof typeof schedule].map((slot) => (
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
              ) : (
                <div className="pt-4 text-center text-muted-foreground">
                  No schedule has been set for {grade}.
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
