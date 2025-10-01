import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Calendar, Users, DollarSign, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

interface FlightDetailsProps {
  origin: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  travelers: number;
}

interface Flight {
  id: string;
  price: number;
  currency: string;
  outbound: {
    departure: string;
    arrival: string;
    duration: string;
    stops: number;
    airline: string;
  };
  return: {
    departure: string;
    arrival: string;
    duration: string;
    stops: number;
    airline: string;
  } | null;
  seatsAvailable: number;
}

export function FlightDetails({ origin, destination, startDate, endDate, travelers }: FlightDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [flightPrice, setFlightPrice] = useState<number | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFlightPrices();
  }, [origin, destination, startDate, endDate, travelers]);

  const fetchFlightPrices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-flight-prices', {
        body: {
          origin: origin.substring(0, 3).toUpperCase(),
          destination: 'JAC', // Jackson Hole Airport for Yellowstone
          departureDate: startDate.toISOString().split('T')[0],
          returnDate: endDate.toISOString().split('T')[0],
          travelers: travelers,
        },
      });

      if (error) throw error;
      setFlightPrice(data?.price || null);
      setFlights(data?.flights || []);
    } catch (error) {
      console.error('Error fetching flight prices:', error);
      toast({
        title: "Unable to fetch flight prices",
        description: "Using estimated prices instead",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <Plane className="h-5 w-5" />
          Available Flights
        </CardTitle>
        <CardDescription>
          {origin} to Jackson Hole (JAC) - Gateway to Yellowstone
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-semibold">Direct & Connecting Flights</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {travelers} {travelers === 1 ? 'traveler' : 'travelers'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold flex items-center gap-1">
                <DollarSign className="h-5 w-5" />
                {flightPrice ? flightPrice.toFixed(0) : '450'}
              </p>
              <p className="text-sm text-muted-foreground">per person</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Various departure times available</span>
          </div>

          <Button className="w-full" variant="default" onClick={() => setShowDialog(true)}>
            View Flight Options
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>💡 Tip: Book flights to Jackson Hole (JAC) for closest access to Yellowstone's South Entrance.</p>
          <p className="mt-2">Prices shown are estimates. Actual prices may vary based on availability and booking time.</p>
        </div>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Available Flights</DialogTitle>
            <DialogDescription>
              {origin} to Jackson Hole (JAC) - {format(startDate, 'MMM dd')} to {format(endDate, 'MMM dd')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {flights.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No flights found. Try different dates.</p>
            ) : (
              flights.map((flight) => (
                <Card key={flight.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold">${flight.price.toFixed(0)}</div>
                      <div className="text-sm text-muted-foreground">{flight.seatsAvailable} seats left</div>
                    </div>
                    
                    {/* Outbound Flight */}
                    <div className="border-b pb-3 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Plane className="h-4 w-4" />
                        <span className="font-semibold">Outbound</span>
                        <span className="text-sm text-muted-foreground">({flight.outbound.airline})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{format(new Date(flight.outbound.departure), 'HH:mm')}</div>
                          <div className="text-sm text-muted-foreground">{origin}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-sm text-muted-foreground">{flight.outbound.duration}</div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm text-muted-foreground">
                            {flight.outbound.stops === 0 ? 'Direct' : `${flight.outbound.stops} stop${flight.outbound.stops > 1 ? 's' : ''}`}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">{format(new Date(flight.outbound.arrival), 'HH:mm')}</div>
                          <div className="text-sm text-muted-foreground">JAC</div>
                        </div>
                      </div>
                    </div>

                    {/* Return Flight */}
                    {flight.return && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Plane className="h-4 w-4 rotate-180" />
                          <span className="font-semibold">Return</span>
                          <span className="text-sm text-muted-foreground">({flight.return.airline})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{format(new Date(flight.return.departure), 'HH:mm')}</div>
                            <div className="text-sm text-muted-foreground">JAC</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-sm text-muted-foreground">{flight.return.duration}</div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm text-muted-foreground">
                              {flight.return.stops === 0 ? 'Direct' : `${flight.return.stops} stop${flight.return.stops > 1 ? 's' : ''}`}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold">{format(new Date(flight.return.arrival), 'HH:mm')}</div>
                            <div className="text-sm text-muted-foreground">{origin}</div>
                          </div>
                        </div>
                      </div>
                    )}
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
