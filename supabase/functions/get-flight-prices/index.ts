import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { origin, destination, departureDate, returnDate, travelers } = await req.json();
    
    const AMADEUS_API_KEY = Deno.env.get('AMADEUS_API_KEY');
    if (!AMADEUS_API_KEY) {
      throw new Error('AMADEUS_API_KEY not configured');
    }

    // First, get access token from Amadeus
    const tokenResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_API_KEY.split(':')[0],
        client_secret: AMADEUS_API_KEY.split(':')[1],
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Token error:', await tokenResponse.text());
      throw new Error('Failed to get Amadeus access token');
    }

    const { access_token } = await tokenResponse.json();

    // Search for flight offers
    const searchParams = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      returnDate: returnDate,
      adults: travelers.toString(),
      currencyCode: 'USD',
      max: '1',
    });

    const flightResponse = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${searchParams}`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    if (!flightResponse.ok) {
      console.error('Flight search error:', await flightResponse.text());
      throw new Error('Failed to search flights');
    }

    const flightData = await flightResponse.json();
    
    // Extract the lowest price
    const lowestPrice = flightData.data?.[0]?.price?.total || null;

    return new Response(
      JSON.stringify({ price: lowestPrice ? parseFloat(lowestPrice) : null }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-flight-prices:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', price: null }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
