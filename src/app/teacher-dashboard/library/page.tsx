
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
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { PlusCircle } from 'lucide-react';
import { library } from '@/lib/data';

type Book = (typeof library.books)[0];
type BookCategory = (typeof library.bookCategories)[0];

export default function LibraryPage() {
  const [books, setBooks] = useState(library.books);
  const [categories, setCategories] = useState(library.bookCategories);

  // Modal states for adding
  const [isBookModalOpen, setBookModalOpen] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

  // Helper
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'N/A';
  }

  // --- Category Handler for adding ---
  const handleCategorySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;

    if (name) {
      setCategories([...categories, { id: `BC${(categories.length + 1).toString().padStart(2, '0')}`, name }]);
      setCategoryModalOpen(false);
    }
  };

  // --- Book Handler for adding ---
  const handleBookSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const categoryId = formData.get('categoryId') as string;
    const quantity = parseInt(formData.get('quantity') as string, 10);

    if (title && author && categoryId && !isNaN(quantity)) {
      setBooks([...books, { id: `B${(books.length + 1).toString().padStart(3, '0')}`, title, author, categoryId, quantity }]);
      setBookModalOpen(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Library</CardTitle>
          <CardDescription>View and add to the book inventory and categories.</CardDescription>
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
                    <Button size="sm" onClick={() => setBookModalOpen(true)}>
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {books.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell className="font-medium">{book.title}</TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>{getCategoryName(book.categoryId)}</TableCell>
                          <TableCell>{book.quantity}</TableCell>
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
                     <Button size="sm" onClick={() => setCategoryModalOpen(true)}>
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((cat) => (
                        <TableRow key={cat.id}>
                          <TableCell className="font-medium">{cat.name}</TableCell>
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

      {/* Add Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} key={isCategoryModalOpen ? 'add-category-form' : 'closed'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCategoryModalOpen(false)}>Cancel</Button>
              <Button type="submit">Add Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add Book Modal */}
      <Dialog open={isBookModalOpen} onOpenChange={setBookModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBookSubmit} key={isBookModalOpen ? 'add-book-form' : 'closed'}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" name="title" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="author" className="text-right">Author</Label>
                <Input id="author" name="author" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoryId" className="text-right">Category</Label>
                <Select name="categoryId" required>
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
                <Input id="quantity" name="quantity" type="number" className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setBookModalOpen(false)}>Cancel</Button>
              <Button type="submit">Add Book</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
