import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Plus, Zap, Trash2 } from 'lucide-react';
import { ExecutionRule } from '@/hooks/useLocalStorage';

interface ExecutionRulesPanelProps {
  rules: ExecutionRule[];
  onUpdateRules: (rules: ExecutionRule[]) => void;
}

const defaultRules: ExecutionRule[] = [
  { id: '1', rule: 'No social media before deep work', active: true },
  { id: '2', rule: 'Read your calendar as a command', active: true },
  { id: '3', rule: 'Move toward goals every day', active: true },
  { id: '4', rule: 'Phone in another room during focus', active: false },
];

export function ExecutionRulesPanel({ rules, onUpdateRules }: ExecutionRulesPanelProps) {
  const [newRule, setNewRule] = useState('');
  const [showInput, setShowInput] = useState(false);

  const displayRules = rules.length > 0 ? rules : defaultRules;

  const handleAddRule = () => {
    if (!newRule.trim()) return;
    const rule: ExecutionRule = {
      id: crypto.randomUUID(),
      rule: newRule,
      active: true,
    };
    onUpdateRules([...displayRules, rule]);
    setNewRule('');
    setShowInput(false);
  };

  const handleToggleRule = (id: string) => {
    onUpdateRules(
      displayRules.map(r => r.id === id ? { ...r, active: !r.active } : r)
    );
  };

  const handleDeleteRule = (id: string) => {
    onUpdateRules(displayRules.filter(r => r.id !== id));
  };

  const activeCount = displayRules.filter(r => r.active).length;

  return (
    <Card className="eco-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-eco-sun" />
            Execution Rules
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowInput(!showInput)}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          {activeCount} rules active • Follow these to win the day
        </p>

        {showInput && (
          <div className="flex gap-2">
            <Input
              placeholder="Add a rule..."
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddRule()}
              className="flex-1"
            />
            <Button onClick={handleAddRule} size="sm">Add</Button>
          </div>
        )}

        <div className="space-y-2">
          {displayRules.map((rule) => (
            <div 
              key={rule.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                rule.active ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Switch
                  checked={rule.active}
                  onCheckedChange={() => handleToggleRule(rule.id)}
                />
                <span className={`text-sm ${rule.active ? 'font-medium' : 'line-through'}`}>
                  {rule.rule}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => handleDeleteRule(rule.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
