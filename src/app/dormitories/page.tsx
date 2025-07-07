
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
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, PlusCircle, BedDouble } from 'lucide-react';
import { dormitories as dormitoriesData, students } from '@/lib/data';

type Dormitory = (typeof dormitoriesData.list)[0];
type Room = (typeof dormitoriesData.rooms)[0];
type Bed = (typeof dormitoriesData.beds)[0];

export default function DormitoriesPage() {
  const [dormitories, setDormitories] = useState(dormitoriesData.list);
  const [rooms, setRooms] = useState(dormitoriesData.rooms);
  const [beds, setBeds] = useState(dormitoriesData.beds);

  const [isDormitoryModalOpen, setDormitoryModalOpen] = useState(false);
  const [isRoomModalOpen, setRoomModalOpen] = useState(false);
  const [isBedModalOpen, setBedModalOpen] = useState(false);

  const [editingDormitory, setEditingDormitory] = useState<Dormitory | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'dormitory' | 'room' | 'bed'; id: string } | null>(null);

  const getDormitoryName = (dormId: string) => dormitories.find(d => d.id === dormId)?.name || 'N/A';
  const getRoomInfo = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return { roomNumber: 'N/A', dormitoryName: 'N/A' };
    const dormitoryName = getDormitoryName(room.dormitoryId);
    return { roomNumber: room.roomNumber, dormitoryName };
  }
  const getStudentName = (studentId: string | null) => {
    if (!studentId) return <span className="text-muted-foreground">Vacant</span>;
    return students.find(s => s.id === studentId)?.name || 'N/A';
  }

  const assignedStudentIds = beds.map(b => b.studentId).filter((id): id is string => !!id);
  const unassignedStudents = students.filter(s => !assignedStudentIds.includes(s.id));

  const handleOpenDormitoryModal = (dorm: Dormitory | null) => {
    setEditingDormitory(dorm);
    setDormitoryModalOpen(true);
  };

  const handleDormitorySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      description: formData.get('description') as string,
    };
    if (editingDormitory) {
      setDormitories(dormitories.map(d => d.id === editingDormitory.id ? { ...d, ...data } : d));
    } else {
      setDormitories([...dormitories, { id: `D${(dormitories.length + 1).toString().padStart(2, '0')}`, ...data }]);
    }
    setDormitoryModalOpen(false);
  };

  const handleOpenRoomModal = (room: Room | null) => {
    setEditingRoom(room);
    setRoomModalOpen(true);
  };

  const handleRoomSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      dormitoryId: formData.get('dormitoryId') as string,
      roomNumber: formData.get('roomNumber') as string,
      costPerBed: parseInt(formData.get('costPerBed') as string, 10),
    };
    if (editingRoom) {
      setRooms(rooms.map(r => r.id === editingRoom.id ? { ...r, ...data } : r));
    } else {
      setRooms([...rooms, { id: `ROOM${(rooms.length + 1).toString().padStart(2, '0')}`, ...data }]);
    }
    setRoomModalOpen(false);
  };

  const handleOpenBedModal = (bed: Bed | null) => {
    setEditingBed(bed);
    setBedModalOpen(true);
  };

  const handleBedSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const studentIdValue = formData.get('studentId') as string;
    const studentId = studentIdValue === 'null' ? null : studentIdValue;

    if (editingBed) {
      setBeds(beds.map(b => b.id === editingBed.id ? { ...b, studentId: studentId } : b));
    } else {
       const data = {
        roomId: formData.get('roomId') as string,
        bedNumber: formData.get('bedNumber') as string,
        studentId,
      };
      setBeds([...beds, { id: `BED${(beds.length + 1).toString().padStart(2, '0')}`, ...data }]);
    }
    setBedModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    if (type === 'dormitory') {
      const roomIdsToDelete = rooms.filter(r => r.dormitoryId === id).map(r => r.id);
      setBeds(beds.filter(b => !roomIdsToDelete.includes(b.roomId)));
      setRooms(rooms.filter(r => r.dormitoryId !== id));
      setDormitories(dormitories.filter(d => d.id !== id));
    } else if (type === 'room') {
      setBeds(beds.filter(b => b.roomId !== id));
      setRooms(rooms.filter(r => r.id !== id));
    } else if (type === 'bed') {
      setBeds(beds.filter(b => b.id !== id));
    }
    setDeleteTarget(null);
  };
  
  const getDeleteDescription = () => {
    if (!deleteTarget) return '';
    switch (deleteTarget.type) {
        case 'dormitory': return 'This action will permanently delete the dormitory and all its rooms and bed assignments.';
        case 'room': return 'This action will permanently delete the room and all its associated beds.';
        case 'bed': return 'This action will permanently delete this bed and unassign any student.';
        default: return 'This action cannot be undone.';
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <BedDouble className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Dormitory Management</CardTitle>
              <CardDescription>Manage dormitories, rooms, and bed assignments for students.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dormitories">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dormitories">Dormitories</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="beds">Beds & Assignments</TabsTrigger>
            </TabsList>

            <TabsContent value="dormitories">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Dormitory List</CardTitle>
                    <Button size="sm" onClick={() => handleOpenDormitoryModal(null)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Dormitory
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {dormitories.map(dorm => (
                        <TableRow key={dorm.id}>
                          <TableCell className="font-medium">{dorm.name}</TableCell>
                          <TableCell>{dorm.type}</TableCell>
                          <TableCell>{dorm.description}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenDormitoryModal(dorm)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'dormitory', id: dorm.id })}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rooms">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Room List</CardTitle>
                    <Button size="sm" onClick={() => handleOpenRoomModal(null)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Room
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Room Number</TableHead><TableHead>Dormitory</TableHead><TableHead>Cost per Bed</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {rooms.map(room => (
                        <TableRow key={room.id}>
                          <TableCell className="font-medium">{room.roomNumber}</TableCell>
                          <TableCell>{getDormitoryName(room.dormitoryId)}</TableCell>
                          <TableCell>${room.costPerBed.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenRoomModal(room)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'room', id: room.id })}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="beds">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Bed Management</CardTitle>
                    <Button size="sm" onClick={() => handleOpenBedModal(null)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Bed
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Bed Number</TableHead><TableHead>Room</TableHead><TableHead>Dormitory</TableHead><TableHead>Assigned Student</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {beds.map(bed => {
                        const { roomNumber, dormitoryName } = getRoomInfo(bed.roomId);
                        return (
                          <TableRow key={bed.id}>
                            <TableCell className="font-medium">{bed.bedNumber}</TableCell>
                            <TableCell>{roomNumber}</TableCell>
                            <TableCell>{dormitoryName}</TableCell>
                            <TableCell>{getStudentName(bed.studentId)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleOpenBedModal(bed)}>{bed.studentId ? 'Edit Assignment' : 'Assign Student'}</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'bed', id: bed.id })}>Delete Bed</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
      
      {/* Dormitory Modal */}
      <Dialog open={isDormitoryModalOpen} onOpenChange={setDormitoryModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingDormitory ? 'Edit Dormitory' : 'Add New Dormitory'}</DialogTitle></DialogHeader>
          <form onSubmit={handleDormitorySubmit} key={editingDormitory?.id || 'add-dorm'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" name="name" className="col-span-3" required defaultValue={editingDormitory?.name} /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="type" className="text-right">Type</Label><Select name="type" required defaultValue={editingDormitory?.type}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="Boys">Boys</SelectItem><SelectItem value="Girls">Girls</SelectItem><SelectItem value="Mixed">Mixed</SelectItem></SelectContent></Select></div>
              <div className="grid grid-cols-4 items-start gap-4"><Label htmlFor="description" className="text-right pt-2">Description</Label><Textarea id="description" name="description" className="col-span-3" defaultValue={editingDormitory?.description} /></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setDormitoryModalOpen(false)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Room Modal */}
      <Dialog open={isRoomModalOpen} onOpenChange={setRoomModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle></DialogHeader>
          <form onSubmit={handleRoomSubmit} key={editingRoom?.id || 'add-room'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="dormitoryId" className="text-right">Dormitory</Label><Select name="dormitoryId" required defaultValue={editingRoom?.dormitoryId}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select dormitory" /></SelectTrigger><SelectContent>{dormitories.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="roomNumber" className="text-right">Room Number</Label><Input id="roomNumber" name="roomNumber" className="col-span-3" required defaultValue={editingRoom?.roomNumber} /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="costPerBed" className="text-right">Cost per Bed</Label><Input id="costPerBed" name="costPerBed" type="number" className="col-span-3" required defaultValue={editingRoom?.costPerBed} /></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setRoomModalOpen(false)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Bed & Assignment Modal */}
      <Dialog open={isBedModalOpen} onOpenChange={setBedModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingBed ? 'Edit Bed/Assignment' : 'Add New Bed'}</DialogTitle></DialogHeader>
          <form onSubmit={handleBedSubmit} key={editingBed?.id || 'add-bed'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roomId" className="text-right">Room</Label>
                <Select name="roomId" required defaultValue={editingBed?.roomId} disabled={!!editingBed}>
                  <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a room" /></SelectTrigger>
                  <SelectContent>{rooms.map(r => <SelectItem key={r.id} value={r.id}>{getDormitoryName(r.dormitoryId)} - {r.roomNumber}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bedNumber" className="text-right">Bed Number</Label>
                <Input id="bedNumber" name="bedNumber" className="col-span-3" required defaultValue={editingBed?.bedNumber} disabled={!!editingBed} />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="studentId" className="text-right">Student</Label>
                <Select name="studentId" defaultValue={editingBed?.studentId || 'null'}>
                  <SelectTrigger className="col-span-3"><SelectValue placeholder="Assign a student" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'null'}>Vacant / Unassigned</SelectItem>
                    {editingBed?.studentId && <SelectItem value={editingBed.studentId}>{getStudentName(editingBed.studentId)} (Current)</SelectItem>}
                    {unassignedStudents.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setBedModalOpen(false)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>{getDeleteDescription()}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
