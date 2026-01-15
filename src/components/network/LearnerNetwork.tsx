import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, MessageSquare, Calendar, Building2, 
  TrendingUp, Bell
} from "lucide-react";
import { NetworkFeed } from "./NetworkFeed";
import { NetworkConnections } from "./NetworkConnections";
import { NetworkMessages } from "./NetworkMessages";
import { NetworkEvents } from "./NetworkEvents";
import { NetworkGroups } from "./NetworkGroups";
import { NetworkProfile } from "./NetworkProfile";

export function LearnerNetwork() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Learner Interaction Space
          </h2>
          <p className="text-muted-foreground">
            Connect, share, and grow with fellow learners
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Feed</span>
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Network</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Groups</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-6">
          <NetworkFeed />
        </TabsContent>

        <TabsContent value="connections" className="mt-6">
          <NetworkConnections />
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <NetworkMessages />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <NetworkEvents />
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          <NetworkGroups />
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <NetworkProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
}
