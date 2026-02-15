import { ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        You don't have permission to access this resource. Please contact an administrator if you believe this is an
        error.
      </p>
      <Button onClick={() => navigate({ to: '/dashboard' })}>Return to Dashboard</Button>
    </div>
  );
}
