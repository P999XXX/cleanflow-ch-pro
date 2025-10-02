-- Add address fields to contact_persons table
ALTER TABLE contact_persons
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Schweiz';

-- Add indices for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_persons_city 
ON contact_persons(city);

CREATE INDEX IF NOT EXISTS idx_contact_persons_postal_code 
ON contact_persons(postal_code);

-- Add comment for documentation
COMMENT ON COLUMN contact_persons.address IS 'Street address of the contact person';
COMMENT ON COLUMN contact_persons.postal_code IS 'Postal code (PLZ)';
COMMENT ON COLUMN contact_persons.city IS 'City name';
COMMENT ON COLUMN contact_persons.country IS 'Country, defaults to Schweiz';