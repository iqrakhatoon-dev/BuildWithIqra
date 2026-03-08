import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, Code2, BookOpen, GitCommit, Trash2, Share2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { toast } from "sonner";
import { AIAnalysisModal } from "@/components/AIAnalysisModal";

const tagIcons: Record<string, typeof Code2> = {
  React: Code2,
  TypeScript: Code2,
  DSA: CheckCircle2,
  Backend: GitCommit,
  Deploy: GitCommit,
  Learning: BookOpen,
  Security: BookOpen,
  General: Code2,
};

export default function CodingLog() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [socialModal, setSocialModal] = useState<{ open: boolean; entry: any }>({ open: false, entry: null });

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["coding-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coding_logs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("coding_logs").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Log deleted");
      queryClient.invalidateQueries({ queryKey: ["coding-logs"] });
      queryClient.invalidateQueries({ queryKey: ["recent-logs"] });
      queryClient.invalidateQueries({ queryKey: ["log-count"] });
    }
  };

  const grouped = logs.reduce<Record<string, typeof logs>>((acc, log) => {
    const date = format(new Date(log.created_at), "MMMM d, yyyy");
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="fluid-text-2xl font-bold text-foreground">
          Coding <span className="text-gradient-rosy">Log</span>
        </h1>
        <p className="fluid-text-sm text-muted-foreground mt-1">Track your daily progress</p>
      </div>

      {isLoading ? (
        <p className="fluid-text-sm text-muted-foreground">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="fluid-text-sm text-muted-foreground">No logs yet. Add entries from the Dashboard!</p>
      ) : (
        <div className="relative">
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-8">
            {Object.entries(grouped).map(([date, entries], di) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: di * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative z-10 w-3 h-3 rounded-full bg-primary glow-rosy ml-[10px] md:ml-[18px]" />
                  <h3 className="fluid-text-base font-semibold text-foreground">{date}</h3>
                </div>
                <div className="ml-10 md:ml-14 space-y-3">
                  {entries.map((entry, ei) => {
                    const Icon = tagIcons[entry.tag || "General"] || Code2;
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: di * 0.1 + ei * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-card rounded-lg p-4 border-glow hover:glow-rosy transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="fluid-text-sm font-medium text-foreground">{entry.title}</h4>
                              {entry.tag && (
                                <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{entry.tag}</span>
                              )}
                              <div className="ml-auto flex items-center gap-1.5">
                                <button
                                  onClick={() => setSocialModal({ open: true, entry })}
                                  className="text-primary hover:text-primary/80 transition-colors"
                                  title="Generate Social Post"
                                >
                                  <Share2 className="h-3.5 w-3.5" />
                                </button>
                                {isAdmin && (
                                  <button onClick={() => handleDelete(entry.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                            {entry.description && (
                              <p className="fluid-text-xs text-muted-foreground mt-1">{entry.description}</p>
                            )}
                            {entry.code_snippet && (
                              <pre className="mt-2 bg-secondary rounded p-3 text-xs text-foreground overflow-x-auto font-mono">
                                {entry.code_snippet}
                              </pre>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AIAnalysisModal
        open={socialModal.open}
        onClose={() => setSocialModal({ open: false, entry: null })}
        type="social"
        title={socialModal.entry?.title || ""}
        description={socialModal.entry?.description}
        code_snippet={socialModal.entry?.code_snippet}
      />
    </div>
  );
}
