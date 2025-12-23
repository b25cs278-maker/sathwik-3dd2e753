import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, Edit, Trash2, Building2, GraduationCap, Users,
  MapPin, Award, ExternalLink, Search
} from "lucide-react";
import { toast } from "sonner";

interface Partner {
  id: string;
  name: string;
  type: 'ngo' | 'school' | 'college' | 'corporate';
  location: string;
  contactEmail: string;
  projectsCount: number;
  participantsCount: number;
  certificatesIssued: number;
  isActive: boolean;
  createdAt: string;
}

export function PartnerManagement() {
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'Green Earth Foundation',
      type: 'ngo',
      location: 'Mumbai, Maharashtra',
      contactEmail: 'contact@greenearth.org',
      projectsCount: 12,
      participantsCount: 450,
      certificatesIssued: 280,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Delhi Public School',
      type: 'school',
      location: 'New Delhi',
      contactEmail: 'eco@dps.edu',
      projectsCount: 8,
      participantsCount: 320,
      certificatesIssued: 180,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'IIT Sustainability Club',
      type: 'college',
      location: 'Chennai, Tamil Nadu',
      contactEmail: 'sustainability@iitm.ac.in',
      projectsCount: 15,
      participantsCount: 890,
      certificatesIssued: 560,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'EcoTech Solutions',
      type: 'corporate',
      location: 'Bangalore, Karnataka',
      contactEmail: 'csr@ecotech.com',
      projectsCount: 5,
      participantsCount: 120,
      certificatesIssued: 75,
      isActive: false,
      createdAt: new Date().toISOString()
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "ngo" as Partner['type'],
    location: "",
    contactEmail: "",
    isActive: true
  });

  const handleSavePartner = () => {
    if (!formData.name.trim() || !formData.contactEmail.trim()) {
      toast.error('Please fill required fields');
      return;
    }

    if (editingPartner) {
      setPartners(prev => prev.map(p => 
        p.id === editingPartner.id 
          ? { ...p, ...formData }
          : p
      ));
      toast.success('Partner updated');
    } else {
      const newPartner: Partner = {
        id: Date.now().toString(),
        ...formData,
        projectsCount: 0,
        participantsCount: 0,
        certificatesIssued: 0,
        createdAt: new Date().toISOString()
      };
      setPartners(prev => [...prev, newPartner]);
      toast.success('Partner added');
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDeletePartner = (id: string) => {
    if (!confirm('Delete this partner?')) return;
    setPartners(prev => prev.filter(p => p.id !== id));
    toast.success('Partner deleted');
  };

  const openEditDialog = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      type: partner.type,
      location: partner.location,
      contactEmail: partner.contactEmail,
      isActive: partner.isActive
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPartner(null);
    setFormData({
      name: "",
      type: "ngo",
      location: "",
      contactEmail: "",
      isActive: true
    });
  };

  const getTypeIcon = (type: Partner['type']) => {
    switch (type) {
      case 'ngo':
        return <Users className="h-4 w-4" />;
      case 'school':
        return <GraduationCap className="h-4 w-4" />;
      case 'college':
        return <GraduationCap className="h-4 w-4" />;
      case 'corporate':
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: Partner['type']) => {
    const colors = {
      ngo: 'bg-primary',
      school: 'bg-eco-sky',
      college: 'bg-eco-sun',
      corporate: 'bg-eco-reward'
    };
    return (
      <Badge className={colors[type]}>
        {getTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    );
  };

  const filteredPartners = partners.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStats = {
    partners: partners.length,
    projects: partners.reduce((sum, p) => sum + p.projectsCount, 0),
    participants: partners.reduce((sum, p) => sum + p.participantsCount, 0),
    certificates: partners.reduce((sum, p) => sum + p.certificatesIssued, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">NGO, School & Partner Management</h2>
          <p className="text-muted-foreground">Manage institutional partnerships and projects</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Partners</p>
                <p className="text-2xl font-bold">{totalStats.partners}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-eco-sky/10">
                <ExternalLink className="h-6 w-6 text-eco-sky" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Projects</p>
                <p className="text-2xl font-bold">{totalStats.projects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-eco-sun/10">
                <Users className="h-6 w-6 text-eco-sun" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Participants</p>
                <p className="text-2xl font-bold">{totalStats.participants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="eco">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-eco-reward/10">
                <Award className="h-6 w-6 text-eco-reward" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Certificates</p>
                <p className="text-2xl font-bold">{totalStats.certificates}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search partners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Partners Table */}
      <Card variant="eco">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Certificates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{partner.name}</p>
                      <p className="text-sm text-muted-foreground">{partner.contactEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(partner.type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {partner.location}
                    </div>
                  </TableCell>
                  <TableCell>{partner.projectsCount}</TableCell>
                  <TableCell>{partner.participantsCount}</TableCell>
                  <TableCell>{partner.certificatesIssued}</TableCell>
                  <TableCell>
                    <Badge variant={partner.isActive ? 'default' : 'secondary'}>
                      {partner.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(partner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeletePartner(partner.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPartner ? 'Edit Partner' : 'Add Partner'}</DialogTitle>
            <DialogDescription>Configure partner details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Organization name"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ngo">NGO</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="college">College/University</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, State"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Contact Email *</label>
              <Input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="email@organization.com"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Active</label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePartner}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
