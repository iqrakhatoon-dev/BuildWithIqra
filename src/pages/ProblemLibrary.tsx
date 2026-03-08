import { motion } from "framer-motion";
import { useState } from "react";
import { Search, CheckCircle2, Circle, Filter } from "lucide-react";

const problems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", category: "Arrays", status: "solved", platform: "LeetCode" },
  { id: 2, title: "Valid Parentheses", difficulty: "Easy", category: "Stack", status: "solved", platform: "LeetCode" },
  { id: 3, title: "Merge Intervals", difficulty: "Medium", category: "Arrays", status: "solved", platform: "LeetCode" },
  { id: 4, title: "LRU Cache", difficulty: "Hard", category: "Design", status: "attempted", platform: "LeetCode" },
  { id: 5, title: "Binary Tree Level Order", difficulty: "Medium", category: "Trees", status: "solved", platform: "LeetCode" },
  { id: 6, title: "Word Search II", difficulty: "Hard", category: "Backtracking", status: "unsolved", platform: "LeetCode" },
  { id: 7, title: "Course Schedule", difficulty: "Medium", category: "Graphs", status: "solved", platform: "LeetCode" },
  { id: 8, title: "Sliding Window Maximum", difficulty: "Hard", category: "Queue", status: "unsolved", platform: "LeetCode" },
  { id: 9, title: "Number of Islands", difficulty: "Medium", category: "Graphs", status: "solved", platform: "LeetCode" },
  { id: 10, title: "Longest Palindromic Substring", difficulty: "Medium", category: "Strings", status: "attempted", platform: "LeetCode" },
];

const difficultyStyle: Record<string, string> = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-red-400",
};

export default function ProblemLibrary() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

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

      {/* Mobile: cards, Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 fluid-text-xs text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 fluid-text-xs text-muted-foreground uppercase tracking-wider">Title</th>
              <th className="text-left py-3 px-4 fluid-text-xs text-muted-foreground uppercase tracking-wider">Difficulty</th>
              <th className="text-left py-3 px-4 fluid-text-xs text-muted-foreground uppercase tracking-wider">Category</th>
              <th className="text-left py-3 px-4 fluid-text-xs text-muted-foreground uppercase tracking-wider">Platform</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((problem, i) => (
              <motion.tr
                key={problem.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
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
                <td className={`py-3 px-4 fluid-text-sm font-medium ${difficultyStyle[problem.difficulty]}`}>{problem.difficulty}</td>
                <td className="py-3 px-4">
                  <span className="bg-secondary px-2 py-1 rounded fluid-text-xs text-secondary-foreground">{problem.category}</span>
                </td>
                <td className="py-3 px-4 fluid-text-xs text-muted-foreground">{problem.platform}</td>
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
            transition={{ delay: i * 0.05 }}
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
              <span className={`fluid-text-xs font-medium ${difficultyStyle[problem.difficulty]}`}>{problem.difficulty}</span>
            </div>
            <div className="mt-2 flex gap-2">
              <span className="bg-secondary px-2 py-0.5 rounded fluid-text-xs text-secondary-foreground">{problem.category}</span>
              <span className="fluid-text-xs text-muted-foreground">{problem.platform}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
