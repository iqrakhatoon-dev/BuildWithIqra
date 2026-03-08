import { motion } from "framer-motion";
import { useState } from "react";
import { ExternalLink, Github, Plus, Trash2, Image } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ProjectForm } from "@/components/ProjectForm";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function ProjectShowcase() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="fluid-text-2xl font-bold text-foreground">
            Project <span className="text-gradient-rosy">Showcase</span>
          </h1>
          <p className="fluid-text-sm text-muted-foreground mt-1">
            Crafted with passion and precision
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-rosy text-primary-foreground px-4 py-2 rounded-lg fluid-text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Add Project
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="fluid-text-sm text-muted-foreground">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="fluid-text-sm text-muted-foreground">No projects yet. {isAdmin ? "Add your first project!" : ""}</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {projects.map((project: any) => (
            <motion.div
              key={project.id}
              variants={item}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group bg-card rounded-lg border-glow overflow-hidden transition-shadow hover:glow-rosy-strong"
            >
              <div className="h-32 md:h-40 bg-secondary flex items-center justify-center overflow-hidden">
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <Image className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="fluid-text-base font-bold text-foreground">{project.title}</h3>
                  {isAdmin && (
                    <button onClick={() => handleDelete(project.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {project.description && (
                  <p className="fluid-text-xs text-muted-foreground mt-2 line-clamp-2">
                    {project.description}
                  </p>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-secondary px-2 py-0.5 rounded fluid-text-xs text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 fluid-text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Github className="h-4 w-4" /> Code
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 fluid-text-xs text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="h-4 w-4" /> Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <ProjectForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
