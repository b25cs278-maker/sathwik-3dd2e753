import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, AlertCircle, CheckCircle2, Clock,
  ThumbsUp, Flag, Reply, Trash2, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  ticket_type: string;
  status: string;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
}

export function FeedbackManagement() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responseText, setResponseText] = useState("");
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // Fetch tickets
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;

      if (ticketsData && ticketsData.length > 0) {
        // Fetch user profiles for the tickets
        const userIds = [...new Set(ticketsData.map(t => t.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        const enrichedTickets = ticketsData.map(ticket => ({
          ...ticket,
          user_name: profileMap.get(ticket.user_id)?.name || 'Unknown User',
          user_email: profileMap.get(ticket.user_id)?.email || 'No email'
        }));

        setTickets(enrichedTickets);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setTickets(prev => prev.map(t => 
        t.id === id ? { ...t, status: newStatus } : t
      ));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleRespond = async (id: string) => {
    if (!responseText.trim()) {
      toast.error('Please enter a response');
      return;
    }

    setResponding(true);
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ 
          admin_response: responseText, 
          status: 'resolved',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setTickets(prev => prev.map(t => 
        t.id === id ? { ...t, admin_response: responseText, status: 'resolved' } : t
      ));
      setResponseText("");
      setSelectedTicket(null);
      toast.success('Response sent successfully');
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    } finally {
      setResponding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
      const { error } = await supabase
        .from('support_tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTickets(prev => prev.filter(t => t.id !== id));
      toast.success('Ticket deleted');
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Failed to delete ticket');
    }
  };

  const getTypeBadge = (type: string) => {
    const config: Record<string, { color: string; icon: typeof ThumbsUp }> = {
      feedback: { color: 'bg-primary', icon: ThumbsUp },
      complaint: { color: 'bg-destructive', icon: AlertCircle },
      suggestion: { color: 'bg-eco-sky', icon: MessageSquare },
      bug: { color: 'bg-eco-sun', icon: Flag }
    };
    const { color, icon: Icon } = config[type] || config.feedback;
    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {type}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'secondary' | 'outline' | 'default'; icon: typeof Clock }> = {
      open: { variant: 'secondary', icon: Clock },
      'in-progress': { variant: 'outline', icon: Clock },
      resolved: { variant: 'default', icon: CheckCircle2 },
      closed: { variant: 'secondary', icon: CheckCircle2 }
    };
    const { variant, icon: Icon } = config[status] || config.open;
    return (
      <Badge variant={variant}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in-progress');
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Feedback & Support Tickets</h2>
        <p className="text-muted-foreground">Manage user feedback, complaints, and support requests</p>
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
                <p className="text-sm text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold">{tickets.length}</p>
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
                <p className="text-2xl font-bold">{openTickets.length}</p>
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
                <p className="text-2xl font-bold">{resolvedTickets.length}</p>
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
                <p className="text-sm text-muted-foreground">Complaints</p>
                <p className="text-2xl font-bold">
                  {tickets.filter(t => t.ticket_type === 'complaint' && t.status !== 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">
            Open ({openTickets.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-6 space-y-4">
          {openTickets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No open tickets</p>
              <p className="text-sm mt-1">All support requests have been resolved</p>
            </div>
          ) : (
            openTickets.map((ticket) => (
              <Card key={ticket.id} variant="eco">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        <p className="text-sm text-muted-foreground">
                          {ticket.user_name} ({ticket.user_email})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeBadge(ticket.ticket_type)}
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>

                    <p className="text-muted-foreground">{ticket.message}</p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusChange(ticket.id, 'in-progress')}
                          disabled={ticket.status === 'in-progress'}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          In Progress
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Respond
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(ticket.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {selectedTicket?.id === ticket.id && (
                      <div className="pt-4 border-t space-y-3">
                        <Textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Write your response..."
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleRespond(ticket.id)}
                            disabled={responding}
                          >
                            {responding && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Send Response
                          </Button>
                          <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="resolved" className="mt-6 space-y-4">
          {resolvedTickets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No resolved tickets yet</p>
            </div>
          ) : (
            resolvedTickets.map((ticket) => (
              <Card key={ticket.id} variant="eco">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        <p className="text-sm text-muted-foreground">{ticket.user_name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeBadge(ticket.ticket_type)}
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{ticket.message}</p>
                    {ticket.admin_response && (
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm font-medium mb-1">Admin Response:</p>
                        <p className="text-sm text-muted-foreground">{ticket.admin_response}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">
                        Resolved: {new Date(ticket.updated_at).toLocaleDateString()}
                      </span>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(ticket.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
