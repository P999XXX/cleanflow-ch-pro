import { toast } from '@/hooks/use-toast';

/**
 * Centralized error handling utilities
 */

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Parse Supabase errors into user-friendly messages
 */
export const parseSupabaseError = (error: any): AppError => {
  // Network errors
  if (error.message?.includes('Failed to fetch')) {
    return {
      message: 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.',
      code: 'NETWORK_ERROR',
    };
  }

  // RLS policy violations
  if (error.message?.includes('row-level security')) {
    return {
      message: 'Sie haben keine Berechtigung für diese Aktion.',
      code: 'PERMISSION_DENIED',
    };
  }

  // Unique constraint violations
  if (error.code === '23505') {
    return {
      message: 'Dieser Eintrag existiert bereits.',
      code: 'DUPLICATE_ENTRY',
    };
  }

  // Foreign key violations
  if (error.code === '23503') {
    return {
      message: 'Dieser Eintrag wird noch verwendet und kann nicht gelöscht werden.',
      code: 'FOREIGN_KEY_VIOLATION',
    };
  }

  // Check constraint violations (validation)
  if (error.code === '23514') {
    // Extract constraint name for better error messages
    if (error.message?.includes('valid_swiss_iban')) {
      return {
        message: 'Ungültiger Schweizer IBAN (Format: CH93 0076 2011 6238 5295 7)',
        code: 'INVALID_IBAN',
      };
    }
    if (error.message?.includes('valid_swiss_ahv')) {
      return {
        message: 'Ungültige AHV-Nummer (Format: 756.XXXX.XXXX.XX)',
        code: 'INVALID_AHV',
      };
    }
    if (error.message?.includes('valid_employment_rate')) {
      return {
        message: 'Beschäftigungsgrad muss zwischen 1% und 100% liegen',
        code: 'INVALID_EMPLOYMENT_RATE',
      };
    }
    if (error.message?.includes('valid_hourly_wage')) {
      return {
        message: 'Stundenlohn muss positiv sein',
        code: 'INVALID_HOURLY_WAGE',
      };
    }
    return {
      message: 'Die eingegebenen Daten sind ungültig.',
      code: 'VALIDATION_ERROR',
    };
  }

  // Authentication errors
  if (error.status === 401 || error.message?.includes('JWT')) {
    return {
      message: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.',
      code: 'AUTH_EXPIRED',
    };
  }

  // Default error
  return {
    message: error.message || 'Ein unerwarteter Fehler ist aufgetreten.',
    code: 'UNKNOWN_ERROR',
    details: error,
  };
};

/**
 * Show error toast with parsed message
 */
export const showErrorToast = (error: any, fallbackMessage?: string) => {
  const parsedError = parseSupabaseError(error);
  
  toast({
    title: 'Fehler',
    description: fallbackMessage || parsedError.message,
    variant: 'destructive',
  });

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('Error details:', parsedError);
  }
};

/**
 * Show success toast
 */
export const showSuccessToast = (message: string) => {
  toast({
    title: 'Erfolg',
    description: message,
  });

  // Vibration feedback on mobile
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
};

/**
 * Async error handler wrapper
 */
export const withErrorHandling = async <T,>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    showErrorToast(error, errorMessage);
    return null;
  }
};
