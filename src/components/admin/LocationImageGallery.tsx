
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LocationImageGalleryProps {
  coverImage?: string;
  gallery?: string[];
}

export default function LocationImageGallery({
  coverImage: initialCoverImage,
  gallery: initialGallery = [],
}: LocationImageGalleryProps) {
  const [coverImage, setCoverImage] = useState(initialCoverImage || 'https://placehold.co/1200x800.png');
  const [gallery, setGallery] = useState(initialGallery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Gallery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video relative rounded-md overflow-hidden border">
          <Image
            src={coverImage}
            alt="Cover Image"
            layout="fill"
            objectFit="cover"
            className="bg-muted"
            data-ai-hint="restaurant interior"
          />
           <div className="absolute top-2 right-2 flex gap-2">
             <Button size="icon" variant="secondary" className="h-8 w-8">
                <ImageIcon />
                <span className="sr-only">Change cover image</span>
             </Button>
           </div>
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
                  onClick={() => setCoverImage(img)}
                  data-ai-hint="restaurant food"
                />
                 <Button size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6 opacity-70 hover:opacity-100">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" className="w-full">
          <Upload className="mr-2" />
          Upload Images
        </Button>
      </CardContent>
    </Card>
  );
}
