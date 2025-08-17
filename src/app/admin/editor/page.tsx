import MapEditor from '@/components/admin/MapEditor';

export default function EditorPage() {
  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-4">
        <h1 className="font-semibold text-2xl md:text-3xl font-headline">Map Editor</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Upload a floor plan, then drag and drop objects to create your interactive map. Use the AI assistant for placement suggestions.
      </p>
      <MapEditor />
    </main>
  );
}
