import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { GuestProvider } from "@/contexts/GuestContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import PromptMastery from "./pages/PromptMastery";
import BeginnerJourney from "./pages/BeginnerJourney";
import IntermediateJourney from "./pages/IntermediateJourney";
import AdvancedJourney from "./pages/AdvancedJourney";
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
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import Productivity from "./pages/Productivity";
import NotFound from "./pages/NotFound";
import SkillPowerWidget from "./components/SkillPowerWidget";
import Profile from "./pages/profile/Profile";
import ProfileEdit from "./pages/profile/ProfileEdit";
import ProfileActivity from "./pages/profile/ProfileActivity";
import ProfileProjects from "./pages/profile/ProfileProjects";
import ProfileSkills from "./pages/profile/ProfileSkills";
import ProfileCertificates from "./pages/profile/ProfileCertificates";
import ProfileConnections from "./pages/profile/ProfileConnections";
import ProfileAnalytics from "./pages/profile/ProfileAnalytics";
import ProfileSettings from "./pages/profile/ProfileSettings";
import ProfilePublic from "./pages/profile/ProfilePublic";

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
              <Route path="/" element={<LandingPage />} />
              <Route path="/prompt-mastery" element={<PromptMastery />} />
              <Route path="/prompt-mastery/beginner" element={<BeginnerJourney />} />
              <Route path="/prompt-mastery/intermediate" element={<IntermediateJourney />} />
              <Route path="/prompt-mastery/advanced" element={<AdvancedJourney />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
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
              {/* Profile ecosystem */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
              <Route path="/profile/activity" element={<ProtectedRoute><ProfileActivity /></ProtectedRoute>} />
              <Route path="/profile/projects" element={<ProtectedRoute><ProfileProjects /></ProtectedRoute>} />
              <Route path="/profile/skills" element={<ProtectedRoute><ProfileSkills /></ProtectedRoute>} />
              <Route path="/profile/certificates" element={<ProtectedRoute><ProfileCertificates /></ProtectedRoute>} />
              <Route path="/profile/connections" element={<ProtectedRoute><ProfileConnections /></ProtectedRoute>} />
              <Route path="/profile/analytics" element={<ProtectedRoute><ProfileAnalytics /></ProtectedRoute>} />
              <Route path="/profile/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
              <Route path="/u/:username" element={<ProfilePublic />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <SkillPowerWidget />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </GuestProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
