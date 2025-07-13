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
import { Users, BookUser, Contact, Briefcase, PlusCircle, ChevronLeft, ChevronRight, CalendarDays, Circle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { notices, stats, students, teachers, parents, todoList as initialTodoList, academicEvents } from '@/lib/data';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

type Todo = (typeof initialTodoList)[0];
type AcademicEvent = (typeof academicEvents)[0];

const incomeData = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 2000, expenses: 9800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'May', income: 1890, expenses: 4800 },
  { name: 'Jun', income: 2390, expenses: 3800 },
  { name: 'Jul', income: 3490, expenses: 4300 },
];

const eventDatesByType = {
    holiday: academicEvents.filter(e => e.type === 'Holiday').map(e => new Date(e.date + 'T00:00:00')),
    exam: academicEvents.filter(e => e.type === 'Exam').map(e => new Date(e.date + 'T00:00:00')),
    event: academicEvents.filter(e => e.type === 'Event').map(e => new Date(e.date + 'T00:00:00')),
};

export default function Dashboard() {
  const [todoList, setTodoList] = useState<Todo[]>(initialTodoList);
  const [newTodo, setNewTodo] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState(date || new Date());
  
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
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if(selectedDate) {
        setMonth(selectedDate);
    }
  }

  const upcomingEvents = date 
    ? academicEvents.filter(event => isSameDay(new Date(event.date + 'T00:00:00'), date))
    : academicEvents.filter(event => new Date(event.date) >= new Date()).slice(0, 5);

  const eventColors = {
    'Holiday': 'bg-red-500',
    'Exam': 'bg-blue-500',
    'Event': 'bg-yellow-500'
  }

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
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            month={month}
            onMonthChange={setMonth}
            modifiers={{ 
                holiday: eventDatesByType.holiday,
                exam: eventDatesByType.exam,
                event: eventDatesByType.event,
              }}
            modifiersClassNames={{
                holiday: 'day-holiday',
                exam: 'day-exam',
                event: 'day-event',
            }}
            className="w-full"
          />
          <CardFooter className="flex-col items-start gap-2 border-t pt-4">
              <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2"><Circle className="h-3 w-3 text-red-500 fill-current" /> <span>Holiday</span></div>
                  <div className="flex items-center gap-2"><Circle className="h-3 w-3 text-blue-500 fill-current" /> <span>Exam</span></div>
                  <div className="flex items-center gap-2"><Circle className="h-3 w-3 text-yellow-500 fill-current" /> <span>Event</span></div>
              </div>
          </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{date ? `Events on ${format(date, 'PPP')}`: 'Upcoming Events'}</CardTitle>
            </CardHeader>
            <CardContent>
                {upcomingEvents.length > 0 ? (
                    <Carousel opts={{ align: "start", loop: false }}>
                        <CarouselContent>
                            {upcomingEvents.map(event => (
                                <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                        <Card className="h-full">
                                            <CardContent className="flex flex-col items-start gap-2 p-4">
                                                <Badge className={eventColors[event.type as keyof typeof eventColors]}>{event.type}</Badge>
                                                <h4 className="font-semibold">{event.title}</h4>
                                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                                <p className="text-xs text-muted-foreground pt-2">{format(new Date(event.date + 'T00:00:00'), 'PPP')}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No events scheduled for {date ? 'this day' : 'the near future'}.</p>
                )}
            </CardContent>
        </Card>
      </div>

    </div>
  );
}