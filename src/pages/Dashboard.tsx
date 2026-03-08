import { motion } from "framer-motion";
import { Code2, GitBranch, Trophy, Flame, TrendingUp, Clock, Plus, LogOut } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { NewEntryModal } from "@/components/NewEntryModal";
import { format } from "date-fns";

const statIcons = [Code2, Flame, GitBranch, Trophy, Clock, TrendingUp];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user, isAdmin, signOut } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"log" | "problem">("log");

  const { data: problemCount = 0 } = useQuery({
    queryKey: ["dsa-count"],
    queryFn: async () => {
      const { count } = await supabase.from("dsa_problems").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: solvedCount = 0 } = useQuery({
    queryKey: ["dsa-solved"],
    queryFn: async () => {
      const { count } = await supabase.from("dsa_problems").select("*", { count: "exact", head: true }).eq("status", "solved");
      return count ?? 0;
    },
  });

  const { data: logCount = 0 } = useQuery({
    queryKey: ["log-count"],
    queryFn: async () => {
      const { count } = await supabase.from("coding_logs").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: recentLogs = [], refetch: refetchLogs } = useQuery({
    queryKey: ["recent-logs"],
    queryFn: async () => {
      const { data } = await supabase.from("coding_logs").select("*").order("created_at", { ascending: false }).limit(5);
      return data ?? [];
    },
  });

  const stats = [
    { label: "Problems Tracked", value: String(problemCount), icon: Code2, change: `${solvedCount} solved` },
    { label: "Coding Logs", value: String(logCount), icon: Clock, change: "Keep going!" },
    { label: "Solved Rate", value: problemCount > 0 ? `${Math.round((solvedCount / problemCount) * 100)}%` : "N/A", icon: Trophy, change: "of all problems" },
  ];

  const openModal = (type: "log" | "problem") => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="fluid-text-2xl font-bold text-foreground">
            Welcome back, <span className="text-gradient-rosy">Iqra</span>
          </h1>
          <p className="fluid-text-sm text-muted-foreground mt-1">
            Here's your development overview
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button onClick={() => openModal("log")} className="flex items-center gap-1.5 bg-gradient-rosy text-primary-foreground px-4 py-2 rounded-lg fluid-text-xs font-semibold hover:opacity-90 transition-opacity">
                <Plus className="h-4 w-4" /> New Log
              </button>
              <button onClick={() => openModal("problem")} className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg fluid-text-xs font-semibold hover:bg-muted transition-colors border-glow">
                <Plus className="h-4 w-4" /> New Problem
              </button>
            </>
          )}
          {user && (
            <button onClick={signOut} className="flex items-center gap-1.5 bg-secondary text-muted-foreground px-3 py-2 rounded-lg fluid-text-xs hover:text-foreground transition-colors">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          )}
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            className="bg-card rounded-lg p-5 md:p-6 border-glow transition-shadow hover:glow-rosy"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="fluid-text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="fluid-text-xl font-bold text-foreground mt-2">{stat.value}</p>
                <p className="fluid-text-xs text-primary mt-1">{stat.change}</p>
              </div>
              <div className="p-2 rounded-md bg-secondary">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-lg p-6 border-glow"
      >
        <h2 className="fluid-text-lg font-semibold text-foreground mb-4">Recent Coding Logs</h2>
        {recentLogs.length === 0 ? (
          <p className="fluid-text-sm text-muted-foreground">No logs yet. {isAdmin ? "Add your first entry!" : "Sign in as admin to add entries."}</p>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="min-w-0 flex-1">
                  <span className="fluid-text-sm text-foreground block truncate">{log.title}</span>
                  {log.description && <span className="fluid-text-xs text-muted-foreground block truncate">{log.description}</span>}
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  {log.tag && <span className="bg-primary/20 text-primary px-2 py-0.5 rounded fluid-text-xs">{log.tag}</span>}
                  <span className="fluid-text-xs text-muted-foreground">{format(new Date(log.created_at), "MMM d")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <NewEntryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refetchLogs}
        type={modalType}
      />
    </div>
  );
}
