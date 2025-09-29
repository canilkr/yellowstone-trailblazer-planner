import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface Photo {
  id: string;
  url: string;
  name: string;
}

export const PhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const newPhoto: Photo = {
              id: `${Date.now()}-${Math.random()}`,
              url: event.target.result as string,
              name: file.name,
            };
            setPhotos((prev) => [...prev, newPhoto]);
            toast.success("Photo uploaded successfully!");
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    toast.success("Photo removed");
  };

  return (
    <Card className="w-full shadow-[var(--shadow-card)] border-border/50 transition-all duration-300 hover:shadow-xl">
      <CardHeader className="bg-gradient-to-r from-accent/20 to-accent/10">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Camera className="w-6 h-6 text-accent" />
          Trip Photo Gallery
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Upload and manage your Yellowstone memories
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:scale-[1.01]"
              role="button"
              aria-label="Upload photos"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG or WEBP</p>
              </div>
              <input
                id="photo-upload"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6" role="list" aria-label="Uploaded photos">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group transition-all duration-300 hover:scale-105" role="listitem">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-40 object-cover rounded-lg border border-border shadow-sm"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    onClick={() => removePhoto(photo.id)}
                    aria-label={`Remove photo ${photo.name}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
