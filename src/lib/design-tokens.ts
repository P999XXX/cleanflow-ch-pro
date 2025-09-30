/**
 * Central Design Tokens for CleanFlow.ai
 * Provides consistent styling across the entire application
 */

export const designTokens = {
  // Spacing Scale
  spacing: {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },
  
  // Container Sizes
  containers: {
    dialog: {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      fullMobile: 'max-w-full md:max-w-4xl',
    },
    page: 'container mx-auto',
  },
  
  // Card Styles
  cards: {
    base: 'rounded-lg border border-border bg-card shadow-clean-md',
    interactive: 'rounded-lg border border-border bg-card shadow-clean-md hover:shadow-clean-lg transition-all duration-200 cursor-pointer',
    elevated: 'rounded-lg border border-border bg-card shadow-clean-lg',
  },
  
  // Button Patterns
  buttons: {
    primary: 'bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all',
    primarySolid: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
  },
  
  // Dialog/Modal Patterns
  dialogs: {
    content: 'p-0 gap-0 overflow-y-auto overflow-x-hidden',
    header: 'px-6 py-4 border-b border-border bg-card',
    body: 'px-6 py-4 space-y-4',
    footer: 'px-6 py-4 border-t border-border bg-card flex justify-end gap-3',
    tabs: {
      container: 'border-b border-border',
      list: 'flex w-full h-12 bg-transparent p-0 rounded-none',
      trigger: 'shrink-0 px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary hover:text-foreground',
    },
  },
  
  // Typography
  typography: {
    pageTitle: 'text-2xl md:text-3xl font-bold text-foreground',
    sectionTitle: 'text-xl font-semibold text-foreground',
    cardTitle: 'text-lg font-semibold text-foreground',
    body: 'text-sm text-foreground',
    muted: 'text-sm text-muted-foreground',
  },
  
  // Layout Patterns
  layouts: {
    pageContainer: 'container mx-auto p-3 md:p-6 space-y-4 md:space-y-6 animate-fade-in',
    flexBetween: 'flex items-center justify-between',
    flexStart: 'flex items-start gap-4',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    formGrid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  },
  
  // Mobile Optimizations
  mobile: {
    hideOnMobile: 'hidden md:inline',
    showOnMobile: 'md:hidden',
    fullscreenDialog: 'fixed inset-0 md:relative md:inset-auto',
    responsivePadding: 'px-3 md:px-6',
  },
} as const;

// Type-safe helper to get design tokens
export type DesignTokenKey = keyof typeof designTokens;
export type SpacingKey = keyof typeof designTokens.spacing;
export type ContainerKey = keyof typeof designTokens.containers;
export type CardStyleKey = keyof typeof designTokens.cards;
