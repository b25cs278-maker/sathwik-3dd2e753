import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, GraduationCap, BookOpen, Brain, Mic, Code, Sparkles, ChevronLeft, ChevronRight, Bell, Star, Users, Briefcase, Plus } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isToday } from "date-fns";
import { toast } from "sonner";

interface LearningEvent {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  icon: string;
  color: string;
  start_date: string;
  end_date: string | null;
  is_public: boolean;
  created_by: string;
  activities: string[];
}

const iconMap: Record<string, typeof Calendar> = {
  calendar: Calendar,
  graduation: GraduationCap,
  book: BookOpen,
  brain: Brain,
  mic: Mic,
  code: Code,
  sparkles: Sparkles,
  users: Users,
  briefcase: Briefcase,
  star: Star,
};

export function EcoCalendar() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<LearningEvent | null>(null);
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: "", description: "", date: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReminder = async () => {
    if (!user || !newReminder.title.trim() || !newReminder.date) {
      toast.error('Please fill in title and date');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('learning_events')
        .insert({
          title: newReminder.title,
          description: newReminder.description || null,
          event_type: 'reminder',
          is_public: false,
          created_by: user.id,
          start_date: new Date(newReminder.date).toISOString(),
          icon: 'star',
          color: 'text-primary',
        });
      if (error) throw error;
      toast.success('Reminder added!');
      setNewReminder({ title: "", description: "", date: "" });
      setShowAddReminder(false);
      fetchEvents();
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast.error('Failed to add reminder');
    } finally {
      setSubmitting(false);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (date: Date) => {
    return events.filter(ev => {
      const evDate = new Date(ev.start_date);
      return evDate.getDate() === date.getDate() && evDate.getMonth() === date.getMonth() && evDate.getFullYear() === date.getFullYear();
    });
  };

  const upcomingEvents = events
    .filter(ev => new Date(ev.start_date) >= new Date())
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 4);

  const getIcon = (iconName: string) => iconMap[iconName] || Calendar;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            My <span className="eco-gradient-text">Schedule</span>
          </h2>
          <p className="text-muted-foreground">
            Upcoming learning events, workshops, and personal reminders
          </p>
        </div>
        <Dialog open={showAddReminder} onOpenChange={setShowAddReminder}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Personal Reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Reminder title"
                value={newReminder.title}
                onChange={e => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newReminder.description}
                onChange={e => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
              <Input
                type="date"
                value={newReminder.date}
                onChange={e => setNewReminder(prev => ({ ...prev, date: e.target.value }))}
              />
              <Button onClick={addReminder} disabled={submitting} className="w-full">
                {submitting ? 'Adding...' : 'Add Reminder'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card variant="eco" className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-lg">{format(currentMonth, "MMMM yyyy")}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {days.map(day => {
                const dayEvents = getEventsForDay(day);
                const isCurrentDay = isToday(day);
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center text-sm
                      transition-all relative
                      ${isCurrentDay ? 'bg-primary text-primary-foreground font-bold' : ''}
                      ${dayEvents.length > 0 ? 'bg-primary/10 hover:bg-primary/20 cursor-pointer' : 'hover:bg-muted'}
                      ${!isCurrentDay && dayEvents.length === 0 ? 'text-foreground' : ''}
                    `}
                  >
                    <span>{format(day, "d")}</span>
                    {dayEvents.length > 0 && (
                      <span className="absolute bottom-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Event Details */}
            {selectedEvent && (
              <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-primary/10">
                    {(() => { const Icon = getIcon(selectedEvent.icon); return <Icon className={`h-6 w-6 ${selectedEvent.color}`} />; })()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{selectedEvent.title}</h4>
                      {!selectedEvent.is_public && <Badge variant="outline" className="text-xs">Personal</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                    <p className="text-xs text-primary mt-1">
                      {format(new Date(selectedEvent.start_date), "MMMM d, yyyy")}
                    </p>
                    {selectedEvent.activities && selectedEvent.activities.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Activities:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedEvent.activities.map((activity, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" /> {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card variant="eco">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => {
                const daysUntil = Math.ceil((new Date(event.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const Icon = getIcon(event.icon);
                return (
                  <div
                    key={event.id}
                    className="p-3 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-all cursor-pointer"
                    onClick={() => {
                      setCurrentMonth(new Date(event.start_date));
                      setSelectedEvent(event);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className={`h-5 w-5 ${event.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground truncate">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(event.start_date), "MMMM d")}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {daysUntil > 0 ? `${daysUntil}d` : daysUntil === 0 ? 'Today!' : 'Past'}
                      </Badge>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground text-sm py-4">
                No upcoming events. Check back soon!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card variant="eco">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary" />
              <span className="text-muted-foreground">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/20" />
              <span className="text-muted-foreground">Event Day</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
