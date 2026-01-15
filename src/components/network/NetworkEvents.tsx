import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, MapPin, Users, Clock, Plus, Video, 
  Building, ExternalLink, Check
} from "lucide-react";
import { toast } from "sonner";
import { format, isFuture, isPast } from "date-fns";

interface NetworkEvent {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  event_type: string;
  location?: string;
  event_url?: string;
  start_time: string;
  end_time?: string;
  organizer_id: string;
  attendees_count: number;
  is_public: boolean;
  created_at: string;
  organizer_name?: string;
  user_rsvp?: string;
}

export function NetworkEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<NetworkEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_type: "online",
    location: "",
    event_url: "",
    start_time: "",
    end_time: "",
    is_public: true
  });

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data: eventsData, error } = await supabase
        .from('network_events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;

      const organizerIds = [...new Set(eventsData?.map(e => e.organizer_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', organizerIds);

      let userRsvps: { event_id: string; status: string }[] = [];
      if (user) {
        const { data: rsvps } = await supabase
          .from('event_attendees')
          .select('event_id, status')
          .eq('user_id', user.id);
        userRsvps = rsvps || [];
      }

      const eventsWithDetails = eventsData?.map(event => ({
        ...event,
        organizer_name: profiles?.find(p => p.id === event.organizer_id)?.name || 'Unknown',
        user_rsvp: userRsvps.find(r => r.event_id === event.id)?.status
      })) || [];

      setEvents(eventsWithDetails);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!user || !newEvent.title || !newEvent.start_time) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const { error } = await supabase.from('network_events').insert({
        title: newEvent.title,
        description: newEvent.description,
        event_type: newEvent.event_type,
        location: newEvent.location,
        event_url: newEvent.event_url,
        start_time: newEvent.start_time,
        end_time: newEvent.end_time || null,
        is_public: newEvent.is_public,
        organizer_id: user.id
      });

      if (error) throw error;

      toast.success("Event created!");
      setShowCreateDialog(false);
      setNewEvent({
        title: "",
        description: "",
        event_type: "online",
        location: "",
        event_url: "",
        start_time: "",
        end_time: "",
        is_public: true
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error("Failed to create event");
    }
  };

  const handleRSVP = async (eventId: string, status: string) => {
    if (!user) {
      toast.error("Please log in");
      return;
    }

    try {
      const existingRsvp = events.find(e => e.id === eventId)?.user_rsvp;

      if (existingRsvp) {
        if (existingRsvp === status) {
          // Remove RSVP
          await supabase
            .from('event_attendees')
            .delete()
            .eq('event_id', eventId)
            .eq('user_id', user.id);
        } else {
          // Update RSVP
          await supabase
            .from('event_attendees')
            .update({ status })
            .eq('event_id', eventId)
            .eq('user_id', user.id);
        }
      } else {
        // Create RSVP
        await supabase.from('event_attendees').insert({
          event_id: eventId,
          user_id: user.id,
          status
        });
      }

      fetchEvents();
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'online': return <Video className="h-4 w-4" />;
      case 'in_person': return <Building className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const upcomingEvents = events.filter(e => isFuture(new Date(e.start_time)));
  const pastEvents = events.filter(e => isPast(new Date(e.start_time)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Community Events</h3>
          <p className="text-muted-foreground">Join events and connect with peers</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(p => ({ ...p, title: e.target.value }))}
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(p => ({ ...p, description: e.target.value }))}
                  placeholder="What's this event about?"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Event Type</label>
                  <Select value={newEvent.event_type} onValueChange={(v) => setNewEvent(p => ({ ...p, event_type: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="in_person">In Person</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={newEvent.location}
                    onChange={(e) => setNewEvent(p => ({ ...p, location: e.target.value }))}
                    placeholder="City or venue"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Event URL</label>
                <Input
                  value={newEvent.event_url}
                  onChange={(e) => setNewEvent(p => ({ ...p, event_url: e.target.value }))}
                  placeholder="Link to join or more info"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Date & Time *</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.start_time}
                    onChange={(e) => setNewEvent(p => ({ ...p, start_time: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.end_time}
                    onChange={(e) => setNewEvent(p => ({ ...p, end_time: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleCreateEvent} className="w-full">
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingEvents.map(event => (
              <Card key={event.id} variant="eco" className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {getEventTypeIcon(event.event_type)}
                      <span className="capitalize">{event.event_type.replace('_', ' ')}</span>
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {event.attendees_count}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-lg mb-1">{event.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {format(new Date(event.start_time), 'PPP p')}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Organized by {event.organizer_name}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={event.user_rsvp === 'going' ? 'default' : 'outline'}
                      onClick={() => handleRSVP(event.id, 'going')}
                      className="flex-1"
                    >
                      {event.user_rsvp === 'going' && <Check className="h-3 w-3 mr-1" />}
                      Going
                    </Button>
                    <Button
                      size="sm"
                      variant={event.user_rsvp === 'interested' ? 'secondary' : 'outline'}
                      onClick={() => handleRSVP(event.id, 'interested')}
                      className="flex-1"
                    >
                      Interested
                    </Button>
                    {event.event_url && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={event.event_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {upcomingEvents.length === 0 && (
            <Card variant="eco">
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming events. Create one!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {pastEvents.map(event => (
              <Card key={event.id} variant="eco" className="overflow-hidden opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline">{event.event_type}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {event.attendees_count} attended
                    </span>
                  </div>
                  <h4 className="font-semibold text-lg mb-1">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.start_time), 'PPP')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          {pastEvents.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No past events</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
