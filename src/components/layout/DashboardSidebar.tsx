import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
}

interface DashboardSidebarProps {
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  title?: string;
  subtitle?: string;
  headerIcon?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export function DashboardSidebar({
  items,
  activeItem,
  onItemClick,
  title,
  subtitle,
  headerIcon,
  headerAction,
}: DashboardSidebarProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  // Auto-close on mobile, auto-open on desktop when breakpoint changes
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const handleItemClick = (id: string) => {
    onItemClick(id);
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* Toggle Button - always visible */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        className={cn(
          "fixed top-20 z-[60] bg-card border border-border shadow-md hover:bg-accent transition-all duration-300 min-h-11 min-w-11",
          isOpen && !isMobile ? "left-[248px]" : "left-3 md:left-4"
        )}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <button
          aria-label="Close navigation overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-r border-border transition-all duration-300 flex flex-col overflow-hidden",
          isMobile
            ? cn(
                "fixed left-0 top-16 bottom-0 z-50 w-72 max-w-[85vw] shadow-xl",
                isOpen ? "translate-x-0" : "-translate-x-full"
              )
            : cn(
                "sticky top-0 h-[calc(100vh-4rem)]",
                isOpen ? "w-64" : "w-0 border-r-0"
              )
        )}
        aria-hidden={!isOpen}
      >
        <div className={cn("flex flex-col h-full min-w-64", !isOpen && !isMobile && "opacity-0")}>
          {(title || subtitle) && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 mb-1">
                {headerIcon}
                <h2 className="text-lg font-display font-bold text-foreground truncate">
                  {title}
                </h2>
              </div>
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
              )}
              {headerAction && <div className="mt-3">{headerAction}</div>}
            </div>
          )}

          <ScrollArea className="flex-1 py-2">
            <nav className="space-y-1 px-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all min-h-11",
                    "hover:bg-accent hover:text-accent-foreground",
                    activeItem === item.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground"
                  )}
                  aria-current={activeItem === item.id ? "page" : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {item.badge}
                </button>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
