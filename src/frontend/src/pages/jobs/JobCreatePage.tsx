import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateJobOpening, useGetAllClients } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { NONE_SENTINEL, mapSelectToState, mapStateToSelect } from '../../utils/optionalSelect';

export default function JobCreatePage() {
  const navigate = useNavigate();
  const createJob = useCreateJobOpening();
  const { data: clients = [] } = useGetAllClients();

  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    location: '',
    salary: '',
    description: '',
    requirements: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const jobId = await createJob.mutateAsync({
        title: formData.title.trim(),
        clientId: formData.clientId ? BigInt(formData.clientId) : null,
        location: formData.location.trim(),
        salary: formData.salary.trim() || null,
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
      });
      toast.success('Job opening created successfully');
      navigate({ to: `/jobs/${jobId}` });
    } catch (error) {
      toast.error('Failed to create job opening');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/jobs' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Job Opening</h1>
          <p className="text-muted-foreground">Add a new job position</p>
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
                placeholder="e.g., Executive Chef"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., New York, NY"
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary (Optional)</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g., $60,000 - $80,000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientId">Client (Optional)</Label>
                <Select 
                  value={mapStateToSelect(formData.clientId)} 
                  onValueChange={(value) => setFormData({ ...formData, clientId: mapSelectToState(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_SENTINEL}>None</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id.toString()} value={client.id.toString()}>
                        {client.companyName}
                      </SelectItem>
                    ))}
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
                placeholder="Describe the job role and responsibilities..."
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
                placeholder="List the required skills and qualifications..."
                rows={5}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={createJob.isPending}>
                {createJob.isPending ? 'Creating...' : 'Create Job Opening'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/jobs' })}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
