DELETE FROM public.website_data;

INSERT INTO public.website_data (name,value) VALUES ('lists_text', 'Space is valuable! Please don''t leave boxes half empty - pack efficiently!
BOXES MUST BE PACKED FLAT SO THAT THEY CAN BE STACKED. Do not leave items sticking out of the top.
We do have a selection of ''free from'' goods as well as vegan and halal products. If you''re uncertain about any additional dietary needs, please speak to one of the team.'), ('driver_overview_message', 'At the end of your shift, please call/text the Dispatch phone to let us know all deliveries have been completed or to report any issues.
In an emergency, please ring Elizabeth or Rebekah.
Dispatch- 07840 821 794 | Elizabeth- 07722 121 108 | Rebekah- 07366 574 794');


DELETE FROM public.status_order;

INSERT INTO public.status_order (event_name,workflow_order) VALUES
    ('No Status', 0),
    ('Request Denied', 1),
    ('Pending More Info', 2),
    ('Called and Confirmed', 3),
    ('Called and No Response', 4),
    ('Shopping List Downloaded', 5),
    ('Ready to Dispatch', 6),
    ('Received by Centre', 7),
    ('Collection Failed', 8),
    ('Parcel Collected', 9),
    ('Shipping Labels Downloaded', 10),
    ('Out for Delivery', 11),
    ('Delivered', 12),
    ('Delivery Failed', 13),
    ('Delivery Cancelled', 14),
    ('Fulfilled with Trussell Trust', 15),
    ('Request Deleted', 16);
