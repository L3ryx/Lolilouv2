import { type AnalysisResult } from "@shared/schema";
import { LinkItem } from "./LinkItem";
import { AlertCircle, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ResultCardProps {
  result: AnalysisResult;
  index: number;
}

export function ResultCard({ result, index }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-500"
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section */}
        <div className="md:w-2/5 lg:w-1/3 bg-muted/30 relative border-b md:border-b-0 md:border-r border-border/50">
          <div className="absolute inset-0 p-4 flex items-center justify-center">
            {result.originalImage ? (
              <img
                src={result.originalImage}
                alt="Analyzed"
                className="w-full h-full object-contain drop-shadow-sm"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                <ImageIcon className="w-8 h-8 opacity-20" />
                <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
              </div>
            )}
          </div>
          {/* Aspect ratio preserver */}
          <div className="pb-[100%] md:pb-[120%]"></div>
        </div>

        {/* Details Section */}
        <div className="flex-1 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-foreground mb-4 font-display">
            Analysis Results
          </h3>
          
          {result.error ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/5 text-destructive border border-destructive/10 mt-auto mb-auto">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed">{result.error}</p>
            </div>
          ) : result.aliexpressLinks && result.aliexpressLinks.length > 0 ? (
            <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              {result.aliexpressLinks.map((link, i) => (
                <LinkItem key={`${link}-${i}`} url={link} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8 px-4 mt-auto mb-auto">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBag className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No matches found</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
                We couldn't find any AliExpress products matching this image.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
