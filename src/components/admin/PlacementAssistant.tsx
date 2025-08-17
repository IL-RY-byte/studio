
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BotMessageSquare, Sparkles, Loader2, Upload, X } from 'lucide-react';
import { getPlacementSuggestions } from '@/app/admin/editor/actions';
import { useToast } from '@/hooks/use-toast';
import type { ObjectType } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PlacementAssistantProps {
  floorPlanUrl: string | null; 
  onSuggestions: (suggestions: any[]) => void;
  disabled?: boolean;
}

export default function PlacementAssistant({ floorPlanUrl, onSuggestions, disabled }: PlacementAssistantProps) {
  const [objectType, setObjectType] = useState<ObjectType>('table');
  const [exampleLayouts, setExampleLayouts] = useState<string[]>([]);
  const [exampleFiles, setExampleFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
     if (files.length + exampleLayouts.length > 3) {
      toast({ variant: "destructive", title: "Maximum 3 examples allowed."});
      return;
    }

    setExampleFiles(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setExampleLayouts(prev => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExample = (index: number) => {
    setExampleLayouts(prev => prev.filter((_, i) => i !== index));
    setExampleFiles(prev => prev.filter((_, i) => i !== index));
  }

  const handleGetSuggestions = async () => {
    if (!floorPlanUrl) {
      toast({
        variant: "destructive",
        title: "No Floor Plan",
        description: "Please upload a floor plan before getting suggestions.",
      });
      return;
    }

    setIsLoading(true);

    const result = await getPlacementSuggestions({ floorPlanDataUri: floorPlanUrl, objectType, exampleLayouts });
    
    setIsLoading(false);

    if ('error' in result) {
        toast({ variant: "destructive", title: "AI Assistant Error", description: result.error });
    } else if (result && result.length > 0) {
        onSuggestions(result);
        toast({ title: "Suggestions Ready", description: `${result.length} new placements suggested by AI.` });
    } else {
        toast({ title: "No suggestions found", description: "The AI assistant could not find any suitable placements." });
    }
  };

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <CardTitle>AI Placement Assistant</CardTitle>
        </div>
        <CardDescription>Let AI help you optimize your space.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Object Type</Label>
          <Select value={objectType} onValueChange={(value) => setObjectType(value as ObjectType)} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder="Select an object" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="sunbed">Sunbed</SelectItem>
              <SelectItem value="workspace">Workspace</SelectItem>
              <SelectItem value="boat">Boat/Jet Ski</SelectItem>
              <SelectItem value="room">Room/House</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Inspiration (Optional)</Label>
          <CardDescription className="text-xs">Provide up to 3 example layouts.</CardDescription>
          <div className="grid grid-cols-3 gap-2">
            {exampleLayouts.map((src, index) => (
              <div key={index} className="relative aspect-square">
                <Image src={src} alt={`Example ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md" />
                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => removeExample(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
           {exampleLayouts.length < 3 && (
            <Button asChild variant="outline" className="w-full" disabled={disabled}>
              <label htmlFor="example-upload" className={cn("cursor-pointer", disabled && "cursor-not-allowed")}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Examples
              </label>
            </Button>
           )}
          <input id="example-upload" type="file" multiple className="hidden" accept="image/*" onChange={handleFileChange} disabled={disabled} />
        </div>

        <Button onClick={handleGetSuggestions} disabled={isLoading || disabled} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BotMessageSquare className="mr-2 h-4 w-4" />
          )}
          Get Suggestions
        </Button>
      </CardContent>
    </Card>
  );
}
