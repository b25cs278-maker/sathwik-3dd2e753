import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  earnedAt?: Date;
  locked?: boolean;
}

interface BadgeDisplayProps {
  badges: UserBadge[];
  title?: string;
  showLocked?: boolean;
}

export function BadgeDisplay({ badges, title = "Your Badges", showLocked = true }: BadgeDisplayProps) {
  const displayBadges = showLocked ? badges : badges.filter(b => !b.locked);

  return (
    <Card variant="eco">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-eco-sun" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayBadges.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Complete tasks to earn your first badge!
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {displayBadges.map((badge) => (
              <div
                key={badge.id}
                className={`group flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                  badge.locked
                    ? "opacity-40 grayscale"
                    : "hover:bg-muted cursor-pointer"
                }`}
                title={badge.description}
              >
                <div className={`relative h-14 w-14 rounded-2xl flex items-center justify-center text-3xl ${
                  badge.locked 
                    ? "bg-muted" 
                    : "bg-gradient-to-br from-eco-sun/20 to-eco-leaf/20 group-hover:shadow-eco"
                } transition-shadow`}>
                  {badge.iconUrl ? (
                    <img src={badge.iconUrl} alt={badge.name} className="h-10 w-10" />
                  ) : (
                    <span>{badge.locked ? "🔒" : "🏆"}</span>
                  )}
                </div>
                <span className="text-xs font-medium text-center text-muted-foreground line-clamp-2">
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
