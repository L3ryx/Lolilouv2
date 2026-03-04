import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, ImagePlus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadAreaProps {
  files: File[];
  previews: string[];
  onFilesSelected: (files: File[]) => void;
  onClearFiles: () => void;
  isLoading: boolean;
}

export function UploadArea({ files, previews, onFilesSelected, onClearFiles, isLoading }: UploadAreaProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    disabled: isLoading
  });

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {files.length === 0 ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            {...getRootProps()}
            className={`
              relative overflow-hidden
              group cursor-pointer rounded-3xl border-2 border-dashed 
              transition-all duration-300 ease-out py-20 px-8 text-center
              ${isDragActive 
                ? "border-primary bg-primary/5 scale-[1.02]" 
                : "border-border hover:border-primary/50 hover:bg-muted/30 bg-card"}
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input {...getInputProps()} />
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/[0.02] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className={`
                w-20 h-20 rounded-2xl flex items-center justify-center mb-6
                transition-all duration-500 ease-out
                ${isDragActive ? "bg-primary text-primary-foreground shadow-xl scale-110" : "bg-secondary text-foreground group-hover:scale-105 group-hover:shadow-md"}
              `}>
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display text-foreground mb-2">
                {isDragActive ? "Drop images here" : "Upload product images"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Drag and drop your images here, or click to browse. We support JPG, PNG, and WebP.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card rounded-3xl border border-border/50 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold font-display">Ready for analysis</h3>
                <p className="text-sm text-muted-foreground">{files.length} image{files.length !== 1 ? 's' : ''} selected</p>
              </div>
              {!isLoading && (
                <button
                  onClick={onClearFiles}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear files"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {previews.map((preview, idx) => (
                <div key={preview} className="relative group aspect-square rounded-2xl overflow-hidden bg-muted/30 border border-border/50">
                  <img
                    src={preview}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              ))}
              
              {!isLoading && (
                <div
                  {...getRootProps()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-primary hover:bg-muted/30 transition-all duration-300"
                >
                  <input {...getInputProps()} />
                  <ImagePlus className="w-6 h-6 mb-2" />
                  <span className="text-xs font-medium">Add More</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
