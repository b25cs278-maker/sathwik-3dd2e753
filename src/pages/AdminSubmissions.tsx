import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, CheckCircle2, XCircle, Clock, MapPin, 
  User, Calendar, ChevronRight, Eye, Zap, Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: string;
  taskTitle: string;
  userName: string;
  userEmail: string;
  status: "pending" | "approved" | "rejected";
  photos: string[];
  lat: number;
  lng: number;
  accuracy: number;
  submittedAt: string;
  points: number;
}

const mockSubmissions: Submission[] = [
  {
    id: "1",
    taskTitle: "Community Garden Volunteer",
    userName: "Alex Johnson",
    userEmail: "alex@example.com",
    status: "pending",
    photos: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400",
    ],
    lat: 37.7749,
    lng: -122.4194,
    accuracy: 15,
    submittedAt: "2 hours ago",
    points: 35,
  },
  {
    id: "2",
    taskTitle: "Beach Cleanup Challenge",
    userName: "Sarah Miller",
    userEmail: "sarah@example.com",
    status: "pending",
    photos: [
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
    ],
    lat: 37.7849,
    lng: -122.4094,
    accuracy: 8,
    submittedAt: "5 hours ago",
    points: 75,
  },
  {
    id: "3",
    taskTitle: "Recycling Drop-off",
    userName: "Mike Chen",
    userEmail: "mike@example.com",
    status: "approved",
    photos: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
    ],
    lat: 37.7649,
    lng: -122.4294,
    accuracy: 25,
    submittedAt: "1 day ago",
    points: 25,
  },
];

export default function AdminSubmissions() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = sub.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || sub.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = (id: string) => {
    setSubmissions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, status: "approved" as const } : sub)
    );
    toast({
      title: "Submission Approved",
      description: "Points have been awarded to the user.",
    });
    setSelectedSubmission(null);
  };

  const handleReject = (id: string) => {
    setSubmissions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, status: "rejected" as const } : sub)
    );
    toast({
      title: "Submission Rejected",
      description: "The user has been notified.",
    });
    setSelectedSubmission(null);
  };

  const pendingCount = submissions.filter(s => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={true} userRole="admin" />
      
      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Review Submissions
            </h1>
            <p className="text-muted-foreground">
              {pendingCount} submissions awaiting review
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-slide-up delay-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by task or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === "pending" && pendingCount > 0 && (
                  <Badge variant="secondary" className="ml-2">{pendingCount}</Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Submissions List */}
          <div className="lg:col-span-2 space-y-4 animate-slide-up delay-200">
            {filteredSubmissions.length === 0 ? (
              <Card variant="flat">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No submissions found</p>
                </CardContent>
              </Card>
            ) : (
              filteredSubmissions.map((submission) => (
                <Card
                  key={submission.id}
                  variant={selectedSubmission?.id === submission.id ? "eco" : "default"}
                  className={`cursor-pointer transition-all ${
                    selectedSubmission?.id === submission.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <img
                          src={submission.photos[0]}
                          alt="Submission"
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-foreground">{submission.taskTitle}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <User className="h-3 w-3" />
                            {submission.userName}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {submission.submittedAt}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            submission.status === "approved" ? "success" :
                            submission.status === "rejected" ? "destructive" : "pending"
                          }
                        >
                          {submission.status}
                        </Badge>
                        <div className="flex items-center gap-1 mt-2 text-sm">
                          <Zap className="h-4 w-4 text-eco-sun" />
                          <span className="font-medium">{submission.points}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Detail Panel */}
          <div className="animate-slide-up delay-300">
            {selectedSubmission ? (
              <Card variant="eco" className="sticky top-24">
                <CardHeader>
                  <CardTitle>Submission Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{selectedSubmission.taskTitle}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {selectedSubmission.userName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {selectedSubmission.lat.toFixed(4)}, {selectedSubmission.lng.toFixed(4)}
                      <Badge variant={selectedSubmission.accuracy < 20 ? "success" : "warning"}>
                        ±{selectedSubmission.accuracy}m
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Photos ({selectedSubmission.photos.length})</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedSubmission.photos.map((photo, i) => (
                        <img
                          key={i}
                          src={photo}
                          alt={`Evidence ${i + 1}`}
                          className="rounded-lg aspect-square object-cover"
                        />
                      ))}
                    </div>
                  </div>

                  {selectedSubmission.status === "pending" && (
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="success"
                        className="flex-1"
                        onClick={() => handleApprove(selectedSubmission.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleReject(selectedSubmission.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card variant="flat">
                <CardContent className="py-12 text-center">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a submission to review</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
