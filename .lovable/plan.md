## Goal
Bring the full profile ecosystem from `ecol-earn-ecosystem-build/` (a Next.js App Router project) into this Vite + React Router app at `/profile/*`, reachable from the existing Profile entry points, without disturbing any current routes, auth, or features.

## Scope inventory (source → target)
From `ecol-earn-ecosystem-build/`:

Pages (Next `app/profile/*/page.tsx`) → React Router pages under `src/pages/profile/`:
- `page.tsx` → `Profile.tsx` (overview/dashboard)
- `edit/page.tsx` → `ProfileEdit.tsx`
- `activity/page.tsx` → `ProfileActivity.tsx`
- `projects/page.tsx` → `ProfileProjects.tsx`
- `skills/page.tsx` → `ProfileSkills.tsx`
- `certificates/page.tsx` → `ProfileCertificates.tsx`
- `connections/page.tsx` → `ProfileConnections.tsx`
- `analytics/page.tsx` → `ProfileAnalytics.tsx`
- `settings/page.tsx` → `ProfileSettings.tsx`
- `public/[username]/page.tsx` → `ProfilePublic.tsx` (route `/u/:username`)

Components → `src/components/profile/`:
- `ProfileLayout.tsx`, `ProfileNav.tsx`, `ProfileHeader.tsx`, `AIChatPanel.tsx`, `ProjectCard.tsx`, `SkillCard.tsx`
- `forms/EditProfileForm.tsx`, `forms/AddSkillForm.tsx`

Supporting:
- `lib/types.ts` → `src/types/profile.ts`
- `lib/mock-data.ts` → `src/data/profileMockData.ts` (used only as fallback for sections without backend tables yet)
- `lib/ai-insights.ts` → `src/lib/profile/aiInsights.ts`

## Adaptations (Next → Vite/React Router)
- Replace `next/link` → `react-router-dom` `Link`, `usePathname` → `useLocation`, `next/navigation` `useRouter` → `useNavigate`.
- Strip `'use server'` actions and `app/api/*` routes. Replace data fetching with:
  - Existing Supabase `profiles` table for the core user fields (name, email, points, avatar_url, last_active, referral data already present).
  - Mock-data fallback (kept locally) for sections without a backing table yet: skills, projects, certificates, activity timeline, analytics charts, connections suggestions. Clearly marked as demo placeholders so future backend work can replace them table by table. (Avoids creating ~8 new tables for this single request.)
- Remove `'use client'` directives (all components are client by default in Vite).
- Replace Tailwind v4 `bg-card`/`text-foreground` tokens (already match this project's shadcn tokens, so 1:1).
- Swap `lucide-react` icons (already a dep in this project).

## Integration points
- **Routing** (`src/App.tsx`): add nested routes under `/profile` wrapped in `ProtectedRoute`:
  - `/profile` (overview)
  - `/profile/edit`, `/profile/activity`, `/profile/projects`, `/profile/skills`, `/profile/certificates`, `/profile/connections`, `/profile/analytics`, `/profile/settings`
  - Public route `/u/:username` (no auth guard)
- **Entry points**:
  - `DashboardSidebar.tsx`: add a "Profile" item linking to `/profile`.
  - `Navbar.tsx`: add avatar/profile menu item linking to `/profile` (only when signed in).
- **Auth/user data**: `ProfileHeader` and overview read from `useAuth()` + a single `profiles` SELECT (id, name, email, avatar_url, points, referral_code, last_active, created_at). Edit form writes back to `profiles` with allowed columns only.
- **Design system**: keep ecol layout (left rail `ProfileNav` 64-wide), but reuse this app's shadcn primitives (`Card`, `Button`, `Input`, `Tabs`, `Avatar`, `Badge`, `Progress`) so the visual language matches the rest of the dashboard. The existing `DashboardSidebar` stays as the global nav; the profile rail becomes a secondary in-page nav inside `/profile/*`.

## Out of scope (explicitly preserved untouched)
- Auth flow, landing page, learning tracks, tasks, productivity, admin pages.
- No schema migrations in this pass. Mock-data placeholders are isolated and labeled so they can be swapped for real tables later without rewiring the UI.

## File plan
Create:
- `src/types/profile.ts`
- `src/data/profileMockData.ts`
- `src/lib/profile/aiInsights.ts`
- `src/components/profile/{ProfileLayout,ProfileNav,ProfileHeader,AIChatPanel,ProjectCard,SkillCard}.tsx`
- `src/components/profile/forms/{EditProfileForm,AddSkillForm}.tsx`
- `src/pages/profile/{Profile,ProfileEdit,ProfileActivity,ProfileProjects,ProfileSkills,ProfileCertificates,ProfileConnections,ProfileAnalytics,ProfileSettings,ProfilePublic}.tsx`

Edit:
- `src/App.tsx` (add routes)
- `src/components/layout/DashboardSidebar.tsx` (add Profile link)
- `src/components/layout/Navbar.tsx` (add Profile link when signed in)

## Verification
- Typecheck passes (handled by harness).
- Manual: click sidebar "Profile" → overview loads with current user's name/email/points/avatar; navigate each sub-tab; edit form save updates `profiles` row; public route `/u/:username` resolves by `profiles.name` lookup (or shows not-found).
- Responsive: profile rail collapses to top tabs under `md`.
