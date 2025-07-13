
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Circle, ChevronsLeft, ChevronsRight } from "lucide-react"
import { DayPicker, type DayProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { add, format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"

type AcademicEvent = { id: string; date: string; title: string; description: string; type: 'Holiday' | 'Exam' | 'Event' };
type Schedule = Record<string, { time: string; [key: string]: string }[]>;

export type CalendarProps = {
    events?: AcademicEvent[];
    schedule?: Schedule;
    className?: string;
};


function DashboardCalendar({
  className,
  events = [],
  schedule = {},
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [view, setView] = React.useState<'month' | 'week' | 'day' | 'list'>('month');

  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, AcademicEvent[]>();
    events.forEach(event => {
        const dateKey = format(new Date(event.date + 'T00:00:00'), 'yyyy-MM-dd');
        if (!map.has(dateKey)) {
            map.set(dateKey, []);
        }
        map.get(dateKey)?.push(event);
    });
    return map;
  }, [events]);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setView('day');
  };

  const DayContent = (dayProps: DayProps) => {
    const dayEvents = eventsByDate.get(format(dayProps.date, 'yyyy-MM-dd')) || [];
    const eventTypes = new Set(dayEvents.map(e => e.type));
    
    return (
      <div className="relative h-full w-full flex flex-col items-center justify-center p-1">
        <span>{dayProps.date.getDate()}</span>
        {dayEvents.length > 0 && (
          <div className="absolute bottom-1 flex space-x-0.5">
            {eventTypes.has('Holiday') && <Circle className="h-1.5 w-1.5 text-red-500 fill-current" />}
            {eventTypes.has('Exam') && <Circle className="h-1.5 w-1.5 text-blue-500 fill-current" />}
            {eventTypes.has('Event') && <Circle className="h-1.5 w-1.5 text-yellow-500 fill-current" />}
          </div>
        )}
      </div>
    );
  };
  
  const CustomCaption = () => {
    const handleMonthChange = (offset: number) => {
      setMonth(add(month, { months: offset }));
    };
  
    const handleYearChange = (offset: number) => {
      setMonth(add(month, { years: offset }));
    };
  
    return (
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 rounded-md border bg-muted p-1">
               <Button variant="outline" size="icon" className="h-7 w-7 bg-background" onClick={() => handleYearChange(-1)}>
                  <ChevronsLeft />
              </Button>
              <Button variant="outline" size="icon" className="h-7 w-7 bg-background" onClick={() => handleMonthChange(-1)}>
                  <ChevronLeft />
              </Button>
            </div>
             <Button variant="outline" size="sm" className="h-7" onClick={() => { setMonth(new Date()); setSelectedDate(new Date()); }}>
              Today
            </Button>
            <div className="flex items-center gap-1 rounded-md border bg-muted p-1">
              <Button variant="outline" size="icon" className="h-7 w-7 bg-background" onClick={() => handleMonthChange(1)}>
                  <ChevronRight />
              </Button>
              <Button variant="outline" size="icon" className="h-7 w-7 bg-background" onClick={() => handleYearChange(1)}>
                  <ChevronsRight />
              </Button>
            </div>
        </div>
  
        <h2 className="text-lg font-bold">{format(month, 'MMMM yyyy')}</h2>
  
        <div className="flex items-center gap-1 rounded-md border bg-muted p-1">
            <Button variant={view === 'month' ? 'default' : 'outline'} size="sm" className="h-7" onClick={() => setView('month')}>month</Button>
            <Button variant={view === 'week' ? 'default' : 'outline'} size="sm" className="h-7" onClick={() => setView('week')}>week</Button>
            <Button variant={view === 'day' ? 'default' : 'outline'} size="sm" className="h-7" onClick={() => setView('day')}>day</Button>
            <Button variant={view === 'list' ? 'default' : 'outline'} size="sm" className="h-7" onClick={() => setView('list')}>list</Button>
        </div>
      </div>
    );
  }

  const renderDayView = () => {
    if (!selectedDate) return <div className="text-center p-8 text-muted-foreground">No date selected.</div>;
    const dayOfWeek = format(selectedDate, 'EEEE').toLowerCase();
    const dayEvents = eventsByDate.get(format(selectedDate, 'yyyy-MM-dd')) || [];
    const allClasses: { time: string; grade: string; subject: string }[] = [];

    Object.entries(schedule).forEach(([grade, slots]) => {
      slots.forEach(slot => {
        const subject = slot[dayOfWeek as keyof typeof slot];
        if (subject && subject !== 'Study Hall' && subject !== 'Physical Ed.') {
          allClasses.push({ time: slot.time, grade, subject });
        }
      });
    });

    allClasses.sort((a,b) => a.time.localeCompare(b.time));

    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">{format(selectedDate, 'PPP')}</h3>
        <ul className="space-y-3">
          {dayEvents.map(event => (
            <li key={event.id} className="p-3 rounded-md border bg-muted/50">
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </li>
          ))}
          {allClasses.map((item, index) => (
            <li key={index} className="p-3 rounded-md border">
                <p className="font-semibold">{item.time} - {item.grade}: {item.subject}</p>
            </li>
          ))}
          {dayEvents.length === 0 && allClasses.length === 0 && <p className="text-muted-foreground">No events or classes scheduled.</p>}
        </ul>
      </div>
    );
  };
  
  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate || new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate || new Date(), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 divide-x">
        {days.slice(0, 5).map(day => {
          const dayOfWeek = format(day, 'EEEE').toLowerCase();
          const dayEvents = eventsByDate.get(format(day, 'yyyy-MM-dd')) || [];
          const dayClasses: { time: string; grade: string; subject: string }[] = [];
          Object.entries(schedule).forEach(([grade, slots]) => {
            slots.forEach(slot => {
              const subject = slot[dayOfWeek as keyof typeof slot];
              if (subject && subject !== 'Study Hall' && subject !== 'Physical Ed.') {
                dayClasses.push({ time: slot.time, grade, subject });
              }
            });
          });
          return (
            <div key={day.toISOString()} className="p-2">
              <h4 className="font-bold text-center border-b pb-2 mb-2">{format(day, 'EEE, MMM d')}</h4>
              <ul className="space-y-2 text-xs">
                {dayEvents.map(event => <li key={event.id}>{event.title}</li>)}
                {dayClasses.map((c, i) => <li key={i}>{c.time} - {c.grade}: {c.subject}</li>)}
              </ul>
            </div>
          )
        })}
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
        <ul className="space-y-2">
          {events.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
            <li key={event.id} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
              <p className="text-sm text-muted-foreground">{format(new Date(event.date + 'T00:00:00'), 'PPP')}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  };

  const renderContent = () => {
      switch (view) {
          case 'month':
              return (
                  <DayPicker
                      showOutsideDays
                      className="p-0"
                      classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4 w-full",
                          caption: "hidden",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex w-full",
                          head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: "h-auto p-0 text-center text-sm focus-within:relative focus-within:z-20",
                          day: "h-14 w-full p-1 font-normal aria-selected:opacity-100 rounded-md",
                          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                          day_today: "bg-accent text-accent-foreground",
                          day_outside: "day-outside text-muted-foreground opacity-50",
                          day_disabled: "text-muted-foreground opacity-50",
                      }}
                      components={{
                          DayContent: DayContent,
                      }}
                      month={month}
                      onMonthChange={setMonth}
                      selected={selectedDate}
                      onDayClick={handleDayClick}
                      {...props}
                  />
              );
          case 'week':
              return renderWeekView();
          case 'day':
              return renderDayView();
          case 'list':
              return renderListView();
          default:
              return null;
      }
  };


  return (
    <div className={cn("w-full", className)}>
        <CustomCaption />
        <Separator />
        
        <div className="min-h-[295px]">
          {renderContent()}
        </div>
    </div>
  );
}
DashboardCalendar.displayName = "DashboardCalendar"

export { DashboardCalendar }
