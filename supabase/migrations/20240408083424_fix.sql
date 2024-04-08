set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public."insertClientAndTheirFamily"(clientrecord jsonb, familymembers jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
    created_family_id UUID;
    member JSONB;
    inserted_client_id UUID;
BEGIN 
    INSERT INTO clients (full_name, phone_number, address_1, address_2, address_town, address_county, address_postcode, delivery_instructions, dietary_requirements, feminine_products, baby_food, pet_food, other_items, extra_information, flagged_for_attention, signposting_call_required)
    VALUES (clientRecord->>'full_name', clientRecord->>'phone_number', clientRecord->>'address_1', clientRecord->>'address_2', clientRecord->>'address_town', clientRecord->>'address_county', clientRecord->>'address_postcode', clientRecord->>'delivery_instructions',array(select * from jsonb_array_elements_text(clientRecord->'dietary_requirements')), array(select * from jsonb_array_elements_text(clientRecord->'feminine_products')),
    CASE WHEN clientRecord->>'baby_food' = 'true' THEN TRUE
     WHEN clientRecord->>'baby_food' = 'false' THEN FALSE
     ELSE NULL END, 
   array(select * from jsonb_array_elements_text(clientRecord->'pet_food')), array(select * from jsonb_array_elements_text(clientRecord->'other_items')), clientRecord->>'extra_information', CASE WHEN clientRecord->>'flagged_for_attention' = 'true' THEN TRUE
     WHEN clientRecord->>'flagged_for_attention' = 'false' THEN FALSE
     ELSE NULL END, CASE WHEN clientRecord->>'signposting_call_required' = 'true' THEN TRUE
     WHEN clientRecord->>'signposting_call_required' = 'false' THEN FALSE
     ELSE NULL END)
     RETURNING primary_key into inserted_client_id;
     

    raise log 'inserted client id %', inserted_client_id;

     IF inserted_client_id IS NULL THEN
        RETURN NULL;
    END IF;
     
    SELECT family_id INTO created_family_id
    FROM clients
    WHERE primary_key = inserted_client_id;

    raise log 'created_family_id: %', created_family_id;

    FOR member IN SELECT * FROM jsonb_array_elements(familyMembers)
    LOOP
        INSERT INTO families (family_id, age, gender)
        VALUES (created_family_id, (member->>'age')::numeric, (member->>'gender')::gender);
    END LOOP;

    RETURN inserted_client_id;
END;$function$
;

CREATE OR REPLACE FUNCTION public."updateClientAndTheirFamily"(clientrecord jsonb, familymembers jsonb, clientid uuid)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
    updated_family_id UUID;
    member JSONB;
BEGIN  
    update clients
    set full_name=clientRecord->>'full_name', phone_number=clientRecord->>'phone_number', address_1=clientRecord->>'address_1', address_2=clientRecord->>'address_2', address_town=clientRecord->>'address_town', address_county=clientRecord->>'address_county', address_postcode=clientRecord->>'address_postcode', delivery_instructions=clientRecord->>'delivery_instructions',dietary_requirements=array(select * from jsonb_array_elements_text(clientRecord->'dietary_requirements')), feminine_products=array(select * from jsonb_array_elements_text(clientRecord->'feminine_products')), baby_food=CASE WHEN clientRecord->>'baby_food' = 'true' THEN TRUE
     WHEN clientRecord->>'baby_food' = 'false' THEN FALSE
     ELSE NULL END, pet_food=array(select * from jsonb_array_elements_text(clientRecord->'pet_food')), other_items=array(select * from jsonb_array_elements_text(clientRecord->'other_items')), extra_information=clientRecord->>'extra_information', flagged_for_attention=CASE WHEN clientRecord->>'flagged_for_attention' = 'true' THEN TRUE
     WHEN clientRecord->>'flagged_for_attention' = 'false' THEN FALSE
     ELSE NULL END,signposting_call_required= CASE WHEN clientRecord->>'signposting_call_required' = 'true' THEN TRUE
     WHEN clientRecord->>'signposting_call_required' = 'false' THEN FALSE
     ELSE NULL END
     where primary_key = clientId;
     
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


