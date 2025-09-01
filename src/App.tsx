import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientBody from "@/components/ClientBody";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Maths from "./pages/Maths";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import TradingDashboard from "./pages/TradingDashboard";
import Lesson from "./pages/Lesson";
import Goals from "./pages/Goals";
import Progress from "./pages/Progress";
import NotFound from "./pages/NotFound";
import FXCourse from "./pages/FXCourse";
import FXModule from "./pages/FXModule";
import FXLesson from "./pages/FXLesson";
import GoalSettings from "./pages/GoalSettings";
import Settings from "./pages/Settings";
import Subscribe from "./pages/Subscribe";
import Success from "./pages/Success";
import TrialOnboarding from "./pages/TrialOnboarding";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ClientBody>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/trial" element={<TrialOnboarding />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/success" element={<Success />} />
            <Route path="/course/fx" element={<ProtectedRoute><FXCourse /></ProtectedRoute>} />
            <Route path="/course/fx/module/:moduleSlug" element={<ProtectedRoute><FXModule /></ProtectedRoute>} />
            <Route path="/course/fx/lesson/:lessonSlug" element={<ProtectedRoute><FXLesson /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/trading" element={<ProtectedRoute><TradingDashboard /></ProtectedRoute>} />
            <Route path="/lesson/:moduleId/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/settings/goals" element={<ProtectedRoute><GoalSettings /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
            <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/maths" element={<ProtectedRoute><Maths /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </ClientBody>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
