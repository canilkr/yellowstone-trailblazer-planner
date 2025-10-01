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

    const [clientId, clientSecret] = AMADEUS_API_KEY.split(':');
    
    if (!clientId || !clientSecret) {
      throw new Error('AMADEUS_API_KEY must be in format: client_id:client_secret');
    }

    // Get access token
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
    
    // Format all car rental offers
    const cars = (carData.data || []).slice(0, 10).map((offer: any) => {
      const vehicle = offer.vehicle;
      return {
        id: offer.id,
        category: vehicle?.category,
        type: vehicle?.modelInfo?.vehicleType,
        transmission: vehicle?.transmission,
        airConditioning: vehicle?.airConditioning,
        seats: vehicle?.seats,
        doors: vehicle?.doors,
        totalPrice: parseFloat(offer.price?.total || 0),
        currency: offer.price?.currency || 'USD',
        mileage: offer.mileage?.unlimited ? 'Unlimited' : offer.mileage?.allowedPerDay,
        provider: offer.provider?.companyName,
      };
    });

    const lowestTotal = cars.length > 0 ? Math.min(...cars.map((c: any) => c.totalPrice)) : null;

    return new Response(
      JSON.stringify({ totalPrice: lowestTotal, cars }),
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
