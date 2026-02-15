import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateCandidate, useGetAllJobOpenings, useGetCandidate } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { NONE_SENTINEL, mapSelectToState, mapStateToSelect } from '../../utils/optionalSelect';

export default function CandidateCreatePage() {
  const navigate = useNavigate();
  const createCandidate = useCreateCandidate();
  const { data: jobs = [] } = useGetAllJobOpenings();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    skills: '',
    notes: '',
    source: '',
    jobOpeningId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('Please enter candidate name');
      return;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      toast.error('Please provide at least one contact method (phone or email)');
      return;
    }

    try {
      const candidateId = await createCandidate.mutateAsync({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        skills: formData.skills.trim(),
        notes: formData.notes.trim(),
        source: formData.source.trim(),
        jobOpeningId: formData.jobOpeningId ? BigInt(formData.jobOpeningId) : null,
      });
      toast.success('Candidate created successfully');
      navigate({ to: `/candidates/${candidateId}` });
    } catch (error) {
      toast.error('Failed to create candidate');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/candidates' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add Candidate</h1>
          <p className="text-muted-foreground">Create a new candidate profile</p>
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
                placeholder="e.g., John Smith"
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
                  placeholder="e.g., +1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g., john@example.com"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g., LinkedIn, Referral"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobOpeningId">Link to Job (Optional)</Label>
                <Select 
                  value={mapStateToSelect(formData.jobOpeningId)} 
                  onValueChange={(value) => setFormData({ ...formData, jobOpeningId: mapSelectToState(value) })}
                >
                  <SelectTrigger id="jobOpeningId">
                    <SelectValue placeholder="Select a job opening" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_SENTINEL}>None</SelectItem>
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
                placeholder="List relevant skills and experience..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about the candidate..."
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={createCandidate.isPending}>
                {createCandidate.isPending ? 'Creating...' : 'Create Candidate'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/candidates' })}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
