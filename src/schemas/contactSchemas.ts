import { z } from 'zod';

/**
 * Swiss postal code validation (4 digits)
 */
const swissPostalCodeSchema = z
  .string()
  .regex(/^\d{4}$/, 'PLZ muss aus 4 Ziffern bestehen')
  .min(4, 'PLZ muss 4 Ziffern enthalten')
  .max(4, 'PLZ muss 4 Ziffern enthalten');

/**
 * Swiss phone number validation
 * Accepts formats like: +41791234567, 0791234567, 079 123 45 67
 */
const swissPhoneSchema = z
  .string()
  .regex(/^(\+41|0)[0-9\s\-\/()]{8,}$/, 'Bitte geben Sie eine gültige Schweizer Telefonnummer ein (z.B. +41 79 123 45 67 oder 079 123 45 67)');

/**
 * Email validation
 */
const emailSchema = z
  .string()
  .email('Ungültige E-Mail-Adresse')
  .max(255, 'E-Mail-Adresse ist zu lang');

/**
 * URL validation (optional, but must be valid if provided)
 */
const urlSchema = z
  .string()
  .url('Ungültige URL (z.B. https://example.ch)')
  .or(z.string().length(0))
  .optional();

/**
 * Company validation schema
 */
export const companySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Firmenname ist erforderlich')
    .max(255, 'Firmenname ist zu lang'),
  
  address: z
    .string()
    .trim()
    .min(1, 'Adresse ist erforderlich')
    .max(255, 'Adresse ist zu lang'),
  
  city: z
    .string()
    .trim()
    .min(1, 'Ort ist erforderlich')
    .max(100, 'Ortsname ist zu lang'),
  
  postal_code: swissPostalCodeSchema,
  
  country: z
    .string()
    .trim()
    .min(1, 'Land ist erforderlich')
    .max(100, 'Ländername ist zu lang')
    .default('Schweiz'),
  
  phone: swissPhoneSchema,
  
  email: emailSchema,
  
  website: urlSchema,
  
  vat_number: z
    .string()
    .trim()
    .max(50, 'MwSt-Nummer ist zu lang')
    .optional(),
  
  notes: z
    .string()
    .max(2000, 'Notizen sind zu lang (max. 2000 Zeichen)')
    .optional(),
  
  status: z
    .enum(['aktiv', 'inaktiv', 'potentiell'], {
      errorMap: () => ({ message: 'Status muss aktiv, inaktiv oder potentiell sein' })
    })
    .default('aktiv'),
  
  company_type: z
    .string()
    .trim()
    .min(1, 'Gesellschaftsart ist erforderlich')
    .max(100, 'Gesellschaftsart ist zu lang'),
  
  industry_category: z
    .string()
    .trim()
    .min(1, 'Branche ist erforderlich')
    .max(100, 'Branche ist zu lang'),
  
  contact_type: z
    .enum(['Unternehmen', 'Geschäftskunde'], {
      errorMap: () => ({ message: 'Kontakttyp muss Unternehmen oder Geschäftskunde sein' })
    })
    .default('Unternehmen'),
});

/**
 * Type inference for company form data
 */
export type CompanyFormData = z.infer<typeof companySchema>;

/**
 * Contact person validation schema
 */
export const contactPersonSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, 'Vorname ist erforderlich')
    .max(100, 'Vorname ist zu lang'),
  
  last_name: z
    .string()
    .trim()
    .min(1, 'Nachname ist erforderlich')
    .max(100, 'Nachname ist zu lang'),
  
  position: z
    .string()
    .trim()
    .max(100, 'Position ist zu lang')
    .optional(),
  
  email: emailSchema.optional().or(z.literal('')),
  
  phone: z
    .string()
    .regex(/^(\+41|0)?[0-9\s\-\/()]*$/, 'Ungültiges Telefonformat')
    .max(50, 'Telefonnummer ist zu lang')
    .optional()
    .or(z.literal('')),
  
  mobile: z
    .string()
    .regex(/^(\+41|0)?[0-9\s\-\/()]*$/, 'Ungültiges Mobilformat')
    .max(50, 'Mobilnummer ist zu lang')
    .optional()
    .or(z.literal('')),
  
  is_primary_contact: z.boolean().default(false),
  
  is_employee: z.boolean().default(false),
  
  is_private_customer: z.boolean().default(false),
  
  notes: z
    .string()
    .max(2000, 'Notizen sind zu lang (max. 2000 Zeichen)')
    .optional(),
  
  customer_company_id: z
    .string()
    .uuid('Ungültige Unternehmens-ID')
    .optional(),
  
  status: z
    .enum(['aktiv', 'inaktiv'], {
      errorMap: () => ({ message: 'Status muss aktiv oder inaktiv sein' })
    })
    .default('aktiv'),
  
  contact_type: z
    .string()
    .optional(),
});

