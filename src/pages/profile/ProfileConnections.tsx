import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { ProfileComingSoon } from '@/components/profile/ProfileComingSoon';

export default function ProfileConnections() {
  return (
    <ProfileLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Connections</h1>
          <p className="text-muted-foreground">Build your network</p>
        </div>
        <ProfileComingSoon message="Your real learner connections will appear here when the network data is connected." />
      </div>
    </ProfileLayout>
  );
}
