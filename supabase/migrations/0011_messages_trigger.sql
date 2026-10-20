-- The messages trigger counts earlier rows, which the public key may not read; run it as the owner,
-- like the applications trigger. Run after 0010.
create or replace function public.messages_clean_insert() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.status := 'new'; new.notes := null; new.ts := now();
  new.email := lower(trim(new.email)); new.name := trim(new.name); new.message := trim(new.message);
  if new.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Invalid email.' using errcode = 'P0001'; end if;
  if (select count(*) from public.messages where email = new.email and ts > now() - interval '1 day') >= 5 then
    raise exception 'Too many messages from this address today.' using errcode = 'P0001';
  end if;
  if (select count(*) from public.messages where ts > now() - interval '1 day') >= 200 then
    raise exception 'The form is paused for today. Please email us instead.' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke execute on function public.messages_clean_insert() from public, anon, authenticated;
