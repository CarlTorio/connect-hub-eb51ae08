-- Update referral code generator to use first 6 letters of name
-- Example: "John Carl Torio" → "JOHNCA"
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
  base_code TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.referral_code IS NOT NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get first 6 letters of name (removing spaces and non-alpha chars)
  base_code := UPPER(LEFT(REGEXP_REPLACE(COALESCE(NEW.name, 'MEMBER'), '[^a-zA-Z]', '', 'g'), 6));
  
  -- Pad with X if less than 6 characters
  base_code := RPAD(base_code, 6, 'X');
  
  -- Start with base code, add counter if collision
  new_code := base_code;
  
  LOOP
    SELECT EXISTS(SELECT 1 FROM public.members WHERE referral_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
    counter := counter + 1;
    -- If collision, append number (e.g., JOHNCA1, JOHNCA2)
    new_code := LEFT(base_code, 6 - LENGTH(counter::TEXT)) || counter::TEXT;
  END LOOP;
  
  NEW.referral_code := new_code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;