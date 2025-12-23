import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProductivityTask } from '@/hooks/useLocalStorage';
import { 
  BookOpen, 
  PenTool, 
  Code, 
  MessageSquare, 
  Palette,
  TrendingUp,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface SkillTrackerProps {
  tasks: ProductivityTask[];
}

type SkillType = 'reading' | 'writing' | 'coding' | 'speaking' | 'designing';

interface SkillData {
  name: SkillType;
  label: string;
  icon: React.ReactNode;
  color: string;
  keywords: string[];
}

const SKILLS: SkillData[] = [
  {
    name: 'reading',
    label: 'Reading',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'hsl(var(--chart-1))',
    keywords: ['read', 'book', 'article', 'chapter', 'study', 'learn', 'research', 'review', 'notes', 'documentation', 'docs'],
  },
  {
    name: 'writing',
    label: 'Writing',
    icon: <PenTool className="h-4 w-4" />,
    color: 'hsl(var(--chart-2))',
    keywords: ['write', 'blog', 'post', 'content', 'essay', 'script', 'copy', 'draft', 'article', 'email', 'newsletter'],
  },
  {
    name: 'coding',
    label: 'Coding',
    icon: <Code className="h-4 w-4" />,
    color: 'hsl(var(--chart-3))',
    keywords: ['code', 'program', 'develop', 'build', 'app', 'website', 'debug', 'fix', 'feature', 'api', 'backend', 'frontend', 'software', 'project'],
  },
  {
    name: 'speaking',
    label: 'Speaking',
    icon: <MessageSquare className="h-4 w-4" />,
    color: 'hsl(var(--chart-4))',
    keywords: ['speak', 'present', 'pitch', 'video', 'youtube', 'record', 'podcast', 'call', 'meeting', 'interview', 'practice', 'speech'],
  },
  {
    name: 'designing',
    label: 'Designing',
    icon: <Palette className="h-4 w-4" />,
    color: 'hsl(var(--chart-5))',
    keywords: ['design', 'ui', 'ux', 'figma', 'graphic', 'logo', 'visual', 'layout', 'wireframe', 'prototype', 'mockup', 'creative'],
  },
];

const SKILL_LEVELS = [
  { name: 'Beginner', min: 0, max: 10 },
  { name: 'Intermediate', min: 11, max: 30 },
  { name: 'Advanced', min: 31, max: Infinity },
];

function detectSkill(task: ProductivityTask): SkillType | null {
  const text = `${task.title} ${task.description || ''}`.toLowerCase();
  
  for (const skill of SKILLS) {
    if (skill.keywords.some(keyword => text.includes(keyword))) {
      return skill.name;
    }
  }
  return null;
}

function getSkillLevel(tasksCompleted: number): string {
  const level = SKILL_LEVELS.find(l => tasksCompleted >= l.min && tasksCompleted <= l.max);
  return level?.name || 'Beginner';
}

function getSkillProgress(tasksCompleted: number): number {
  if (tasksCompleted <= 10) return (tasksCompleted / 10) * 100;
  if (tasksCompleted <= 30) return ((tasksCompleted - 10) / 20) * 100;
  return 100;
}

export function SkillTracker({ tasks }: SkillTrackerProps) {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const skillStats = useMemo(() => {
    const stats: Record<SkillType, { total: number; daily: number; weekly: number }> = {
      reading: { total: 0, daily: 0, weekly: 0 },
      writing: { total: 0, daily: 0, weekly: 0 },
      coding: { total: 0, daily: 0, weekly: 0 },
      speaking: { total: 0, daily: 0, weekly: 0 },
      designing: { total: 0, daily: 0, weekly: 0 },
    };

    tasks.filter(t => t.completed).forEach(task => {
      const skill = detectSkill(task);
      if (skill) {
        stats[skill].total++;
        
        const completedDate = task.completedAt?.split('T')[0];
        if (completedDate === today) {
          stats[skill].daily++;
        }
        if (completedDate && completedDate >= weekAgo) {
          stats[skill].weekly++;
        }
      }
    });

    return stats;
  }, [tasks, today, weekAgo]);

  const weeklyData = useMemo(() => {
    const days: Record<string, Record<SkillType, number>> = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      days[dayName] = { reading: 0, writing: 0, coding: 0, speaking: 0, designing: 0 };
      
      tasks.filter(t => t.completed && t.completedAt?.split('T')[0] === dateStr).forEach(task => {
        const skill = detectSkill(task);
        if (skill) {
          days[dayName][skill]++;
        }
      });
    }

    return Object.entries(days).map(([day, skills]) => ({
      day,
      ...skills,
      total: Object.values(skills).reduce((a, b) => a + b, 0),
    }));
  }, [tasks]);

  const pieData = useMemo(() => {
    return SKILLS.map(skill => ({
      name: skill.label,
      value: skillStats[skill.name].total,
      color: skill.color,
    })).filter(d => d.value > 0);
  }, [skillStats]);

  const totalTasksToday = Object.values(skillStats).reduce((a, b) => a + b.daily, 0);
  const totalTasksWeek = Object.values(skillStats).reduce((a, b) => a + b.weekly, 0);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-primary" />
          Skill Tracking
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Progress based on tasks completed, not time spent
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalTasksToday}</div>
            <div className="text-xs text-muted-foreground">Tasks Today</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-secondary-foreground">{totalTasksWeek}</div>
            <div className="text-xs text-muted-foreground">Tasks This Week</div>
          </div>
        </div>

        {/* Skill Cards */}
        <div className="space-y-3">
          {SKILLS.map(skill => {
            const stats = skillStats[skill.name];
            const level = getSkillLevel(stats.total);
            const progress = getSkillProgress(stats.total);
            
            return (
              <div key={skill.name} className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-1.5 rounded-md" 
                      style={{ backgroundColor: `${skill.color}20` }}
                    >
                      {skill.icon}
                    </div>
                    <span className="font-medium text-sm">{skill.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={level === 'Advanced' ? 'default' : level === 'Intermediate' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {stats.total} tasks
                    </span>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                  <span>Today: {stats.daily}</span>
                  <span>Week: {stats.weekly}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Progress Chart */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Weekly Progress
          </h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                {SKILLS.map(skill => (
                  <Bar 
                    key={skill.name}
                    dataKey={skill.name} 
                    stackId="a"
                    fill={skill.color}
                    radius={[2, 2, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Distribution */}
        {pieData.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Skill Distribution</h4>
            <div className="flex items-center gap-4">
              <div className="h-32 w-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={50}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1.5">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-muted-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {pieData.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Complete tasks to see your skill distribution
          </div>
        )}
      </CardContent>
    </Card>
  );
}
