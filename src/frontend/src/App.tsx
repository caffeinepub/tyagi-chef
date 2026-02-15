import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from './hooks/useQueries';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import JobsListPage from './pages/jobs/JobsListPage';
import JobDetailPage from './pages/jobs/JobDetailPage';
import JobCreatePage from './pages/jobs/JobCreatePage';
import JobEditPage from './pages/jobs/JobEditPage';
import CandidatesListPage from './pages/candidates/CandidatesListPage';
import CandidateDetailPage from './pages/candidates/CandidateDetailPage';
import CandidateCreatePage from './pages/candidates/CandidateCreatePage';
import CandidateEditPage from './pages/candidates/CandidateEditPage';
import InterviewsListPage from './pages/interviews/InterviewsListPage';
import InterviewDetailPage from './pages/interviews/InterviewDetailPage';
import InterviewCreatePage from './pages/interviews/InterviewCreatePage';
import InterviewEditPage from './pages/interviews/InterviewEditPage';
import ClientsListPage from './pages/clients/ClientsListPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
import ClientCreatePage from './pages/clients/ClientCreatePage';
import ClientEditPage from './pages/clients/ClientEditPage';
import AppLayout from './components/AppLayout';
import AccessDeniedScreen from './components/AccessDeniedScreen';
import ProfileSetupDialog from './components/ProfileSetupDialog';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { isAuthorizationError } from './utils/isAuthorizationError';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading, error: adminError } = useIsCallerAdmin();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show loading state while checking admin status
  if (adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If admin check failed with authorization error or returned false, show access denied
  const isAuthError = adminError && isAuthorizationError(adminError);
  if (isAuthError || isAdmin === false) {
    return <AccessDeniedScreen />;
  }

  // Only proceed if user is confirmed admin
  if (isAdmin !== true) {
    return <AccessDeniedScreen />;
  }

  // Check if profile setup is needed (only for admins)
  const showProfileSetup = !profileLoading && profileFetched && userProfile === null;

  return (
    <>
      {showProfileSetup && <ProfileSetupDialog />}
      <AppLayout>
        <Outlet />
      </AppLayout>
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

function IndexComponent() {
  const { identity } = useInternetIdentity();
  return identity ? <DashboardPage /> : <LoginPage />;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs',
  component: JobsListPage,
});

const jobDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/$jobId',
  component: JobDetailPage,
});

const jobCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/new',
  component: JobCreatePage,
});

const jobEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/$jobId/edit',
  component: JobEditPage,
});

const candidatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/candidates',
  component: CandidatesListPage,
});

const candidateDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/candidates/$candidateId',
  component: CandidateDetailPage,
});

const candidateCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/candidates/new',
  component: CandidateCreatePage,
});

const candidateEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/candidates/$candidateId/edit',
  component: CandidateEditPage,
});

const interviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/interviews',
  component: InterviewsListPage,
});

const interviewDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/interviews/$interviewId',
  component: InterviewDetailPage,
});

const interviewCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/interviews/new',
  component: InterviewCreatePage,
});

const interviewEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/interviews/$interviewId/edit',
  component: InterviewEditPage,
});

const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients',
  component: ClientsListPage,
});

const clientDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients/$clientId',
  component: ClientDetailPage,
});

const clientCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients/new',
  component: ClientCreatePage,
});

const clientEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients/$clientId/edit',
  component: ClientEditPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  jobsRoute,
  jobDetailRoute,
  jobCreateRoute,
  jobEditRoute,
  candidatesRoute,
  candidateDetailRoute,
  candidateCreateRoute,
  candidateEditRoute,
  interviewsRoute,
  interviewDetailRoute,
  interviewCreateRoute,
  interviewEditRoute,
  clientsRoute,
  clientDetailRoute,
  clientCreateRoute,
  clientEditRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
