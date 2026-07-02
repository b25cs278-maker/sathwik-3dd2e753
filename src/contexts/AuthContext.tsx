import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "admin" | "student";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string, referralCode?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string, attempt = 0): Promise<UserRole | null> => {
    const MAX_ATTEMPTS = 4;
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching role (attempt ${attempt + 1}):`, error);
      if (attempt < MAX_ATTEMPTS - 1) {
        await new Promise((r) => setTimeout(r, 400 * Math.pow(2, attempt)));
        return fetchUserRole(userId, attempt + 1);
      }
      return "student";
    }
    // Role row may not exist yet right after signup (trigger lag) — retry briefly
    if (!data && attempt < MAX_ATTEMPTS - 1) {
      await new Promise((r) => setTimeout(r, 400 * Math.pow(2, attempt)));
      return fetchUserRole(userId, attempt + 1);
    }
    return (data?.role as UserRole) ?? "student";
  };

  const ensureUserProfile = async (currentUser: User) => {
    const fullName =
      typeof currentUser.user_metadata?.name === "string" && currentUser.user_metadata.name.trim()
        ? currentUser.user_metadata.name.trim()
        : currentUser.email?.split("@")[0] ?? "Learner";

    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: currentUser.id,
          name: fullName,
          email: currentUser.email,
          last_active: new Date().toISOString(),
        } as any,
        { onConflict: "id" }
      );

    if (error) {
      console.error("Error ensuring profile:", error);
    }
  };

  const updateLastActive = async (userId: string) => {
    try {
      await supabase
        .from("profiles")
        .update({ last_active: new Date().toISOString() })
        .eq("id", userId);
    } catch (error) {
      console.error("Error updating last_active:", error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!mounted) return;

        if (error) {
          console.error("Error restoring session:", error);
          await supabase.auth.signOut({ scope: "local" });
          setSession(null);
          setUser(null);
          setRole(null);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await ensureUserProfile(session.user);
          const resolvedRole = await fetchUserRole(session.user.id);
          if (!mounted) return;
          setRole(resolvedRole);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error("Unexpected auth restore error:", error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setRole(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer role fetching and last_active update to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            ensureUserProfile(session.user);
            fetchUserRole(session.user.id).then(setRole);
            // Update last_active on sign in or token refresh
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              updateLastActive(session.user.id);
            }
          }, 0);
        } else {
          setRole(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    loadSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    await supabase.auth.signOut({ scope: "local" });
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (!error && data.user) {
      await ensureUserProfile(data.user);
      const resolvedRole = await fetchUserRole(data.user.id);
      setRole(resolvedRole);
    }
    return { error };
  };

  const signUp = async (email: string, password: string, name: string, referralCode?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const normalizedEmail = email.trim().toLowerCase();
    const metadata: Record<string, string> = { name: name.trim() };
    if (referralCode) {
      metadata.referred_by = referralCode;
    }
    
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });
    if (!error && data.user) {
      await ensureUserProfile(data.user);
      const resolvedRole = await fetchUserRole(data.user.id);
      setRole(resolvedRole);
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
