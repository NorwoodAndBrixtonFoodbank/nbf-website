CREATE OR REPLACE VIEW reports AS
SELECT
    TO_CHAR(date_trunc('week', CURRENT_DATE) - (number_of_weeks_ago * INTERVAL '1 week'), 'YYYY-MM-DD') as week_commencing,
    COUNT(CASE WHEN family_count = 1 THEN 1 END) AS family_size_1,
    COUNT(CASE WHEN family_count = 2 THEN 1 END) AS family_size_2,
    COUNT(CASE WHEN family_count = 3 THEN 1 END) AS family_size_3,
    COUNT(CASE WHEN family_count = 4 THEN 1 END) AS family_size_4,
    COUNT(CASE WHEN family_count = 5 THEN 1 END) AS family_size_5,
    COUNT(CASE WHEN family_count = 6 THEN 1 END) AS family_size_6,
    COUNT(CASE WHEN family_count = 7 THEN 1 END) AS family_size_7,
    COUNT(CASE WHEN family_count = 8 THEN 1 END) AS family_size_8,
    COUNT(CASE WHEN family_count = 9 THEN 1 END) AS family_size_9,
    COUNT(CASE WHEN family_count >= 10 THEN 1 END) AS family_size_10_plus,
    COUNT(parcel_id) AS total_parcels,
    COUNT(CASE WHEN pet_food = ARRAY['Cat'] THEN 1 END) AS cat,
    COUNT(CASE WHEN pet_food = ARRAY['Dog'] THEN 1 END) AS dog,
    COUNT(CASE WHEN pet_food @> ARRAY['Cat','Dog'] THEN 1 END) AS cat_and_dog,
    COUNT(CASE WHEN NOT pet_food = ARRAY[]::text[] THEN 1 END) AS total_parcels_with_pets
FROM
    generate_series(0, (EXTRACT(YEAR FROM CURRENT_DATE) - 2024) * 52 + EXTRACT(WEEK FROM CURRENT_DATE) - 1) AS number_of_weeks_ago
        LEFT JOIN completed_parcels ON
            date_trunc('week', CURRENT_DATE) - ((number_of_weeks_ago - 1) * INTERVAL '1 week') > completed_timestamp
        AND completed_timestamp >= date_trunc('week', CURRENT_DATE) - (number_of_weeks_ago * INTERVAL '1 week')
GROUP BY
    week_commencing
ORDER BY
    week_commencing DESC;