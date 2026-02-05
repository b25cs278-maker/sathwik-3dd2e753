import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CollapsibleCardGroupContextValue {
  openCardId: string | null;
  setOpenCardId: (id: string | null) => void;
}

const CollapsibleCardGroupContext = React.createContext<CollapsibleCardGroupContextValue | null>(null);

interface CollapsibleCardGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function CollapsibleCardGroup({ children, className }: CollapsibleCardGroupProps) {
  const [openCardId, setOpenCardId] = React.useState<string | null>(null);

  return (
    <CollapsibleCardGroupContext.Provider value={{ openCardId, setOpenCardId }}>
      <div className={className}>
        {children}
      </div>
    </CollapsibleCardGroupContext.Provider>
  );
}

interface AccordionCardProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function AccordionCard({ id, children, className }: AccordionCardProps) {
  const context = React.useContext(CollapsibleCardGroupContext);
  
  if (!context) {
    throw new Error("AccordionCard must be used within a CollapsibleCardGroup");
  }

  const { openCardId, setOpenCardId } = context;
  const isOpen = openCardId === id;

  const handleClick = () => {
    setOpenCardId(isOpen ? null : id);
  };

  return (
    <motion.div
      onClick={handleClick}
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
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ isOpen?: boolean }>, { isOpen });
        }
        return child;
      })}
    </motion.div>
  );
}

interface AccordionCardHeaderProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
}

export function AccordionCardHeader({ children, className }: AccordionCardHeaderProps) {
  return (
    <div className={cn("p-4 sm:p-6", className)}>
      {children}
    </div>
  );
}

interface AccordionCardContentProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
}

export function AccordionCardContent({ children, className, isOpen }: AccordionCardContentProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
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
