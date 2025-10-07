import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import oldFaithfulImg from "@/assets/old-faithful.jpg";
import grandPrismaticImg from "@/assets/hero-grand-prismatic.jpg";
import yellowstoneLakeImg from "@/assets/yellowstone-lake.jpg";
import grandCanyonImg from "@/assets/grand-canyon-yellowstone.jpg";
import wildlifeImg from "@/assets/wildlife-bison.jpg";

export const TopAttractions = () => {
  const attractions = [
    {
      title: "Old Faithful Geyser",
      description: "The world's most famous geyser erupts approximately every 90 minutes",
      image: oldFaithfulImg
    },
    {
      title: "Grand Prismatic Spring",
      description: "The largest hot spring in the US, with stunning rainbow colors",
      image: grandPrismaticImg
    },
    {
      title: "Yellowstone Lake",
      description: "One of the largest high-elevation lakes in North America",
      image: yellowstoneLakeImg
    },
    {
      title: "Grand Canyon of the Yellowstone",
      description: "Dramatic canyon with spectacular waterfalls and colorful rock formations",
      image: grandCanyonImg
    },
    {
      title: "Wildlife Viewing",
      description: "Encounter bison, bears, wolves, and elk throughout the park",
      image: wildlifeImg
    }
  ];

  return (
    <section className="py-16 bg-secondary/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Top Attractions
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Must-see destinations in America's wonderland
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.map((attraction, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={attraction.image}
                  alt={attraction.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{attraction.title}</CardTitle>
                <CardDescription>{attraction.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
