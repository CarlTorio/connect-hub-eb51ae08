-- Add UPDATE and DELETE policies for anon on members table
CREATE POLICY "Allow update for anon on members" ON public.members 
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for anon on members" ON public.members 
    FOR DELETE TO anon USING (true);

-- Also add UPDATE policy for anon on bookings (for status updates)
CREATE POLICY "Allow update for anon on bookings" ON public.bookings 
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Add UPDATE policy for anon on patient_records
CREATE POLICY "Allow update for anon on patient_records" ON public.patient_records 
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for anon on patient_records" ON public.patient_records 
    FOR DELETE TO anon USING (true);