import React from 'react';
import { Badge } from "@/components/ui/badge";

/**
 * Get company type abbreviation
 */
export function getCompanyTypeAbbreviation(companyType: string): string {
  const abbreviations: Record<string, string> = {
    'GmbH': 'GmbH',
    'AG': 'AG',
    'Einzelunternehmen': 'EU',
    'Personengesellschaft': 'PG',
    'Kapitalgesellschaft': 'KG',
    'Genossenschaft': 'eG',
    'Stiftung': 'Stift.',
    'Verein': 'e.V.',
    'Kommanditgesellschaft': 'KG',
    'Offene Handelsgesellschaft': 'OHG',
    'Gesellschaft bürgerlichen Rechts': 'GbR',
    'Limited': 'Ltd.',
    'Unternehmergesellschaft': 'UG'
  };
  
  if (abbreviations[companyType]) {
    return abbreviations[companyType];
  }
  
  for (const [fullName, abbrev] of Object.entries(abbreviations)) {
    if (companyType.toLowerCase().includes(fullName.toLowerCase())) {
      return abbrev;
    }
  }
  
  return companyType.length > 3 ? companyType.substring(0, 3) + '.' : companyType;
}

/**
 * Get status badge component for contact status
 */
export function getStatusBadge(status: string): JSX.Element {
  const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline'; className: string }> = {
    aktiv: { 
      label: 'Aktiv', 
      variant: 'default',
      className: 'bg-success/10 text-success border-success/20'
    },
    inaktiv: { 
      label: 'Inaktiv', 
      variant: 'secondary',
      className: 'bg-muted text-muted-foreground border-muted'
    },
    potentiell: { 
      label: 'Potentiell', 
      variant: 'outline',
      className: 'bg-primary/10 text-primary border-primary/20'
    },
  };
  const config = statusConfig[status] || statusConfig.aktiv;
  return (
    <Badge 
      variant={config.variant} 
      className={`${config.className} font-medium border`}
    >
      {config.label}
    </Badge>
  );
}
