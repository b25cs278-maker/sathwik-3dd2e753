import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: "primary" | "leaf" | "sky" | "sun" | "reward";
}

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  leaf: "bg-eco-leaf/10 text-eco-leaf",
  sky: "bg-eco-sky/10 text-eco-sky",
  sun: "bg-eco-sun/10 text-eco-earth",
  reward: "bg-eco-reward/10 text-eco-reward",
};

export function StatsCard({ title, value, subtitle, icon: Icon, trend, color = "primary" }: StatsCardProps) {
  return (
    <Card variant="eco" className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-display font-bold text-foreground">{value}</p>
              {trend && (
                <span className={`text-sm font-medium ${trend.positive ? 'text-eco-leaf' : 'text-destructive'}`}>
                  {trend.positive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
