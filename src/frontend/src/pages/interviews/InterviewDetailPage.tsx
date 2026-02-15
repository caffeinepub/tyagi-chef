import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetInterview, useGetCandidate, useGetJobOpening } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Edit, Calendar, User, MapPin, Video, Phone, Users, Briefcase, FileText } from 'lucide-react';
import { InterviewStatus, InterviewType } from '../../backend';

export default function InterviewDetailPage() {
  const navigate = useNavigate();
  const { interviewId } = useParams({ strict: false });
  const { data: interview, isLoading } = useGetInterview(interviewId ? BigInt(interviewId) : undefined);
  const { data: candidate } = useGetCandidate(interview?.candidateId);
  const { data: job } = useGetJobOpening(interview?.jobOpeningId || undefined);

  if (isLoading) {
    return <div className="text-center py-12">Loading interview details...</div>;
  }

  if (!interview) {
    return <div className="text-center py-12">Interview not found</div>;
  }

  const getStatusBadge = (status: InterviewStatus) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      scheduled: { variant: 'default', label: 'SCHEDULED' },
      completed: { variant: 'secondary', label: 'COMPLETED' },
      noShow: { variant: 'destructive', label: 'NO SHOW' },
      cancelled: { variant: 'destructive', label: 'CANCELLED' },
    };
    const { variant, label } = config[status] || { variant: 'default', label: status.toUpperCase() };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getTypeIcon = (type: InterviewType) => {
    if (type === InterviewType.video) return <Video className="h-5 w-5" />;
    if (type === InterviewType.phone) return <Phone className="h-5 w-5" />;
    return <Users className="h-5 w-5" />;
  };

  const getTypeLabel = (type: InterviewType) => {
    if (type === InterviewType.video) return 'Video';
    if (type === InterviewType.phone) return 'Phone';
    return 'In Person';
  };

  const formatDateTime = (nano: bigint) => {
    const ms = Number(nano / BigInt(1_000_000));
    return new Date(ms).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/interviews' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Interview Details</h1>
          <p className="text-muted-foreground">{candidate?.fullName || 'Unknown Candidate'}</p>
        </div>
        <Button onClick={() => navigate({ to: `/interviews/${interview.id}/edit` })}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Interview Information</CardTitle>
              {getStatusBadge(interview.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {interview.outcome && (
              <div>
                <h3 className="font-semibold mb-2">Outcome Notes</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{interview.outcome}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">{formatDateTime(interview.interviewDate)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                {getTypeIcon(interview.interviewType)}
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground">{getTypeLabel(interview.interviewType)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Interviewer</p>
                  <p className="text-sm text-muted-foreground">{interview.interviewerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{interview.location}</p>
                </div>
              </div>
              {candidate && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Candidate</p>
                    <p className="text-sm text-muted-foreground">{candidate.fullName}</p>
                  </div>
                </div>
              )}
              {job && (
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Job Opening</p>
                    <p className="text-sm text-muted-foreground">{job.title}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
