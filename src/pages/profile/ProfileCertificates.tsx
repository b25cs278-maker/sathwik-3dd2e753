import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { ProfileComingSoon } from '@/components/profile/ProfileComingSoon';

export default function ProfileCertificates() {
  return (
    <ProfileLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Certificates</h1>
            <p className="text-muted-foreground">Your verified credentials</p>
          </div>
        </div>
        <ProfileComingSoon message="Certificates will show here after verified certificate data is connected." />
      </div>
    </ProfileLayout>
  );
}
