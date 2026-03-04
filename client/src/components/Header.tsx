import { Search } from "lucide-react";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
            <Search className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold font-display tracking-tight text-foreground">
            AliSource
          </span>
        </Link>
      </div>
    </header>
  );
}
