import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface AIAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  type: "analyze" | "social";
  title: string;
  description?: string | null;
  code_snippet?: string | null;
  notes?: string | null;
}

export function AIAnalysisModal({ open, onClose, type, title, description, code_snippet, notes }: AIAnalysisModalProps) {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-analyze", {
        body: { type, title, description, code_snippet, notes },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data.result);
    } catch (err: any) {
      toast.error(err.message || "AI analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-card rounded-lg border-glow p-6 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="fluid-text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {type === "analyze" ? "AI Code Analysis" : "Generate Social Post"}
              </h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="fluid-text-sm text-muted-foreground mb-4">
              {type === "analyze"
                ? `Analyzing: "${title}"`
                : `Creating social captions for: "${title}"`}
            </p>

            {!result && !loading && (
              <button
                onClick={handleGenerate}
                className="w-full bg-gradient-rosy text-primary-foreground rounded-lg py-3 fluid-text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {type === "analyze" ? "Analyze with Claude AI" : "Generate Captions"}
              </button>
            )}

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="ml-3 fluid-text-sm text-muted-foreground">Claude is thinking...</span>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="prose prose-invert prose-sm max-w-none bg-secondary rounded-lg p-4">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
                <button
                  onClick={handleCopy}
                  className="w-full bg-secondary text-secondary-foreground rounded-lg py-2.5 fluid-text-sm font-semibold hover:bg-muted transition-colors border-glow"
                >
                  Copy to Clipboard
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
