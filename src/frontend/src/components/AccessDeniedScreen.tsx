import { ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export default function AccessDeniedScreen() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        You don't have permission to access this application. Only administrators can use this system.
      </p>
      <Button onClick={handleLogout} variant="outline">
        Logout
      </Button>
    </div>
  );
}
