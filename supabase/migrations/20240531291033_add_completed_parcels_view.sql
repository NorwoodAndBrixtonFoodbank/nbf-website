CREATE OR REPLACE VIEW completed_parcels AS
WITH completed_events AS (
    SELECT
        events.parcel_id,
        -- If a parcel has multiple successful events, we chose the most recent.
        MAX(events.timestamp) AS completed_timestamp
    FROM
        events
    WHERE
        new_parcel_status IN (
            SELECT
                event_name
            FROM
                status_order
            WHERE
                is_successfully_completed_event
        )
    -- Ensures each parcel is only counted once.
    GROUP BY
        events.parcel_id
)
SELECT
    completed_events.parcel_id,
    completed_timestamp,
    family_count,
    pet_food
FROM
    completed_events
        INNER JOIN
    parcels_plus ON parcels_plus.parcel_id = completed_events.parcel_id
        LEFT JOIN
    clients ON parcels_plus.client_id = clients.primary_key
