
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TodoItem } from '@/components/todo-item';
import { Users, BookUser, Contact, Briefcase, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { notices, stats, students, teachers, parents, todoList as initialTodoList, personalEvents } from '@/lib/data';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

type Todo = (typeof initialTodoList)[0];
type CalendarView = 'month' | 'week' | 'day' | 'list';

const incomeData = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 2000, expenses: 9800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'May', income: 1890, expenses: 4800 },
  { name: 'Jun', income: 2390, expenses: 3800 },
  { name: 'Jul', income: 3490, expenses: 4300 },
];

// Convert event dates for the calendar
const eventDates = personalEvents.map(event => new Date(event.date + 'T00:00:00'));

export default function Dashboard() {
  const [todoList, setTodoList] = useState<Todo[]>(initialTodoList);
  const [newTodo, setNewTodo] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState(date || new Date());
  const [calendarView, setCalendarView] = useState<CalendarView>('month');
  
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const newTodoItem: Todo = {
        id: `TODO${Date.now()}`,
        task: newTodo.trim(),
        completed: false,
      };
      setTodoList(prev => [newTodoItem, ...prev]);
      setNewTodo('');
    }
  };

  const handleToggleTodo = (id: string) => {
    setTodoList(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodoList(prev => prev.filter(todo => todo.id !== id));
  };
  
  const handleTodayClick = () => {
    const today = new Date();
    setDate(today);
    setMonth(today);
  }
  
  const renderCalendarContent = () => {
    switch (calendarView) {
      case 'month':
        return (
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={month}
            onMonthChange={setMonth}
            modifiers={{ hasEvent: eventDates }}
            modifiersStyles={{ hasEvent: { position: 'relative' } }}
            components={{
              IconLeft: () => <ChevronLeft className="h-4 w-4" />,
              IconRight: () => <ChevronRight className="h-4 w-4" />,
              DayContent: (props) => {
                const hasEvent = eventDates.some(d => isSameDay(d, props.date));
                return (
                  <div className="relative h-full w-full flex items-center justify-center">
                    {props.date.getDate()}
                    {hasEvent && <div className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />}
                  </div>
                )
              }
            }}
            className="w-full"
          />
        );
      case 'week':
      case 'day':
      case 'list':
        const filteredEvents = personalEvents
          .map(e => ({ ...e, dateObj: new Date(e.date + 'T00:00:00') }))
          .filter(e => {
            if (calendarView === 'day' && date) return isSameDay(e.dateObj, date);
            if (calendarView === 'week' && date) {
              const start = startOfWeek(date);
              const end = endOfWeek(date);
              return isWithinInterval(e.dateObj, { start, end });
            }
            return true; // For list view
          })
          .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
        
        return (
          <div className="p-4 min-h-[300px]">
            {filteredEvents.length > 0 ? (
              <ul className="space-y-3">
                {filteredEvents.map(event => (
                  <li key={event.id} className="flex items-start gap-4">
                    <div className="text-center font-semibold text-primary w-16 flex-shrink-0">
                      <div className="text-sm">{format(event.dateObj, 'MMM')}</div>
                      <div className="text-2xl">{format(event.dateObj, 'dd')}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground pt-16">No events for this selection.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Welcome - CampusFlow | Admin</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#00BCD4] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{students.length}</div>
            <p className="text-xs">Total Students</p>
          </CardContent>
        </Card>
        <Card className="bg-[#8E44AD] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <BookUser className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{teachers.length}</div>
            <p className="text-xs">Total Teachers</p>
          </CardContent>
        </Card>
        <Card className="bg-[#3498DB] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parents</CardTitle>
            <Contact className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{parents.length}</div>
            <p className="text-xs">Total Parents</p>
          </CardContent>
        </Card>
         <Card className="bg-[#E91E63] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
            <Briefcase className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{teachers.length}</div>
            <p className="text-xs">Total Staff</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income and Expenses for 2024</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#8884d8" />
                <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Notice Board</CardTitle>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-right">Author</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {notices.slice(0, 4).map((notice) => (
                    <TableRow key={notice.id}>
                    <TableCell>{notice.date}</TableCell>
                    <TableCell className="font-medium">{notice.title}</TableCell>
                    <TableCell className="text-right">{notice.author}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>

        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>To-Do List</CardTitle>
                <CardDescription>Manage your daily tasks here.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
                    <Input 
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Add a new task..." 
                    />
                    <Button type="submit" size="icon">
                        <PlusCircle className="h-5 w-5" />
                    </Button>
                </form>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {todoList.length > 0 ? todoList.map(todo => (
                        <TodoItem 
                            key={todo.id} 
                            todo={todo} 
                            onToggle={handleToggleTodo} 
                            onDelete={handleDeleteTodo}
                        />
                    )) : (
                        <p className="text-center text-muted-foreground py-4">Your to-do list is empty!</p>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-medium">{format(month, 'MMMM yyyy')}</CardTitle>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleTodayClick}>Today</Button>
                <div className="flex items-center rounded-md border p-1">
                    <Button variant={calendarView === 'day' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setCalendarView('day')}>Day</Button>
                    <Button variant={calendarView === 'week' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setCalendarView('week')}>Week</Button>
                    <Button variant={calendarView === 'month' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setCalendarView('month')}>Month</Button>
                    <Button variant={calendarView === 'list' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setCalendarView('list')}>List</Button>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             {renderCalendarContent()}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

