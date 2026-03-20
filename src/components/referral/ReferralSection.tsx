import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, CheckCircle2, Users, Gift, Link2 } from "lucide-react";
import { toast } from "sonner";

interface ReferralData {
  referralCode: string;
  referralsCount: number;
  validReferrals: number;
  points: number;
  quizCompleted: boolean;
  extraAttemptUnlocked: boolean;
}

export function ReferralSection() {
  const { user } = useAuth();
  const [data, setData] = useState<ReferralData | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) fetchReferralData();
  }, [user]);

  const fetchReferralData = async () => {
    if (!user) return;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code, referrals_count, valid_referrals, points, quiz_completed, extra_attempt_unlocked")
        .eq("id", user.id)
        .single();

      if (profile) {
        setData({
          referralCode: profile.referral_code || "",
          referralsCount: profile.referrals_count || 0,
          validReferrals: profile.valid_referrals || 0,
          points: profile.points || 0,
          quizCompleted: profile.quiz_completed || false,
          extraAttemptUnlocked: profile.extra_attempt_unlocked || false,
        });
      }

      const { data: refs } = await supabase
        .from("referrals")
        .select("*, profiles!referrals_referred_id_fkey(name, email, quiz_completed)")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });
      
      // Fallback: query without join if foreign key doesn't exist
      if (!refs) {
        const { data: refsSimple } = await supabase
          .from("referrals")
          .select("*")
          .eq("referrer_id", user.id)
          .order("created_at", { ascending: false });
        setReferrals(refsSimple || []);
      } else {
        setReferrals(refs || []);
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!data?.referralCode) return;
    const link = `${window.location.origin}/signup?ref=${data.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  // Hide referral section if quiz not completed
  if (!data?.quizCompleted) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Referral Link Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Share2 className="h-5 w-5 text-primary" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share your link to earn points! Each valid referral gives you <strong>+10 points</strong> and unlocks a bonus quiz attempt.
          </p>
          
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-background rounded-lg border px-3 py-2 text-sm font-mono truncate">
              {window.location.origin}/signup?ref={data?.referralCode}
            </div>
            <Button
              onClick={copyReferralLink}
              variant={copied ? "default" : "outline"}
              size="sm"
              className="shrink-0"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="text-center p-3 rounded-lg bg-background border">
              <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="text-xl font-bold">{data?.referralsCount || 0}</p>
              <p className="text-xs text-muted-foreground">Total Referrals</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background border">
              <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-green-500" />
              <p className="text-xl font-bold">{data?.validReferrals || 0}</p>
              <p className="text-xs text-muted-foreground">Valid</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background border">
              <Gift className="h-4 w-4 mx-auto mb-1 text-amber-500" />
              <p className="text-xl font-bold">{data?.points || 0}</p>
              <p className="text-xs text-muted-foreground">Total Points</p>
            </div>
          </div>

          {data?.extraAttemptUnlocked && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Bonus quiz attempt unlocked!
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Referral History */}
      {referrals.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Referral History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {referrals.map((ref) => (
                <div
                  key={ref.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {(ref.profiles as any)?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ref.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      ref.status === "valid"
                        ? "default"
                        : ref.status === "invalid"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {ref.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
