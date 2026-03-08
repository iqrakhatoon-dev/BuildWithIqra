import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
}

export function ProjectForm({ open, onClose }: ProjectFormProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(path, imageFile);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("projects").insert({
        user_id: user.id,
        title,
        description: description || null,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        live_url: liveUrl || null,
        github_url: githubUrl || null,
        image_url: imageUrl,
      });
      if (error) throw error;

      toast.success("Project added!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
      setTitle("");
      setDescription("");
      setTags("");
      setLiveUrl("");
      setGithubUrl("");
      setImageFile(null);
      setPreview(null);
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
              <h2 className="fluid-text-lg font-bold text-foreground">New Project</h2>
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
                  placeholder="Project name"
                />
              </div>

              <div>
                <label className="fluid-text-xs text-muted-foreground block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 fluid-text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder="What does it do?"
                />
              </div>

              <div>
                <label className="fluid-text-xs text-muted-foreground block mb-1">Project Image</label>
                <label className="flex items-center justify-center gap-2 w-full bg-secondary border border-dashed border-border rounded-lg py-6 cursor-pointer hover:border-primary transition-colors">
                  {preview ? (
                    <img src={preview} alt="Preview" className="max-h-32 rounded object-cover" />
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="fluid-text-sm text-muted-foreground">Click to upload</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              <div>
                <label className="fluid-text-xs text-muted-foreground block mb-1">Tags (comma-separated)</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 fluid-text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="React, TypeScript, Tailwind"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="fluid-text-xs text-muted-foreground block mb-1">Live URL</label>
                  <input
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 fluid-text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="fluid-text-xs text-muted-foreground block mb-1">GitHub URL</label>
                  <input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 fluid-text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-rosy text-primary-foreground rounded-lg py-2.5 fluid-text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {loading ? "Uploading..." : "Add Project"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
