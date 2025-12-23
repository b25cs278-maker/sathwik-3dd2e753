import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, MapPin, Clock, Trophy, Flame, Target, Star, TrendingUp } from "lucide-react";

interface BoostTask {
  id: string;
  title: string;
  description: string;
  basePoints: number;
  boostMultiplier: number;
  boostReason: string;
  difficulty: string;
  category: string;
}

const boostMultipliers = [
  {
    type: "difficulty",
    icon: Flame,
    title: "Hard Task Bonus",
    description: "2x points for hard difficulty tasks",
    multiplier: "2x",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10"
  },
  {
    type: "location",
    icon: MapPin,
    title: "Remote Location Bonus",
    description: "1.5x points for tasks in remote areas",
    multiplier: "1.5x",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    type: "urgent",
    icon: Clock,
    title: "Urgent Activity Bonus",
    description: "1.75x points for time-sensitive tasks",
    multiplier: "1.75x",
    color: "text-red-500",
    bgColor: "bg-red-500/10"
  },
  {
    type: "streak",
    icon: TrendingUp,
    title: "Streak Bonus",
    description: "Extra 10% per consecutive day",
    multiplier: "+10%",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  }
];

export function SmartRewardBoost() {
  const [boostedTasks, setBoostedTasks] = useState<BoostTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyBonus, setWeeklyBonus] = useState(0);

  useEffect(() => {
    fetchBoostedTasks();
  }, []);

  const fetchBoostedTasks = async () => {
    try {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('points', { ascending: false })
        .limit(6);

      // Apply boost logic to tasks
      const boosted = (tasks || []).map(task => {
        let multiplier = 1;
        let reason = "";

        if (task.difficulty === 'hard') {
          multiplier = 2;
          reason = "Hard Task";
        } else if (task.difficulty === 'medium') {
          multiplier = 1.25;
          reason = "Medium Difficulty";
        }

        if (task.location_required) {
          multiplier += 0.5;
          reason += reason ? " + Location" : "Location Required";
        }

        return {
          id: task.id,
          title: task.title,
          description: task.description || '',
          basePoints: task.points,
          boostMultiplier: multiplier,
          boostReason: reason || "Standard",
          difficulty: task.difficulty,
          category: task.category
        };
      });

      setBoostedTasks(boosted);

      // Calculate weekly bonus (mock calculation)
      const totalBonus = boosted.reduce((sum, t) => 
        sum + (t.basePoints * t.boostMultiplier - t.basePoints), 0
      );
      setWeeklyBonus(Math.round(totalBonus));
    } catch (error) {
      console.error('Error fetching boosted tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'hard': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Smart <span className="eco-gradient-text">Reward Boost</span>
        </h2>
        <p className="text-muted-foreground">
          Earn extra points for challenging tasks and special conditions
        </p>
      </div>

      {/* Boost Multipliers Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {boostMultipliers.map((boost, i) => (
          <Card key={i} variant="eco" className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-20 h-20 ${boost.bgColor} rounded-bl-full opacity-50`} />
            <CardContent className="pt-6 relative">
              <div className={`p-3 rounded-xl ${boost.bgColor} w-fit mb-3`}>
                <boost.icon className={`h-6 w-6 ${boost.color}`} />
              </div>
              <h3 className="font-semibold text-foreground">{boost.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{boost.description}</p>
              <Badge className={`mt-3 ${boost.bgColor} ${boost.color} border-0`}>
                {boost.multiplier}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Bonus Summary */}
      <Card variant="eco" className="bg-gradient-to-r from-primary/5 to-eco-sun/5 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Potential Weekly Bonus</p>
                <p className="text-3xl font-display font-bold text-foreground">
                  +{weeklyBonus.toLocaleString()} pts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-eco-sun" />
              <span className="text-sm text-muted-foreground">Complete boosted tasks to earn more!</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Boosted Tasks */}
      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-eco-sun" />
          Current Boosted Tasks
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boostedTasks.map((task) => (
            <Card key={task.id} variant="eco" className="relative overflow-hidden group hover:shadow-eco transition-all">
              {task.boostMultiplier > 1 && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-gradient-to-r from-primary to-eco-sun text-white border-0">
                    <Zap className="h-3 w-3 mr-1" />
                    {task.boostMultiplier}x
                  </Badge>
                </div>
              )}
              <CardContent className="pt-6">
                <Badge variant="outline" className={`mb-3 ${getDifficultyColor(task.difficulty)}`}>
                  {task.difficulty}
                </Badge>
                <h4 className="font-semibold text-foreground line-clamp-1">{task.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Base: {task.basePoints} pts</span>
                    <span className="font-bold text-primary">
                      Total: {Math.round(task.basePoints * task.boostMultiplier)} pts
                    </span>
                  </div>
                  {task.boostMultiplier > 1 && (
                    <p className="text-xs text-eco-sun mt-2 flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {task.boostReason}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
