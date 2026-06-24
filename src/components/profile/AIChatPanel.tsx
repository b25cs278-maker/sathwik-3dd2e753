import { Sparkles } from 'lucide-react';
import type { AIInsight } from '@/types/profile';

export function AIChatPanel({ insights }: { insights: AIInsight[] }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-foreground">AI Insights</h2>
      </div>
      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-3 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex gap-3">
              <div className="text-2xl flex-shrink-0">{insight.icon}</div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground text-sm mb-1">{insight.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
        <p>Powered by AI • Personalized for you</p>
      </div>
    </div>
  );
}
