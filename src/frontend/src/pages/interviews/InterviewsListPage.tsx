import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllInterviews, useGetAllCandidates, useDeleteInterview } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import EmptyState from '../../components/EmptyState';
import { Plus, Calendar as CalendarIcon, User, Eye, Edit, Trash2 } from 'lucide-react';
import { InterviewStatus } from '../../backend';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

export default function InterviewsListPage() {
  const navigate = useNavigate();
  const { data: interviews = [], isLoading } = useGetAllInterviews();
  const { data: candidates = [] } = useGetAllCandidates();
  const deleteInterview = useDeleteInterview();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const candidateMap = new Map(candidates.map((c) => [c.id.toString(), c]));

  const filteredInterviews = interviews.filter((interview) => {
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
    return matchesStatus;
  });

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

  const formatDateTime = (nano: bigint) => {
    const ms = Number(nano / BigInt(1_000_000));
    return new Date(ms).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteInterview.mutateAsync(deleteId);
      toast.success('Interview deleted successfully');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete interview');
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading interviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground">Manage all interviews</p>
        </div>
        <Button onClick={() => navigate({ to: '/interviews/new' })}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="noShow">No Show</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredInterviews.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="h-12 w-12" />}
          title="No interviews found"
          description={
            statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by scheduling your first interview'
          }
          action={
            statusFilter === 'all'
              ? {
                  label: 'Schedule Interview',
                  onClick: () => navigate({ to: '/interviews/new' }),
                }
              : undefined
          }
          showIllustration={interviews.length === 0}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInterviews.map((interview) => {
            const candidate = candidateMap.get(interview.candidateId.toString());
            return (
              <Card key={interview.id.toString()} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{candidate?.fullName || 'Unknown Candidate'}</CardTitle>
                    {getStatusBadge(interview.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDateTime(interview.interviewDate)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    {interview.interviewerName}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{interview.location}</p>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate({ to: `/interviews/${interview.id}` })}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate({ to: `/interviews/${interview.id}/edit` })}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteId(interview.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Interview</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this interview? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
