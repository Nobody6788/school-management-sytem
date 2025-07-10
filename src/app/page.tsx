
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { TodoItem } from '@/components/todo-item';
import { Users, BookUser, Contact, Briefcase, PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { notices, stats, students, teachers, parents, personalEvents, todoList as initialTodoList } from '@/lib/data';

type Todo = (typeof initialTodoList)[0];

export default function Dashboard() {
  const [todoList, setTodoList] = useState<Todo[]>(initialTodoList);
  const [newTodo, setNewTodo] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
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

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#00BCD4]/80 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{students.length}</div>
            <p className="text-xs">Total Students</p>
          </CardContent>
        </Card>
        <Card className="bg-[#8E44AD]/80 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <BookUser className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{teachers.length}</div>
            <p className="text-xs">Total Teachers</p>
          </CardContent>
        </Card>
        <Card className="bg-[#3498DB]/80 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parents</CardTitle>
            <Contact className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{parents.length}</div>
            <p className="text-xs">Total Parents</p>
          </CardContent>
        </Card>
         <Card className="bg-[#E91E63]/80 text-white">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Notices</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Author</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {notices.slice(0, 4).map((notice) => (
                        <TableRow key={notice.id}>
                        <TableCell className="font-medium">{notice.title}</TableCell>
                        <TableCell>{notice.date}</TableCell>
                        <TableCell className="text-right">{notice.author}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>

            <Card>
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

        <Card className="lg:col-span-1">
             <CardHeader>
                <CardTitle>Calendar</CardTitle>
             </CardHeader>
             <CardContent className="flex justify-center">
                 <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                        hasEvent: personalEvents.map(e => new Date(e.date + 'T00:00:00')),
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
      </div>

    </div>
  );
}
