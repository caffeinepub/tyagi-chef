import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetCandidate, useGetJobOpening } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Edit, Mail, Phone, Briefcase, FileText, Calendar } from 'lucide-react';
import { CandidateStatus } from '../../backend';

export default function CandidateDetailPage() {
  const navigate = useNavigate();
  const { candidateId } = useParams({ strict: false });
  const { data: candidate, isLoading } = useGetCandidate(candidateId ? BigInt(candidateId) : undefined);
  const { data: job } = useGetJobOpening(candidate?.jobOpeningId || undefined);

  if (isLoading) {
    return <div className="text-center py-12">Loading candidate details...</div>;
  }

  if (!candidate) {
    return <div className="text-center py-12">Candidate not found</div>;
  }

  const getStatusBadge = (status: CandidateStatus) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      new_: { variant: 'default', label: 'NEW' },
      screening: { variant: 'secondary', label: 'SCREENING' },
      interviewing: { variant: 'default', label: 'INTERVIEWING' },
      offered: { variant: 'default', label: 'OFFERED' },
      placed: { variant: 'default', label: 'PLACED' },
      rejected: { variant: 'destructive', label: 'REJECTED' },
    };
    const { variant, label } = config[status] || { variant: 'default', label: status.toUpperCase() };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const formatDate = (nano: bigint) => {
    const ms = Number(nano / BigInt(1_000_000));
    return new Date(ms).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/candidates' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{candidate.fullName}</h1>
          <p className="text-muted-foreground">Candidate Details</p>
        </div>
        <Button onClick={() => navigate({ to: `/candidates/${candidate.id}/edit` })}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Candidate Information</CardTitle>
              {getStatusBadge(candidate.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {candidate.skills && (
              <div>
                <h3 className="font-semibold mb-2">Skills</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{candidate.skills}</p>
              </div>
            )}
            {candidate.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{candidate.notes}</p>
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
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{candidate.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{candidate.phone}</p>
                </div>
              </div>
              {candidate.source && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Source</p>
                    <p className="text-sm text-muted-foreground">{candidate.source}</p>
                  </div>
                </div>
              )}
              {job && (
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Linked Job</p>
                    <p className="text-sm text-muted-foreground">{job.title}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{formatDate(candidate.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
