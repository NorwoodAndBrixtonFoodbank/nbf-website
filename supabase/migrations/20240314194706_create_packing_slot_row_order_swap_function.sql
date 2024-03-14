set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.packing_slot_order_swap(id1 uuid, id2 uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
    row1order INT;
    row2order INT;
BEGIN
    SELECT "order" INTO row1order FROM packing_slots WHERE primary_key = id1;
    SELECT "order" INTO row2order FROM packing_slots WHERE primary_key = id2;

    UPDATE packing_slots
    SET "order" = -1
    WHERE primary_key = id1;

    UPDATE packing_slots
    SET "order" = row1order
    WHERE primary_key = id2;

    UPDATE packing_slots
    SET "order" = row2order
    WHERE primary_key = id1;
END;$function$
;


