import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import Rewards from "./pages/Rewards";
import AdminSubmissions from "./pages/AdminSubmissions";
import Quizzes from "./pages/Quizzes";
import QuizPlay from "./pages/QuizPlay";
import AdminQuizzes from "./pages/AdminQuizzes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="student">
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            } />
            <Route path="/tasks/:id" element={
              <ProtectedRoute>
                <TaskDetail />
              </ProtectedRoute>
            } />
            <Route path="/rewards" element={
              <ProtectedRoute>
                <Rewards />
              </ProtectedRoute>
            } />
            <Route path="/quizzes" element={
              <ProtectedRoute>
                <Quizzes />
              </ProtectedRoute>
            } />
            <Route path="/quiz/:id" element={
              <ProtectedRoute>
                <QuizPlay />
              </ProtectedRoute>
            } />
            <Route path="/admin/submissions" element={
              <ProtectedRoute requiredRole="admin">
                <AdminSubmissions />
              </ProtectedRoute>
            } />
            <Route path="/admin/quizzes" element={
              <ProtectedRoute requiredRole="admin">
                <AdminQuizzes />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
