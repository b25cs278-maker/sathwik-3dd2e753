import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest } from "@/contexts/GuestContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "student";
  allowGuest?: boolean;
}

export function ProtectedRoute({ children, requiredRole, allowGuest = false }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const { isGuest } = useGuest();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Allow guest access for routes that permit it
  if (!user && allowGuest && isGuest) {
    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
