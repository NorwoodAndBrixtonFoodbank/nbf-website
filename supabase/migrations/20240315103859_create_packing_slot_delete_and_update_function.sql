set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.packing_slot_delete_and_update(rowid uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
    rowOrder INT;
    numberOfRows INT;
    i INT := 1;
    numberOfUpdates INT;
    rowToUpdate UUID;
BEGIN
    -- Get the total number of rows
    SELECT COUNT(*) INTO numberOfRows FROM packing_slots;

    -- Get the order of the row to delete
    SELECT "order" INTO rowOrder FROM packing_slots WHERE primary_key = rowId;

    -- Calculate the number of rows to update
    numberOfUpdates := numberOfRows - rowOrder;

    -- Delete the specified row
    DELETE FROM packing_slots WHERE primary_key = rowId;

    -- Loop to update the order of subsequent rows
    WHILE i <= numberOfUpdates LOOP
        -- Get the primary key of the row to update
        SELECT primary_key INTO rowToUpdate FROM packing_slots WHERE "order" = rowOrder + 1;

        -- Update the order of the row
        UPDATE packing_slots
        SET "order" = "order" - 1
        WHERE primary_key = rowToUpdate;

        -- Update loop variables
        i := i + 1;
        rowOrder := rowOrder + 1;
    END LOOP;
END;$function$
;


