import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllCandidates, useDeleteCandidate } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import EmptyState from '../../components/EmptyState';
import { Plus, Search, Users, Mail, Phone, Eye, Edit, Trash2 } from 'lucide-react';
import { CandidateStatus } from '../../backend';
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

export default function CandidatesListPage() {
  const navigate = useNavigate();
  const { data: candidates = [], isLoading } = useGetAllCandidates();
  const deleteCandidate = useDeleteCandidate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.fullName.toLowerCase().includes(search.toLowerCase()) ||
      candidate.email.toLowerCase().includes(search.toLowerCase()) ||
      candidate.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCandidate.mutateAsync(deleteId);
      toast.success('Candidate deleted successfully');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete candidate');
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading candidates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Candidates</h1>
          <p className="text-muted-foreground">Manage all candidates</p>
        </div>
        <Button onClick={() => navigate({ to: '/candidates/new' })}>
          <Plus className="mr-2 h-4 w-4" />
          New Candidate
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new_">New</SelectItem>
            <SelectItem value="screening">Screening</SelectItem>
            <SelectItem value="interviewing">Interviewing</SelectItem>
            <SelectItem value="offered">Offered</SelectItem>
            <SelectItem value="placed">Placed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredCandidates.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="No candidates found"
          description={
            search || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first candidate'
          }
          action={
            !search && statusFilter === 'all'
              ? {
                  label: 'Add Candidate',
                  onClick: () => navigate({ to: '/candidates/new' }),
                }
              : undefined
          }
          showIllustration={candidates.length === 0}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id.toString()} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{candidate.fullName}</CardTitle>
                  {getStatusBadge(candidate.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {candidate.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {candidate.phone}
                </div>
                {candidate.skills && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{candidate.skills}</p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate({ to: `/candidates/${candidate.id}` })}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate({ to: `/candidates/${candidate.id}/edit` })}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteId(candidate.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this candidate? This action cannot be undone.
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
