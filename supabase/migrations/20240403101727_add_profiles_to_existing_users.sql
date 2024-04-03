CREATE TEMP TABLE user_id_array (
    user_id UUID,
    "role" varchar,
    array_index SERIAL
);

DO
$$
DECLARE 
    total_count INT;
    index INT := 1;
    profile_id UUID;
    profile_role role;
BEGIN
    INSERT INTO user_id_array (user_id, "role")
    SELECT id, "role" FROM auth.users;

    SELECT COUNT(*) INTO total_count FROM user_id_array;

    WHILE index <= total_count LOOP
        SELECT user_id INTO profile_id FROM user_id_array WHERE array_index = index;
        SELECT "role" INTO profile_role FROM user_id_array WHERE array_index = index;
        INSERT INTO profiles (user_id, "role") VALUES (profile_id, profile_role);
        index := index + 1;
    END LOOP;
END;
$$;
