import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, PanelLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [hidden, setHidden] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // When hidden, show only a floating toggle button
  if (hidden) {
    return (
      <div className="sticky top-0 h-[calc(100vh-4rem)] flex items-start pt-4 pl-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setHidden(false)}
              className="bg-card shadow-md border-border"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Show sidebar</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "sticky top-0 h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      {!collapsed && (title || subtitle) && (
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

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-1 px-2">
          {items.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onItemClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    "hover:bg-accent hover:text-accent-foreground",
                    activeItem === item.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1 text-left">{item.label}</span>
                      {item.badge}
                    </>
                  )}
                </button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>
      </ScrollArea>

      {/* Collapse & Hide Controls */}
      <div className="p-2 border-t border-border flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="flex-1 justify-center"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHidden(true)}
              className="justify-center"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hide sidebar</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}
