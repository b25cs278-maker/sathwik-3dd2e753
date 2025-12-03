import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Gift, Check } from "lucide-react";

export interface Reward {
  id: string;
  name: string;
  description: string;
  costPoints: number;
  imageUrl?: string;
  stock?: number;
  category?: string;
  redeemed?: boolean;
}

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onRedeem?: (rewardId: string) => void;
}

export function RewardCard({ reward, userPoints, onRedeem }: RewardCardProps) {
  const canAfford = userPoints >= reward.costPoints;
  const outOfStock = reward.stock !== undefined && reward.stock <= 0;

  return (
    <Card variant="eco" className="overflow-hidden group">
      {reward.imageUrl && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={reward.imageUrl}
            alt={reward.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
          {reward.category && (
            <Badge variant="secondary" className="absolute top-3 left-3">
              {reward.category}
            </Badge>
          )}
        </div>
      )}

      <CardHeader className={reward.imageUrl ? "pt-4" : ""}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-lg text-foreground line-clamp-2">
            {reward.name}
          </h3>
          {reward.redeemed && (
            <Badge variant="success">
              <Check className="h-3 w-3 mr-1" />
              Redeemed
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {reward.description}
        </p>
        {reward.stock !== undefined && !outOfStock && (
          <p className="text-xs text-muted-foreground mt-2">
            {reward.stock} remaining
          </p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Zap className="h-5 w-5 text-eco-sun" />
          <span className="font-bold text-foreground">{reward.costPoints}</span>
          <span className="text-sm text-muted-foreground">points</span>
        </div>
        
        {reward.redeemed ? (
          <Button variant="secondary" size="sm" disabled>
            <Gift className="h-4 w-4 mr-2" />
            Claimed
          </Button>
        ) : outOfStock ? (
          <Button variant="secondary" size="sm" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button
            variant={canAfford ? "reward" : "secondary"}
            size="sm"
            disabled={!canAfford}
            onClick={() => onRedeem?.(reward.id)}
          >
            <Gift className="h-4 w-4 mr-2" />
            {canAfford ? "Redeem" : `Need ${reward.costPoints - userPoints} more`}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
