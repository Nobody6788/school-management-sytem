
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { transport, students, teachers } from '@/lib/data';

export default function TeacherTransportPage() {
  const [vehicles] = useState(transport.vehicles);
  const [routes] = useState(transport.routes);
  const [members] = useState(transport.members);

  const getVehicleNumber = (vehicleId: string) => vehicles.find(v => v.id === vehicleId)?.vehicleNumber || 'N/A';
  const getRouteName = (routeId: string) => routes.find(r => r.id === routeId)?.name || 'N/A';
  
  const getMemberDetails = (memberId: string, memberType: string) => {
    const source = memberType === 'Student' ? students : teachers;
    const member = source.find(m => m.id === memberId);
    return { name: member?.name || 'N/A', role: memberType };
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transport Information</CardTitle>
          <CardDescription>View school vehicles, routes, and transport members.</CardDescription>
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
                  <CardTitle>Vehicle Fleet</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Vehicle No.</TableHead><TableHead>Model</TableHead><TableHead>Year</TableHead><TableHead>Capacity</TableHead><TableHead>Driver</TableHead><TableHead>Contact</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {vehicles.map(v => (
                        <TableRow key={v.id}>
                          <TableCell className="font-medium">{v.vehicleNumber}</TableCell>
                          <TableCell>{v.model}</TableCell>
                          <TableCell>{v.year}</TableCell>
                          <TableCell>{v.capacity}</TableCell>
                          <TableCell>{v.driverName}</TableCell>
                          <TableCell>{v.driverContact}</TableCell>
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
                  <CardTitle>Transport Routes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Route Name</TableHead><TableHead>Stops</TableHead><TableHead>Vehicle</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {routes.map(r => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.name}</TableCell>
                          <TableCell className="max-w-md truncate">{r.stops}</TableCell>
                          <TableCell>{getVehicleNumber(r.vehicleId)}</TableCell>
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
                  <CardTitle>Assigned Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Member Name</TableHead><TableHead>Role</TableHead><TableHead>Assigned Route</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {members.map(m => {
                        const { name, role } = getMemberDetails(m.memberId, m.memberType);
                        return (
                          <TableRow key={m.id}>
                            <TableCell className="font-medium">{name}</TableCell>
                            <TableCell>{role}</TableCell>
                            <TableCell>{getRouteName(m.routeId)}</TableCell>
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
    </>
  );
}
