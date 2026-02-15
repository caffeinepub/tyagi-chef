import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetJobOpening, useUpdateJobOpening, useGetAllClients } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { JobStatus } from '../../backend';
import { toast } from 'sonner';

export default function JobEditPage() {
  const navigate = useNavigate();
  const { jobId } = useParams({ strict: false });
  const { data: job, isLoading } = useGetJobOpening(jobId ? BigInt(jobId) : undefined);
  const { data: clients = [] } = useGetAllClients();
  const updateJob = useUpdateJobOpening();

  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    location: '',
    salary: '',
    description: '',
    requirements: '',
    status: 'open' as JobStatus,
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        clientId: job.clientId?.toString() || '',
        location: job.location,
        salary: job.salary || '',
        description: job.description,
        requirements: job.requirements,
        status: job.status,
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!job) return;

    if (!formData.title.trim()) {
      toast.error('Please enter a job title');
      return;
    }
    if (!formData.location.trim()) {
      toast.error('Please enter a location');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    if (!formData.requirements.trim()) {
      toast.error('Please enter requirements');
      return;
    }

    try {
      await updateJob.mutateAsync({
        id: job.id,
        title: formData.title.trim(),
        clientId: formData.clientId ? BigInt(formData.clientId) : null,
        location: formData.location.trim(),
        salary: formData.salary.trim() || null,
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        status: formData.status,
      });
      toast.success('Job opening updated successfully');
      navigate({ to: `/jobs/${job.id}` });
    } catch (error) {
      toast.error('Failed to update job opening');
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!job) {
    return <div className="text-center py-12">Job not found</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: `/jobs/${job.id}` })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Job Opening</h1>
          <p className="text-muted-foreground">Update job information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary (Optional)</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientId">Client (Optional)</Label>
                <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id.toString()} value={client.id.toString()}>
                        {client.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as JobStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements *</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={updateJob.isPending}>
                {updateJob.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate({ to: `/jobs/${job.id}` })}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
