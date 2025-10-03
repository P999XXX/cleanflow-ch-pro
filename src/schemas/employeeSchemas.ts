import { z } from 'zod';

// IBAN validation - Swiss format (CH + 19 digits)
export const ibanSchema = z.string()
  .regex(/^CH[0-9]{2}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{1}$/, 'Ungültiger Schweizer IBAN (Format: CH93 0076 2011 6238 5295 7)')
  .optional()
  .or(z.literal(''));

// AHV number validation - Swiss format (756.xxxx.xxxx.xx)
export const ahvSchema = z.string()
  .regex(/^756\.[0-9]{4}\.[0-9]{4}\.[0-9]{2}$/, 'Ungültige AHV-Nummer (Format: 756.XXXX.XXXX.XX)')
  .optional()
  .or(z.literal(''));

// Employment rate validation (1-100%)
export const employmentRateSchema = z.number()
  .min(1, 'Beschäftigungsgrad muss mindestens 1% sein')
  .max(100, 'Beschäftigungsgrad darf maximal 100% sein')
  .optional();

// Hourly wage validation (positive number)
export const hourlyWageSchema = z.number()
  .positive('Stundenlohn muss positiv sein')
  .optional();

// Employee details schema
export const employeeDetailsSchema = z.object({
  birth_date: z.string().optional(),
  birth_place: z.string().optional(),
  nationality: z.string().optional(),
  current_address: z.string().optional(),
  address_since: z.string().optional(),
  origin_country: z.string().optional(),
  permit_type: z.string().optional(),
  ahv_number: ahvSchema,
  marital_status: z.string().optional(),
  tax_residence: z.boolean().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  employment_start_date: z.string().optional(),
  hourly_wage: hourlyWageSchema,
  iban: ibanSchema,
  employment_rate: employmentRateSchema,
});

export type EmployeeDetailsFormData = z.infer<typeof employeeDetailsSchema>;

// Child schema
export const childSchema = z.object({
  first_name: z.string().min(1, 'Vorname ist erforderlich'),
  last_name: z.string().min(1, 'Nachname ist erforderlich'),
  birth_date: z.string().min(1, 'Geburtsdatum ist erforderlich'),
});

export type ChildFormData = z.infer<typeof childSchema>;

// Helper function to format IBAN with spaces
export const formatIBAN = (iban: string): string => {
  // Remove all spaces
  const cleaned = iban.replace(/\s/g, '');
  
  // Add spaces every 4 characters
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

// Helper function to validate IBAN checksum (Mod 97 algorithm)
export const validateIBANChecksum = (iban: string): boolean => {
  const cleaned = iban.replace(/\s/g, '');
  
  // Move first 4 characters to end
  const rearranged = cleaned.substring(4) + cleaned.substring(0, 4);
  
  // Replace letters with numbers (A=10, B=11, etc.)
  const numeric = rearranged.replace(/[A-Z]/g, (char) => {
    return (char.charCodeAt(0) - 55).toString();
  });
  
  // Calculate mod 97
  let remainder = numeric;
  while (remainder.length > 2) {
    const block = remainder.substring(0, 9);
    remainder = (parseInt(block, 10) % 97).toString() + remainder.substring(block.length);
  }
  
  return parseInt(remainder, 10) % 97 === 1;
};

// Helper function to format AHV number
export const formatAHV = (ahv: string): string => {
  // Remove all non-numeric characters
  const cleaned = ahv.replace(/\D/g, '');
  
  // Add dots at the correct positions (756.XXXX.XXXX.XX)
  if (cleaned.length === 13 && cleaned.startsWith('756')) {
    return `${cleaned.substring(0, 3)}.${cleaned.substring(3, 7)}.${cleaned.substring(7, 11)}.${cleaned.substring(11, 13)}`;
  }
  
  return ahv;
};
