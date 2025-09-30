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
    const { pickupLocation, pickupDate, dropoffDate } = await req.json();
    
    const AMADEUS_API_KEY = Deno.env.get('AMADEUS_API_KEY');
    if (!AMADEUS_API_KEY) {
      throw new Error('AMADEUS_API_KEY not configured');
    }

    // Get access token
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

    // Search for car rental offers
    const searchParams = new URLSearchParams({
      pickUpLocationCode: pickupLocation,
      pickUpDateTime: `${pickupDate}T10:00:00`,
      dropOffDateTime: `${dropoffDate}T10:00:00`,
      currency: 'USD',
    });

    const carResponse = await fetch(
      `https://test.api.amadeus.com/v1/shopping/car-rental-offers?${searchParams}`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    if (!carResponse.ok) {
      console.error('Car rental search error:', await carResponse.text());
      throw new Error('Failed to search car rentals');
    }

    const carData = await carResponse.json();
    
    // Extract the lowest price per day
    const offers = carData.data || [];
    if (offers.length > 0) {
      const prices = offers.map((offer: any) => parseFloat(offer.price?.total || 0));
      const lowestTotal = Math.min(...prices);
      
      return new Response(
        JSON.stringify({ totalPrice: lowestTotal }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ totalPrice: null }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-car-rental-prices:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', totalPrice: null }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
