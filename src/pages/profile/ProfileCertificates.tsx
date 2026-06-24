import { ProfileLayout } from '@/components/profile/ProfileLayout';
import { certificates } from '@/data/profileMockData';
import { Plus, Download, Share2, CheckCircle } from 'lucide-react';

export default function ProfileCertificates() {
  const isExpired = (d?: Date) => !!d && new Date() > d;

  return (
    <ProfileLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Certificates</h1>
            <p className="text-muted-foreground">Your verified credentials</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 font-medium">
            <Plus className="h-5 w-5" /> Add Certificate
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                  {!isExpired(cert.expirationDate) && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-medium text-green-500">Verified</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">ID: {cert.verificationId}</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Issued</p>
                  <p className="text-sm font-medium text-foreground">{cert.issueDate.toLocaleDateString()}</p>
                </div>
                {cert.expirationDate && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Expires</p>
                    <p className="text-sm font-medium text-foreground">
                      {cert.expirationDate.toLocaleDateString()}
                      {isExpired(cert.expirationDate) && <span className="text-xs text-red-500 font-medium ml-2">Expired</span>}
                    </p>
                  </div>
                )}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <button className="flex items-center justify-center gap-2 flex-1 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 text-sm font-medium">
                    <Download className="h-4 w-4" /> Download
                  </button>
                  <button className="flex items-center justify-center gap-2 flex-1 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 text-sm font-medium">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!certificates.length && (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No certificates yet</p>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Add your first certificate</button>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
