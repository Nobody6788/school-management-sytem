'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { academic } from '@/lib/data';

type Class = (typeof academic.classes)[0];
type Section = (typeof academic.sections)[0];
type Group = (typeof academic.groups)[0];
type Subject = (typeof academic.subjects)[0];

export default function AdminPage() {
  const [classes, setClasses] = useState(academic.classes);
  const [sections, setSections] = useState(academic.sections);
  const [groups, setGroups] = useState(academic.groups);
  const [subjects, setSubjects] = useState(academic.subjects);

  // Modal states for Add/Edit
  const [isClassModalOpen, setClassModalOpen] = useState(false);
  const [isSectionModalOpen, setSectionModalOpen] = useState(false);
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [isSubjectModalOpen, setSubjectModalOpen] = useState(false);

  // State for item being edited
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // State for delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);

  // --- Handlers for Class ---
  const handleOpenClassModal = (cls: Class | null) => {
    setEditingClass(cls);
    setClassModalOpen(true);
  };

  const handleClassSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const capacity = parseInt(formData.get('capacity') as string, 10);

    if (name && capacity) {
      if (editingClass) {
        const oldClassName = editingClass.name;
        // Update class
        setClasses(classes.map((c) => (c.id === editingClass.id ? { ...c, name, capacity } : c)));
        // Update associated sections and subjects if class name changed
        if (oldClassName !== name) {
          setSections(sections.map(s => s.className === oldClassName ? { ...s, className: name } : s));
          setSubjects(subjects.map(s => s.className === oldClassName ? { ...s, className: name } : s));
        }
      } else {
        setClasses([...classes, { id: `C${(classes.length + 1).toString().padStart(2, '0')}`, name, capacity }]);
      }
      setClassModalOpen(false);
      setEditingClass(null);
    }
  };

  // --- Handlers for Section ---
  const handleOpenSectionModal = (sec: Section | null) => {
    setEditingSection(sec);
    setSectionModalOpen(true);
  };

  const handleSectionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const className = formData.get('className') as string;
    const capacity = parseInt(formData.get('capacity') as string, 10);

    if (name && className && capacity) {
      if (editingSection) {
        setSections(sections.map((s) => (s.id === editingSection.id ? { ...s, name, className, capacity } : s)));
      } else {
        setSections([...sections, { id: `S${(sections.length + 1).toString().padStart(2, '0')}`, name, className, capacity }]);
      }
      setSectionModalOpen(false);
      setEditingSection(null);
    }
  };

  // --- Handlers for Group ---
  const handleOpenGroupModal = (grp: Group | null) => {
    setEditingGroup(grp);
    setGroupModalOpen(true);
  };

  const handleGroupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;

    if (name) {
      if (editingGroup) {
        setGroups(groups.map((g) => (g.id === editingGroup.id ? { ...g, name } : g)));
      } else {
        setGroups([...groups, { id: `G${(groups.length + 1).toString().padStart(2, '0')}`, name }]);
      }
      setGroupModalOpen(false);
      setEditingGroup(null);
    }
  };

    // --- Handlers for Subject ---
    const handleOpenSubjectModal = (sub: Subject | null) => {
      setEditingSubject(sub);
      setSubjectModalOpen(true);
    };
  
    const handleSubjectSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const name = formData.get('name') as string;
      const className = formData.get('className') as string;
  
      if (name && className) {
        if (editingSubject) {
          setSubjects(subjects.map((s) => (s.id === editingSubject.id ? { ...s, name, className } : s)));
        } else {
          setSubjects([...subjects, { id: `SUB${(subjects.length + 1).toString().padStart(2, '0')}`, name, className }]);
        }
        setSubjectModalOpen(false);
        setEditingSubject(null);
      }
    };

  // --- Handler for Deletion ---
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    switch (deleteTarget.type) {
      case 'class':
        const classToDelete = classes.find(c => c.id === deleteTarget.id);
        if (classToDelete) {
          // Cascade delete to sections and subjects
          setSections(sections.filter(s => s.className !== classToDelete.name));
          setSubjects(subjects.filter(s => s.className !== classToDelete.name));
        }
        setClasses(classes.filter((c) => c.id !== deleteTarget.id));
        break;
      case 'section':
        setSections(sections.filter((s) => s.id !== deleteTarget.id));
        break;
      case 'group':
        setGroups(groups.filter((g) => g.id !== deleteTarget.id));
        break;
      case 'subject':
        setSubjects(subjects.filter((s) => s.id !== deleteTarget.id));
        break;
    }
    setDeleteTarget(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>
            Manage all aspects of the CampusFlow application from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="classes">
            <TabsList>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
            </TabsList>

            {/* Classes Tab */}
            <TabsContent value="classes">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Manage Classes</CardTitle>
                    <Button size="sm" onClick={() => handleOpenClassModal(null)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Class
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class Name</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classes.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.name}</TableCell>
                          <TableCell>{c.capacity}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenClassModal(c)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'class', id: c.id })}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sections Tab */}
            <TabsContent value="sections">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Manage Sections</CardTitle>
                    <Button size="sm" onClick={() => handleOpenSectionModal(null)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Section Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sections.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>{s.name}</TableCell>
                          <TableCell>{s.className}</TableCell>
                          <TableCell>{s.capacity}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenSectionModal(s)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'section', id: s.id })}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Groups Tab */}
            <TabsContent value="groups">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Manage Groups</CardTitle>
                    <Button size="sm" onClick={() => handleOpenGroupModal(null)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Group
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Group Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groups.map((g) => (
                        <TableRow key={g.id}>
                          <TableCell>{g.name}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenGroupModal(g)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'group', id: g.id })}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Subjects Tab */}
            <TabsContent value="subjects">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Manage Subjects</CardTitle>
                    <Button size="sm" onClick={() => handleOpenSubjectModal(null)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Subject
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>{s.name}</TableCell>
                          <TableCell>{s.className}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenSubjectModal(s)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'subject', id: s.id })}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Class Modal */}
      <Dialog open={isClassModalOpen} onOpenChange={setClassModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClass ? 'Edit Class' : 'Add New Class'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleClassSubmit} key={editingClass ? editingClass.id : 'add-class'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required defaultValue={editingClass?.name} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">Capacity</Label>
                <Input id="capacity" name="capacity" type="number" className="col-span-3" required defaultValue={editingClass?.capacity} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setClassModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Section Modal */}
      <Dialog open={isSectionModalOpen} onOpenChange={setSectionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSection ? 'Edit Section' : 'Add New Section'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSectionSubmit} key={editingSection ? editingSection.id : 'add-section'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required defaultValue={editingSection?.name} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">Capacity</Label>
                <Input id="capacity" name="capacity" type="number" className="col-span-3" required defaultValue={editingSection?.capacity} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="className" className="text-right">Class</Label>
                <Select name="className" required defaultValue={editingSection?.className}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSectionModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Group Modal */}
      <Dialog open={isGroupModalOpen} onOpenChange={setGroupModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGroup ? 'Edit Group' : 'Add New Group'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGroupSubmit} key={editingGroup ? editingGroup.id : 'add-group'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required defaultValue={editingGroup?.name} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGroupModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Subject Modal */}
      <Dialog open={isSubjectModalOpen} onOpenChange={setSubjectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubjectSubmit} key={editingSubject ? editingSubject.id : 'add-subject'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required defaultValue={editingSubject?.name} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="className" className="text-right">Class</Label>
                <Select name="className" required defaultValue={editingSubject?.className}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSubjectModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected item and any associated sections or subjects.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
