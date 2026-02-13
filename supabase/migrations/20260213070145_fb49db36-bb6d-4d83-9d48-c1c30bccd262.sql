
-- Create video_modules table
CREATE TABLE public.video_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  resource_pdf_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_modules ENABLE ROW LEVEL SECURITY;

-- Admins can manage video modules
CREATE POLICY "Admins can manage video modules"
ON public.video_modules
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Anyone authenticated can view active video modules
CREATE POLICY "Anyone can view active video modules"
ON public.video_modules
FOR SELECT
USING (is_active = true);

-- Create storage bucket for module PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('module-resources', 'module-resources', true);

-- Storage policies for module resources
CREATE POLICY "Anyone can view module resources"
ON storage.objects FOR SELECT
USING (bucket_id = 'module-resources');

CREATE POLICY "Admins can upload module resources"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'module-resources' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update module resources"
ON storage.objects FOR UPDATE
USING (bucket_id = 'module-resources' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete module resources"
ON storage.objects FOR DELETE
USING (bucket_id = 'module-resources' AND public.has_role(auth.uid(), 'admin'::app_role));
