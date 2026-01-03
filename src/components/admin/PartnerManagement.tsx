import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  type: string;
  location: string | null;
  contact_email: string;
  projects_count: number;
  participants_count: number;
  certificates_issued: number;
  is_active: boolean;
  created_at: string;
}

export function PartnerManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "ngo",
    location: "",
    contact_email: "",
    is_active: true
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePartner = async () => {
    if (!formData.name.trim() || !formData.contact_email.trim()) {
      toast.error('Please fill required fields');
      return;
    }

    setSaving(true);
    try {
      if (editingPartner) {
        const { error } = await supabase
          .from('partners')
          .update({
            name: formData.name,
            type: formData.type,
            location: formData.location || null,
            contact_email: formData.contact_email,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPartner.id);

        if (error) throw error;
        toast.success('Partner updated');
      } else {
        const { error } = await supabase
          .from('partners')
          .insert({
            name: formData.name,
            type: formData.type,
            location: formData.location || null,
            contact_email: formData.contact_email,
            is_active: formData.is_active
          });

        if (error) throw error;
        toast.success('Partner added');
      }

      setDialogOpen(false);
      resetForm();
      fetchPartners();
    } catch (error) {
      console.error('Error saving partner:', error);
      toast.error('Failed to save partner');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!confirm('Delete this partner?')) return;

    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Partner deleted');
      fetchPartners();
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast.error('Failed to delete partner');
    }
  };

  const openEditDialog = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      type: partner.type,
      location: partner.location || "",
      contact_email: partner.contact_email,
      is_active: partner.is_active
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPartner(null);
    setFormData({
      name: "",
      type: "ngo",
      location: "",
      contact_email: "",
      is_active: true
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ngo':
        return <Users className="h-4 w-4" />;
      case 'school':
        return <GraduationCap className="h-4 w-4" />;
      case 'college':
        return <GraduationCap className="h-4 w-4" />;
      case 'corporate':
        return <Building2 className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      ngo: 'bg-primary',
      school: 'bg-eco-sky',
      college: 'bg-eco-sun',
      corporate: 'bg-eco-reward'
    };
    return (
      <Badge className={colors[type] || 'bg-primary'}>
        {getTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    );
  };

  const filteredPartners = partners.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.location?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalStats = {
    partners: partners.length,
    projects: partners.reduce((sum, p) => sum + p.projects_count, 0),
    participants: partners.reduce((sum, p) => sum + p.participants_count, 0),
    certificates: partners.reduce((sum, p) => sum + p.certificates_issued, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

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
          {filteredPartners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No partners found</p>
              <p className="text-sm">Add your first partner to get started</p>
            </div>
          ) : (
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
                        <p className="text-sm text-muted-foreground">{partner.contact_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(partner.type)}</TableCell>
                    <TableCell>
                      {partner.location ? (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {partner.location}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{partner.projects_count}</TableCell>
                    <TableCell>{partner.participants_count}</TableCell>
                    <TableCell>{partner.certificates_issued}</TableCell>
                    <TableCell>
                      <Badge variant={partner.is_active ? 'default' : 'secondary'}>
                        {partner.is_active ? 'Active' : 'Inactive'}
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
          )}
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
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
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
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="email@organization.com"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Active</label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePartner} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}