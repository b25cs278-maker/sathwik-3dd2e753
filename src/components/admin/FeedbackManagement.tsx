import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, AlertCircle, CheckCircle2, Clock,
  ThumbsUp, ThumbsDown, Reply, Trash2, Flag
} from "lucide-react";
import { toast } from "sonner";

interface Feedback {
  id: string;
  type: 'feedback' | 'complaint' | 'suggestion' | 'bug';
  subject: string;
  message: string;
  author: string;
  authorEmail: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  response?: string;
}

export function FeedbackManagement() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([
    {
      id: '1',
      type: 'feedback',
      subject: 'Great app for learning!',
      message: 'I love how the app gamifies environmental learning. My kids are now more interested in recycling.',
      author: 'Sunita Devi',
      authorEmail: 'sunita@example.com',
      status: 'open',
      priority: 'low',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      type: 'complaint',
      subject: 'Photo upload not working',
      message: 'I tried to upload my task completion photo but the app shows an error. Please fix this urgently.',
      author: 'Rajesh Kumar',
      authorEmail: 'rajesh@example.com',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      type: 'suggestion',
      subject: 'Add more local language support',
      message: 'It would be great if the app supported Tamil and Telugu languages for better accessibility.',
      author: 'Priya Rajan',
      authorEmail: 'priya@example.com',
      status: 'open',
      priority: 'medium',
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      type: 'bug',
      subject: 'Points not updating after task approval',
      message: 'My task was approved but points did not reflect in my account. Task ID: T-123',
      author: 'Amit Shah',
      authorEmail: 'amit@example.com',
      status: 'resolved',
      priority: 'high',
      createdAt: new Date().toISOString(),
      response: 'Issue has been fixed. Your points have been credited.'
    }
  ]);

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [responseText, setResponseText] = useState("");

  const handleStatusChange = (id: string, newStatus: Feedback['status']) => {
    setFeedbackList(prev => prev.map(f => 
      f.id === id ? { ...f, status: newStatus } : f
    ));
    toast.success(`Status updated to ${newStatus}`);
  };

  const handleRespond = (id: string) => {
    if (!responseText.trim()) {
      toast.error('Please enter a response');
      return;
    }

    setFeedbackList(prev => prev.map(f => 
      f.id === id ? { ...f, response: responseText, status: 'resolved' } : f
    ));
    setResponseText("");
    setSelectedFeedback(null);
    toast.success('Response sent');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this feedback?')) return;
    setFeedbackList(prev => prev.filter(f => f.id !== id));
    toast.success('Feedback deleted');
  };

  const getTypeBadge = (type: Feedback['type']) => {
    const config = {
      feedback: { color: 'bg-primary', icon: ThumbsUp },
      complaint: { color: 'bg-destructive', icon: AlertCircle },
      suggestion: { color: 'bg-eco-sky', icon: MessageSquare },
      bug: { color: 'bg-eco-sun', icon: Flag }
    };
    const { color, icon: Icon } = config[type];
    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {type}
      </Badge>
    );
  };

  const getStatusBadge = (status: Feedback['status']) => {
    const config = {
      open: { variant: 'secondary' as const, icon: Clock },
      'in-progress': { variant: 'outline' as const, icon: Clock },
      resolved: { variant: 'default' as const, icon: CheckCircle2 },
      closed: { variant: 'secondary' as const, icon: CheckCircle2 }
    };
    const { variant, icon: Icon } = config[status];
    return (
      <Badge variant={variant}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Feedback['priority']) => {
    const colors = {
      low: 'bg-muted text-muted-foreground',
      medium: 'bg-eco-sun/20 text-eco-sun',
      high: 'bg-destructive/20 text-destructive'
    };
    return <Badge className={colors[priority]}>{priority}</Badge>;
  };

  const openFeedback = feedbackList.filter(f => f.status === 'open' || f.status === 'in-progress');
  const resolvedFeedback = feedbackList.filter(f => f.status === 'resolved' || f.status === 'closed');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Feedback & Issue Management</h2>
        <p className="text-muted-foreground">Handle user feedback, complaints, and suggestions</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Feedback</p>
                <p className="text-2xl font-bold">{feedbackList.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-eco-sun/10">
                <Clock className="h-6 w-6 text-eco-sun" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold">{openFeedback.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{resolvedFeedback.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold">
                  {feedbackList.filter(f => f.priority === 'high' && f.status !== 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">
            Open ({openFeedback.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-6 space-y-4">
          {openFeedback.map((feedback) => (
            <Card key={feedback.id} variant="eco">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{feedback.subject}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feedback.author} ({feedback.authorEmail})
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(feedback.priority)}
                      {getTypeBadge(feedback.type)}
                      {getStatusBadge(feedback.status)}
                    </div>
                  </div>

                  <p className="text-muted-foreground">{feedback.message}</p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(feedback.id, 'in-progress')}
                        disabled={feedback.status === 'in-progress'}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        In Progress
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => setSelectedFeedback(feedback)}
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        Respond
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(feedback.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {selectedFeedback?.id === feedback.id && (
                    <div className="pt-4 border-t space-y-3">
                      <Textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Write your response..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => handleRespond(feedback.id)}>
                          Send Response
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedFeedback(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {openFeedback.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No open feedback</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="mt-6 space-y-4">
          {resolvedFeedback.map((feedback) => (
            <Card key={feedback.id} variant="eco">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{feedback.subject}</h3>
                      <p className="text-sm text-muted-foreground">{feedback.author}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(feedback.type)}
                      {getStatusBadge(feedback.status)}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{feedback.message}</p>
                  {feedback.response && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm font-medium mb-1">Response:</p>
                      <p className="text-sm text-muted-foreground">{feedback.response}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
