import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { ProfileComingSoon } from '@/components/profile/ProfileComingSoon';

export default function ProfileProjects() {
  return (
    <ProfileLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">Your portfolio of work</p>
        </div>
        <ProfileComingSoon message="Project uploads and portfolio cards will appear here when real project data is available." />
      </div>
    </ProfileLayout>
  );
}
