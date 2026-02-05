import { 
  CollapsibleCard, 
  CollapsibleCardHeader, 
  CollapsibleCardContent 
} from "@/components/ui/collapsible-card";
import { cn } from "@/lib/utils";

interface InfoSection {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

interface CollapsibleInfoSectionProps {
  title?: string;
  subtitle?: string;
  sections: InfoSection[];
  className?: string;
}

export function CollapsibleInfoSection({ 
  title, 
  subtitle, 
  sections, 
  className 
}: CollapsibleInfoSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className="space-y-3">
        {sections.map((section) => (
          <CollapsibleCard key={section.id}>
            <CollapsibleCardHeader>
              <div>
                <h4 className="font-medium text-foreground leading-snug">
                  {section.title}
                </h4>
                {section.subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {section.subtitle}
                  </p>
                )}
              </div>
            </CollapsibleCardHeader>
            <CollapsibleCardContent>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {section.content}
              </div>
            </CollapsibleCardContent>
          </CollapsibleCard>
        ))}
      </div>
    </div>
  );
}
