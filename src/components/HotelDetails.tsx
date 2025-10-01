import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hotel, MapPin, Star, DollarSign, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface HotelDetailsProps {
  city: string;
  startDate: Date;
  endDate: Date;
  travelers: number;
}

export function HotelDetails({ city, startDate, endDate, travelers }: HotelDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [pricePerNight, setPricePerNight] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchHotelPrices();
  }, [city, startDate, endDate, travelers]);

  const fetchHotelPrices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-hotel-prices', {
        body: {
          cityCode: 'JAC', // Jackson Hole area code
          checkInDate: startDate.toISOString().split('T')[0],
          checkOutDate: endDate.toISOString().split('T')[0],
          adults: travelers,
        },
      });

      if (error) throw error;
      setPricePerNight(data?.pricePerNight || null);
    } catch (error) {
      console.error('Error fetching hotel prices:', error);
      toast({
        title: "Unable to fetch hotel prices",
        description: "Using estimated prices instead",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const estimatedPrice = pricePerNight || 150;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hotel className="h-5 w-5" />
          Accommodation Options
        </CardTitle>
        <CardDescription>
          Hotels and lodges near Yellowstone National Park
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Featured Hotel Option */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-semibold">Hotels Near Park Entrance</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>West Yellowstone, MT</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.2</span>
                <span className="text-muted-foreground">(850+ reviews)</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold flex items-center gap-1">
                <DollarSign className="h-5 w-5" />
                {estimatedPrice.toFixed(0)}
              </p>
              <p className="text-sm text-muted-foreground">per night</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Accommodates {travelers} {travelers === 1 ? 'guest' : 'guests'}</span>
          </div>

          <div className="bg-muted/50 rounded p-2 text-sm">
            <p className="font-medium">Total for {nights} nights:</p>
            <p className="text-lg font-bold">${(estimatedPrice * nights).toFixed(0)}</p>
          </div>

          <Button className="w-full" variant="default">
            View Available Hotels
          </Button>
        </div>

        {/* Additional Options */}
        <div className="border rounded-lg p-4 space-y-2">
          <p className="font-semibold text-sm">Other Options</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>🏨 Inside Park Lodges - from $200/night</p>
            <p>🏡 Vacation Rentals - from $180/night</p>
            <p>⛺ Park Campgrounds - from $30/night</p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>💡 Tip: Book accommodations well in advance, especially for summer visits.</p>
          <p className="mt-2">Prices shown are estimates and vary by season and availability.</p>
        </div>
      </CardContent>
    </Card>
  );
}
