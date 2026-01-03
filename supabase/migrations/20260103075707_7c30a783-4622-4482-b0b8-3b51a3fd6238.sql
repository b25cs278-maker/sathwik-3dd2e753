-- Create partners table
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'ngo',
  location TEXT,
  contact_email TEXT NOT NULL,
  projects_count INTEGER NOT NULL DEFAULT 0,
  participants_count INTEGER NOT NULL DEFAULT 0,
  certificates_issued INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage partners" 
ON public.partners 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view active partners
CREATE POLICY "Anyone can view active partners" 
ON public.partners 
FOR SELECT 
USING (is_active = true);

-- Create app_settings table
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Admins can manage settings
CREATE POLICY "Admins can manage settings" 
ON public.app_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view settings
CREATE POLICY "Anyone can view settings" 
ON public.app_settings 
FOR SELECT 
USING (true);