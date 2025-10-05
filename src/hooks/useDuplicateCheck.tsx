import { useState, useEffect, useCallback } from 'react';
import { useCompanies } from './useCompanies';
import { useContactPersons } from './useContactPersons';

interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicates: Array<{
    id: string;
    name: string;
    type: 'company' | 'person';
    similarity: number;
  }>;
}

/**
 * Hook for checking duplicate contacts with debouncing
 */
export function useDuplicateCheck() {
  const { data: companies } = useCompanies();
  const { data: persons } = useContactPersons();
  const [isChecking, setIsChecking] = useState(false);

  const checkCompanyDuplicate = useCallback(
    (name: string, excludeId?: string): DuplicateCheckResult => {
      if (!name || name.trim().length < 3) {
        return { isDuplicate: false, duplicates: [] };
      }

      const searchTerm = name.toLowerCase().trim();
      const duplicates = companies
        ?.filter((c) => {
          if (excludeId && c.id === excludeId) return false;
          const companyName = c.name.toLowerCase();
          
          // Exact match or very similar
          if (companyName === searchTerm) return true;
          
          // Contains search term
          if (companyName.includes(searchTerm) || searchTerm.includes(companyName)) {
            return true;
          }
          
          return false;
        })
        .map((c) => ({
          id: c.id,
          name: c.name,
          type: 'company' as const,
          similarity: calculateSimilarity(name, c.name),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3) || [];

      return {
        isDuplicate: duplicates.length > 0,
        duplicates,
      };
    },
    [companies]
  );

  const checkPersonDuplicate = useCallback(
    (firstName: string, lastName: string, excludeId?: string): DuplicateCheckResult => {
      if (!firstName || !lastName || firstName.trim().length < 2 || lastName.trim().length < 2) {
        return { isDuplicate: false, duplicates: [] };
      }

      const searchFirst = firstName.toLowerCase().trim();
      const searchLast = lastName.toLowerCase().trim();
      
      const duplicates = persons
        ?.filter((p) => {
          if (excludeId && p.id === excludeId) return false;
          const personFirst = p.first_name.toLowerCase();
          const personLast = p.last_name.toLowerCase();
          
          // Exact match
          if (personFirst === searchFirst && personLast === searchLast) return true;
          
          // Very close match (account for typos)
          if (
            (personFirst === searchFirst || personLast === searchLast) &&
            (personFirst.includes(searchFirst) || personLast.includes(searchLast))
          ) {
            return true;
          }
          
          return false;
        })
        .map((p) => ({
          id: p.id,
          name: `${p.first_name} ${p.last_name}`,
          type: 'person' as const,
          similarity: calculateSimilarity(`${firstName} ${lastName}`, `${p.first_name} ${p.last_name}`),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3) || [];

      return {
        isDuplicate: duplicates.length > 0,
        duplicates,
      };
    },
    [persons]
  );

  return {
    checkCompanyDuplicate,
    checkPersonDuplicate,
    isChecking,
  };
}

/**
 * Calculate similarity between two strings (0-1)
 * Simple Levenshtein-based approach
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(s1, s2);
  return 1 - distance / maxLen;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}
