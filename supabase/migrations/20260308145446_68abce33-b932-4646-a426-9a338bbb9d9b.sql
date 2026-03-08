-- Projects table
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  tags text[] DEFAULT '{}',
  live_url text,
  github_url text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

CREATE POLICY "Anyone can view project images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Admins can upload project images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete project images" ON storage.objects FOR DELETE USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));