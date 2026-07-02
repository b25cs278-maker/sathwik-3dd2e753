import { Clock3 } from 'lucide-react';

interface ProfileComingSoonProps {
  title?: string;
  message?: string;
}

export function ProfileComingSoon({
  title = 'Coming soon',
  message = 'This section will appear here when real account data is available.',
}: ProfileComingSoonProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Clock3 className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
    </div>
  );
}