
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { academic, schedule } from '@/lib/data';
import { Edit } from 'lucide-react';

type ScheduleSlot = (typeof schedule)['Grade 9'][0];

export default function SchedulePage() {
  const [schedulesData, setSchedulesData] = useState(schedule);
  const grades = academic.classes.map((c) => c.name);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<{
    grade: string;
    slotIndex: number;
    slot: ScheduleSlot;
  } | null>(null);

  const handleOpenModal = (grade: string, slotIndex: number) => {
    const slotToEdit = schedulesData[grade as keyof typeof schedulesData][slotIndex];
    setEditingData({
      grade,
      slotIndex,
      slot: { ...slotToEdit },
    });
    setModalOpen(true);
  };

  const handleScheduleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingData) return;

    const formData = new FormData(event.currentTarget);
    const updatedSlot: ScheduleSlot = {
      time: editingData.slot.time,
      monday: formData.get('monday') as string,
      tuesday: formData.get('tuesday') as string,
      wednesday: formData.get('wednesday') as string,
      thursday: formData.get('thursday') as string,
      friday: formData.get('friday') as string,
    };

    const newSchedules = { ...schedulesData };
    const gradeSchedules = [...newSchedules[editingData.grade as keyof typeof newSchedules]];
    gradeSchedules[editingData.slotIndex] = updatedSlot;
    
    (newSchedules as any)[editingData.grade] = gradeSchedules;

    setSchedulesData(newSchedules);
    setModalOpen(false);
    setEditingData(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Class Schedules</CardTitle>
          <CardDescription>View and manage weekly class schedules.</CardDescription>
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
                {schedulesData[grade as keyof typeof schedulesData] ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Time</TableHead>
                        <TableHead>Monday</TableHead>
                        <TableHead>Tuesday</TableHead>
                        <TableHead>Wednesday</TableHead>
                        <TableHead>Thursday</TableHead>
                        <TableHead>Friday</TableHead>
                        <TableHead className="w-[80px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedulesData[grade as keyof typeof schedulesData].map((slot, index) => (
                        <TableRow key={slot.time}>
                          <TableCell className="font-medium">{slot.time}</TableCell>
                          <TableCell>{slot.monday}</TableCell>
                          <TableCell>{slot.tuesday}</TableCell>
                          <TableCell>{slot.wednesday}</TableCell>
                          <TableCell>{slot.thursday}</TableCell>
                          <TableCell>{slot.friday}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenModal(grade, index)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </TableCell>
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

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            {editingData && (
              <DialogDescription>
                Editing schedule for {editingData.grade} at {editingData.slot.time}.
              </DialogDescription>
            )}
          </DialogHeader>
          {editingData && (
            <form onSubmit={handleScheduleUpdate} key={editingData ? `${editingData.grade}-${editingData.slotIndex}` : 'schedule-form'}>
              <div className="grid gap-4 py-4">
                 <div className="grid grid-cols-6 items-center gap-4">
                    <Label className="text-right">Time</Label>
                    <Input className="col-span-5" value={editingData.slot.time} disabled />
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label htmlFor="monday" className="text-right">Monday</Label>
                  <Input id="monday" name="monday" className="col-span-5" defaultValue={editingData.slot.monday} />
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label htmlFor="tuesday" className="text-right">Tuesday</Label>
                  <Input id="tuesday" name="tuesday" className="col-span-5" defaultValue={editingData.slot.tuesday} />
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label htmlFor="wednesday" className="text-right">Wednesday</Label>
                  <Input id="wednesday" name="wednesday" className="col-span-5" defaultValue={editingData.slot.wednesday} />
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label htmlFor="thursday" className="text-right">Thursday</Label>
                  <Input id="thursday" name="thursday" className="col-span-5" defaultValue={editingData.slot.thursday} />
                </div>
                <div className="grid grid-cols-6 items-center gap-4">
                  <Label htmlFor="friday" className="text-right">Friday</Label>
                  <Input id="friday" name="friday" className="col-span-5" defaultValue={editingData.slot.friday} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
