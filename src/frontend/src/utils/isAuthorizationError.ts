/**
 * Utility to detect authorization errors from backend calls.
 * Backend traps with "Unauthorized" messages when access is denied.
 */
export function isAuthorizationError(error: unknown): boolean {
  if (!error) return false;
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return (
    errorMessage.includes('Unauthorized') ||
    errorMessage.includes('Only admins can') ||
    errorMessage.includes('Access denied')
  );
}
