
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Circle, ChevronsLeft, ChevronsRight } from "lucide-react"
import { DayPicker, type DayProps } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { add, format, isSameDay } from "date-fns"

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
  
        <div></div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
        <CustomCaption />
        <Separator />
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
    </div>
  );
}
DashboardCalendar.displayName = "DashboardCalendar"

export { DashboardCalendar }



