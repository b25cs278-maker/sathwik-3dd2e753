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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col lg:flex-row gap-6">
        <TabsList className="flex flex-row lg:flex-col justify-start gap-1 w-full lg:w-48 h-auto shrink-0">
          <TabsTrigger value="feed" className="flex items-center gap-2 justify-start w-full">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Feed</span>
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2 justify-start w-full">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Network</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2 justify-start w-full">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2 justify-start w-full">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2 justify-start w-full">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Groups</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2 justify-start w-full">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-w-0">
          <TabsContent value="feed" className="mt-0">
            <NetworkFeed />
          </TabsContent>

          <TabsContent value="connections" className="mt-0">
            <NetworkConnections />
          </TabsContent>

          <TabsContent value="messages" className="mt-0">
            <NetworkMessages />
          </TabsContent>

          <TabsContent value="events" className="mt-0">
            <NetworkEvents />
          </TabsContent>

          <TabsContent value="groups" className="mt-0">
            <NetworkGroups />
          </TabsContent>

          <TabsContent value="profile" className="mt-0">
            <NetworkProfile />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
