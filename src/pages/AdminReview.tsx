import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  CheckCircle2, XCircle, AlertTriangle, Eye, Star,
  MapPin, Clock, Camera, User, Loader2, Bot
} from "lucide-react";
import { toast } from "sonner";

interface Submission {
  id: string;
  task_id: string;
  user_id: string;
  status: string;
  photos: any;
  location_lat: number | null;
  location_lng: number | null;
  metadata: any;
  created_at: string;
  ai_verification_score: number | null;
  ai_verification_notes: string | null;
  ai_flagged: boolean | null;
  tasks?: {
    title: string;
    description: string;
    category: string;
    points: number;
    location_lat: number | null;
    location_lng: number | null;
  };
  profiles?: {
    name: string;
    email: string;
  };
}

export default function AdminReview() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [pointsToAward, setPointsToAward] = useState(0);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (role !== 'admin') {
      toast.error('Admin access required');
      navigate('/');
      return;
    }
    fetchSubmissions();
  }, [role, navigate]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('task_submissions')
        .select(`
          *,
          tasks (title, description, category, points, location_lat, location_lng),
          profiles!task_submissions_user_id_fkey (name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setPointsToAward(submission.tasks?.points || 0);
    setReviewNotes("");
    setReviewDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedSubmission || !user) return;

    setProcessing(true);
    try {
      const { error } = await supabase.rpc('award_submission_points', {
        p_submission_id: selectedSubmission.id,
        p_points: pointsToAward,
        p_reviewer_id: user.id
      });

      if (error) throw error;

      // Update review notes
      await supabase
        .from('task_submissions')
        .update({ review_notes: reviewNotes })
        .eq('id', selectedSubmission.id);

      toast.success(`Approved! ${pointsToAward} points awarded.`);
      setReviewDialogOpen(false);
      fetchSubmissions();
    } catch (error) {
      console.error('Approval error:', error);
      toast.error('Failed to approve submission');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission || !user) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('task_submissions')
        .update({
          status: 'rejected',
          reviewer_id: user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes
        })
        .eq('id', selectedSubmission.id);

      if (error) throw error;

      toast.success('Submission rejected');
      setReviewDialogOpen(false);
      fetchSubmissions();
    } catch (error) {
      console.error('Rejection error:', error);
      toast.error('Failed to reject submission');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-primary">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAIScoreBadge = (score: number | null) => {
    if (score === null) return null;
    
    if (score >= 80) {
      return <Badge className="bg-green-500">AI Score: {score}</Badge>;
    } else if (score >= 50) {
      return <Badge className="bg-yellow-500">AI Score: {score}</Badge>;
    } else {
      return <Badge variant="destructive">AI Score: {score}</Badge>;
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (activeTab === "pending") return s.status === "pending";
    if (activeTab === "flagged") return s.ai_flagged === true;
    if (activeTab === "approved") return s.status === "approved";
    if (activeTab === "rejected") return s.status === "rejected";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Admin Review
          </h1>
          <p className="text-muted-foreground">
            Review and approve task submissions with AI-assisted verification
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <Card variant="eco">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{submissions.filter(s => s.status === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card variant="eco">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{submissions.filter(s => s.ai_flagged).length}</p>
                <p className="text-sm text-muted-foreground">Flagged</p>
              </div>
            </CardContent>
          </Card>
          <Card variant="eco">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{submissions.filter(s => s.status === 'approved').length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card variant="eco">
            <CardContent className="p-4 flex items-center gap-3">
              <XCircle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{submissions.filter(s => s.status === 'rejected').length}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              Pending ({submissions.filter(s => s.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="flagged">
              Flagged ({submissions.filter(s => s.ai_flagged).length})
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredSubmissions.length > 0 ? (
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <Card key={submission.id} variant="eco">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Photos */}
                        <div className="flex gap-2 flex-wrap lg:w-1/3">
                          {submission.photos?.slice(0, 3).map((photo: string, idx: number) => (
                            <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                              <img
                                src={photo}
                                alt={`Submission ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-lg">{submission.tasks?.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {submission.tasks?.category} • {submission.tasks?.points} points
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(submission.status)}
                              {submission.ai_flagged && (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Flagged
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{submission.profiles?.name || submission.profiles?.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(submission.created_at).toLocaleString()}</span>
                            </div>
                            {submission.location_lat && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>GPS captured</span>
                              </div>
                            )}
                          </div>

                          {/* AI Verification */}
                          {submission.ai_verification_score !== null && (
                            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                              <div className="flex items-center gap-2">
                                <Bot className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">AI Verification</span>
                                {getAIScoreBadge(submission.ai_verification_score)}
                              </div>
                              {submission.ai_verification_notes && (
                                <p className="text-sm text-muted-foreground">
                                  {submission.ai_verification_notes}
                                </p>
                              )}
                            </div>
                          )}

                          {submission.status === 'pending' && (
                            <Button onClick={() => handleReviewClick(submission)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No submissions in this category</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
            <DialogDescription>
              Review the evidence and decide whether to approve or reject
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6 py-4">
              {/* Task Info */}
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-semibold mb-1">{selectedSubmission.tasks?.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedSubmission.tasks?.description}
                </p>
              </div>

              {/* Photos */}
              <div>
                <label className="text-sm font-medium mb-2 block">Submitted Photos</label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedSubmission.photos?.map((photo: string, idx: number) => (
                    <a key={idx} href={photo} target="_blank" rel="noopener noreferrer">
                      <img
                        src={photo}
                        alt={`Evidence ${idx + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                    </a>
                  ))}
                </div>
              </div>

              {/* AI Verification */}
              {selectedSubmission.ai_verification_score !== null && (
                <div className={`p-4 rounded-lg ${selectedSubmission.ai_flagged ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-5 w-5" />
                    <span className="font-medium">AI Analysis</span>
                    {getAIScoreBadge(selectedSubmission.ai_verification_score)}
                  </div>
                  <p className="text-sm">{selectedSubmission.ai_verification_notes}</p>
                </div>
              )}

              {/* Points */}
              <div>
                <label className="text-sm font-medium mb-2 block">Points to Award</label>
                <Input
                  type="number"
                  value={pointsToAward}
                  onChange={(e) => setPointsToAward(parseInt(e.target.value) || 0)}
                  min={0}
                  max={selectedSubmission.tasks?.points ? selectedSubmission.tasks.points * 2 : 100}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Base task points: {selectedSubmission.tasks?.points}
                </p>
              </div>

              {/* Review Notes */}
              <div>
                <label className="text-sm font-medium mb-2 block">Review Notes</label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Optional notes about this review..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={processing}>
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
              Reject
            </Button>
            <Button variant="hero" onClick={handleApprove} disabled={processing}>
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}