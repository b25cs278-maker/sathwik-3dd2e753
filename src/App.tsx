import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { GuestProvider } from "@/contexts/GuestContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Tracks from "./pages/Tracks";
import TrackDetail from "./pages/TrackDetail";
import Lesson from "./pages/Lesson";
import Project from "./pages/Project";
import Portfolio from "./pages/Portfolio";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";

import AdminReview from "./pages/AdminReview";
import Productivity from "./pages/Productivity";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <GuestProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/tracks" element={<Tracks />} />
              <Route path="/track/:trackId" element={
                <ProtectedRoute allowGuest>
                  <TrackDetail />
                </ProtectedRoute>
              } />
              <Route path="/lesson/:trackId/:lessonId" element={
                <ProtectedRoute allowGuest>
                  <Lesson />
                </ProtectedRoute>
              } />
              <Route path="/project/:trackId/:projectId" element={
                <ProtectedRoute>
                  <Project />
                </ProtectedRoute>
              } />
              <Route path="/portfolio" element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              } />
              {/* Dashboard redirect based on role */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              {/* Student Dashboard */}
              <Route path="/student/dashboard" element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              {/* Admin Dashboard */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/task/:id" element={
                <ProtectedRoute allowGuest>
                  <TaskDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/productivity" element={
                <ProtectedRoute>
                  <Productivity />
                </ProtectedRoute>
              } />
              <Route path="/admin/review" element={
                <ProtectedRoute>
                  <AdminReview />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </GuestProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
