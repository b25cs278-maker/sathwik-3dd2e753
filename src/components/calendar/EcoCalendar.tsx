import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, GraduationCap, Globe, BookOpen, Brain, Mic, Code, Sparkles, ChevronLeft, ChevronRight, Bell, Star, Users, Briefcase } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from "date-fns";

interface ScheduleDay {
  date: Date;
  name: string;
  description: string;
  icon: typeof GraduationCap;
  color: string;
  activities?: string[];
}

// Learning & skill development events calendar
const scheduledDays: ScheduleDay[] = [
  {
    date: new Date(2025, 0, 15),
    name: "AI Innovation Kickoff",
    description: "Introduction to AI concepts and hands-on activities",
    icon: Brain,
    color: "text-violet-500",
    activities: ["AI Basics Workshop", "Chatbot Building Demo"]
  },
  {
    date: new Date(2025, 1, 10),
    name: "Communication Skills Day",
    description: "Master verbal and non-verbal communication",
    icon: Mic,
    color: "text-rose-500",
    activities: ["Public Speaking Practice", "Body Language Workshop"]
  },
  {
    date: new Date(2025, 2, 8),
    name: "English Proficiency Week",
    description: "Intensive English grammar and speaking sessions",
    icon: BookOpen,
    color: "text-blue-500",
    activities: ["Grammar Bootcamp", "Conversation Practice"]
  },
  {
    date: new Date(2025, 3, 5),
    name: "Mock Interview Day",
    description: "Practice interviews with AI and peer feedback",
    icon: Briefcase,
    color: "text-amber-600",
    activities: ["HR Interview Prep", "Technical Q&A Practice", "Resume Review"]
  },
  {
    date: new Date(2025, 3, 22),
    name: "Earth Day Learning Sprint",
    description: "Environmental innovation projects and challenges",
    icon: Globe,
    color: "text-emerald-500",
    activities: ["Eco Data Analysis", "Green Innovation Challenge"]
  },
  {
    date: new Date(2025, 4, 15),
    name: "Teamwork & Leadership Day",
    description: "Collaborate, lead, and solve problems together",
    icon: Users,
    color: "text-sky-500",
    activities: ["Team Decision Simulator", "Leadership Challenge"]
  },
  {
    date: new Date(2025, 5, 10),
    name: "AI Project Showcase",
    description: "Present your AI projects and get feedback",
    icon: Code,
    color: "text-indigo-500",
    activities: ["Project Presentations", "Peer Code Review", "Portfolio Building"]
  },
  {
    date: new Date(2025, 7, 20),
    name: "Career Readiness Bootcamp",
    description: "Prepare for real-world job applications",
    icon: Briefcase,
    color: "text-orange-500",
    activities: ["Resume Building", "LinkedIn Optimization", "Interview Simulation"]
  },
  {
    date: new Date(2025, 9, 5),
    name: "Soft Skills Marathon",
    description: "Full-day focus on essential workplace skills",
    icon: Sparkles,
    color: "text-pink-500",
    activities: ["Time Management Workshop", "Confidence Builder", "Active Listening"]
  },
  {
    date: new Date(2025, 11, 10),
    name: "Year-End Learning Fest",
    description: "Celebrate achievements and plan next year's goals",
    icon: GraduationCap,
    color: "text-primary",
    activities: ["Achievement Awards", "Goal Setting Workshop", "Skill Assessment"]
  },
];

export function EcoCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<ScheduleDay | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getScheduleDay = (date: Date) => {
    return scheduledDays.find(sd => 
      sd.date.getMonth() === date.getMonth() && sd.date.getDate() === date.getDate()
    );
  };

  const upcomingDays = scheduledDays
    .filter(sd => {
      const thisYear = new Date(currentMonth.getFullYear(), sd.date.getMonth(), sd.date.getDate());
      return thisYear >= new Date();
    })
    .sort((a, b) => {
      const aDate = new Date(currentMonth.getFullYear(), a.date.getMonth(), a.date.getDate());
      const bDate = new Date(currentMonth.getFullYear(), b.date.getMonth(), b.date.getDate());
      return aDate.getTime() - bDate.getTime();
    })
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          My <span className="eco-gradient-text">Schedule</span>
        </h2>
        <p className="text-muted-foreground">
          Upcoming learning events, workshops, and skill-building activities
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card variant="eco" className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-lg">
                {format(currentMonth, "MMMM yyyy")}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {days.map(day => {
                const scheduleDay = getScheduleDay(day);
                const isCurrentDay = isToday(day);
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => scheduleDay && setSelectedDay(scheduleDay)}
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center text-sm
                      transition-all relative
                      ${isCurrentDay ? 'bg-primary text-primary-foreground font-bold' : ''}
                      ${scheduleDay ? 'bg-primary/10 hover:bg-primary/20 cursor-pointer' : 'hover:bg-muted'}
                      ${!isCurrentDay && !scheduleDay ? 'text-foreground' : ''}
                    `}
                  >
                    <span>{format(day, "d")}</span>
                    {scheduleDay && (
                      <span className="absolute bottom-1">
                        <scheduleDay.icon className={`h-3 w-3 ${scheduleDay.color}`} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Day Details */}
            {selectedDay && (
              <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-xl ${selectedDay.color.replace('text-', 'bg-')}/10`}>
                    <selectedDay.icon className={`h-6 w-6 ${selectedDay.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{selectedDay.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedDay.description}</p>
                    <p className="text-xs text-primary mt-1">
                      {format(new Date(currentMonth.getFullYear(), selectedDay.date.getMonth(), selectedDay.date.getDate()), "MMMM d, yyyy")}
                    </p>
                    
                    {selectedDay.activities && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Activities:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedDay.activities.map((activity, i) => (
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
            {upcomingDays.map((day, i) => {
              const dayDate = new Date(currentMonth.getFullYear(), day.date.getMonth(), day.date.getDate());
              const daysUntil = Math.ceil((dayDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div 
                  key={i} 
                  className="p-3 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => {
                    setCurrentMonth(dayDate);
                    setSelectedDay(day);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${day.color.replace('text-', 'bg-')}/10`}>
                      <day.icon className={`h-5 w-5 ${day.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground truncate">{day.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {format(dayDate, "MMMM d")}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {daysUntil > 0 ? `${daysUntil}d` : 'Today!'}
                    </Badge>
                  </div>
                </div>
              );
            })}

            {upcomingDays.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-4">
                Check back for upcoming learning events!
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
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-violet-500" />
              <span className="text-muted-foreground">AI Workshop</span>
            </div>
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-rose-500" />
              <span className="text-muted-foreground">Soft Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-amber-600" />
              <span className="text-muted-foreground">Interview Prep</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
