
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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { transport, students, teachers } from '@/lib/data';

type Vehicle = (typeof transport.vehicles)[0];
type Route = (typeof transport.routes)[0];
type Member = (typeof transport.members)[0];

export default function TransportPage() {
  const [vehicles, setVehicles] = useState(transport.vehicles);
  const [routes, setRoutes] = useState(transport.routes);
  const [members, setMembers] = useState(transport.members);

  const [isVehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [isRouteModalOpen, setRouteModalOpen] = useState(false);
  const [isMemberModalOpen, setMemberModalOpen] = useState(false);

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'vehicle' | 'route' | 'member'; id: string } | null>(null);
  
  const [selectedMemberType, setSelectedMemberType] = useState('Student');

  const getVehicleNumber = (vehicleId: string) => vehicles.find(v => v.id === vehicleId)?.vehicleNumber || 'N/A';
  const getRouteName = (routeId: string) => routes.find(r => r.id === routeId)?.name || 'N/A';
  
  const getMemberDetails = (memberId: string, memberType: string) => {
    const source = memberType === 'Student' ? students : teachers;
    const member = source.find(m => m.id === memberId);
    return { name: member?.name || 'N/A', role: memberType };
  };

  const assignedMemberIds = members.map(m => m.memberId);
  const availableStudents = students.filter(s => !assignedMemberIds.includes(s.id));
  const availableTeachers = teachers.filter(t => !assignedMemberIds.includes(t.id));


  const handleOpenVehicleModal = (vehicle: Vehicle | null) => {
    setEditingVehicle(vehicle);
    setVehicleModalOpen(true);
  };

  const handleVehicleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      vehicleNumber: formData.get('vehicleNumber') as string,
      model: formData.get('model') as string,
      year: formData.get('year') as string,
      capacity: parseInt(formData.get('capacity') as string, 10),
      driverName: formData.get('driverName') as string,
      driverContact: formData.get('driverContact') as string,
    };

    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...v, ...data } : v));
    } else {
      setVehicles([...vehicles, { id: `V${(vehicles.length + 1).toString().padStart(2, '0')}`, ...data }]);
    }
    setVehicleModalOpen(false);
    setEditingVehicle(null);
  };

  const handleOpenRouteModal = (route: Route | null) => {
    setEditingRoute(route);
    setRouteModalOpen(true);
  };

  const handleRouteSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      stops: (formData.get('stops') as string).split(',').map(s => s.trim()).join(', '),
      vehicleId: formData.get('vehicleId') as string,
    };

    if (editingRoute) {
      setRoutes(routes.map(r => r.id === editingRoute.id ? { ...r, ...data } : r));
    } else {
      setRoutes([...routes, { id: `R${(routes.length + 1).toString().padStart(2, '0')}`, ...data }]);
    }
    setRouteModalOpen(false);
    setEditingRoute(null);
  };

  const handleOpenMemberModal = (member: Member | null) => {
    setEditingMember(member);
    setSelectedMemberType(member?.memberType || 'Student');
    setMemberModalOpen(true);
  };

  const handleMemberSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      memberId: formData.get('memberId') as string,
      memberType: formData.get('memberType') as string,
      routeId: formData.get('routeId') as string,
    };
    
    if (editingMember) {
      setMembers(members.map(m => m.id === editingMember.id ? { ...m, ...data } : m));
    } else {
      setMembers([...members, { id: `TM${(members.length + 1).toString().padStart(2, '0')}`, ...data }]);
    }
    setMemberModalOpen(false);
    setEditingMember(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;

    if (type === 'vehicle') {
      const routesToDelete = routes.filter(r => r.vehicleId === id).map(r => r.id);
      setMembers(members.filter(m => !routesToDelete.includes(m.routeId)));
      setRoutes(routes.filter(r => r.vehicleId !== id));
      setVehicles(vehicles.filter(v => v.id !== id));
    } else if (type === 'route') {
      setMembers(members.filter(m => m.routeId !== id));
      setRoutes(routes.filter(r => r.id !== id));
    } else if (type === 'member') {
      setMembers(members.filter(m => m.id !== id));
    }

    setDeleteTarget(null);
  };

  const getDeleteDescription = () => {
    if (!deleteTarget) return '';
    switch (deleteTarget.type) {
        case 'vehicle': return 'This action will permanently delete the vehicle and all associated routes and member assignments.';
        case 'route': return 'This will permanently delete the route and all its member assignments.';
        case 'member': return 'This will remove the member from their assigned transport route.';
        default: return 'This action cannot be undone.';
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transport Management</CardTitle>
          <CardDescription>Manage vehicles, routes, and transport members.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vehicles">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              <TabsTrigger value="routes">Routes</TabsTrigger>
              <TabsTrigger value="members">Transport Members</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vehicles">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Vehicle Fleet</CardTitle>
                    <Button size="sm" onClick={() => handleOpenVehicleModal(null)}>
                      <PlusCircle className="mr-2" /> Add Vehicle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Vehicle No.</TableHead><TableHead>Model</TableHead><TableHead>Year</TableHead><TableHead>Capacity</TableHead><TableHead>Driver</TableHead><TableHead>Contact</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {vehicles.map(v => (
                        <TableRow key={v.id}>
                          <TableCell className="font-medium">{v.vehicleNumber}</TableCell>
                          <TableCell>{v.model}</TableCell>
                          <TableCell>{v.year}</TableCell>
                          <TableCell>{v.capacity}</TableCell>
                          <TableCell>{v.driverName}</TableCell>
                          <TableCell>{v.driverContact}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal/></Button></DropdownMenuTrigger>
                              <DropdownMenuContent><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuItem onClick={() => handleOpenVehicleModal(v)}>Edit</DropdownMenuItem><DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'vehicle', id: v.id })}>Delete</DropdownMenuItem></DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="routes">
               <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Transport Routes</CardTitle>
                    <Button size="sm" onClick={() => handleOpenRouteModal(null)}>
                      <PlusCircle className="mr-2" /> Add Route
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Route Name</TableHead><TableHead>Stops</TableHead><TableHead>Vehicle</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {routes.map(r => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.name}</TableCell>
                          <TableCell className="max-w-md truncate">{r.stops}</TableCell>
                          <TableCell>{getVehicleNumber(r.vehicleId)}</TableCell>
                          <TableCell className="text-right">
                             <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal/></Button></DropdownMenuTrigger>
                              <DropdownMenuContent><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuItem onClick={() => handleOpenRouteModal(r)}>Edit</DropdownMenuItem><DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'route', id: r.id })}>Delete</DropdownMenuItem></DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members">
               <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Assigned Members</CardTitle>
                    <Button size="sm" onClick={() => handleOpenMemberModal(null)}>
                      <PlusCircle className="mr-2" /> Assign Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Member Name</TableHead><TableHead>Role</TableHead><TableHead>Assigned Route</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {members.map(m => {
                        const { name, role } = getMemberDetails(m.memberId, m.memberType);
                        return (
                          <TableRow key={m.id}>
                            <TableCell className="font-medium">{name}</TableCell>
                            <TableCell>{role}</TableCell>
                            <TableCell>{getRouteName(m.routeId)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal/></Button></DropdownMenuTrigger>
                                <DropdownMenuContent><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuItem onClick={() => handleOpenMemberModal(m)}>Edit</DropdownMenuItem><DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'member', id: m.id })}>Delete</DropdownMenuItem></DropdownMenuContent>
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

      <Dialog open={isVehicleModalOpen} onOpenChange={setVehicleModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle></DialogHeader>
          <form onSubmit={handleVehicleSubmit} key={editingVehicle ? editingVehicle.id : 'add-vehicle'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="vehicleNumber" className="text-right">Vehicle No.</Label><Input id="vehicleNumber" name="vehicleNumber" className="col-span-3" required defaultValue={editingVehicle?.vehicleNumber} /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="model" className="text-right">Model</Label><Input id="model" name="model" className="col-span-3" required defaultValue={editingVehicle?.model} /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="year" className="text-right">Year</Label><Input id="year" name="year" className="col-span-3" required defaultValue={editingVehicle?.year} /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="capacity" className="text-right">Capacity</Label><Input id="capacity" name="capacity" type="number" className="col-span-3" required defaultValue={editingVehicle?.capacity} /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="driverName" className="text-right">Driver Name</Label><Input id="driverName" name="driverName" className="col-span-3" required defaultValue={editingVehicle?.driverName} /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="driverContact" className="text-right">Driver Contact</Label><Input id="driverContact" name="driverContact" className="col-span-3" required defaultValue={editingVehicle?.driverContact} /></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setVehicleModalOpen(false)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isRouteModalOpen} onOpenChange={setRouteModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle></DialogHeader>
          <form onSubmit={handleRouteSubmit} key={editingRoute ? editingRoute.id : 'add-route'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Route Name</Label><Input id="name" name="name" className="col-span-3" required defaultValue={editingRoute?.name} /></div>
              <div className="grid grid-cols-4 items-start gap-4"><Label htmlFor="stops" className="text-right pt-2">Stops</Label><Textarea id="stops" name="stops" className="col-span-3" rows={4} placeholder="Enter stops, separated by commas" required defaultValue={editingRoute?.stops} /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="vehicleId" className="text-right">Vehicle</Label><Select name="vehicleId" required defaultValue={editingRoute?.vehicleId}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select a vehicle" /></SelectTrigger><SelectContent>{vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.vehicleNumber} ({v.model})</SelectItem>)}</SelectContent></Select></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setRouteModalOpen(false)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isMemberModalOpen} onOpenChange={setMemberModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingMember ? 'Edit Assignment' : 'Assign Member to Route'}</DialogTitle></DialogHeader>
          <form onSubmit={handleMemberSubmit} key={editingMember ? editingMember.id : 'add-member'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="memberType" className="text-right">Member Type</Label><Select name="memberType" required onValueChange={setSelectedMemberType} defaultValue={editingMember?.memberType || selectedMemberType}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Student">Student</SelectItem><SelectItem value="Teacher">Teacher</SelectItem></SelectContent></Select></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="memberId" className="text-right">Member</Label><Select name="memberId" required defaultValue={editingMember?.memberId}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select a member" /></SelectTrigger><SelectContent>{(selectedMemberType === 'Student' ? availableStudents : availableTeachers).map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)} {editingMember && <SelectItem key={editingMember.memberId} value={editingMember.memberId}>{getMemberDetails(editingMember.memberId, editingMember.memberType).name}</SelectItem>}</SelectContent></Select></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="routeId" className="text-right">Route</Label><Select name="routeId" required defaultValue={editingMember?.routeId}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select a route" /></SelectTrigger><SelectContent>{routes.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setMemberModalOpen(false)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>{getDeleteDescription()}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
