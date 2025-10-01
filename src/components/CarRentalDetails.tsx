import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, MapPin, Users, DollarSign, Fuel } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface CarRentalDetailsProps {
  startDate: Date;
  endDate: Date;
  travelers: number;
}

export function CarRentalDetails({ startDate, endDate, travelers }: CarRentalDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCarRentalPrices();
  }, [startDate, endDate]);

  const fetchCarRentalPrices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-car-rental-prices', {
        body: {
          pickupLocation: 'JAC',
          pickupDate: startDate.toISOString().split('T')[0],
          dropoffDate: endDate.toISOString().split('T')[0],
        },
      });

      if (error) throw error;
      setTotalPrice(data?.totalPrice || null);
    } catch (error) {
      console.error('Error fetching car rental prices:', error);
      toast({
        title: "Unable to fetch car rental prices",
        description: "Using estimated prices instead",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const estimatedTotal = totalPrice || (days * 65);
  const pricePerDay = Math.round(estimatedTotal / days);

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
          <Car className="h-5 w-5" />
          Car Rental Options
        </CardTitle>
        <CardDescription>
          Vehicles available at Jackson Hole Airport (JAC)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* SUV Option */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-semibold">SUV - Recommended for Yellowstone</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Jackson Hole Airport</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Seats {travelers <= 5 ? travelers : 5}
                </span>
                <span className="flex items-center gap-1">
                  <Fuel className="h-4 w-4" />
                  Automatic
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold flex items-center gap-1">
                <DollarSign className="h-5 w-5" />
                {pricePerDay}
              </p>
              <p className="text-sm text-muted-foreground">per day</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded p-2 text-sm space-y-1">
            <p className="font-medium">Total for {days} days:</p>
            <p className="text-lg font-bold">${estimatedTotal.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Includes unlimited mileage</p>
          </div>

          <Button className="w-full" variant="default">
            View SUV Options
          </Button>
        </div>

        {/* Other Vehicle Options */}
        <div className="border rounded-lg p-4 space-y-2">
          <p className="font-semibold text-sm">Other Vehicle Types</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>🚗 Sedan (Economy)</span>
              <span className="font-medium">${Math.round(pricePerDay * 0.7)}/day</span>
            </div>
            <div className="flex justify-between">
              <span>🚙 Crossover</span>
              <span className="font-medium">${Math.round(pricePerDay * 0.85)}/day</span>
            </div>
            <div className="flex justify-between">
              <span>🚐 Minivan (7+ passengers)</span>
              <span className="font-medium">${Math.round(pricePerDay * 1.3)}/day</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>💡 Tip: SUVs are recommended for Yellowstone's varied terrain and wildlife viewing.</p>
          <p className="mt-2">Prices include standard insurance. Additional coverage available at checkout.</p>
        </div>
      </CardContent>
    </Card>
  );
}
