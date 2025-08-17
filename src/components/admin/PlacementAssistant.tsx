'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BotMessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { getPlacementSuggestions } from '@/app/admin/editor/actions';
import { useToast } from '@/hooks/use-toast';
import type { ObjectType } from '@/lib/types';

interface PlacementAssistantProps {
  floorPlanFile: File | null;
  onSuggestions: (suggestions: any[]) => void;
}

export default function PlacementAssistant({ floorPlanFile, onSuggestions }: PlacementAssistantProps) {
  const [objectType, setObjectType] = useState<ObjectType>('table');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    if (!floorPlanFile) {
      toast({
        variant: "destructive",
        title: "No Floor Plan",
        description: "Please upload a floor plan before getting suggestions.",
      });
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(floorPlanFile);
    reader.onload = async (event) => {
        const floorPlanDataUri = event.target?.result as string;
        const result = await getPlacementSuggestions({ floorPlanDataUri, objectType });
        
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
    reader.onerror = () => {
        setIsLoading(false);
        toast({ variant: 'destructive', title: 'Error reading file' });
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
          <label className="text-sm font-medium">Object Type</label>
          <Select value={objectType} onValueChange={(value) => setObjectType(value as ObjectType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an object" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="sunbed">Sunbed</SelectItem>
              <SelectItem value="workspace">Workspace</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleGetSuggestions} disabled={isLoading || !floorPlanFile} className="w-full">
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
