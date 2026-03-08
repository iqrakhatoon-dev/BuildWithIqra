import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, CheckCircle2, Circle, Trash2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AIAnalysisModal } from "@/components/AIAnalysisModal";

const difficultyStyle: Record<string, string> = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-red-400",
};

export default function ProblemLibrary() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [aiModal, setAiModal] = useState<{ open: boolean; problem: any }>({ open: false, problem: null });

  const { data: problems = [], isLoading } = useQuery({
    queryKey: ["dsa-problems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dsa_problems")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("dsa_problems").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Problem deleted");
      queryClient.invalidateQueries({ queryKey: ["dsa-problems"] });
      queryClient.invalidateQueries({ queryKey: ["dsa-count"] });
      queryClient.invalidateQueries({ queryKey: ["dsa-solved"] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fluid-text-2xl font-bold text-foreground">
          Problem <span className="text-gradient-rosy">Library</span>
        </h1>
        <p className="fluid-text-sm text-muted-foreground mt-1">
          {problems.filter((p) => p.status === "solved").length}/{problems.length} solved
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 fluid-text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          {["all", "solved", "attempted", "unsolved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg fluid-text-xs capitalize transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="fluid-text-sm text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="fluid-text-sm text-muted-foreground">No problems found. Add some from the Dashboard!</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 fluid-text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 fluid-text-xs text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="text-left py-3 px-4 fluid-text-xs text-muted-foreground uppercase tracking-wider">Difficulty</th>
                  <th className="text-left py-3 px-4 fluid-text-xs text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-4 fluid-text-xs text-muted-foreground uppercase tracking-wider">Platform</th>
                  <th className="text-left py-3 px-4 fluid-text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((problem, i) => (
                  <motion.tr
                    key={problem.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      {problem.status === "solved" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : (
                        <Circle className={`h-5 w-5 ${problem.status === "attempted" ? "text-yellow-400" : "text-muted-foreground"}`} />
                      )}
                    </td>
                    <td className="py-3 px-4 fluid-text-sm text-foreground font-medium">{problem.title}</td>
                    <td className={`py-3 px-4 fluid-text-sm font-medium ${difficultyStyle[problem.difficulty] || ""}`}>{problem.difficulty}</td>
                    <td className="py-3 px-4">
                      <span className="bg-secondary px-2 py-1 rounded fluid-text-xs text-secondary-foreground">{problem.category}</span>
                    </td>
                    <td className="py-3 px-4 fluid-text-xs text-muted-foreground">{problem.platform}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAiModal({ open: true, problem })}
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="AI Analysis"
                        >
                          <Sparkles className="h-4 w-4" />
                        </button>
                        {isAdmin && (
                          <button onClick={() => handleDelete(problem.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((problem, i) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card rounded-lg p-4 border-glow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {problem.status === "solved" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                    ) : (
                      <Circle className={`h-4 w-4 shrink-0 ${problem.status === "attempted" ? "text-yellow-400" : "text-muted-foreground"}`} />
                    )}
                    <h3 className="fluid-text-sm font-medium text-foreground">{problem.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`fluid-text-xs font-medium ${difficultyStyle[problem.difficulty] || ""}`}>{problem.difficulty}</span>
                    <button
                      onClick={() => setAiModal({ open: true, problem })}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                    </button>
                    {isAdmin && (
                      <button onClick={() => handleDelete(problem.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <span className="bg-secondary px-2 py-0.5 rounded fluid-text-xs text-secondary-foreground">{problem.category}</span>
                  <span className="fluid-text-xs text-muted-foreground">{problem.platform}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <AIAnalysisModal
        open={aiModal.open}
        onClose={() => setAiModal({ open: false, problem: null })}
        type="analyze"
        title={aiModal.problem?.title || ""}
        notes={aiModal.problem?.notes}
      />
    </div>
  );
}
