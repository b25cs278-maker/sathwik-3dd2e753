import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { UserManagement } from "@/components/admin/UserManagement";
import { TaskManagement } from "@/components/admin/TaskManagement";
import { LearningManagement } from "@/components/admin/LearningManagement";
import { CommunityModeration } from "@/components/admin/CommunityModeration";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";
import { PartnerManagement } from "@/components/admin/PartnerManagement";
import { NotificationsPanel } from "@/components/admin/NotificationsPanel";
import { FeedbackManagement } from "@/components/admin/FeedbackManagement";
import { SecurityPanel } from "@/components/admin/SecurityPanel";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { VideoModuleManagement } from "@/components/admin/VideoModuleManagement";
import { useRealtimeSubmissions } from "@/hooks/useRealtimeSubmissions";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, Users, ListTodo, BookOpen,
  BarChart3, Shield, Bell, Settings, Eye, Lightbulb,
  Building2, MessageSquare, Video
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { role } = useAuth();
  const { unreadCount } = useRealtimeSubmissions();
  const [activeSection, setActiveSection] = useState("overview");

  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Admin access required</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: "overview", label: "Overview Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "users", label: "Learners Management", icon: <Users className="h-4 w-4" /> },
    { id: "tasks", label: "Workshop Management", icon: <ListTodo className="h-4 w-4" /> },
    { id: "learning", label: "AI Learning Hub", icon: <BookOpen className="h-4 w-4" /> },
    { id: "video-modules", label: "Video Modules", icon: <Video className="h-4 w-4" /> },
    { id: "community", label: "Eco Learn Network", icon: <Lightbulb className="h-4 w-4" /> },
    { id: "analytics", label: "Insights & Analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "partners", label: "Startup Collaborations", icon: <Building2 className="h-4 w-4" /> },
    { 
      id: "notifications", 
      label: "Announcements & Alerts", 
      icon: <Bell className="h-4 w-4" />,
      badge: unreadCount > 0 ? (
        <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
          {unreadCount}
        </Badge>
      ) : undefined
    },
    { id: "feedback", label: "Suggestions & Feedback", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "security", label: "Access & Security", icon: <Shield className="h-4 w-4" /> },
    { id: "settings", label: "Platform Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview": return <AdminOverview />;
      case "users": return <UserManagement />;
      case "tasks": return <TaskManagement />;
      case "learning": return <LearningManagement />;
      case "video-modules": return <VideoModuleManagement />;
      case "community": return <CommunityModeration />;
      case "analytics": return <AnalyticsPanel />;
      case "partners": return <PartnerManagement />;
      case "notifications": return <NotificationsPanel />;
      case "feedback": return <FeedbackManagement />;
      case "security": return <SecurityPanel />;
      case "settings": return <SettingsPanel />;
      default: return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        <DashboardSidebar
          items={sidebarItems}
          activeItem={activeSection}
          onItemClick={setActiveSection}
          title="Eco Learn Control Center"
          subtitle="Platform Management"
          headerIcon={<Shield className="h-5 w-5 text-primary" />}
          headerAction={
            <Link to="/admin/review">
              <Button variant="hero" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Review Submissions
              </Button>
            </Link>
          }
        />

        <main className="flex-1 overflow-auto">
          <div className="container py-8">
            {renderContent()}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
