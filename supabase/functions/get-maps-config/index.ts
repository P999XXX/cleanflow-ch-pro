import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('get-maps-config: Request received', {
    method: req.method,
    hasAuthHeader: !!req.headers.get('Authorization'),
    url: req.url
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('get-maps-config: Handling CORS preflight');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('get-maps-config: Missing Authorization header');
      return new Response(
        JSON.stringify({ 
          error: 'No authorization header',
          message: 'Authentication required'
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('get-maps-config: Auth header present, checking API key');

    const mapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!mapsApiKey) {
      console.error('get-maps-config: GOOGLE_MAPS_API_KEY environment variable not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Google Maps API key not configured',
          message: 'Please configure GOOGLE_MAPS_API_KEY in Lovable Cloud Secrets'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('get-maps-config: Successfully returning API key (length:', mapsApiKey.length, ')');

    return new Response(
      JSON.stringify({ 
        apiKey: mapsApiKey,
        success: true,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('get-maps-config: Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});