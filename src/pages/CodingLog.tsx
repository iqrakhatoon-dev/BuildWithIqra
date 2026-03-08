import { motion } from "framer-motion";
import { CheckCircle2, Code2, BookOpen, GitCommit } from "lucide-react";

const logs = [
  {
    date: "March 8, 2026",
    entries: [
      { icon: Code2, title: "Built responsive sidebar component", desc: "React + Tailwind CSS sidebar with collapsible states", tag: "React" },
      { icon: CheckCircle2, title: "Solved 3 LeetCode problems", desc: "Arrays & Hashing - Easy/Medium difficulty", tag: "DSA" },
    ],
  },
  {
    date: "March 7, 2026",
    entries: [
      { icon: GitCommit, title: "Deployed portfolio v2.0", desc: "Added project showcase with Framer Motion animations", tag: "Deploy" },
      { icon: BookOpen, title: "Studied system design patterns", desc: "Load balancing, caching strategies, database sharding", tag: "Learning" },
    ],
  },
  {
    date: "March 6, 2026",
    entries: [
      { icon: Code2, title: "Created REST API with Express", desc: "CRUD operations with MongoDB integration", tag: "Backend" },
      { icon: CheckCircle2, title: "Completed TypeScript generics module", desc: "Advanced type patterns and utility types", tag: "TypeScript" },
    ],
  },
  {
    date: "March 5, 2026",
    entries: [
      { icon: Code2, title: "Implemented authentication flow", desc: "JWT tokens with refresh token rotation", tag: "Security" },
    ],
  },
];

const tagColors: Record<string, string> = {
  React: "bg-primary/20 text-primary",
  DSA: "bg-primary/20 text-primary",
  Deploy: "bg-primary/20 text-primary",
  Learning: "bg-primary/20 text-primary",
  Backend: "bg-primary/20 text-primary",
  TypeScript: "bg-primary/20 text-primary",
  Security: "bg-primary/20 text-primary",
};

export default function CodingLog() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="fluid-text-2xl font-bold text-foreground">
          Coding <span className="text-gradient-rosy">Log</span>
        </h1>
        <p className="fluid-text-sm text-muted-foreground mt-1">Track your daily progress</p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-8">
          {logs.map((day, di) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: di * 0.15 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative z-10 w-3 h-3 rounded-full bg-primary glow-rosy ml-[10px] md:ml-[18px]" />
                <h3 className="fluid-text-base font-semibold text-foreground">{day.date}</h3>
              </div>

              <div className="ml-10 md:ml-14 space-y-3">
                {day.entries.map((entry, ei) => (
                  <motion.div
                    key={ei}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: di * 0.15 + ei * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card rounded-lg p-4 border-glow hover:glow-rosy transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <entry.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="fluid-text-sm font-medium text-foreground">{entry.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${tagColors[entry.tag]}`}>
                            {entry.tag}
                          </span>
                        </div>
                        <p className="fluid-text-xs text-muted-foreground mt-1">{entry.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
