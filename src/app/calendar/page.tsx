'use client';

import { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { personalEvents as initialEvents } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type PersonalEvent = {
  id: string;
  date: Date;
  title: string;
  description: string;
};

// Convert string dates from data file to Date objects
const parsedEvents = initialEvents.map(event => ({
    ...event,
    date: new Date(event.date + 'T00:00:00') // Avoid timezone issues by setting time
}));

export default function PersonalCalendarPage() {
  const [events, setEvents] = useState<PersonalEvent[]>(parsedEvents);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PersonalEvent | null>(null);
  const { toast } = useToast();

  const selectedDayEvents = selectedDate
    ? events.filter((event) => isSameDay(event.date, selectedDate))
    : [];

  const handleOpenModal = (event: PersonalEvent | null) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleEventSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!title || !selectedDate) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Title and date are required to create an event."
        });
        return;
    }
    
    if (editingEvent) {
      // Update existing event
      setEvents(events.map(e => e.id === editingEvent.id ? { ...e, title, description, date: selectedDate } : e));
      toast({ title: "Event Updated", description: "Your event has been successfully updated." });
    } else {
      // Add new event
      const newEvent: PersonalEvent = {
        id: `E${Date.now()}`,
        date: selectedDate,
        title,
        description,
      };
      setEvents([...events, newEvent]);
      toast({ title: "Event Created", description: "Your new event has been added to the calendar." });
    }

    setModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    toast({ title: "Event Deleted", description: "The event has been removed from your calendar." });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>My Calendar</CardTitle>
          <CardDescription>Select a date to view or add events.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              hasEvent: events.map(e => e.date),
            }}
            modifiersStyles={{
              hasEvent: {
                fontWeight: 'bold',
                textDecoration: 'underline',
                textDecorationColor: 'hsl(var(--primary))'
              },
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Events for {selectedDate ? format(selectedDate, 'PPP') : 'Today'}</CardTitle>
              <CardDescription>Manage your events for the selected day.</CardDescription>
            </div>
            <Button size="sm" onClick={() => handleOpenModal(null)} disabled={!selectedDate}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedDayEvents.length > 0 ? (
            <ul className="space-y-4">
              {selectedDayEvents.map(event => (
                <li key={event.id} className="flex items-start justify-between p-4 rounded-md border bg-muted/50">
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(event)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteEvent(event.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <CalendarIcon className="mx-auto h-12 w-12" />
              <p className="mt-4">No events for this day.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Event Modal */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
             <CardDescription>
                For {selectedDate && format(selectedDate, "PPP")}
            </CardDescription>
          </DialogHeader>
          <form onSubmit={handleEventSubmit} key={editingEvent ? editingEvent.id : 'add-event'}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" name="title" required defaultValue={editingEvent?.title} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={4} defaultValue={editingEvent?.description} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}