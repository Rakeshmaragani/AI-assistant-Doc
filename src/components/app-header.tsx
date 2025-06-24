import { BookMarked } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center gap-3 px-4">
        <BookMarked className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground">
          Document Sage
        </h1>
      </div>
    </header>
  );
}
