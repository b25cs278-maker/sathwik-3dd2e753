import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Edit3,
  Zap,
  Code,
  Award,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Leaf,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', href: '/profile', icon: Home, exact: true },
  { name: 'Edit Profile', href: '/profile/edit', icon: Edit3 },
  { name: 'Activity', href: '/profile/activity', icon: Zap },
  { name: 'Projects', href: '/profile/projects', icon: Code },
  { name: 'Skills', href: '/profile/skills', icon: Award },
  { name: 'Certificates', href: '/profile/certificates', icon: Award },
  { name: 'Connections', href: '/profile/connections', icon: Users },
  { name: 'Analytics', href: '/profile/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/profile/settings', icon: Settings },
];

export function ProfileNav() {
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="md:sticky md:top-16 md:h-[calc(100vh-4rem)] w-full md:w-64 border-r border-border bg-card p-4 md:p-6 flex md:flex-col flex-row overflow-x-auto md:overflow-y-auto">
      <Link to="/profile" className="hidden md:flex mb-10 items-center gap-2">
        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-foreground">NexusCraft Profile</span>
      </Link>

      <div className="flex md:flex-col md:space-y-1 gap-1 flex-1 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap text-sm font-medium',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <button
        onClick={async () => {
          await signOut();
          navigate('/');
        }}
        className="hidden md:flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors w-full text-sm font-medium mt-2"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </nav>
  );
}
