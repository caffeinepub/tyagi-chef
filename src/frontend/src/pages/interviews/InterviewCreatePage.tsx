import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateInterview, useGetAllCandidates, useGetAllJobOpenings } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { InterviewType } from '../../backend';
import { toast } from 'sonner';
import { NONE_SENTINEL, mapSelectToState, mapStateToSelect } from '../../utils/optionalSelect';

export default function InterviewCreatePage() {
  const navigate = useNavigate();
  const createInterview = useCreateInterview();
  const { data: candidates = [] } = useGetAllCandidates();
  const { data: jobs = [] } = useGetAllJobOpenings();

  const [formData, setFormData] = useState({
    candidateId: '',
    jobOpeningId: '',
    interviewDate: '',
    interviewTime: '',
    interviewType: 'video' as InterviewType,
    interviewerName: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.candidateId) {
      toast.error('Please select a candidate');
      return;
    }
    if (!formData.interviewDate || !formData.interviewTime) {
      toast.error('Please select date and time');
      return;
    }
    if (!formData.interviewerName.trim()) {
      toast.error('Please enter interviewer name');
      return;
    }
    if (!formData.location.trim()) {
      toast.error('Please enter location or meeting link');
      return;
    }

    try {
      const dateTime = new Date(`${formData.interviewDate}T${formData.interviewTime}`);
      const interviewDateNano = BigInt(dateTime.getTime()) * BigInt(1_000_000);

      const interviewId = await createInterview.mutateAsync({
        candidateId: BigInt(formData.candidateId),
        jobOpeningId: formData.jobOpeningId ? BigInt(formData.jobOpeningId) : null,
        interviewDate: interviewDateNano,
        interviewType: formData.interviewType,
        interviewerName: formData.interviewerName.trim(),
        location: formData.location.trim(),
      });
      toast.success('Interview scheduled successfully');
      navigate({ to: `/interviews/${interviewId}` });
    } catch (error) {
      toast.error('Failed to schedule interview');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/interviews' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Schedule Interview</h1>
          <p className="text-muted-foreground">Create a new interview</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="candidateId">Candidate *</Label>
              <Select value={formData.candidateId} onValueChange={(value) => setFormData({ ...formData, candidateId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a candidate" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((candidate) => (
                    <SelectItem key={candidate.id.toString()} value={candidate.id.toString()}>
                      {candidate.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobOpeningId">Job Opening (Optional)</Label>
              <Select 
                value={mapStateToSelect(formData.jobOpeningId)} 
                onValueChange={(value) => setFormData({ ...formData, jobOpeningId: mapSelectToState(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a job" />
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

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="interviewDate">Date *</Label>
                <Input
                  id="interviewDate"
                  type="date"
                  value={formData.interviewDate}
                  onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interviewTime">Time *</Label>
                <Input
                  id="interviewTime"
                  type="time"
                  value={formData.interviewTime}
                  onChange={(e) => setFormData({ ...formData, interviewTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interviewType">Interview Type *</Label>
              <Select value={formData.interviewType} onValueChange={(value) => setFormData({ ...formData, interviewType: value as InterviewType })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="inPerson">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interviewerName">Interviewer Name *</Label>
              <Input
                id="interviewerName"
                value={formData.interviewerName}
                onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
                placeholder="e.g., Sarah Johnson"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location / Meeting Link *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Zoom link or office address"
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={createInterview.isPending}>
                {createInterview.isPending ? 'Scheduling...' : 'Schedule Interview'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/interviews' })}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
