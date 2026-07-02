import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="mb-3 text-4xl font-bold text-foreground">Coming soon</h1>
        <p className="mb-6 text-muted-foreground">
          This page is not available yet. It will appear here when the feature is ready.
        </p>
        <Link to="/student/dashboard" className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground hover:opacity-90">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
