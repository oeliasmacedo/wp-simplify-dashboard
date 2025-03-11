
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ContentManager from "./pages/ContentManager";
import UserManager from "./pages/UserManager";
import LMSManager from "./pages/LMSManager";
import NotFound from "./pages/NotFound";
import { WordPressProvider } from "./contexts/WordPressContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WordPressProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/content" element={<ContentManager />} />
            <Route path="/users" element={<UserManager />} />
            <Route path="/lms" element={<LMSManager />} />
            {/* Add additional routes as they're implemented */}
            {/* <Route path="/statistics" element={<Statistics />} /> */}
            {/* <Route path="/backups" element={<Backups />} /> */}
            {/* <Route path="/extensions" element={<Extensions />} /> */}
            {/* <Route path="/branding" element={<Branding />} /> */}
            {/* <Route path="/integrations" element={<Integrations />} /> */}
            {/* <Route path="/settings" element={<Settings />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WordPressProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
