import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, Send, Search, Check, CheckCheck
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  user_id: string;
  user_name: string;
  user_avatar?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export function NetworkMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
      setupRealtimeSubscription();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('direct_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `recipient_id=eq.${user.id}`
        },
        () => {
          fetchConversations();
          if (selectedConversation) {
            fetchMessages(selectedConversation.user_id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchConversations = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Get all messages where user is sender or recipient
      const { data: messagesData, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by conversation partner
      const conversationMap = new Map<string, { messages: Message[]; unread: number }>();
      
      messagesData?.forEach(msg => {
        const partnerId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, { messages: [], unread: 0 });
        }
        const conv = conversationMap.get(partnerId)!;
        conv.messages.push(msg);
        if (!msg.is_read && msg.recipient_id === user.id) {
          conv.unread++;
        }
      });

      // Get user profiles
      const partnerIds = Array.from(conversationMap.keys());
      if (partnerIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', partnerIds);

      const convs: Conversation[] = partnerIds.map(partnerId => {
        const conv = conversationMap.get(partnerId)!;
        const profile = profiles?.find(p => p.id === partnerId);
        const lastMsg = conv.messages[0];
        
        return {
          user_id: partnerId,
          user_name: profile?.name || 'Unknown',
          user_avatar: profile?.avatar_url,
          last_message: lastMsg?.content || '',
          last_message_time: lastMsg?.created_at || '',
          unread_count: conv.unread
        };
      });

      setConversations(convs.sort((a, b) => 
        new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
      ));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('direct_messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('sender_id', partnerId)
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      fetchConversations();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    try {
      const { error } = await supabase.from('direct_messages').insert({
        sender_id: user.id,
        recipient_id: selectedConversation.user_id,
        content: newMessage.trim()
      });

      if (error) throw error;

      setNewMessage("");
      fetchMessages(selectedConversation.user_id);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card variant="eco" className="md:col-span-1 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            Messages
          </CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full">
            {filteredConversations.map(conv => (
              <div
                key={conv.user_id}
                onClick={() => {
                  setSelectedConversation(conv);
                  fetchMessages(conv.user_id);
                }}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b ${
                  selectedConversation?.user_id === conv.user_id ? 'bg-muted' : ''
                }`}
              >
                <Avatar>
                  <AvatarImage src={conv.user_avatar} />
                  <AvatarFallback>{conv.user_name[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{conv.user_name}</span>
                    {conv.unread_count > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.last_message}</p>
                </div>
              </div>
            ))}
            {filteredConversations.length === 0 && (
              <p className="text-center text-muted-foreground py-8 px-4">
                No conversations yet. Connect with others to start messaging!
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card variant="eco" className="md:col-span-2 flex flex-col">
        {selectedConversation ? (
          <>
            <CardHeader className="pb-2 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedConversation.user_avatar} />
                  <AvatarFallback>{selectedConversation.user_name[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedConversation.user_name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender_id === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 text-xs ${
                          msg.sender_id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          <span>
                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                          </span>
                          {msg.sender_id === user?.id && (
                            msg.is_read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a conversation to start messaging</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
