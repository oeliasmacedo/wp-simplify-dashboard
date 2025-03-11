
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { SitesManager } from "@/components/SitesManager";
import { useWordPress } from "@/contexts/WordPressContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, MoreHorizontal, Pencil, Trash2, RefreshCw, User, Search } from "lucide-react";
import { ConnectSiteWizard } from "@/components/ConnectSiteWizard";

const UserManager = () => {
  const { currentSite, users, fetchUsers, isLoading } = useWordPress();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefreshUsers = async () => {
    await fetchUsers();
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          {!currentSite ? (
            <Button onClick={() => setWizardOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Connect WordPress Site
            </Button>
          ) : (
            <Button variant="outline" onClick={handleRefreshUsers} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Users</span>
            </Button>
          )}
        </div>

        {!currentSite ? (
          <SitesManager />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search users..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button disabled>
                <User className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </div>

            {isLoading ? (
              <LoadingUsers />
            ) : (
              <UserTable users={filteredUsers} />
            )}
          </div>
        )}

        <ConnectSiteWizard 
          open={wizardOpen} 
          onOpenChange={setWizardOpen} 
        />
      </div>
    </DashboardLayout>
  );
};

const UserTable = ({ users }: { users: any[] }) => {
  if (users.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">
          No users found. Make sure you have permission to access users on this WordPress site.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={user.avatar_urls["96"]} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.slug}</TableCell>
              <TableCell>{user.email || "Not available"}</TableCell>
              <TableCell>{(user.roles && user.roles[0]) || "Not available"}</TableCell>
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
};

const LoadingUsers = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    ))}
  </div>
);

export default UserManager;
