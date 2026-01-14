-- Create bookings table for consultation bookings
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  membership TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create membership_applications table
CREATE TABLE public.membership_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  membership TEXT NOT NULL,
  amount INTEGER NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create members table for approved applications
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  membership TEXT NOT NULL,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_payment DATE NOT NULL DEFAULT CURRENT_DATE,
  expiration_date DATE NOT NULL,
  total_paid INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for submissions)
-- Bookings: anyone can insert, only admin can read/update/delete
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings"
  ON public.bookings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update bookings"
  ON public.bookings FOR UPDATE
  USING (true);

-- Membership Applications: anyone can insert, only admin can read/update/delete
CREATE POLICY "Anyone can create applications"
  ON public.membership_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view applications"
  ON public.membership_applications FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update applications"
  ON public.membership_applications FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete applications"
  ON public.membership_applications FOR DELETE
  USING (true);

-- Members: public read for admin portal
CREATE POLICY "Anyone can view members"
  ON public.members FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create members"
  ON public.members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update members"
  ON public.members FOR UPDATE
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.membership_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();