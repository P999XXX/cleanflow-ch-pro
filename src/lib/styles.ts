import { cn } from "@/lib/utils";

/**
 * Common CSS class utilities for CleanFlow.ai design system
 * These utilities ensure consistent styling across the application
 */

export const layout = {
  // Page containers
  page: "container mx-auto p-6 animate-fade-in",
  pageHeader: "flex items-center gap-2 mb-6",
  pageTitle: "text-2xl font-bold text-foreground",
  
  // Card containers
  card: "shadow-clean-md border border-border bg-card",
  cardElegant: "shadow-clean-lg border border-border bg-card",
  
  // Form layouts
  formGrid: "grid grid-cols-1 md:grid-cols-2 gap-4",
  formSection: "space-y-4",
  inputGroup: "space-y-2",
  
  // Flex layouts
  flexBetween: "flex items-center justify-between",
  flexCenter: "flex items-center justify-center",
  flexStart: "flex items-start gap-4",
};

export const interactive = {
  // Button styles
  buttonPrimary: "bg-primary text-primary-foreground hover:bg-primary-hover transition-colors",
  buttonSecondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover transition-colors",
  buttonOutline: "border border-border hover:bg-accent hover:text-accent-foreground transition-colors",
  
  // Hover effects
  hoverScale: "transition-transform duration-200 hover:scale-105",
  hoverScaleSm: "transition-transform duration-200 hover:scale-102",
  hoverBg: "transition-colors hover:bg-accent hover:text-accent-foreground",
  
  // Focus states
  focusRing: "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
};

export const status = {
  // Status indicators
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-primary/10 text-primary border-primary/20",
  
  // Background variants
  successBg: "bg-success/5 border-success/20",
  warningBg: "bg-warning/5 border-warning/20",
  errorBg: "bg-destructive/5 border-destructive/20",
  infoBg: "bg-primary/5 border-primary/20",
};

export const typography = {
  // Headings
  h1: "text-3xl font-bold text-foreground",
  h2: "text-2xl font-bold text-foreground",
  h3: "text-xl font-semibold text-foreground",
  h4: "text-lg font-semibold text-foreground",
  
  // Body text
  body: "text-sm text-foreground",
  bodyLarge: "text-base text-foreground",
  muted: "text-sm text-muted-foreground",
  
  // Links
  link: "text-primary hover:text-primary-hover transition-colors",
  linkMuted: "text-muted-foreground hover:text-foreground transition-colors",
};

export const spacing = {
  // Section spacing
  section: "space-y-6",
  sectionTight: "space-y-4",
  sectionLoose: "space-y-8",
  
  // Component spacing
  stack: "space-y-4",
  stackTight: "space-y-2",
  stackLoose: "space-y-6",
  
  // Padding
  padSection: "p-6",
  padContent: "p-4",
  padCompact: "p-2",
};

/**
 * Utility function to combine multiple style objects
 */
export function combineStyles(...styles: (string | undefined | null | false)[]) {
  return cn(...styles.filter(Boolean));
}

/**
 * Common component patterns
 */
export const patterns = {
  // Authentication pages
  authPage: combineStyles(
    "min-h-screen flex items-center justify-center",
    "bg-gradient-to-br from-background via-background to-accent/5 p-4"
  ),
  
  // Empty states
  emptyState: combineStyles(
    "border-dashed border-2 border-muted",
    "flex flex-col items-center justify-center py-12 text-center"
  ),
  
  // Loading states
  loadingOverlay: "fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50",
  
  // Icon containers
  iconContainer: "p-3 rounded-full bg-muted/50",
  iconContainerLarge: "p-4 rounded-full bg-muted/50",
  
  // Status indicators
  statusDot: "w-2 h-2 rounded-full",
  statusBadge: "px-2 py-1 rounded-full text-xs font-medium",
};