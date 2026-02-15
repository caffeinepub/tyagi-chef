import { useNavigate } from '@tanstack/react-router';
import { useGetAllJobOpenings, useGetAllCandidates, useGetAllInterviews, useGetAllClients } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Briefcase, Users, Calendar, Building2, Plus, TrendingUp } from 'lucide-react';
import { JobStatus, CandidateStatus, InterviewStatus, EntityStatus } from '../backend';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: jobs = [] } = useGetAllJobOpenings();
  const { data: candidates = [] } = useGetAllCandidates();
  const { data: interviews = [] } = useGetAllInterviews();
  const { data: clients = [] } = useGetAllClients();

  const openJobs = jobs.filter((j) => j.status === JobStatus.open).length;
  const newCandidates = candidates.filter((c) => c.status === CandidateStatus.new_).length;
  const activeClients = clients.filter((c) => c.status === EntityStatus.active).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayNano = BigInt(today.getTime()) * BigInt(1_000_000);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowNano = BigInt(tomorrow.getTime()) * BigInt(1_000_000);

  const interviewsToday = interviews.filter(
    (i) => i.status === InterviewStatus.scheduled && i.interviewDate >= todayNano && i.interviewDate < tomorrowNano
  ).length;

  const stats = [
    {
      title: 'Open Jobs',
      value: openJobs,
      icon: Briefcase,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900/20',
      action: () => navigate({ to: '/jobs' }),
    },
    {
      title: 'New Candidates',
      value: newCandidates,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      action: () => navigate({ to: '/candidates' }),
    },
    {
      title: 'Interviews Today',
      value: interviewsToday,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      action: () => navigate({ to: '/interviews' }),
    },
    {
      title: 'Active Clients',
      value: activeClients,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      action: () => navigate({ to: '/clients' }),
    },
  ];

  const quickActions = [
    { label: 'New Job Opening', path: '/jobs/new', icon: Briefcase },
    { label: 'Add Candidate', path: '/candidates/new', icon: Users },
    { label: 'Schedule Interview', path: '/interviews/new', icon: Calendar },
    { label: 'Add Client', path: '/clients/new', icon: Building2 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your hospitality management.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={stat.action}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Click to view details
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.path}
                  variant="outline"
                  className="h-auto py-6 flex flex-col gap-2"
                  onClick={() => navigate({ to: action.path })}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
