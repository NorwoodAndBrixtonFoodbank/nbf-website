update public.events set new_parcel_status = 'Out for Delivery', event_data = 'with John' where new_parcel_status = 'Driver Overview Downloaded';

delete from public.status_order where event_name = 'Driver Overview Downloaded';
