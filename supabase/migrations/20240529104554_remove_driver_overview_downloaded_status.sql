update public.events set new_parcel_status = 'Out for Delivery', event_data = 'with John' where new_parcel_status = 'Driver Overview Downloaded' or new_parcel_status = 'Out for Delivery';

delete from public.status_order where event_name = 'Driver Overview Downloaded';

update public.status_order set workflow_order = 12 where event_name = 'Map Generated';
update public.status_order set workflow_order = 13 where event_name = 'Out for Delivery';
update public.status_order set workflow_order = 14 where event_name = 'Delivered';
update public.status_order set workflow_order = 15 where event_name = 'Delivery Failed';
update public.status_order set workflow_order = 16 where event_name = 'Delivery Cancelled';
update public.status_order set workflow_order = 17 where event_name = 'Fulfilled with Trussell Trust';
update public.status_order set workflow_order = 18 where event_name = 'Parcel Deleted';
