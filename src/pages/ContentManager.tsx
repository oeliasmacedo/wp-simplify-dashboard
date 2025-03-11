
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { FilePlus, FileText, MoreHorizontal, Pencil, File, Trash2, Search, Filter } from "lucide-react";

// Mock data for posts and pages
const posts = [
  { id: 1, title: "Welcome to Our Store", author: "Admin", status: "Published", date: "2023-10-15", type: "post" },
  { id: 2, title: "Summer Collection 2023", author: "Editor", status: "Published", date: "2023-09-28", type: "post" },
  { id: 3, title: "How to Choose the Right Size", author: "Admin", status: "Draft", date: "2023-10-10", type: "post" },
  { id: 4, title: "Upcoming Sale Announcement", author: "Marketing", status: "Scheduled", date: "2023-10-20", type: "post" },
  { id: 5, title: "Customer Testimonials", author: "Admin", status: "Published", date: "2023-09-15", type: "post" },
];

const pages = [
  { id: 1, title: "About Us", author: "Admin", status: "Published", date: "2023-08-10", type: "page" },
  { id: 2, title: "Contact", author: "Admin", status: "Published", date: "2023-08-10", type: "page" },
  { id: 3, title: "FAQ", author: "Support", status: "Published", date: "2023-09-05", type: "page" },
  { id: 4, title: "Privacy Policy", author: "Legal", status: "Published", date: "2023-07-22", type: "page" },
  { id: 5, title: "Terms and Conditions", author: "Legal", status: "Published", date: "2023-07-22", type: "page" },
];

const statusColors = {
  Published: "bg-green-100 text-green-800",
  Draft: "bg-gray-100 text-gray-800",
  Scheduled: "bg-blue-100 text-blue-800",
};

const ContentManager = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Content Manager</h1>
        <Button className="flex items-center gap-2">
          <FilePlus className="h-4 w-4" />
          <span>New Content</span>
        </Button>
      </div>

      <Tabs defaultValue="posts" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Posts</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <span>Pages</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search content..." 
                className="pl-8 w-[200px] lg:w-[300px]"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="posts">
          <ContentTable items={posts} />
        </TabsContent>

        <TabsContent value="pages">
          <ContentTable items={pages} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

const ContentTable = ({ items }: { items: any[] }) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.author}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status as keyof typeof statusColors]}`}>
                {item.status}
              </span>
            </TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default ContentManager;
