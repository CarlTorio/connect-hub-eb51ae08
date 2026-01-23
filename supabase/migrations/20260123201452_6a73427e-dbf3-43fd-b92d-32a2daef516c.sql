-- Create transactions table for payment tracking (Stripe-ready)
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.patient_records(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PHP',
  payment_method TEXT NOT NULL DEFAULT 'cash', -- cash, gcash, bank_transfer, card, stripe
  payment_status TEXT NOT NULL DEFAULT 'completed', -- pending, completed, failed, refunded
  stripe_payment_intent_id TEXT, -- For future Stripe integration
  stripe_customer_id TEXT, -- For future Stripe integration
  stripe_charge_id TEXT, -- For future Stripe integration
  description TEXT,
  transaction_type TEXT NOT NULL DEFAULT 'membership_payment', -- membership_payment, service_payment, refund
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Anyone can view transactions"
ON public.transactions
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create transactions"
ON public.transactions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update transactions"
ON public.transactions
FOR UPDATE
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add payment_method column to patient_records for quick reference
ALTER TABLE public.patient_records
ADD COLUMN payment_method TEXT DEFAULT 'cash',
ADD COLUMN payment_status TEXT DEFAULT 'pending',
ADD COLUMN amount_paid DECIMAL(10,2);