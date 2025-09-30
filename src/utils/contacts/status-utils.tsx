import { Badge } from "@/components/ui/badge";

/**
 * Status badge configuration
 */
const statusConfig = {
  aktiv: { variant: "default" as const, label: "Aktiv" },
  inaktiv: { variant: "secondary" as const, label: "Inaktiv" },
  potenziell: { variant: "outline" as const, label: "Potenziell" },
};

/**
 * Renders a status badge component
 */
export const getStatusBadge = (status?: string) => {
  if (!status) return null;
  
  const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig];
  if (!config) return null;

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

/**
 * Gets status color class
 */
export const getStatusColor = (status?: string): string => {
  const colorMap: { [key: string]: string } = {
    aktiv: "text-green-600",
    inaktiv: "text-gray-600",
    potenziell: "text-blue-600",
  };
  return status ? colorMap[status.toLowerCase()] || "" : "";
};
