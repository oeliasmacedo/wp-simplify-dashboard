import {
  Home,
  LayoutDashboard,
  Settings,
  HelpCircle,
  Globe,
  FileText,
  Users,
  Plug,
  Brush,
  GraduationCap,
  CloudUpload,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useSidebar();
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <Sheet open={!sidebarCollapsed} onOpenChange={setSidebarCollapsed}>
      <SheetTrigger asChild>
        <aside className="group/sidebar fixed left-0 top-0 z-50 flex h-full flex-col border-r bg-secondary/50 backdrop-blur-sm transition-all group-[.sidebar-open]/body:translate-x-0 lg:group-[.sidebar-open]/body:pl-[15rem] dark:border-neutral-800">
          <div className="relative flex h-20 shrink-0 items-center justify-end px-4">
            <Link to="/" className="font-bold">
              WPCloud
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-8 !h-auto !w-auto p-0 lg:hidden"
            >
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </div>
          <Separator />

          <nav className="grid items-start px-2 py-2 lg:px-4">
            <Link
              to="/dashboard"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/dashboard"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Home className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Dashboard</span>
            </Link>

            <Link
              to="/sites"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/sites"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Globe className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Sites</span>
            </Link>

            <Link
              to="/content"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/content"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <FileText className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Content</span>
            </Link>

            <Link
              to="/users"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/users"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Users className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Users</span>
            </Link>

            <Link
              to="/plugins"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/plugins"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Plug className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Plugins</span>
            </Link>

            <Link
              to="/themes"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/themes"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Brush className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Themes</span>
            </Link>
            
            <Link
              to="/lms"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/lms"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <GraduationCap className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>LMS Manager</span>
            </Link>
            
            <Link
              to="/backups"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/backups"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <CloudUpload className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Backup & Restore</span>
            </Link>
          </nav>

          <Separator />

          <nav className="grid items-start px-2 py-2 lg:px-4">
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/settings"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Settings className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Settings</span>
            </Link>

            <Link
              to="/help"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/help"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <HelpCircle className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Help</span>
            </Link>
          </nav>
        </aside>
      </SheetTrigger>
      <SheetContent
        className="w-[15rem] p-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-0 data-[state=open]:slide-in-from-left-0 border-r"
        side="left"
      >
        <aside className="group/sidebar flex h-full flex-col border-r bg-secondary/50 backdrop-blur-sm transition-all dark:border-neutral-800">
          <div className="relative flex h-20 shrink-0 items-center justify-end px-4">
            <Link to="/" className="font-bold">
              WPCloud
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-8 !h-auto !w-auto p-0 lg:hidden"
              onClick={closeSidebar}
            >
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </div>
          <Separator />

          <nav className="grid items-start px-2 py-2 lg:px-4">
            <Link
              to="/dashboard"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/dashboard"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Home className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Dashboard</span>
            </Link>

            <Link
              to="/sites"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/sites"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Globe className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Sites</span>
            </Link>

            <Link
              to="/content"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/content"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <FileText className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Content</span>
            </Link>

            <Link
              to="/users"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/users"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Users className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Users</span>
            </Link>

            <Link
              to="/plugins"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/plugins"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Plug className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Plugins</span>
            </Link>

            <Link
              to="/themes"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/themes"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Brush className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Themes</span>
            </Link>
            
            <Link
              to="/lms"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/lms"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <GraduationCap className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>LMS Manager</span>
            </Link>
            
            <Link
              to="/backups"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/backups"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <CloudUpload className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Backup & Restore</span>
            </Link>
          </nav>

          <Separator />

          <nav className="grid items-start px-2 py-2 lg:px-4">
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/settings"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Settings className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Settings</span>
            </Link>

            <Link
              to="/help"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === "/help"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <HelpCircle className="h-5 w-5" />
              <span className={sidebarCollapsed ? "lg:hidden" : ""}>Help</span>
            </Link>
          </nav>
        </aside>
      </SheetContent>
    </Sheet>
  );
}
