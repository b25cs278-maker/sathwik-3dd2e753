import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CollapsibleCardProps {
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

interface CollapsibleCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CollapsibleCardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CollapsibleCardContext = React.createContext<{
  isOpen: boolean;
  toggle: () => void;
} | null>(null);

const useCollapsibleCard = () => {
  const context = React.useContext(CollapsibleCardContext);
  if (!context) {
    throw new Error("CollapsibleCard components must be used within a CollapsibleCard");
  }
  return context;
};

const CollapsibleCard = React.forwardRef<HTMLDivElement, CollapsibleCardProps>(
  ({ children, className, defaultOpen = false }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    const toggle = React.useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    return (
      <CollapsibleCardContext.Provider value={{ isOpen, toggle }}>
        <motion.div
          ref={ref}
          onClick={toggle}
          className={cn(
            "rounded-xl border bg-card text-card-foreground cursor-pointer select-none",
            "transition-all duration-200 ease-out",
            "hover:bg-accent/50 active:scale-[0.99]",
            "touch-manipulation",
            isOpen && "ring-1 ring-primary/20 bg-accent/30",
            className
          )}
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          layout
        >
          {children}
        </motion.div>
      </CollapsibleCardContext.Provider>
    );
  }
);
CollapsibleCard.displayName = "CollapsibleCard";

const CollapsibleCardHeader = React.forwardRef<HTMLDivElement, CollapsibleCardHeaderProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-4 sm:p-6", className)}
      >
        {children}
      </div>
    );
  }
);
CollapsibleCardHeader.displayName = "CollapsibleCardHeader";

const CollapsibleCardContent = React.forwardRef<HTMLDivElement, CollapsibleCardContentProps>(
  ({ children, className }, ref) => {
    const { isOpen } = useCollapsibleCard();

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            ref={ref}
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              transition: {
                height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.2, delay: 0.1 }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.15 }
              }
            }}
            className="overflow-hidden"
          >
            <div className={cn("px-4 pb-4 sm:px-6 sm:pb-6 pt-0", className)}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
CollapsibleCardContent.displayName = "CollapsibleCardContent";

export { CollapsibleCard, CollapsibleCardHeader, CollapsibleCardContent, useCollapsibleCard };
