'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { UploadView } from '@/components/upload-view';
import { InteractionView } from '@/components/interaction-view';

export default function Home() {
  const [document, setDocument] = useState<{ name: string; content: string } | null>(null);
  const [viewKey, setViewKey] = useState(0); // Used to force re-mount of InteractionView

  const handleFileUpload = (name: string, content: string) => {
    setDocument({ name, content });
    setViewKey(prevKey => prevKey + 1); // Increment key to re-mount InteractionView
  };

  const handleNewUpload = () => {
    setDocument(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        {document ? (
          <InteractionView key={viewKey} document={document} onNewUpload={handleNewUpload} />
        ) : (
          <UploadView onFileUpload={handleFileUpload} />
        )}
      </main>
      <footer className="py-4">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
              <p>Built with Next.js, Genkit, and ShadCN/UI.</p>
          </div>
      </footer>
    </div>
  );
}
