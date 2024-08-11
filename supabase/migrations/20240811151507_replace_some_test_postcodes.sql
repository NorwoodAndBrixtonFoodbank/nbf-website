-- this is replacing test data from historic seed.sql
update public.clients set address_postcode = 'SE11 5RD' where address_postcode = 'CB2 3JU';
update public.clients set address_postcode = 'SE24 0HG' where address_postcode = 'CB8 9LJ';
update public.clients set address_postcode = 'SW1P 4JL' where address_postcode = 'CB24 4RT';
