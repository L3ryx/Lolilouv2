import { ExternalLink, ShoppingBag } from "lucide-react";

interface LinkItemProps {
  url: string;
}

export function LinkItem({ url }: LinkItemProps) {
  // Try to extract a clean display name or domain
  const displayUrl = (() => {
    try {
      const urlObj = new URL(url);
      let hostname = urlObj.hostname.replace("www.", "");
      // Truncate path if it's too long to keep it minimal
      let path = urlObj.pathname;
      if (path.length > 20) path = path.substring(0, 20) + "...";
      return hostname + path;
    } catch {
      return url.length > 40 ? url.substring(0, 40) + "..." : url;
    }
  })();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group flex items-center gap-3 p-3 rounded-xl
        bg-secondary/50 border border-transparent
        hover:bg-white hover:border-border hover:shadow-sm
        transition-all duration-300 ease-out
      "
    >
      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform duration-300">
        <ShoppingBag className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          AliExpress Product
        </p>
        <p className="text-xs text-muted-foreground truncate transition-colors group-hover:text-primary">
          {displayUrl}
        </p>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
    </a>
  );
}
