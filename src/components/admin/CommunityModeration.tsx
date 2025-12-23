import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Lightbulb, Check, X, Star, MessageSquare, Flag, 
  ThumbsUp, Eye, Trash2
} from "lucide-react";
import { toast } from "sonner";

interface InnovationPost {
  id: string;
  title: string;
  description: string;
  author: string;
  status: 'pending' | 'approved' | 'featured' | 'rejected';
  likes: number;
  comments: number;
  createdAt: string;
}

interface ReportedContent {
  id: string;
  type: 'post' | 'comment';
  content: string;
  reportedBy: string;
  reason: string;
  createdAt: string;
}

export function CommunityModeration() {
  const [posts, setPosts] = useState<InnovationPost[]>([
    {
      id: '1',
      title: 'Solar-Powered Water Purifier for Villages',
      description: 'A low-cost water purification system using solar energy, designed for rural areas without electricity access.',
      author: 'Rahul Kumar',
      status: 'pending',
      likes: 45,
      comments: 12,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Biodegradable Packaging from Banana Leaves',
      description: 'Using treated banana leaves as eco-friendly packaging alternative to plastic.',
      author: 'Priya Singh',
      status: 'pending',
      likes: 89,
      comments: 23,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Community Composting App',
      description: 'Mobile app connecting neighbors to share composting resources and tips.',
      author: 'Amit Sharma',
      status: 'approved',
      likes: 156,
      comments: 45,
      createdAt: new Date().toISOString()
    }
  ]);

  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([
    {
      id: '1',
      type: 'comment',
      content: 'This is spam content promoting unrelated products...',
      reportedBy: 'User123',
      reason: 'Spam',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      type: 'post',
      content: 'Misleading environmental claims without sources...',
      reportedBy: 'EcoWarrior',
      reason: 'Misinformation',
      createdAt: new Date().toISOString()
    }
  ]);

  const handlePostAction = (postId: string, action: 'approve' | 'feature' | 'reject') => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newStatus = action === 'feature' ? 'featured' : action === 'approve' ? 'approved' : 'rejected';
        return { ...p, status: newStatus };
      }
      return p;
    }));
    toast.success(`Post ${action}ed successfully`);
  };

  const handleRemoveReport = (reportId: string, action: 'dismiss' | 'remove') => {
    setReportedContent(prev => prev.filter(r => r.id !== reportId));
    toast.success(action === 'dismiss' ? 'Report dismissed' : 'Content removed');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-primary">Approved</Badge>;
      case 'featured':
        return <Badge className="bg-eco-sun">Featured</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingPosts = posts.filter(p => p.status === 'pending');
  const approvedPosts = posts.filter(p => p.status === 'approved' || p.status === 'featured');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Community & Innovation</h2>
        <p className="text-muted-foreground">Moderate innovation posts and community content</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-eco-sun/10">
                <Lightbulb className="h-6 w-6 text-eco-sun" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{pendingPosts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{approvedPosts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-eco-sun/10">
                <Star className="h-6 w-6 text-eco-sun" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Featured</p>
                <p className="text-2xl font-bold">{posts.filter(p => p.status === 'featured').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <Flag className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reports</p>
                <p className="text-2xl font-bold">{reportedContent.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review ({pendingPosts.length})
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="reports">
            Reports
            {reportedContent.length > 0 && (
              <Badge className="ml-2" variant="destructive">{reportedContent.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {pendingPosts.map((post) => (
            <Card key={post.id} variant="eco">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-eco-sun" />
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">by {post.author}</p>
                      </div>
                      {getStatusBadge(post.status)}
                    </div>
                    <p className="text-muted-foreground">{post.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                  <div className="flex lg:flex-col gap-2">
                    <Button size="sm" onClick={() => handlePostAction(post.id, 'feature')}>
                      <Star className="h-4 w-4 mr-1" />
                      Feature
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handlePostAction(post.id, 'approve')}>
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handlePostAction(post.id, 'reject')}>
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {pendingPosts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No pending posts to review</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6 space-y-4">
          {approvedPosts.map((post) => (
            <Card key={post.id} variant="eco">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      {post.status === 'featured' && <Star className="h-4 w-4 text-eco-sun" />}
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">by {post.author}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(post.status)}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reports" className="mt-6 space-y-4">
          {reportedContent.map((report) => (
            <Card key={report.id} variant="eco" className="border-destructive/20">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-destructive" />
                      <Badge variant="outline">{report.type}</Badge>
                      <Badge variant="destructive">{report.reason}</Badge>
                    </div>
                    <p className="text-muted-foreground">{report.content}</p>
                    <p className="text-sm text-muted-foreground">
                      Reported by: {report.reportedBy} • {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleRemoveReport(report.id, 'dismiss')}>
                      <Eye className="h-4 w-4 mr-1" />
                      Dismiss
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRemoveReport(report.id, 'remove')}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {reportedContent.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Flag className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No reported content</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
