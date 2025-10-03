import { ReactNode } from 'react';
import { useUserRole, AppRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: AppRole[];
  requireAdmin?: boolean;
  fallback?: ReactNode;
  showMessage?: boolean;
}

export const RoleGuard = ({
  children,
  allowedRoles,
  requireAdmin = false,
  fallback,
  showMessage = false,
}: RoleGuardProps) => {
  const { userRoles, isAdmin, hasRole, isLoading } = useUserRole();

  // Loading state
  if (isLoading) {
    return null;
  }

  // No roles assigned
  if (!userRoles || userRoles.length === 0) {
    if (showMessage) {
      return (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            Sie haben keine Berechtigung für diese Aktion. Bitte kontaktieren Sie Ihren Administrator.
          </AlertDescription>
        </Alert>
      );
    }
    return fallback ? <>{fallback}</> : null;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin()) {
    if (showMessage) {
      return (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            Diese Funktion ist nur für Administratoren verfügbar.
          </AlertDescription>
        </Alert>
      );
    }
    return fallback ? <>{fallback}</> : null;
  }

  // Check specific roles
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some((role) => hasRole(role));
    if (!hasRequiredRole) {
      if (showMessage) {
        return (
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription>
              Sie haben nicht die erforderlichen Berechtigungen für diese Aktion.
            </AlertDescription>
          </Alert>
        );
      }
      return fallback ? <>{fallback}</> : null;
    }
  }

  // User has required permissions
  return <>{children}</>;
};
