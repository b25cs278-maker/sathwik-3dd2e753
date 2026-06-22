import { WifiOff } from "lucide-react";

export function OfflineBanner({ className = "" }: { className?: string }) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive ${className}`}
    >
      <WifiOff className="h-4 w-4 mt-0.5 shrink-0" />
      <div>
        <p className="font-medium">You're offline</p>
        <p className="text-xs opacity-90">
          Check your internet connection. We'll let you retry as soon as you're back online.
        </p>
      </div>
    </div>
  );
}
