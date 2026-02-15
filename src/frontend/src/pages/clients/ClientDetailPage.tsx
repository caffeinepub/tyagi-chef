import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetClient, useGetJobOpeningsForClient } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Building2, Calendar, Briefcase } from 'lucide-react';
import { EntityStatus, JobStatus } from '../../backend';
import StaffingRequirementsTable from './components/StaffingRequirementsTable';

export default function ClientDetailPage() {
  const navigate = useNavigate();
  const { clientId } = useParams({ strict: false });
  const { data: client, isLoading } = useGetClient(clientId ? BigInt(clientId) : undefined);
  const { data: jobOpenings = [], isLoading: jobsLoading } = useGetJobOpeningsForClient(
    clientId ? BigInt(clientId) : undefined
  );

  if (isLoading) {
    return <div className="text-center py-12">Loading client details...</div>;
  }

  if (!client) {
    return <div className="text-center py-12">Client not found</div>;
  }

  const getStatusBadge = (status: EntityStatus) => {
    const variants: Record<string, 'default' | 'secondary'> = {
      active: 'default',
      inactive: 'secondary',
    };
    return <Badge variant={variants[status] || 'default'}>{status.toUpperCase()}</Badge>;
  };

  const getJobStatusBadge = (status: JobStatus) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      open: 'default',
      paused: 'secondary',
      closed: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status.toUpperCase()}</Badge>;
  };

  const formatDate = (nano: bigint) => {
    const ms = Number(nano / BigInt(1_000_000));
    return new Date(ms).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/clients' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{client.companyName}</h1>
          <p className="text-muted-foreground">Client Details</p>
        </div>
        <Button onClick={() => navigate({ to: `/clients/${client.id}/edit` })}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Client Information</CardTitle>
              {getStatusBadge(client.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {client.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{client.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Contact Person</p>
                  <p className="text-sm text-muted-foreground">{client.contactPerson}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{client.phone}</p>
                </div>
              </div>
              {client.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{client.address}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{formatDate(client.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <StaffingRequirementsTable requirements={client.staffingRequirements || []} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <CardTitle>Related Job Openings</CardTitle>
            </div>
            <Badge variant="secondary">{jobOpenings.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {jobsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading job openings...</div>
          ) : jobOpenings.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Job Openings</h3>
              <p className="text-muted-foreground mb-4">
                This client doesn't have any linked job openings yet.
              </p>
              <Button onClick={() => navigate({ to: '/jobs/new' })}>Create Job Opening</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobOpenings.map((job) => (
                <Button
                  key={job.id.toString()}
                  variant="outline"
                  className="w-full justify-start h-auto py-4 px-4"
                  onClick={() => navigate({ to: `/jobs/${job.id}` })}
                >
                  <div className="flex items-start justify-between w-full gap-4">
                    <div className="flex-1 text-left">
                      <div className="font-semibold mb-1">{job.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                        {job.salary && (
                          <>
                            <span>•</span>
                            {job.salary}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">{getJobStatusBadge(job.status)}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
