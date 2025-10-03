import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactPayload {
  contact: {
    id?: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    mobile?: string;
    address?: string;
    postal_code?: string;
    city?: string;
    country?: string;
    contact_type: string;
    is_employee: boolean;
    is_private_customer: boolean;
    status?: string;
    notes?: string;
  };
  employee_details?: {
    birth_date?: string;
    birth_place?: string;
    nationality?: string;
    current_address?: string;
    address_since?: string;
    origin_country?: string;
    permit_type?: string;
    ahv_number?: string;
    marital_status?: string;
    tax_residence?: boolean;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    employment_start_date?: string;
    hourly_wage?: number;
    iban?: string;
    employment_rate?: number;
  };
  children?: Array<{
    first_name: string;
    last_name: string;
    birth_date: string;
  }>;
  role?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role for transactions
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // CRITICAL FIX: Get company via user_roles (not owner_id)
    // Only masteradministrator and administrator can save contacts
    const { data: userRole, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('company_id, role')
      .eq('user_id', user.id)
      .in('role', ['masteradministrator', 'administrator'])
      .maybeSingle();

    if (roleError || !userRole) {
      throw new Error('User does not have admin rights in any company');
    }

    const companyId = userRole.company_id;

    // Parse request body
    const payload: ContactPayload = await req.json();
    console.log('Received payload:', JSON.stringify(payload, null, 2));

    const { contact, employee_details, children, role } = payload;
    
    // Variables to track created/updated records for rollback
    let contactId: string | null = null;
    let isNewContact = false;
    let employeeDetailsId: string | null = null;
    let isNewEmployeeDetails = false;

    try {
      // Step 1: Upsert contact_persons
      const contactData = {
        ...contact,
        company_id: companyId,
      };
      
      if (contact.id) {
        // Update existing contact
        const { data: updatedContact, error: contactError } = await supabaseClient
          .from('contact_persons')
          .update(contactData)
          .eq('id', contact.id)
          .select('id')
          .single();

        if (contactError) {
          console.error('Contact update error:', contactError);
          throw new Error(`Contact update failed: ${contactError.message}`);
        }
        contactId = updatedContact.id;
        console.log('Contact updated:', contactId);
      } else {
        // Create new contact
        const { data: newContact, error: contactError } = await supabaseClient
          .from('contact_persons')
          .insert(contactData)
          .select('id')
          .single();

        if (contactError) {
          console.error('Contact insert error:', contactError);
          throw new Error(`Contact creation failed: ${contactError.message}`);
        }
        contactId = newContact.id;
        isNewContact = true;
        console.log('Contact created:', contactId);
      }

      // Step 2: If employee, handle employee_details
      if (contact.is_employee && employee_details) {
        // Check if employee_details already exist
        const { data: existingDetails } = await supabaseClient
          .from('employee_details')
          .select('id')
          .eq('contact_person_id', contactId)
          .maybeSingle();

        const employeeDetailsData = {
          ...employee_details,
          contact_person_id: contactId,
          company_id: companyId,
        };

        if (existingDetails) {
          // Update existing employee details
          const { error: detailsError } = await supabaseClient
            .from('employee_details')
            .update(employeeDetailsData)
            .eq('id', existingDetails.id);

          if (detailsError) {
            console.error('Employee details update error:', detailsError);
            throw new Error(`Employee details update failed: ${detailsError.message}`);
          }
          employeeDetailsId = existingDetails.id;
          console.log('Employee details updated');
        } else {
          // Create new employee details
          const { data: newDetails, error: detailsError } = await supabaseClient
            .from('employee_details')
            .insert(employeeDetailsData)
            .select('id')
            .single();

          if (detailsError) {
            console.error('Employee details insert error:', detailsError);
            throw new Error(`Employee details creation failed: ${detailsError.message}`);
          }
          employeeDetailsId = newDetails.id;
          isNewEmployeeDetails = true;
          console.log('Employee details created:', employeeDetailsId);
        }

        // Step 3: Handle children (CRITICAL FIX: DELETE old records first)
        if (children && children.length > 0 && employeeDetailsId) {
          // DELETE existing children to prevent corruption
          const { error: deleteError } = await supabaseClient
            .from('employee_children')
            .delete()
            .eq('employee_details_id', employeeDetailsId);

          if (deleteError) {
            console.error('Children delete error:', deleteError);
            throw new Error(`Children deletion failed: ${deleteError.message}`);
          }
          console.log('Deleted existing children records');

          // INSERT new children
          const childrenData = children.map(child => ({
            ...child,
            employee_details_id: employeeDetailsId,
          }));

          const { error: childrenError } = await supabaseClient
            .from('employee_children')
            .insert(childrenData);

          if (childrenError) {
            console.error('Children insert error:', childrenError);
            throw new Error(`Children creation failed: ${childrenError.message}`);
          }
          console.log(`Created ${children.length} children records`);
        }

        // Step 4: Handle role assignment if provided
        if (role) {
          const { data: existingRole } = await supabaseClient
            .from('user_roles')
            .select('id')
            .eq('company_id', companyId)
            .eq('user_id', user.id)
            .maybeSingle();

          if (existingRole) {
            const { error: roleError } = await supabaseClient
              .from('user_roles')
              .update({ role })
              .eq('id', existingRole.id);

            if (roleError) {
              console.error('Role update error:', roleError);
              throw new Error(`Role update failed: ${roleError.message}`);
            }
            console.log('Role updated:', role);
          } else {
            const { error: roleError } = await supabaseClient
              .from('user_roles')
              .insert({
                user_id: user.id,
                company_id: companyId,
                role,
              });

            if (roleError) {
              console.error('Role insert error:', roleError);
              throw new Error(`Role creation failed: ${roleError.message}`);
            }
            console.log('Role created:', role);
          }
        }
      }

      // Success - all operations completed
      console.log('All operations completed successfully');

      return new Response(
        JSON.stringify({ 
          success: true, 
          contactId,
          message: 'Contact saved successfully' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );

    } catch (innerError) {
      // ROLLBACK: Attempt to clean up created records
      console.error('Transaction failed, attempting rollback:', innerError);
      
      try {
        // If we created new employee details, delete it
        if (isNewEmployeeDetails && employeeDetailsId) {
          await supabaseClient
            .from('employee_details')
            .delete()
            .eq('id', employeeDetailsId);
          console.log('Rolled back employee details');
        }
        
        // If we created a new contact, delete it
        if (isNewContact && contactId) {
          await supabaseClient
            .from('contact_persons')
            .delete()
            .eq('id', contactId);
          console.log('Rolled back contact');
        }
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
      
      throw innerError;
    }

  } catch (error) {
    console.error('Error in save-contact function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while saving the contact',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
