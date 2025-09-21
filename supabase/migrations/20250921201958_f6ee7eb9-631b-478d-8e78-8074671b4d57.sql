-- Add new fields to customer_companies table
ALTER TABLE public.customer_companies 
ADD COLUMN company_type text,
ADD COLUMN industry_category text;