
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon, Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface LocationImageGalleryProps {
  coverImage?: string;
  gallery?: string[];
  locationId: string;
  onUpdate: (field: 'coverImageUrl' | 'gallery', value: string | string[]) => void;
}

export default function LocationImageGallery({
  coverImage: initialCoverImage,
  gallery: initialGallery = [],
  locationId,
  onUpdate,
}: LocationImageGalleryProps) {
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [gallery, setGallery] = useState(initialGallery);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      toast({ title: 'Processing image...' });

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;

        if (isCover) {
          setCoverImage(dataUrl);
          onUpdate('coverImageUrl', dataUrl);
        } else {
          const newGallery = [...gallery, dataUrl];
          setGallery(newGallery);
          onUpdate('gallery', newGallery);
        }

        toast({ title: 'Image updated locally!' });
        setIsUploading(false);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not process the image.' });
        setIsUploading(false);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    const newGallery = gallery.filter((_, i) => i !== index);
    setGallery(newGallery);
    onUpdate('gallery', newGallery);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Gallery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video relative rounded-md overflow-hidden border bg-muted">
          {coverImage && (
            <Image
              src={coverImage}
              alt="Cover Image"
              layout="fill"
              objectFit="cover"
              className="bg-muted"
              data-ai-hint="restaurant interior"
            />
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <Button asChild size="icon" variant="secondary" className="h-8 w-8">
              <label htmlFor="cover-upload" className="cursor-pointer">
                <ImageIcon />
                <span className="sr-only">Change cover image</span>
              </label>
            </Button>
            <input
              id="cover-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, true)}
              disabled={isUploading}
            />
          </div>
           {isUploading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
        </div>

        {gallery.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {gallery.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                <Image
                  src={img}
                  alt={`Gallery image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setCoverImage(img);
                    onUpdate('coverImageUrl', img);
                  }}
                  data-ai-hint="restaurant food"
                />
                 <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 opacity-70 hover:opacity-100"
                  onClick={() => handleRemoveGalleryImage(index)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button asChild variant="outline" className="w-full" disabled={isUploading}>
           <label htmlFor="gallery-upload" className="cursor-pointer">
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2" />}
              Upload Image
            </label>
        </Button>
         <input
              id="gallery-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, false)}
              disabled={isUploading}
            />
      </CardContent>
    </Card>
  );
}
