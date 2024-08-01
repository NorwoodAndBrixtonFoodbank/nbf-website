set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.swap_two_wiki_rows(key1 uuid, key2 uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
    row1order INT;
    row2order INT;
BEGIN
    SELECT row_order INTO row1order FROM wiki WHERE wiki_key = key1;
    SELECT row_order INTO row2order FROM wiki WHERE wiki_key = key2;

    UPDATE wiki
    SET row_order = -1
    WHERE wiki_key = key1;

    UPDATE wiki
    SET row_order = row1order
    WHERE wiki_key = key2;

    UPDATE wiki
    SET row_order = row2order
    WHERE wiki_key = key1;
END;$function$
;


