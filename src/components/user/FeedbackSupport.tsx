import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  CollapsibleCard, 
  CollapsibleCardHeader, 
  CollapsibleCardContent 
} from "@/components/ui/collapsible-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, HelpCircle, AlertTriangle, Send, 
  Clock, CheckCircle2, Loader2, Plus
} from "lucide-react";
import { toast } from "sonner";

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  ticket_type: 'feedback' | 'report' | 'support' | 'bug';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  admin_response: string | null;
  created_at: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function FeedbackSupport() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    message: "",
    ticket_type: "feedback" as 'feedback' | 'report' | 'support' | 'bug'
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch FAQs
      const { data: faqData } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      setFaqs((faqData || []) as FAQ[]);

      // Fetch user's tickets if logged in
      if (user) {
        const { data: ticketData } = await supabase
          .from('support_tickets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setTickets((ticketData || []) as SupportTicket[]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTicket = async () => {
    if (!user || !newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('support_tickets').insert({
        user_id: user.id,
        subject: newTicket.subject.trim(),
        message: newTicket.message.trim(),
        ticket_type: newTicket.ticket_type
      });

      if (error) throw error;

      toast.success("Ticket submitted successfully!");
      setShowNewTicket(false);
      setNewTicket({ subject: "", message: "", ticket_type: "feedback" });
      fetchData();
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast.error("Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge variant="outline" className="text-eco-sky border-eco-sky">Open</Badge>;
      case 'in_progress': return <Badge variant="outline" className="text-eco-sun border-eco-sun">In Progress</Badge>;
      case 'resolved': return <Badge variant="default" className="bg-primary">Resolved</Badge>;
      case 'closed': return <Badge variant="secondary">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTicketTypeIcon = (type: string) => {
    switch (type) {
      case 'feedback': return <MessageSquare className="h-4 w-4 text-primary" />;
      case 'report': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'support': return <HelpCircle className="h-4 w-4 text-eco-sky" />;
      case 'bug': return <AlertTriangle className="h-4 w-4 text-eco-sun" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card variant="eco">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="eco">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Help & Support
          </CardTitle>
          <Dialog open={showNewTicket} onOpenChange={setShowNewTicket}>
            <DialogTrigger asChild>
              <Button size="sm" variant="hero">
                <Plus className="h-4 w-4 mr-1" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit a Ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select 
                    value={newTicket.ticket_type} 
                    onValueChange={(v) => setNewTicket(p => ({ ...p, ticket_type: v as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feedback">💬 Feedback</SelectItem>
                      <SelectItem value="report">🚨 Report Fake Activity</SelectItem>
                      <SelectItem value="support">❓ Help Request</SelectItem>
                      <SelectItem value="bug">🐛 Bug Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(p => ({ ...p, subject: e.target.value }))}
                    placeholder="Brief description of your issue..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={newTicket.message}
                    onChange={(e) => setNewTicket(p => ({ ...p, message: e.target.value }))}
                    placeholder="Provide more details..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleSubmitTicket} className="w-full" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Submit Ticket
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="faq">
          <TabsList className="w-full">
            <TabsTrigger value="faq" className="flex-1">FAQs</TabsTrigger>
            <TabsTrigger value="tickets" className="flex-1">
              My Tickets
              {tickets.filter(t => t.status !== 'closed').length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {tickets.filter(t => t.status !== 'closed').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-4">
            <ScrollArea className="h-[300px] pr-2">
              {faqs.length > 0 ? (
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <CollapsibleCard key={faq.id}>
                      <CollapsibleCardHeader className="py-3 px-4">
                        <p className="text-sm font-medium text-foreground leading-snug">
                          {faq.question}
                        </p>
                      </CollapsibleCardHeader>
                      <CollapsibleCardContent className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </CollapsibleCardContent>
                    </CollapsibleCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No FAQs available yet</p>
                  <p className="text-xs mt-1">Submit a ticket if you need help!</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tickets" className="mt-4">
            <ScrollArea className="h-[250px]">
              {tickets.length > 0 ? (
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3 rounded-lg border border-border bg-background"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          {getTicketTypeIcon(ticket.ticket_type)}
                          <div>
                            <p className="text-sm font-medium">{ticket.subject}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {ticket.message}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(ticket.status)}
                      </div>
                      {ticket.admin_response && (
                        <div className="mt-2 p-2 bg-primary/5 rounded-md">
                          <p className="text-xs font-medium text-primary">Admin Response:</p>
                          <p className="text-xs text-muted-foreground">{ticket.admin_response}</p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tickets yet</p>
                  <p className="text-xs mt-1">Create a ticket to get help or send feedback</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
