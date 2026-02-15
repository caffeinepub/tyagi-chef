import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetInterview, useUpdateInterview, useGetAllCandidates, useGetAllJobOpenings } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { InterviewStatus, InterviewType } from '../../backend';
import { toast } from 'sonner';
import { NONE_SENTINEL, mapSelectToState, mapStateToSelect } from '../../utils/optionalSelect';

export default function InterviewEditPage() {
  const navigate = useNavigate();
  const { interviewId } = useParams({ strict: false });
  const { data: interview, isLoading } = useGetInterview(interviewId ? BigInt(interviewId) : undefined);
  const { data: candidates = [] } = useGetAllCandidates();
  const { data: jobs = [] } = useGetAllJobOpenings();
  const updateInterview = useUpdateInterview();

  const [formData, setFormData] = useState({
    candidateId: '',
    jobOpeningId: '',
    interviewDate: '',
    interviewTime: '',
    interviewType: 'video' as InterviewType,
    interviewerName: '',
    location: '',
    status: 'scheduled' as InterviewStatus,
    outcome: '',
  });

  useEffect(() => {
    if (interview) {
      const ms = Number(interview.interviewDate / BigInt(1_000_000));
      const date = new Date(ms);
      const dateStr = date.toISOString().split('T')[0];
      const timeStr = date.toTimeString().slice(0, 5);

      setFormData({
        candidateId: interview.candidateId.toString(),
        jobOpeningId: interview.jobOpeningId?.toString() || '',
        interviewDate: dateStr,
        interviewTime: timeStr,
        interviewType: interview.interviewType,
        interviewerName: interview.interviewerName,
        location: interview.location,
        status: interview.status,
        outcome: interview.outcome,
      });
    }
  }, [interview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!interview) return;

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

      await updateInterview.mutateAsync({
        id: interview.id,
        candidateId: BigInt(formData.candidateId),
        jobOpeningId: formData.jobOpeningId ? BigInt(formData.jobOpeningId) : null,
        interviewDate: interviewDateNano,
        interviewType: formData.interviewType,
        interviewerName: formData.interviewerName.trim(),
        location: formData.location.trim(),
        status: formData.status,
        outcome: formData.outcome.trim(),
      });
      toast.success('Interview updated successfully');
      navigate({ to: `/interviews/${interview.id}` });
    } catch (error) {
      toast.error('Failed to update interview');
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!interview) {
    return <div className="text-center py-12">Interview not found</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: `/interviews/${interview.id}` })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Interview</h1>
          <p className="text-muted-foreground">Update interview information</p>
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

            <div className="grid gap-6 md:grid-cols-2">
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
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as InterviewStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="noShow">No Show</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interviewerName">Interviewer Name *</Label>
              <Input
                id="interviewerName"
                value={formData.interviewerName}
                onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location / Meeting Link *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome Notes (Optional)</Label>
              <Textarea
                id="outcome"
                value={formData.outcome}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                placeholder="Add notes about the interview outcome..."
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={updateInterview.isPending}>
                {updateInterview.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate({ to: `/interviews/${interview.id}` })}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
