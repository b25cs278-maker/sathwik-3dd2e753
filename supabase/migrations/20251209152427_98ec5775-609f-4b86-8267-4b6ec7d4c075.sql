-- Create task_category enum
CREATE TYPE public.task_category AS ENUM ('recycling', 'conservation', 'water', 'community');

-- Create task_difficulty enum
CREATE TYPE public.task_difficulty AS ENUM ('easy', 'medium', 'hard');

-- Create submission_status enum
CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'rejected');

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category task_category NOT NULL,
  difficulty task_difficulty NOT NULL DEFAULT 'easy',
  points INTEGER NOT NULL DEFAULT 10,
  location_required BOOLEAN NOT NULL DEFAULT false,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_radius_m INTEGER DEFAULT 500,
  estimated_time TEXT,
  image_url TEXT,
  instructions JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_submissions table
CREATE TABLE public.task_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status submission_status NOT NULL DEFAULT 'pending',
  photos JSONB DEFAULT '[]'::jsonb,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_accuracy DOUBLE PRECISION,
  metadata JSONB DEFAULT '{}'::jsonb,
  points_awarded INTEGER DEFAULT 0,
  reviewer_id UUID,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for tasks (public read for active tasks, admin manage)
CREATE POLICY "Anyone can view active tasks" 
ON public.tasks 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage tasks" 
ON public.tasks 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- RLS policies for task_submissions
CREATE POLICY "Users can create their own submissions" 
ON public.task_submissions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own submissions" 
ON public.task_submissions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions" 
ON public.task_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update submissions" 
ON public.task_submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

-- Insert sample tasks
INSERT INTO public.tasks (title, description, category, difficulty, points, location_required, estimated_time, image_url, instructions, requirements) VALUES
('Community Garden Volunteer', 'Help maintain the local community garden by weeding, watering, and caring for plants.', 'conservation', 'easy', 35, true, '1-2 hours', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800', '["Arrive at the community garden during open hours", "Check in with the garden coordinator", "Take a before photo", "Complete assigned tasks", "Take an after photo", "Submit your evidence"]'::jsonb, '["Capture GPS location", "Submit at least 2 photos", "Complete within timeframe"]'::jsonb),
('Beach Cleanup Challenge', 'Join the weekend beach cleanup and help remove plastic waste from the shoreline.', 'community', 'medium', 75, true, '2-3 hours', 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400', '["Arrive at the designated beach area", "Collect cleanup supplies", "Document your cleanup area", "Collect trash and recyclables", "Sort collected items", "Submit evidence photos"]'::jsonb, '["GPS verification required", "Before and after photos", "Minimum 1 hour participation"]'::jsonb),
('Recycling Drop-off', 'Collect and properly sort recyclable materials from your home and drop them off at the local center.', 'recycling', 'easy', 25, true, '30 mins', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400', '["Collect recyclables from your home", "Sort by material type", "Visit local recycling center", "Drop off materials", "Take confirmation photo"]'::jsonb, '["Photo of sorted materials", "Photo at recycling center", "GPS location at center"]'::jsonb),
('Tree Planting Initiative', 'Participate in our urban tree planting program to help increase green cover in the city.', 'conservation', 'medium', 100, true, '3-4 hours', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400', '["Attend the planting event", "Receive your tree sapling", "Prepare the planting hole", "Plant and water the tree", "Document the planted tree", "Submit your evidence"]'::jsonb, '["GPS at planting location", "Photos of planting process", "Photo of planted tree with tag"]'::jsonb),
('Water Conservation Audit', 'Learn to conduct a home water audit and identify ways to reduce water consumption.', 'water', 'easy', 40, false, '1 hour', 'https://images.unsplash.com/photo-1538300342682-cf57afb97285?w=400', '["Review the water audit checklist", "Check all faucets and toilets", "Document water usage points", "Identify leaks or wastage", "Create improvement plan", "Submit audit report"]'::jsonb, '["Complete audit checklist", "Photos of water fixtures", "Written improvement plan"]'::jsonb),
('E-Waste Collection Drive', 'Collect old electronics from neighbors and bring them to the designated e-waste recycling point.', 'recycling', 'hard', 150, true, 'Half day', 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400', '["Announce collection in your area", "Collect e-waste items safely", "Document collected items", "Transport to e-waste center", "Submit for proper recycling", "Get recycling certificate"]'::jsonb, '["Collect minimum 5 items", "Photos of collected items", "GPS at e-waste center", "Recycling certificate photo"]'::jsonb);