import { Home, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const WhereToStay = () => {
  return (
    <section className="py-16 bg-secondary/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Where to Stay
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Choose between staying inside the park or nearby gateway towns
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Home className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl">Inside the Park</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Historic Lodges</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Old Faithful Inn - Iconic log structure</li>
                  <li>• Lake Yellowstone Hotel - Elegant lakeside</li>
                  <li>• Mammoth Hot Springs Hotel</li>
                  <li>• Canyon Lodge & Cabins</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Campgrounds</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 12 campgrounds (some reservable)</li>
                  <li>• RV and tent sites available</li>
                  <li>• Backcountry camping permits</li>
                </ul>
              </div>
              <p className="text-xs italic text-primary">Book 6-12 months in advance</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl">Nearby Gateway Towns</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">West Yellowstone, MT</h4>
                <p className="text-sm text-muted-foreground">
                  Most popular gateway, minutes from West Entrance
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Gardiner, MT</h4>
                <p className="text-sm text-muted-foreground">
                  North Entrance, year-round access, charming town
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Jackson, WY</h4>
                <p className="text-sm text-muted-foreground">
                  Upscale option near South Entrance & Grand Teton
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cody, WY</h4>
                <p className="text-sm text-muted-foreground">
                  East Entrance, Wild West heritage town
                </p>
              </div>
              <p className="text-xs italic text-primary">More availability & dining options</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
