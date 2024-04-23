create extension if not exists "moddatetime" with schema "extensions";


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public."updateClientAndTheirFamily"(clientrecord jsonb, familymembers jsonb, clientid uuid)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
    updated_family_id UUID;
    member JSONB;
    updated_at TIMESTAMP;
BEGIN  
    update clients
    set updated_at=clientRecord->>'last_updated', full_name=clientRecord->>'full_name', phone_number=clientRecord->>'phone_number', address_1=clientRecord->>'address_1', address_2=clientRecord->>'address_2', address_town=clientRecord->>'address_town', address_county=clientRecord->>'address_county', address_postcode=clientRecord->>'address_postcode', delivery_instructions=clientRecord->>'delivery_instructions',dietary_requirements=array(select * from jsonb_array_elements_text(clientRecord->'dietary_requirements')), feminine_products=array(select * from jsonb_array_elements_text(clientRecord->'feminine_products')), baby_food=CASE WHEN clientRecord->>'baby_food' = 'true' THEN TRUE
     WHEN clientRecord->>'baby_food' = 'false' THEN FALSE
     ELSE NULL END, pet_food=array(select * from jsonb_array_elements_text(clientRecord->'pet_food')), other_items=array(select * from jsonb_array_elements_text(clientRecord->'other_items')), extra_information=clientRecord->>'extra_information', flagged_for_attention=CASE WHEN clientRecord->>'flagged_for_attention' = 'true' THEN TRUE
     WHEN clientRecord->>'flagged_for_attention' = 'false' THEN FALSE
     ELSE NULL END,signposting_call_required= CASE WHEN clientRecord->>'signposting_call_required' = 'true' THEN TRUE
     WHEN clientRecord->>'signposting_call_required' = 'false' THEN FALSE
     ELSE NULL END
     where primary_key = clientId AND last_updated = updated_at;
     
    SELECT family_id INTO updated_family_id
    FROM clients
    WHERE primary_key = clientId;

    delete from families where family_id = updated_family_id;

    FOR member IN SELECT * FROM jsonb_array_elements(familyMembers)
    LOOP
        INSERT INTO families (family_id, age, gender)
        VALUES (updated_family_id, (member->>'age')::numeric, (member->>'gender')::gender);
    END LOOP;

    RETURN clientId;
END;$function$
;

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION moddatetime('last_updated');

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.parcels FOR EACH ROW EXECUTE FUNCTION moddatetime('last_updated');


