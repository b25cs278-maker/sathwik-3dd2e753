import { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ProfileNav } from './ProfileNav';

export function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-col md:flex-row flex-1">
        <ProfileNav />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
