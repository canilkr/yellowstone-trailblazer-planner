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

    const [clientId, clientSecret] = AMADEUS_API_KEY.split(':');
    console.log('Attempting auth with client_id length:', clientId?.length, 'client_secret length:', clientSecret?.length);

    if (!clientId || !clientSecret) {
      throw new Error('AMADEUS_API_KEY must be in format: client_id:client_secret');
    }

    // First, get access token from Amadeus
    const tokenResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token error:', errorText);
      throw new Error(`Failed to get Amadeus access token: ${errorText}`);
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
      max: '10',
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
    
    // Extract and format all flight offers
    const flights = (flightData.data || []).map((offer: any) => {
      const outbound = offer.itineraries?.[0];
      const returnFlight = offer.itineraries?.[1];
      
      return {
        id: offer.id,
        price: parseFloat(offer.price?.total || 0),
        currency: offer.price?.currency || 'USD',
        outbound: {
          departure: outbound?.segments?.[0]?.departure?.at,
          arrival: outbound?.segments?.[outbound.segments.length - 1]?.arrival?.at,
          duration: outbound?.duration,
          stops: outbound?.segments?.length - 1,
          airline: outbound?.segments?.[0]?.carrierCode,
        },
        return: returnFlight ? {
          departure: returnFlight?.segments?.[0]?.departure?.at,
          arrival: returnFlight?.segments?.[returnFlight.segments.length - 1]?.arrival?.at,
          duration: returnFlight?.duration,
          stops: returnFlight?.segments?.length - 1,
          airline: returnFlight?.segments?.[0]?.carrierCode,
        } : null,
        seatsAvailable: offer.numberOfBookableSeats || 0,
      };
    });

    const lowestPrice = flights.length > 0 ? flights[0].price : null;

    return new Response(
      JSON.stringify({ price: lowestPrice, flights }),
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
