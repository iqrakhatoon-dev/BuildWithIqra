import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface NewEntryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: "log" | "problem";
}

export function NewEntryModal({ open, onClose, onSuccess, type }: NewEntryModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [tag, setTag] = useState("General");
  const [difficulty, setDifficulty] = useState("Easy");
  const [category, setCategory] = useState("Arrays");
  const [status, setStatus] = useState("unsolved");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      if (type === "log") {
        const { error } = await supabase.from("coding_logs").insert({
          user_id: user.id,
          title,
          description,
          code_snippet: codeSnippet || null,
          tag,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("dsa_problems").insert({
          user_id: user.id,
          title,
          difficulty,
          category,
          status,
          notes: description || null,
        });
        if (error) throw error;
      }
      toast.success(`${type === "log" ? "Log" : "Problem"} added!`);
      onSuccess();
      onClose();
      setTitle("");
      setDescription("");
      setCodeSnippet("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
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
            className="w-full max-w-lg bg-card rounded-lg border-glow p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="fluid-text-lg font-bold text-foreground">
                New {type === "log" ? "Coding Log" : "Problem"}
              </h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="fluid-text-xs text-muted-foreground block mb-1">Title *</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 fluid-text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter title..."
                />
              </div>

              {type === "log" ? (
                <>
                  <div>
                    <label className="fluid-text-xs text-muted-foreground block mb-1">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 fluid-text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      placeholder="What did you work on?"
                    />
                  </div>
                  <div>
                    <label className="fluid-text-xs text-muted-foreground block mb-1">Code Snippet</label>
                    <textarea
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      rows={4}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 fluid-text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      placeholder="Paste code here..."
                    />
                  </div>
                  <div>
                    <label className="fluid-text-xs text-muted-foreground block mb-1">Tag</label>
                    <select
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 fluid-text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {["General", "React", "TypeScript", "DSA", "Backend", "Deploy", "Learning", "Security"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="fluid-text-xs text-muted-foreground block mb-1">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 fluid-text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="fluid-text-xs text-muted-foreground block mb-1">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 fluid-text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="unsolved">Unsolved</option>
                        <option value="attempted">Attempted</option>
                        <option value="solved">Solved</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="fluid-text-xs text-muted-foreground block mb-1">Category</label>
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 fluid-text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="e.g. Arrays, Trees, Graphs..."
                    />
                  </div>
                  <div>
                    <label className="fluid-text-xs text-muted-foreground block mb-1">Notes</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 fluid-text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      placeholder="Any notes..."
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-rosy text-primary-foreground rounded-lg py-2.5 fluid-text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {loading ? "Saving..." : "Add Entry"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
