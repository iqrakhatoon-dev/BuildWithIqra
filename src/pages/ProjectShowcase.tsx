import { motion } from "framer-motion";
import { ExternalLink, Github, Star } from "lucide-react";

const projects = [
  {
    title: "DevFlow",
    description: "A developer productivity dashboard with real-time analytics, GitHub integration, and customizable widgets.",
    tags: ["React", "TypeScript", "Tailwind", "Supabase"],
    stars: 142,
    image: "🚀",
  },
  {
    title: "CodeSnap",
    description: "Beautiful code screenshot generator with syntax highlighting, custom themes, and export to PNG/SVG.",
    tags: ["Next.js", "Shiki", "Canvas API"],
    stars: 89,
    image: "📸",
  },
  {
    title: "TermChat",
    description: "Terminal-based chat application with end-to-end encryption, file sharing, and room management.",
    tags: ["Node.js", "Socket.io", "Ink"],
    stars: 234,
    image: "💬",
  },
  {
    title: "PixelForge",
    description: "Lightweight pixel art editor with layers, animation timeline, and sprite sheet export.",
    tags: ["Canvas", "React", "WebWorkers"],
    stars: 67,
    image: "🎨",
  },
  {
    title: "APIForge",
    description: "Visual REST API builder with auto-documentation, testing suite, and mock server generation.",
    tags: ["Express", "OpenAPI", "React"],
    stars: 178,
    image: "⚡",
  },
  {
    title: "NoteGraph",
    description: "Knowledge graph note-taking app with bi-directional linking, markdown support, and graph visualization.",
    tags: ["React", "D3.js", "IndexedDB"],
    stars: 312,
    image: "🧠",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function ProjectShowcase() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="fluid-text-2xl font-bold text-foreground">
          Project <span className="text-gradient-rosy">Showcase</span>
        </h1>
        <p className="fluid-text-sm text-muted-foreground mt-1">
          Crafted with passion and precision
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {projects.map((project) => (
          <motion.div
            key={project.title}
            variants={item}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group bg-card rounded-lg border-glow overflow-hidden transition-shadow hover:glow-rosy-strong"
          >
            <div className="h-32 md:h-40 bg-secondary flex items-center justify-center text-5xl md:text-6xl">
              {project.image}
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="fluid-text-base font-bold text-foreground">{project.title}</h3>
                <div className="flex items-center gap-1 text-primary">
                  <Star className="h-4 w-4 fill-primary" />
                  <span className="fluid-text-xs font-medium">{project.stars}</span>
                </div>
              </div>
              <p className="fluid-text-xs text-muted-foreground mt-2 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary px-2 py-0.5 rounded fluid-text-xs text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button className="flex items-center gap-1.5 fluid-text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-4 w-4" /> Code
                </button>
                <button className="flex items-center gap-1.5 fluid-text-xs text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink className="h-4 w-4" /> Demo
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
