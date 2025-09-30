import { ContactFormErrors, CustomerCompanyInput, ContactPersonInput } from "@/types/contacts";

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates company form data
 */
export const validateCompanyForm = (data: Partial<CustomerCompanyInput>): ContactFormErrors => {
  const errors: ContactFormErrors = {};

  if (!data.name?.trim()) {
    errors.name = "Firmenname ist erforderlich";
  }

  if (!data.address?.trim()) {
    errors.address = "Adresse ist erforderlich";
  }

  if (!data.postal_code?.trim()) {
    errors.postal_code = "PLZ ist erforderlich";
  } else if (!/^\d{4}$/.test(data.postal_code.trim())) {
    errors.postal_code = "PLZ muss 4 Ziffern haben";
  }

  if (!data.city?.trim()) {
    errors.city = "Ort ist erforderlich";
  }

  if (!data.country?.trim()) {
    errors.country = "Land ist erforderlich";
  }

  if (data.email && !EMAIL_REGEX.test(data.email)) {
    errors.email = "Ungültige E-Mail-Adresse";
  }

  if (data.phone && !/^[+\d\s()-]+$/.test(data.phone)) {
    errors.phone = "Ungültige Telefonnummer";
  }

  return errors;
};

/**
 * Validates contact person form data
 */
export const validatePersonForm = (data: Partial<ContactPersonInput>): ContactFormErrors => {
  const errors: ContactFormErrors = {};

  if (!data.first_name?.trim()) {
    errors.first_name = "Vorname ist erforderlich";
  }

  if (!data.last_name?.trim()) {
    errors.last_name = "Nachname ist erforderlich";
  }

  if (data.email && !EMAIL_REGEX.test(data.email)) {
    errors.email = "Ungültige E-Mail-Adresse";
  }

  if (data.phone && !/^[+\d\s()-]+$/.test(data.phone)) {
    errors.phone = "Ungültige Telefonnummer";
  }

  if (data.mobile && !/^[+\d\s()-]+$/.test(data.mobile)) {
    errors.mobile = "Ungültige Mobilnummer";
  }

  return errors;
};

/**
 * Checks if form has errors
 */
export const hasErrors = (errors: ContactFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
