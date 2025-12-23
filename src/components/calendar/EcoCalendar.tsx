import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Leaf, Globe, Droplets, TreePine, Bird, Recycle, Sun, ChevronLeft, ChevronRight, Bell, Star } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from "date-fns";

interface EcoDay {
  date: Date;
  name: string;
  description: string;
  icon: typeof Leaf;
  color: string;
  specialTasks?: string[];
}

// Environmental days calendar
const environmentalDays: EcoDay[] = [
  {
    date: new Date(2025, 0, 5), // January 5
    name: "National Bird Day",
    description: "Celebrate and protect our feathered friends",
    icon: Bird,
    color: "text-sky-500",
    specialTasks: ["Bird watching activity", "Build a bird feeder"]
  },
  {
    date: new Date(2025, 1, 2), // February 2
    name: "World Wetlands Day",
    description: "Raising awareness about wetlands",
    icon: Droplets,
    color: "text-blue-500",
    specialTasks: ["Wetland cleanup", "Water conservation challenge"]
  },
  {
    date: new Date(2025, 2, 21), // March 21
    name: "International Day of Forests",
    description: "Celebrating the importance of forests",
    icon: TreePine,
    color: "text-green-600",
    specialTasks: ["Tree planting", "Forest trail cleanup"]
  },
  {
    date: new Date(2025, 2, 22), // March 22
    name: "World Water Day",
    description: "Focus on the importance of freshwater",
    icon: Droplets,
    color: "text-cyan-500",
    specialTasks: ["Water saving challenge", "Beach/river cleanup"]
  },
  {
    date: new Date(2025, 3, 22), // April 22
    name: "Earth Day",
    description: "The biggest environmental event of the year",
    icon: Globe,
    color: "text-emerald-500",
    specialTasks: ["Community cleanup", "Recycling drive", "Plant a tree"]
  },
  {
    date: new Date(2025, 5, 5), // June 5
    name: "World Environment Day",
    description: "UN's principal vehicle for environmental awareness",
    icon: Leaf,
    color: "text-green-500",
    specialTasks: ["Eco pledge", "Sustainable living workshop", "Zero waste day"]
  },
  {
    date: new Date(2025, 5, 8), // June 8
    name: "World Oceans Day",
    description: "Celebrating and preserving our oceans",
    icon: Droplets,
    color: "text-blue-600",
    specialTasks: ["Beach cleanup", "Plastic-free challenge"]
  },
  {
    date: new Date(2025, 8, 16), // September 16
    name: "World Ozone Day",
    description: "Preserving the ozone layer",
    icon: Sun,
    color: "text-yellow-500",
    specialTasks: ["Energy saving challenge", "Air quality awareness"]
  },
  {
    date: new Date(2025, 10, 15), // November 15
    name: "America Recycles Day",
    description: "Promoting recycling and buying recycled products",
    icon: Recycle,
    color: "text-emerald-600",
    specialTasks: ["Recycling challenge", "Upcycling workshop"]
  },
];

export function EcoCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<EcoDay | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEcoDay = (date: Date) => {
    return environmentalDays.find(ed => 
      ed.date.getMonth() === date.getMonth() && ed.date.getDate() === date.getDate()
    );
  };

  const upcomingDays = environmentalDays
    .filter(ed => {
      const thisYear = new Date(currentMonth.getFullYear(), ed.date.getMonth(), ed.date.getDate());
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
          Eco <span className="eco-gradient-text">Calendar</span>
        </h2>
        <p className="text-muted-foreground">
          Environmental days and special eco tasks throughout the year
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
              {/* Empty cells for days before month start */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {days.map(day => {
                const ecoDay = getEcoDay(day);
                const isCurrentDay = isToday(day);
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => ecoDay && setSelectedDay(ecoDay)}
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center text-sm
                      transition-all relative
                      ${isCurrentDay ? 'bg-primary text-primary-foreground font-bold' : ''}
                      ${ecoDay ? 'bg-primary/10 hover:bg-primary/20 cursor-pointer' : 'hover:bg-muted'}
                      ${!isCurrentDay && !ecoDay ? 'text-foreground' : ''}
                    `}
                  >
                    <span>{format(day, "d")}</span>
                    {ecoDay && (
                      <span className="absolute bottom-1">
                        <ecoDay.icon className={`h-3 w-3 ${ecoDay.color}`} />
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
                    
                    {selectedDay.specialTasks && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Special Tasks:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedDay.specialTasks.map((task, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" /> {task}
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
              Upcoming Eco Days
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
                Check back for upcoming eco events!
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
              <span className="text-muted-foreground">Eco Day</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-500" />
              <span className="text-muted-foreground">Earth Day</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">Water Day</span>
            </div>
            <div className="flex items-center gap-2">
              <TreePine className="h-4 w-4 text-green-600" />
              <span className="text-muted-foreground">Forest Day</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
