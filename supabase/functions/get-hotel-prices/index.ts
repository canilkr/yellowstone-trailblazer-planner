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
    const { cityCode, checkInDate, checkOutDate, adults } = await req.json();
    
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

    // Search for hotel offers
    const searchParams = new URLSearchParams({
      cityCode: cityCode,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      adults: adults.toString(),
      roomQuantity: '1',
      currency: 'USD',
      bestRateOnly: 'false',
    });

    const hotelResponse = await fetch(
      `https://test.api.amadeus.com/v3/shopping/hotel-offers?${searchParams}`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    if (!hotelResponse.ok) {
      console.error('Hotel search error:', await hotelResponse.text());
      throw new Error('Failed to search hotels');
    }

    const hotelData = await hotelResponse.json();
    
    // Format all hotel offers
    const hotels = (hotelData.data || []).slice(0, 10).map((hotel: any) => {
      const offer = hotel.offers?.[0];
      return {
        id: hotel.hotel?.hotelId,
        name: hotel.hotel?.name || 'Hotel',
        rating: hotel.hotel?.rating,
        pricePerNight: parseFloat(offer?.price?.total || 0),
        currency: offer?.price?.currency || 'USD',
        roomType: offer?.room?.typeEstimated?.category,
        beds: offer?.room?.typeEstimated?.beds,
        amenities: hotel.hotel?.amenities || [],
        available: offer?.policies?.guarantee?.acceptedPayments?.methods?.length > 0,
      };
    });

    const avgPricePerNight = hotels.length > 0 
      ? hotels.reduce((sum: number, h: any) => sum + h.pricePerNight, 0) / hotels.length 
      : null;

    return new Response(
      JSON.stringify({ pricePerNight: avgPricePerNight, hotels }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-hotel-prices:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', pricePerNight: null }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
