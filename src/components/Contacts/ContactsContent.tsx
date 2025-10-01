import { ContactsCardsView } from './ContactsCardsView';
import { ContactsTableView } from './ContactsTableView';
import { getStatusBadge } from '@/lib/contactUtils';

interface ContactsContentProps {
  viewMode: 'table' | 'cards';
  activeTab: 'all' | 'companies' | 'persons' | 'employees';
  companies: any[];
  persons: any[];
  employees: any[];
  isSearching: boolean;
  hasNoResults: boolean;
  onClearSearch: () => void;
  onCardClick: (item: any, type: 'company' | 'person') => void;
}

/**
 * Renders the main content area (table or cards view) based on active tab
 */
export function ContactsContent({
  viewMode,
  activeTab,
  companies,
  persons,
  employees,
  isSearching,
  hasNoResults,
  onClearSearch,
  onCardClick,
}: ContactsContentProps) {
  const getDataForTab = () => {
    switch (activeTab) {
      case 'companies':
        return { companies, persons: [], employees: [] };
      case 'persons':
        return { companies: [], persons, employees: [] };
      case 'employees':
        return { companies: [], persons: [], employees };
      default:
        return { companies, persons, employees };
    }
  };

  const data = getDataForTab();

  if (viewMode === 'cards') {
    return (
      <ContactsCardsView
        companies={data.companies}
        persons={data.persons}
        employees={data.employees}
        showSections={true}
        isSearching={isSearching}
        hasNoResults={hasNoResults}
        onClearSearch={onClearSearch}
        onCardClick={onCardClick}
      />
    );
  }

  return (
    <ContactsTableView
      companies={data.companies}
      persons={data.persons}
      employees={data.employees}
      showSections={true}
      isSearching={isSearching}
      hasNoResults={hasNoResults}
      onClearSearch={onClearSearch}
      onCardClick={onCardClick}
      getStatusBadge={getStatusBadge}
    />
  );
}
