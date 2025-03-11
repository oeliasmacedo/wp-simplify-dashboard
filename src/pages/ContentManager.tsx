
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FilePlus, 
  FileText, 
  MoreHorizontal, 
  Pencil, 
  File, 
  Trash2, 
  Search, 
  Filter,
  RefreshCw
} from "lucide-react";
import { useWordPress } from "@/contexts/WordPressContext";
import { ConnectSiteWizard } from "@/components/ConnectSiteWizard";
import { WordPressPost, WordPressPage } from "@/types/wordpress";
import { format } from "date-fns";

const ContentManager = () => {
  const { currentSite, posts, pages, fetchPosts, fetchPages, isLoading } = useWordPress();
  const [searchTerm, setSearchTerm] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);

  // Filter content based on search term
  const filteredPosts = posts.filter(post => 
    post.title.rendered.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredPages = pages.filter(page => 
    page.title.rendered.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format WP data for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (e) {
      return dateString;
    }
  };

  const handleRefresh = async () => {
    await Promise.all([fetchPosts(), fetchPages()]);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Content Manager</h1>
        <div className="flex gap-2">
          {currentSite && (
            <Button variant="outline" onClick={handleRefresh} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          )}
          {!currentSite && (
            <Button onClick={() => setWizardOpen(true)}>
              <FilePlus className="mr-2 h-4 w-4" />
              <span>Connect WordPress Site</span>
            </Button>
          )}
        </div>
      </div>

      {!currentSite ? (
        <div className="text-center p-10 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Connect a WordPress Site</h2>
          <p className="mb-6 text-muted-foreground">
            Connect your WordPress site to manage content from this dashboard.
          </p>
          <Button onClick={() => setWizardOpen(true)}>
            <FilePlus className="mr-2 h-4 w-4" />
            <span>Connect WordPress Site</span>
          </Button>
        </div>
      ) : (
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="posts">
            {isLoading ? (
              <LoadingContent />
            ) : (
              <ContentTable 
                items={filteredPosts} 
                type="post"
                formatDate={formatDate}
              />
            )}
          </TabsContent>

          <TabsContent value="pages">
            {isLoading ? (
              <LoadingContent />
            ) : (
              <ContentTable 
                items={filteredPages} 
                type="page"
                formatDate={formatDate}
              />
            )}
          </TabsContent>
        </Tabs>
      )}

      <ConnectSiteWizard 
        open={wizardOpen} 
        onOpenChange={setWizardOpen} 
      />
    </DashboardLayout>
  );
};

type ContentTableProps = {
  items: (WordPressPost | WordPressPage)[];
  type: 'post' | 'page';
  formatDate: (date: string) => string;
};

const ContentTable = ({ items, type, formatDate }: ContentTableProps) => {
  if (items.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">
          No {type}s found. {type === 'post' ? 'Write your first post!' : 'Create a new page!'}
        </p>
      </div>
    );
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'publish':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'future':
        return 'bg-blue-100 text-blue-800';
      case 'private':
        return 'bg-purple-100 text-purple-800';
      case 'trash':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div dangerouslySetInnerHTML={{ __html: item.title.rendered }} />
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(item.status)}`}>
                  {formatStatus(item.status)}
                </span>
              </TableCell>
              <TableCell>{formatDate(item.modified)}</TableCell>
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
                    <DropdownMenuItem className="flex items-center gap-2">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" 
                        className="flex items-center gap-2 w-full">
                        <FileText className="h-4 w-4" />
                        <span>View</span>
                      </a>
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
};

const LoadingContent = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    ))}
  </div>
);

export default ContentManager;
