
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Circle, ChevronsLeft, ChevronsRight } from "lucide-react"
import { DayPicker, type DayProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { add, format, isSameDay, startOfWeek } from "date-fns"

export type CalendarView = 'month' | 'week' | 'day' | 'list';

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
  const [view, setView] = React.useState<CalendarView>('month');
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

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
  
  const renderDayView = () => {
    if (!selectedDate) return <div className="p-4 text-center text-muted-foreground">No date selected.</div>;
    const dayKey = format(selectedDate, 'eeee').toLowerCase();
    
    const todaysSchedule = Object.entries(schedule).flatMap(([grade, slots]) => 
      slots.map(slot => ({
        grade,
        time: slot.time,
        subject: slot[dayKey] || 'No Class'
      })).filter(item => item.subject !== 'No Class' && item.subject !== 'Study Hall' && item.subject !== 'Physical Ed.')
    ).sort((a,b) => a.time.localeCompare(b.time));

    const dayEvents = eventsByDate.get(format(selectedDate, 'yyyy-MM-dd')) || [];

    return (
        <div className="p-4 space-y-4">
            <h3 className="font-semibold text-lg mb-2">Schedule for {format(selectedDate, 'PPP')}</h3>
            {dayEvents.length > 0 && (
                <div>
                    <h4 className="font-medium">Events</h4>
                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                       {dayEvents.map(event => <li key={event.id}>{event.title}</li>)}
                    </ul>
                </div>
            )}
            {todaysSchedule.length > 0 ? (
                <div>
                    <h4 className="font-medium">Classes</h4>
                     <table className="w-full text-sm">
                        <thead className="text-left"><tr><th className="p-2">Time</th><th className="p-2">Grade</th><th className="p-2">Subject</th></tr></thead>
                        <tbody>
                            {todaysSchedule.map((item, index) => (
                                 <tr key={index} className="border-b"><td className="p-2">{item.time}</td><td className="p-2">{item.grade}</td><td className="p-2">{item.subject}</td></tr>
                            ))}
                        </tbody>
                     </table>
                 </div>
            ) : (
                dayEvents.length === 0 && <p className="text-muted-foreground text-sm">No classes scheduled for this day.</p>
            )}
            {dayEvents.length === 0 && todaysSchedule.length === 0 && (
                <p className="text-muted-foreground">No classes or events scheduled for this day.</p>
            )}
        </div>
    )
  }
  
  const renderWeekView = () => {
    if (!selectedDate) return <div className="p-4 text-center text-muted-foreground">No date selected.</div>;

    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
    const weekDays = Array.from({ length: 5 }, (_, i) => add(start, { days: i }));

    return (
        <div className="p-4 grid grid-cols-5 gap-2">
            {weekDays.map((day) => (
                 <Button
                    key={day.toISOString()}
                    variant={isSameDay(day, selectedDate) ? 'default' : 'outline'}
                    className="flex flex-col h-auto p-2"
                    onClick={() => handleDayClick(day)}
                 >
                    <span className="text-xs">{format(day, 'EEE')}</span>
                    <span className="text-lg font-bold">{format(day, 'd')}</span>
                </Button>
            ))}
        </div>
    );
  }

  const renderListView = () => {
     return (
        <div className="p-4 max-h-[400px] overflow-y-auto">
            <h3 className="font-semibold text-lg mb-2">All Upcoming Events</h3>
            {events.filter(e => new Date(e.date + 'T00:00:00') >= startOfWeek(new Date(), { weekStartsOn: 1 })).length > 0 ? (
                <ul className="space-y-2">
                    {events.filter(e => new Date(e.date + 'T00:00:00') >= startOfWeek(new Date(), { weekStartsOn: 1 })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
                        <li key={event.id} className="text-sm">
                            <strong className="font-semibold">{format(new Date(event.date + 'T00:00:00'), 'PPP')}</strong>: {event.title}
                        </li>
                    ))}
                </ul>
            ) : (
                 <p className="text-muted-foreground">No upcoming events.</p>
            )}
        </div>
     )
  }

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
          {(['month', 'week', 'day', 'list'] as CalendarView[]).map((v) => (
            <Button
              key={v}
              variant={view === v ? 'default' : 'ghost'}
              size="sm"
              className="h-7 capitalize"
              onClick={() => setView(v)}
            >
              {v}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
        <CustomCaption />
        <Separator />
        <div className="min-h-[295px]">
            {view === 'month' && (
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
            )}
            {view === 'day' && renderDayView()}
            {view === 'week' && renderWeekView()}
            {view === 'list' && renderListView()}
        </div>
    </div>
  );
}
DashboardCalendar.displayName = "DashboardCalendar"

export { DashboardCalendar }

