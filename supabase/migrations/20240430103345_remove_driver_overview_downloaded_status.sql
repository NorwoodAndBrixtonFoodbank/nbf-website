update public.events set events.new_parcel_status = "Out for Delivery" where events.new_parcel_status = "Driver Overview Downloaded";

DELETE FROM public.status_order;

INSERT INTO public.status_order (event_name,workflow_order) VALUES
    ('No Status', 0),
    ('Request Denied', 1),
    ('Pending More Info', 2),
    ('Called and Confirmed', 3),
    ('Called and No Response', 4),
    ('Shopping List Downloaded', 5),
    ('Day Overview Downloaded', 6),
    ('Ready to Dispatch', 7),
    ('Received by Centre', 8),
    ('Collection Failed', 9),
    ('Parcel Collected', 10),
    ('Shipping Labels Downloaded', 11),
    ('Map Generated', 13),
    ('Out for Delivery', 14),
    ('Delivered', 15),
    ('Delivery Failed', 16),
    ('Delivery Cancelled', 17),
    ('Fulfilled with Trussell Trust', 18),
    ('Request Deleted', 19);