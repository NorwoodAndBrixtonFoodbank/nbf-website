set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.parcel_slot_order_swap(row1id uuid, row2id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
    row1order INT;
    row2order INT;
BEGIN
    SELECT "order" INTO row1order FROM packing_slots WHERE primary_key = row1id;
    SELECT "order" INTO row2order FROM packing_slots WHERE primary_key = row2id;

    UPDATE packing_slots
    SET "order" = -1
    WHERE primary_key = row1id;

    UPDATE packing_slots
    SET "order" = row1order
    WHERE primary_key = row2id;

    UPDATE packing_slots
    SET "order" = row2order
    WHERE primary_key = row1id;
END;$function$
;


