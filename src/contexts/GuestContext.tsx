import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface GuestContextType {
  isGuest: boolean;
  enableGuestMode: () => void;
  disableGuestMode: () => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestProvider({ children }: { children: ReactNode }) {
  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem("guestMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("guestMode", isGuest.toString());
  }, [isGuest]);

  const enableGuestMode = () => setIsGuest(true);
  const disableGuestMode = () => {
    setIsGuest(false);
    localStorage.removeItem("guestMode");
  };

  return (
    <GuestContext.Provider value={{ isGuest, enableGuestMode, disableGuestMode }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error("useGuest must be used within a GuestProvider");
  }
  return context;
}
