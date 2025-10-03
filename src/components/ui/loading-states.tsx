import { Loader2 } from 'lucide-react';
import { Card, CardContent } from './card';
import { Skeleton } from './skeleton';

/**
 * Full page loading spinner
 */
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Lädt...</p>
    </div>
  </div>
);

/**
 * Inline loading spinner
 */
export const InlineLoader = ({ text = 'Lädt...' }: { text?: string }) => (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
    <span className="text-muted-foreground">{text}</span>
  </div>
);

/**
 * Contact card skeleton loader
 */
export const ContactCardSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Multiple contact cards skeleton
 */
export const ContactCardsLoader = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ContactCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Table row skeleton
 */
export const TableRowSkeleton = () => (
  <tr>
    <td className="p-4">
      <Skeleton className="h-4 w-full" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-3/4" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-1/2" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-2/3" />
    </td>
  </tr>
);

/**
 * Form loading overlay
 */
export const FormLoader = () => (
  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">Wird gespeichert...</p>
    </div>
  </div>
);

/**
 * Empty state component
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="text-center py-12">
    {icon && <div className="mb-4 flex justify-center opacity-50">{icon}</div>}
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {description && <p className="text-muted-foreground mb-4">{description}</p>}
    {action && <div>{action}</div>}
  </div>
);
