
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Database, 
  Package, 
  Palette, 
  Share2, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SiteSwitcher } from "./SiteSwitcher";

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard
  },
  {
    title: "Posts & Pages",
    path: "/content",
    icon: FileText
  },
  {
    title: "Users",
    path: "/users",
    icon: Users
  },
  {
    title: "Statistics",
    path: "/statistics",
    icon: BarChart3
  },
  {
    title: "Backups",
    path: "/backups",
    icon: Database
  },
  {
    title: "Plugins & Themes",
    path: "/extensions",
    icon: Package
  },
  {
    title: "Branding",
    path: "/branding",
    icon: Palette
  },
  {
    title: "Integrations",
    path: "/integrations",
    icon: Share2
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings
  }
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex justify-center p-4">
        <div className="flex items-center">
          <SiteSwitcher />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.path)}
                    className={location.pathname === item.path ? 'bg-sidebar-primary text-sidebar-primary-foreground' : ''}
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-sidebar-accent">
              <Avatar>
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs text-sidebar-foreground/70">admin@example.com</p>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Account</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">AD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Admin</p>
                  <p className="text-sm text-muted-foreground">admin@example.com</p>
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsDialogOpen(false)}>
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
