import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hotel, MapPin, Star, DollarSign, Users, Bed } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface HotelDetailsProps {
  startDate: Date;
  endDate: Date;
  travelers: number;
}

interface HotelOption {
  id: string;
  name: string;
  rating: number;
  pricePerNight: number;
  currency: string;
  roomType: string;
  beds: number;
  amenities: string[];
  available: boolean;
}

export function HotelDetails({ startDate, endDate, travelers }: HotelDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [pricePerNight, setPricePerNight] = useState<number | null>(null);
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchHotelPrices();
  }, [startDate, endDate, travelers]);

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
      setHotels(data?.hotels || []);
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

          <Button className="w-full" variant="default" onClick={() => setShowDialog(true)}>
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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Available Hotels</DialogTitle>
            <DialogDescription>
              Near Yellowstone National Park - {nights} night{nights > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {hotels.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hotels found. Try different dates.</p>
            ) : (
              hotels.map((hotel) => (
                <Card key={hotel.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{hotel.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < hotel.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          {hotel.available && (
                            <Badge variant="secondary" className="text-xs">Available</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {hotel.roomType || 'Standard'} - {hotel.beds} bed{hotel.beds > 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Accommodates {travelers}
                          </span>
                        </div>
                        {hotel.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {hotel.amenities.slice(0, 5).map((amenity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold">${hotel.pricePerNight.toFixed(0)}</div>
                        <div className="text-sm text-muted-foreground">per night</div>
                        <div className="mt-2 text-sm font-medium">
                          ${(hotel.pricePerNight * nights).toFixed(0)} total
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
