import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();

    if (!token) {
      return Response.json(
        { error: 'reCAPTCHA token is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get the reCAPTCHA secret key from environment
    const secretKey = Deno.env.get('RECAPTCHA_SECRET_KEY');
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY not found in environment');
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Verify the token with Google
    const verificationResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const verificationResult = await verificationResponse.json();

    if (verificationResult.success) {
      return Response.json(
        { 
          success: true, 
          score: verificationResult.score || null,
          action: verificationResult.action || null 
        },
        { headers: corsHeaders }
      );
    } else {
      return Response.json(
        { 
          success: false, 
          error: 'reCAPTCHA verification failed',
          'error-codes': verificationResult['error-codes'] || []
        },
        { status: 400, headers: corsHeaders }
      );
    }

  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
});