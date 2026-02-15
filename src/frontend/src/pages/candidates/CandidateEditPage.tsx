import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetCandidate, useUpdateCandidate, useGetAllJobOpenings } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { CandidateStatus } from '../../backend';
import { toast } from 'sonner';

export default function CandidateEditPage() {
  const navigate = useNavigate();
  const { candidateId } = useParams({ strict: false });
  const { data: candidate, isLoading } = useGetCandidate(candidateId ? BigInt(candidateId) : undefined);
  const { data: jobs = [] } = useGetAllJobOpenings();
  const updateCandidate = useUpdateCandidate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    skills: '',
    notes: '',
    source: '',
    status: 'new_' as CandidateStatus,
    jobOpeningId: '',
  });

  useEffect(() => {
    if (candidate) {
      setFormData({
        fullName: candidate.fullName,
        phone: candidate.phone,
        email: candidate.email,
        skills: candidate.skills,
        notes: candidate.notes,
        source: candidate.source,
        status: candidate.status,
        jobOpeningId: candidate.jobOpeningId?.toString() || '',
      });
    }
  }, [candidate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidate) return;

    if (!formData.fullName.trim()) {
      toast.error('Please enter candidate name');
      return;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      toast.error('Please provide at least one contact method (phone or email)');
      return;
    }

    try {
      await updateCandidate.mutateAsync({
        id: candidate.id,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        skills: formData.skills.trim(),
        notes: formData.notes.trim(),
        source: formData.source.trim(),
        status: formData.status,
        jobOpeningId: formData.jobOpeningId ? BigInt(formData.jobOpeningId) : null,
      });
      toast.success('Candidate updated successfully');
      navigate({ to: `/candidates/${candidate.id}` });
    } catch (error) {
      toast.error('Failed to update candidate');
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!candidate) {
    return <div className="text-center py-12">Candidate not found</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: `/candidates/${candidate.id}` })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Candidate</h1>
          <p className="text-muted-foreground">Update candidate information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Candidate Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as CandidateStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_">New</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="offered">Offered</SelectItem>
                    <SelectItem value="placed">Placed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobOpeningId">Link to Job</Label>
                <Select value={formData.jobOpeningId} onValueChange={(value) => setFormData({ ...formData, jobOpeningId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {jobs.map((job) => (
                      <SelectItem key={job.id.toString()} value={job.id.toString()}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={updateCandidate.isPending}>
                {updateCandidate.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate({ to: `/candidates/${candidate.id}` })}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
