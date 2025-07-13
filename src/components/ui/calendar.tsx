
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Circle, ChevronsLeft, ChevronsRight } from "lucide-react"
import { DayPicker, type DayPickerProps, type DayProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { add, format, isSameDay, startOfWeek, endOfWeek, isWithinInterval } from "date-fns"

type CalendarView = 'month' | 'week' | 'day' | 'list';

type AcademicEvent = { id: string; date: string; title: string; description: string; type: 'Holiday' | 'Exam' | 'Event' };
type Schedule = Record<string, { time: string; [key: string]: string }[]>;

export type CalendarProps = DayPickerProps & {
    events?: AcademicEvent[];
    schedule?: Schedule;
};

function Caption(props: {
  displayMonth: Date;
  onMonthChange: (date: Date) => void;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}) {
  const handleMonthChange = (offset: number) => {
    props.onMonthChange(add(props.displayMonth, { months: offset }));
  };

  const handleYearChange = (offset: number) => {
    props.onMonthChange(add(props.displayMonth, { years: offset }));
  };

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-1 rounded-md border p-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleYearChange(-1)}>
          <ChevronsLeft />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMonthChange(-1)}>
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="sm" className="h-7" onClick={() => props.onMonthChange(new Date())}>
          Today
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMonthChange(1)}>
          <ChevronRight />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleYearChange(1)}>
          <ChevronsRight />
        </Button>
      </div>

      <h2 className="text-lg font-bold">{format(props.displayMonth, 'MMMM yyyy')}</h2>

      <div className="flex items-center gap-1 rounded-md border p-1">
        {(['month', 'week', 'day', 'list'] as CalendarView[]).map((v) => (
          <Button
            key={v}
            variant={props.view === v ? 'default' : 'ghost'}
            size="sm"
            className="h-7 capitalize"
            onClick={() => props.onViewChange(v)}
          >
            {v}
          </Button>
        ))}
      </div>
    </div>
  );
}


function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  events = [],
  schedule = {},
  ...props
}: CalendarProps) {
  const [view, setView] = React.useState<CalendarView>('month');
  const [month, setMonth] = React.useState(props.month || new Date());
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
        <div className="relative h-full w-full flex items-center justify-center">
        {dayProps.date.getDate()}
        <div className="absolute bottom-1 flex space-x-0.5">
            {eventTypes.has('Holiday') && <Circle className="h-1.5 w-1.5 text-red-500 fill-current" />}
            {eventTypes.has('Exam') && <Circle className="h-1.5 w-1.5 text-blue-500 fill-current" />}
            {eventTypes.has('Event') && <Circle className="h-1.5 w-1.5 text-yellow-500 fill-current" />}
        </div>
        </div>
    );
  };
  
  const renderDayView = () => {
    if (!selectedDate) return <div className="p-4 text-center text-muted-foreground">No date selected.</div>;
    const dayKey = format(selectedDate, 'eeee').toLowerCase(); // e.g., 'monday'
    
    const todaysSchedule = Object.entries(schedule).flatMap(([grade, slots]) => 
      slots.map(slot => ({
        grade,
        time: slot.time,
        subject: slot[dayKey] || 'No Class'
      })).filter(item => item.subject !== 'No Class' && item.subject !== 'Study Hall' && item.subject !== 'Physical Ed.')
    ).sort((a,b) => a.time.localeCompare(b.time));

    return (
        <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">Schedule for {format(selectedDate, 'PPP')}</h3>
            {todaysSchedule.length > 0 ? (
                 <table className="w-full text-sm">
                    <thead className="text-left"><tr><th className="p-2">Time</th><th className="p-2">Grade</th><th className="p-2">Subject</th></tr></thead>
                    <tbody>
                        {todaysSchedule.map((item, index) => (
                             <tr key={index} className="border-b"><td className="p-2">{item.time}</td><td className="p-2">{item.grade}</td><td className="p-2">{item.subject}</td></tr>
                        ))}
                    </tbody>
                 </table>
            ) : (
                <p className="text-muted-foreground">No classes scheduled for this day.</p>
            )}
        </div>
    )
  }
  
  const renderWeekView = () => {
    if (!selectedDate) return <div className="p-4 text-center text-muted-foreground">No date selected.</div>;

    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 5 }, (_, i) => add(start, { days: i }));
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    return (
        <div className="p-4 space-y-4">
            {weekDays.map((day, i) => {
                const dayKey = dayKeys[i];
                const daySchedule = Object.entries(schedule).flatMap(([grade, slots]) => 
                    slots.map(slot => ({
                        grade,
                        time: slot.time,
                        subject: slot[dayKey] || 'No Class'
                    })).filter(item => item.subject !== 'No Class' && item.subject !== 'Study Hall' && item.subject !== 'Physical Ed.')
                ).sort((a,b) => a.time.localeCompare(b.time));

                return (
                    <div key={dayKey}>
                        <h4 className="font-semibold mb-1">{format(day, 'eeee, PPP')}</h4>
                        {daySchedule.length > 0 ? (
                             <ul className="text-sm text-muted-foreground list-disc pl-5">
                                {daySchedule.map((item, index) => (
                                    <li key={index}><strong>{item.time}</strong> - {item.grade}: {item.subject}</li>
                                ))}
                            </ul>
                        ): <p className="text-sm text-muted-foreground pl-5">No classes scheduled.</p>}
                    </div>
                )
            })}
        </div>
    )
  }

  const renderListView = () => {
     return (
        <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">All Upcoming Events</h3>
            {events.filter(e => new Date(e.date) >= new Date()).length > 0 ? (
                <ul className="space-y-2">
                    {events.filter(e => new Date(e.date) >= new Date()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
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

  return (
    <div>
      <Caption
        displayMonth={month}
        onMonthChange={setMonth}
        view={view}
        onViewChange={setView}
      />
      <Separator className="my-2" />
      {view === 'month' && (
        <>
          <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4 w-full",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "hidden", // We use a custom caption component
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-auto p-0 text-center text-sm focus-within:relative focus-within:z-20",
              day: "h-14 w-full p-1 font-normal aria-selected:opacity-100 rounded-md",
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "day-outside text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              ...classNames,
            }}
            components={{
              Caption: () => null, // Hide default caption, we use our own
              DayContent: DayContent,
            }}
            month={month}
            onMonthChange={setMonth}
            selected={selectedDate}
            onDayClick={handleDayClick}
            {...props}
          />
          <div className="flex items-center justify-center gap-4 text-sm p-4 border-t">
            <div className="flex items-center gap-2"><Circle className="h-3 w-3 text-red-500 fill-current" /> <span>Holiday</span></div>
            <div className="flex items-center gap-2"><Circle className="h-3 w-3 text-blue-500 fill-current" /> <span>Exam</span></div>
            <div className="flex items-center gap-2"><Circle className="h-3 w-3 text-yellow-500 fill-current" /> <span>Event</span></div>
          </div>
        </>
      )}
      {view === 'day' && renderDayView()}
      {view === 'week' && renderWeekView()}
      {view === 'list' && renderListView()}
    </div>
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
