-- ===========================================================================
-- HILOMÈ CLINIC DATABASE SCHEMA
-- 4 Core Tables: bookings, members, patient_records, transactions
-- ===========================================================================

-- ===========================================================================
-- FUNCTION: Auto-update timestamps
-- ===========================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ===========================================================================
-- TABLE 1: MEMBERS
-- ===========================================================================
CREATE TABLE public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT NULL,
    membership_type TEXT NOT NULL DEFAULT 'Green',
    membership_start_date TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
    membership_expiry_date TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT DEFAULT NULL,
    amount_paid NUMERIC DEFAULT NULL,
    stripe_payment_intent_id TEXT DEFAULT NULL,
    stripe_charge_id TEXT DEFAULT NULL,
    stripe_receipt_url TEXT DEFAULT NULL,
    stripe_customer_id TEXT DEFAULT NULL,
    is_walk_in BOOLEAN NOT NULL DEFAULT false,
    referral_code TEXT DEFAULT NULL UNIQUE,
    referred_by TEXT DEFAULT NULL,
    referral_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for members
CREATE INDEX idx_members_email ON public.members(email);
CREATE INDEX idx_members_status ON public.members(status);
CREATE INDEX idx_members_membership_type ON public.members(membership_type);
CREATE INDEX idx_members_referral_code ON public.members(referral_code);

-- RLS for members
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon" ON public.members
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow insert for anon" ON public.members
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON public.members
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger for members timestamp
CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================================================
-- TABLE 2: BOOKINGS
-- ===========================================================================
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    preferred_date TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    membership TEXT DEFAULT NULL,
    message TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    patient_id UUID DEFAULT NULL,
    member_id UUID DEFAULT NULL REFERENCES public.members(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for bookings
CREATE INDEX idx_bookings_email ON public.bookings(email);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_preferred_date ON public.bookings(preferred_date);
CREATE INDEX idx_bookings_member_id ON public.bookings(member_id);
CREATE INDEX idx_bookings_patient_id ON public.bookings(patient_id);

-- RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon" ON public.bookings
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow insert for anon" ON public.bookings
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON public.bookings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger for bookings timestamp
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================================================
-- TABLE 3: PATIENT_RECORDS
-- ===========================================================================
CREATE TABLE public.patient_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    contact_number TEXT DEFAULT NULL,
    date_of_birth TEXT DEFAULT NULL,
    age INTEGER DEFAULT NULL,
    gender TEXT DEFAULT NULL,
    emergency_contact TEXT DEFAULT NULL,
    membership TEXT DEFAULT NULL,
    membership_join_date TEXT DEFAULT NULL,
    membership_expiry_date TEXT DEFAULT NULL,
    membership_status TEXT DEFAULT NULL,
    member_id UUID DEFAULT NULL REFERENCES public.members(id) ON DELETE SET NULL,
    booking_id UUID DEFAULT NULL REFERENCES public.bookings(id) ON DELETE SET NULL,
    source TEXT NOT NULL DEFAULT 'manual',
    preferred_date TEXT DEFAULT NULL,
    preferred_time TEXT DEFAULT NULL,
    message TEXT DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    payment_method TEXT DEFAULT NULL,
    payment_status TEXT DEFAULT 'pending',
    amount_paid NUMERIC DEFAULT NULL,
    stripe_payment_intent_id TEXT DEFAULT NULL,
    stripe_customer_id TEXT DEFAULT NULL,
    stripe_receipt_url TEXT DEFAULT NULL,
    medical_records JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for patient_records
CREATE INDEX idx_patient_records_email ON public.patient_records(email);
CREATE INDEX idx_patient_records_member_id ON public.patient_records(member_id);
CREATE INDEX idx_patient_records_booking_id ON public.patient_records(booking_id);
CREATE INDEX idx_patient_records_source ON public.patient_records(source);

-- RLS for patient_records
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon" ON public.patient_records
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow insert for anon" ON public.patient_records
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON public.patient_records
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger for patient_records timestamp
CREATE TRIGGER update_patient_records_updated_at
    BEFORE UPDATE ON public.patient_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add FK from bookings to patient_records (after patient_records exists)
ALTER TABLE public.bookings
    ADD CONSTRAINT fk_bookings_patient 
    FOREIGN KEY (patient_id) REFERENCES public.patient_records(id) ON DELETE SET NULL;

-- ===========================================================================
-- TABLE 4: TRANSACTIONS
-- ===========================================================================
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID DEFAULT NULL REFERENCES public.members(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'PHP',
    payment_method TEXT NOT NULL DEFAULT 'cash',
    payment_status TEXT NOT NULL DEFAULT 'completed',
    stripe_payment_intent_id TEXT DEFAULT NULL,
    stripe_customer_id TEXT DEFAULT NULL,
    stripe_charge_id TEXT DEFAULT NULL,
    stripe_receipt_url TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    transaction_type TEXT NOT NULL DEFAULT 'membership_payment',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for transactions
CREATE INDEX idx_transactions_member_id ON public.transactions(member_id);
CREATE INDEX idx_transactions_payment_status ON public.transactions(payment_status);
CREATE INDEX idx_transactions_transaction_type ON public.transactions(transaction_type);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

-- RLS for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon" ON public.transactions
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow all for authenticated" ON public.transactions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger for transactions timestamp
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================================================
-- FUNCTION: Generate unique referral code
-- ===========================================================================
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  IF NEW.referral_code IS NOT NULL THEN
    RETURN NEW;
  END IF;
  
  LOOP
    -- Generate code: first 4 letters of name + 2 random digits
    new_code := UPPER(LEFT(REGEXP_REPLACE(COALESCE(NEW.name, 'USER'), '[^a-zA-Z]', '', 'g'), 4));
    new_code := new_code || LPAD(FLOOR(RANDOM() * 100)::TEXT, 2, '0');
    
    SELECT EXISTS(SELECT 1 FROM public.members WHERE referral_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  NEW.referral_code := new_code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_member_referral_code
    BEFORE INSERT ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_referral_code();

-- ===========================================================================
-- FUNCTION: Sync member to patient record on member creation
-- ===========================================================================
CREATE OR REPLACE FUNCTION public.sync_member_to_patient()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if patient record exists for this email
  IF NOT EXISTS (SELECT 1 FROM public.patient_records WHERE email = NEW.email) THEN
    -- Create patient record from member data
    INSERT INTO public.patient_records (
      name, email, contact_number, membership, 
      membership_join_date, membership_expiry_date, membership_status,
      member_id, source
    ) VALUES (
      NEW.name, NEW.email, NEW.phone, NEW.membership_type,
      NEW.membership_start_date, NEW.membership_expiry_date, NEW.status,
      NEW.id, 'membership'
    );
  ELSE
    -- Update existing patient record with member link
    UPDATE public.patient_records
    SET member_id = NEW.id,
        membership = NEW.membership_type,
        membership_join_date = NEW.membership_start_date,
        membership_expiry_date = NEW.membership_expiry_date,
        membership_status = NEW.status,
        updated_at = now()
    WHERE email = NEW.email AND member_id IS NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER sync_member_to_patient_trigger
    AFTER INSERT ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_member_to_patient();