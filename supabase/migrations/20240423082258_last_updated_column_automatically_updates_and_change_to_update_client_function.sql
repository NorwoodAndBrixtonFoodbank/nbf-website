create extension if not exists "moddatetime" with schema "extensions";

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION moddatetime('last_updated');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.parcels FOR EACH ROW EXECUTE FUNCTION moddatetime('last_updated');


