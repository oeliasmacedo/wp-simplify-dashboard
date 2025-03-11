
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ContentManager from "./pages/ContentManager";
import UserManager from "./pages/UserManager";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/content" element={<ContentManager />} />
          <Route path="/users" element={<UserManager />} />
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
