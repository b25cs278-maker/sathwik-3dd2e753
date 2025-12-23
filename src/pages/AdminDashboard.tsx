import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { UserManagement } from "@/components/admin/UserManagement";
import { TaskManagement } from "@/components/admin/TaskManagement";
import { RewardsManagement } from "@/components/admin/RewardsManagement";
import { LearningManagement } from "@/components/admin/LearningManagement";
import { CommunityModeration } from "@/components/admin/CommunityModeration";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";
import { PartnerManagement } from "@/components/admin/PartnerManagement";
import { NotificationsPanel } from "@/components/admin/NotificationsPanel";
import { FeedbackManagement } from "@/components/admin/FeedbackManagement";
import { SecurityPanel } from "@/components/admin/SecurityPanel";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { 
  LayoutDashboard, Users, ListTodo, Gift, BookOpen,
  BarChart3, Shield, Bell, Settings, Eye, Lightbulb,
  Building2, MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function AdminDashboard() {
  const { role } = useAuth();

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-display font-bold text-foreground">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              Complete platform management and analytics
            </p>
          </div>
          <Link to="/admin/review">
            <Button variant="hero">
              <Eye className="h-4 w-4 mr-2" />
              Review Submissions
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex h-auto gap-1 p-1 w-max">
              <TabsTrigger value="overview" className="flex items-center gap-2 px-3 py-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2 px-3 py-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2 px-3 py-2">
                <ListTodo className="h-4 w-4" />
                <span className="hidden sm:inline">Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-2 px-3 py-2">
                <Gift className="h-4 w-4" />
                <span className="hidden sm:inline">Rewards</span>
              </TabsTrigger>
              <TabsTrigger value="learning" className="flex items-center gap-2 px-3 py-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Learning</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-2 px-3 py-2">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">Community</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 px-3 py-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="partners" className="flex items-center gap-2 px-3 py-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Partners</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2 px-3 py-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-2 px-3 py-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Feedback</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 px-3 py-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 px-3 py-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="overview"><AdminOverview /></TabsContent>
          <TabsContent value="users"><UserManagement /></TabsContent>
          <TabsContent value="tasks"><TaskManagement /></TabsContent>
          <TabsContent value="rewards"><RewardsManagement /></TabsContent>
          <TabsContent value="learning"><LearningManagement /></TabsContent>
          <TabsContent value="community"><CommunityModeration /></TabsContent>
          <TabsContent value="analytics"><AnalyticsPanel /></TabsContent>
          <TabsContent value="partners"><PartnerManagement /></TabsContent>
          <TabsContent value="notifications"><NotificationsPanel /></TabsContent>
          <TabsContent value="feedback"><FeedbackManagement /></TabsContent>
          <TabsContent value="security"><SecurityPanel /></TabsContent>
          <TabsContent value="settings"><SettingsPanel /></TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
