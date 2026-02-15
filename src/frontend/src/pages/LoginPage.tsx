import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block">
          <img
            src="/assets/generated/hospitality-staffing-illustration.dim_1600x900.png"
            alt="Hospitality Management"
            className="w-full rounded-2xl shadow-2xl"
          />
        </div>
        <Card className="w-full shadow-xl">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center mb-4">
              <img src="/assets/generated/tyagi-chef-logo.dim_512x512.png" alt="Tyagi Chef" className="h-20 w-20" />
            </div>
            <CardTitle className="text-3xl font-bold">Tyagi Chef</CardTitle>
            <CardDescription className="text-base">
              Hospitality Management System
              <br />
              Sign in to manage jobs, candidates, interviews, and clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={login} disabled={isLoggingIn} size="lg" className="w-full">
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in with Internet Identity'
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Secure authentication powered by Internet Computer
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
