import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { WordPressProvider } from "@/contexts/WordPressContext";
import { SitesManager } from "@/components/SitesManager";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Book,
  BookOpen,
  BookmarkPlus,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Chrome,
  Circle,
  Cloud,
  CloudCog,
  CloudRain,
  Code,
  Command,
  Component,
  Copy,
  CreditCard,
  Database,
  Disc,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  Edit,
  ExternalLink,
  File,
  FileText,
  FolderInput,
  FormInput,
  Gamepad2,
  Github,
  Globe,
  GraduationCap,
  Hammer,
  HelpCircle,
  Home,
  Image,
  Inbox,
  Key,
  Laptop2,
  LayoutDashboard,
  ListChecks,
  Mail,
  Maximize2,
  MessageSquare,
  MessagesSquare,
  Mobile,
  MoreHorizontal,
  Paintbrush2,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  PencilLine,
  Percent,
  Plus,
  PlusCircle,
  Question,
  QuestionMarkCircle,
  RefreshCw,
  Rocket,
  Save,
  ScrollText,
  Search,
  Send,
  ServerCrash,
  Settings,
  Share2,
  Shield,
  ShoppingCart,
  SidebarClose,
  SidebarOpen,
  Smile,
  Star,
  Sun,
  Table as TableIcon,
  Tag,
  Text,
  Theme,
  Themes,
  Trash,
  Trash2,
  TrendingUp,
  Type,
  Upload,
  User,
  User2,
  UserCheck,
  UserPlus,
  Users,
  Video,
  View,
  WarningCircle,
  Wifi,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ModeToggle } from "@/components/ModeToggle";
import { CommandDialog, CommandList } from "@/components/ui/command";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ContentManager } from "./pages/ContentManager";
import { UserManager } from "./pages/UserManager";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LMSManager from "./pages/LMSManager";
import BackupManager from "./pages/BackupManager";
import "./index.css";

const queryClient = new QueryClient();

function App() {
  return (
    <WordPressProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider
            router={createBrowserRouter([
              {
                path: "/",
                element: <Index />,
              },
              {
                path: "/dashboard",
                element: <Dashboard />,
              },
              {
                path: "/sites",
                element: <SitesManager />,
              },
              {
                path: "/content",
                element: <ContentManager />,
              },
              {
                path: "/users",
                element: <UserManager />,
              },
              {
                path: "/lms",
                element: <LMSManager />,
              },
              {
                path: "/backups",
                element: <BackupManager />,
              },
              {
                path: "*",
                element: <NotFound />,
              },
            ])}
          />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </WordPressProvider>
  );
}

export default App;
