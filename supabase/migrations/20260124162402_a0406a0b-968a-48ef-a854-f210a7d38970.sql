-- Add UPDATE and DELETE policies for anon users on members table
-- This allows the admin dashboard to work without authentication

CREATE POLICY "Allow update for anon" ON public.members
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for anon" ON public.members
    FOR DELETE TO anon USING (true);

-- Same for patient_records
CREATE POLICY "Allow update for anon" ON public.patient_records
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for anon" ON public.patient_records
    FOR DELETE TO anon USING (true);