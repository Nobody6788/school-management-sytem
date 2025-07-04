
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
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { library } from '@/lib/data';

type Book = (typeof library.books)[0];
type BookCategory = (typeof library.bookCategories)[0];

export default function LibraryPage() {
  const [books, setBooks] = useState(library.books);
  const [categories, setCategories] = useState(library.bookCategories);

  // Modal states
  const [isBookModalOpen, setBookModalOpen] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

  // Editing states
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingCategory, setEditingCategory] = useState<BookCategory | null>(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'book' | 'category'; id: string } | null>(null);

  // Helper
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'N/A';
  }

  // --- Category Handlers ---
  const handleOpenCategoryModal = (category: BookCategory | null) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const handleCategorySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;

    if (name) {
      if (editingCategory) {
        const oldCategoryName = editingCategory.name;
        setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, name } : c)));
      } else {
        setCategories([...categories, { id: `BC${(categories.length + 1).toString().padStart(2, '0')}`, name }]);
      }
      setCategoryModalOpen(false);
      setEditingCategory(null);
    }
  };

  // --- Book Handlers ---
  const handleOpenBookModal = (book: Book | null) => {
    setEditingBook(book);
    setBookModalOpen(true);
  };

  const handleBookSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const categoryId = formData.get('categoryId') as string;
    const quantity = parseInt(formData.get('quantity') as string, 10);

    if (title && author && categoryId && !isNaN(quantity)) {
      if (editingBook) {
        setBooks(books.map((b) => (b.id === editingBook.id ? { ...b, title, author, categoryId, quantity } : b)));
      } else {
        setBooks([...books, { id: `B${(books.length + 1).toString().padStart(3, '0')}`, title, author, categoryId, quantity }]);
      }
      setBookModalOpen(false);
      setEditingBook(null);
    }
  };
  
  // --- Deletion Handler ---
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'category') {
        // Also delete books in this category
        setBooks(books.filter(b => b.categoryId !== deleteTarget.id));
        setCategories(categories.filter((c) => c.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'book') {
        setBooks(books.filter((b) => b.id !== deleteTarget.id));
    }

    setDeleteTarget(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Library Management</CardTitle>
          <CardDescription>Manage book categories and book inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="books">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            
            {/* Books Tab */}
            <TabsContent value="books">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Book List</CardTitle>
                    <Button size="sm" onClick={() => handleOpenBookModal(null)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Book
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {books.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell className="font-medium">{book.title}</TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>{getCategoryName(book.categoryId)}</TableCell>
                          <TableCell>{book.quantity}</TableCell>
                          <TableCell className="text-right">
                             <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenBookModal(book)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'book', id: book.id })}>Delete</DropdownMenuItem>
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

            {/* Categories Tab */}
            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Book Categories</CardTitle>
                     <Button size="sm" onClick={() => handleOpenCategoryModal(null)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((cat) => (
                        <TableRow key={cat.id}>
                          <TableCell className="font-medium">{cat.name}</TableCell>
                          <TableCell className="text-right">
                             <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenCategoryModal(cat)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget({ type: 'category', id: cat.id })}>Delete</DropdownMenuItem>
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

      {/* Add/Edit Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} key={editingCategory ? editingCategory.id : 'add-category'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required defaultValue={editingCategory?.name} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCategoryModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add/Edit Book Modal */}
      <Dialog open={isBookModalOpen} onOpenChange={setBookModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBookSubmit} key={editingBook ? editingBook.id : 'add-book'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" name="title" className="col-span-3" required defaultValue={editingBook?.title} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="author" className="text-right">Author</Label>
                <Input id="author" name="author" className="col-span-3" required defaultValue={editingBook?.author} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoryId" className="text-right">Category</Label>
                <Select name="categoryId" required defaultValue={editingBook?.categoryId}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" className="col-span-3" required defaultValue={editingBook?.quantity} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setBookModalOpen(false)}>Cancel</Button>
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
              This action cannot be undone. This will permanently delete the selected {deleteTarget?.type}. 
              {deleteTarget?.type === 'category' && " All books within this category will also be deleted."}
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
