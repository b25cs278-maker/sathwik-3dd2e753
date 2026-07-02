import { Link } from 'react-router-dom';
import type { UserProfile } from '@/types/profile';
import { Flame, Share2 } from 'lucide-react';

export function ProfileHeader({ profile }: { profile: UserProfile }) {
  const initials = profile.displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mb-8">
      <div className="relative mb-6 h-40 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 via-background to-eco-leaf/20 md:h-48">
        {profile.coverImage && <img src={profile.coverImage} alt="Profile cover" className="absolute inset-0 h-full w-full object-cover" />}
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between -mt-16 px-2 md:px-8 pb-8 gap-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border-4 border-card bg-muted text-3xl font-bold text-primary md:h-32 md:w-32">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.displayName} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="md:pt-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{profile.displayName}</h1>
            <p className="text-base md:text-lg text-muted-foreground">{profile.tagline}</p>
            <div className="flex gap-6 mt-4">
              <div>
                <div className="text-xl md:text-2xl font-bold text-primary">Level {profile.level}</div>
                <div className="text-sm text-muted-foreground">{profile.xp.toLocaleString()} XP</div>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-6 w-6 text-orange-500" />
                <div>
                  <div className="text-xl md:text-2xl font-bold text-foreground">{profile.streak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 md:pt-4">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <Link
            to="/profile/edit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="px-4 md:px-8 py-4 bg-muted/30 rounded-lg border border-border">
        <p className="text-foreground leading-relaxed">{profile.bio}</p>
      </div>
    </div>
  );
}