/**
 * Type inference for contact person form data
 */
export type ContactPersonFormData = z.infer<typeof contactPersonSchema>;

/**
 * Employee details validation schema
 */
export const employeeDetailsSchema = z.object({
  employee_number: z
    .string()
    .trim()
    .max(50, 'Personalnummer ist zu lang')
    .optional(),
  
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum muss im Format YYYY-MM-DD sein')
    .optional(),
  
  hire_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum muss im Format YYYY-MM-DD sein')
    .optional(),
  
  employment_type: z
    .enum(['vollzeit', 'teilzeit', 'aushilfe', 'praktikant'], {
      errorMap: () => ({ message: 'Ungültiger Beschäftigungstyp' })
    })
    .optional(),
  
  weekly_hours: z
    .number()
    .min(0, 'Wochenstunden müssen positiv sein')
    .max(168, 'Wochenstunden können nicht mehr als 168 sein')
    .optional(),
  
  hourly_rate: z
    .number()
    .min(0, 'Stundenlohn muss positiv sein')
    .max(1000, 'Stundenlohn ist unrealistisch hoch')
    .optional(),
  
  emergency_contact_name: z
    .string()
    .trim()
    .max(200, 'Notfallkontakt-Name ist zu lang')
    .optional(),
  
  emergency_contact_phone: z
    .string()
    .regex(/^(\+41|0)?[0-9\s\-\/()]*$/, 'Ungültiges Telefonformat')
    .max(50, 'Telefonnummer ist zu lang')
    .optional(),
  
  address: z
    .string()
    .trim()
    .max(255, 'Adresse ist zu lang')
    .optional(),
  
  city: z
    .string()
    .trim()
    .max(100, 'Ortsname ist zu lang')
    .optional(),
  
  postal_code: z
    .string()
    .regex(/^\d{4}$/, 'PLZ muss aus 4 Ziffern bestehen')
    .optional()
    .or(z.literal('')),
  
  country: z
    .string()
    .trim()
    .max(100, 'Ländername ist zu lang')
    .optional(),
  
  ahv_number: z
    .string()
    .regex(/^756\.\d{4}\.\d{4}\.\d{2}$/, 'AHV-Nummer muss im Format 756.XXXX.XXXX.XX sein')
    .optional()
    .or(z.literal('')),
  
  marital_status: z
    .enum(['ledig', 'verheiratet', 'geschieden', 'verwitwet', 'eingetragene_partnerschaft'], {
      errorMap: () => ({ message: 'Ungültiger Zivilstand' })
    })
    .optional(),
  
  number_of_children: z
    .number()
    .int('Kinderanzahl muss eine ganze Zahl sein')
    .min(0, 'Kinderanzahl muss positiv sein')
    .max(20, 'Kinderanzahl ist unrealistisch hoch')
    .optional(),
  
  bank_name: z
    .string()
    .trim()
    .max(200, 'Bankname ist zu lang')
    .optional(),
  
  iban: z
    .string()
    .regex(/^CH\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d$/, 'IBAN muss im Format CH00 0000 0000 0000 0000 0 sein')
    .optional()
    .or(z.literal('')),
  
  contract_type: z
    .enum(['unbefristet', 'befristet', 'temporär'], {
      errorMap: () => ({ message: 'Ungültiger Vertragstyp' })
    })
    .optional(),
  
  contract_end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum muss im Format YYYY-MM-DD sein')
    .optional()
    .or(z.literal('')),
  
  probation_end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum muss im Format YYYY-MM-DD sein')
    .optional()
    .or(z.literal('')),
  
  termination_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum muss im Format YYYY-MM-DD sein')
    .optional()
    .or(z.literal('')),
  
  notes: z
    .string()
    .max(2000, 'Notizen sind zu lang (max. 2000 Zeichen)')
    .optional(),
});

/**
 * Type inference for employee details form data
 */
export type EmployeeDetailsFormData = z.infer<typeof employeeDetailsSchema>;

/**
 * Employee child validation schema
 */
export const employeeChildSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name ist erforderlich')
    .max(200, 'Name ist zu lang'),
  
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum muss im Format YYYY-MM-DD sein'),
  
  notes: z
    .string()
    .max(500, 'Notizen sind zu lang (max. 500 Zeichen)')
    .optional(),
});

/**
 * Type inference for employee child form data
 */
export type EmployeeChildFormData = z.infer<typeof employeeChildSchema>;
