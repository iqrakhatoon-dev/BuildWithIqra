import { motion } from "framer-motion";
import { Code2, GitBranch, Trophy, Flame, TrendingUp, Clock } from "lucide-react";

const stats = [
  { label: "Problems Solved", value: "347", icon: Code2, change: "+12 this week" },
  { label: "Current Streak", value: "23 days", icon: Flame, change: "Personal best!" },
  { label: "Projects Built", value: "18", icon: GitBranch, change: "+2 this month" },
  { label: "Achievements", value: "42", icon: Trophy, change: "3 new unlocked" },
  { label: "Hours Coded", value: "1,240", icon: Clock, change: "+28 this week" },
  { label: "Contributions", value: "892", icon: TrendingUp, change: "+65 this month" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="fluid-text-2xl font-bold text-foreground">
          Welcome back, <span className="text-gradient-rosy">Iqra</span>
        </h1>
        <p className="fluid-text-sm text-muted-foreground mt-1">
          Here's your development overview
        </p>
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
                <p className="fluid-text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="fluid-text-xl font-bold text-foreground mt-2">
                  {stat.value}
                </p>
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
        transition={{ delay: 0.6 }}
        className="bg-card rounded-lg p-6 border-glow"
      >
        <h2 className="fluid-text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { text: "Solved 'Two Sum' on LeetCode", time: "2 hours ago" },
            { text: "Pushed 3 commits to portfolio-v2", time: "5 hours ago" },
            { text: "Completed React Hooks module", time: "1 day ago" },
            { text: "Started 'Build a CLI Tool' project", time: "2 days ago" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="fluid-text-sm text-foreground">{activity.text}</span>
              <span className="fluid-text-xs text-muted-foreground whitespace-nowrap ml-4">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
