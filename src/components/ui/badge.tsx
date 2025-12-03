import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        success: "border-transparent bg-eco-leaf/10 text-eco-leaf border-eco-leaf/20",
        warning: "border-transparent bg-eco-sun/10 text-eco-earth border-eco-sun/20",
        info: "border-transparent bg-eco-sky/10 text-eco-sky border-eco-sky/20",
        reward: "border-transparent bg-eco-reward/10 text-eco-reward border-eco-reward/20",
        pending: "border-transparent bg-muted text-muted-foreground",
        easy: "border-transparent bg-eco-leaf/15 text-eco-forest",
        medium: "border-transparent bg-eco-sun/15 text-eco-earth",
        hard: "border-transparent bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
