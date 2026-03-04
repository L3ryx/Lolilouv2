import { useState, useEffect } from "react";
import { UploadArea } from "@/components/UploadArea";
import { ResultCard } from "@/components/ResultCard";
import { Header } from "@/components/Header";
import { useAnalyzeImages } from "@/hooks/use-analyze";
import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const { mutate, data: results, isPending, error, reset } = useAnalyzeImages();

  // Create previews and cleanup
  useEffect(() => {
    const objectUrls = files.map(file => URL.createObjectURL(file));
    setPreviews(objectUrls);
    
    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    reset(); // Clear previous results/errors
  };

  const handleClear = () => {
    setFiles([]);
    reset();
  };

  const handleAnalyze = () => {
    if (files.length === 0) return;
    mutate(files);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      <Header />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-32 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-foreground mb-6">
              Find products on <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                AliExpress
              </span> instantly.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Upload images of products you like, and our reverse-search engine will discover the exact matches or closest alternatives for you.
            </p>
          </motion.div>
        </div>

        {/* Interaction Area */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        >
          <UploadArea 
            files={files}
            previews={previews}
            onFilesSelected={handleFilesSelected}
            onClearFiles={handleClear}
            isLoading={isPending}
          />

          {/* Action Button */}
          {files.length > 0 && !results && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleAnalyze}
                disabled={isPending}
                className={`
                  flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base
                  transition-all duration-300 ease-out shadow-lg
                  ${isPending 
                    ? "bg-secondary text-muted-foreground shadow-none cursor-not-allowed" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20"}
                `}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing {files.length} image{files.length !== 1 ? 's' : ''}...
                  </>
                ) : (
                  <>
                    Analyze Images
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10 text-center"
            >
              <h3 className="text-lg font-bold text-destructive mb-2">Analysis Failed</h3>
              <p className="text-sm text-destructive/80">{error.message}</p>
              <button 
                onClick={() => reset()}
                className="mt-4 text-sm font-semibold text-destructive hover:underline"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          {/* Results Grid */}
          {results && results.length > 0 && (
            <div className="mt-16 space-y-10">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-2xl font-bold font-display">Results</h2>
                <button 
                  onClick={handleClear}
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Start Over
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                {results.map((result, idx) => (
                  <ResultCard key={idx} result={result} index={idx} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
