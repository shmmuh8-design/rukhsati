-- رخصتي: قاعدة بيانات معلّمي السياقة — انسخ الملف كامل والصقه في SQL Editor (نفس مشروع سُقيا) واضغط Run
-- يستخدم نفس رمز المدير حق سُقيا (جدول app_admin).
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.rk_instructors (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 70),
  sex         text not null check (sex in ('m','f')),
  phone       text not null unique check (phone ~ '^[0-9]{10,15}$'),
  lic         text not null check (char_length(lic) between 3 and 30),
  car         text check (char_length(car) <= 60),
  gear        text[] not null check (gear <@ array['auto','manual'] and cardinality(gear) between 1 and 2),
  areas       text[] not null check (cardinality(areas) between 1 and 80),
  price       numeric(6,3) not null check (price > 0 and price < 1000),
  pack        int check (pack between 2 and 60),
  pack_price  numeric(7,3) check (pack_price > 0 and pack_price < 10000),
  langs       text check (char_length(langs) <= 60),
  years       int check (years between 0 and 60),
  available   boolean not null default true,
  status      text not null default 'pending' check (status in ('pending','approved','blocked')),
  code_hash   text not null
);
create table if not exists public.rk_reports (
  id            bigserial primary key,
  instructor_id uuid references public.rk_instructors(id) on delete cascade,
  reason        text not null default '',
  created_at    timestamptz not null default now()
);
alter table public.rk_instructors enable row level security;
alter table public.rk_reports     enable row level security;
revoke all on public.rk_instructors, public.rk_reports from anon, authenticated;

create or replace function public._rk_me(p_phone text, p_code text) returns public.rk_instructors
language plpgsql security definer set search_path = public, extensions as $$
declare d rk_instructors;
begin
  select * into d from rk_instructors where phone = p_phone;
  if d.id is null or d.code_hash <> crypt(upper(coalesce(p_code,'')), d.code_hash) then
    perform pg_sleep(1);
    raise exception 'الرقم أو رمز الدخول غلط';
  end if;
  return d;
end $$;

-- public list: approved only
create or replace function public.rk_list()
returns table(id uuid, name text, sex text, phone text, car text, gear text[], areas text[], price numeric, pack int, pack_price numeric, langs text, years int, available boolean)
language sql stable security definer set search_path = public as $$
  select id, name, sex, phone, car, gear, areas, price, pack, pack_price, langs, years, available
  from rk_instructors where status = 'approved' order by available desc, price
$$;

create or replace function public.rk_report(p_id uuid, p_reason text)
returns void language sql security definer set search_path = public as $$
  insert into rk_reports(instructor_id, reason) values (p_id, left(coalesce(p_reason, ''), 500));
$$;

-- instructor: register (pending until admin approves) -> login code shown once
create or replace function public.rk_register(p_name text, p_sex text, p_phone text, p_lic text, p_car text, p_gear text[], p_areas text[],
  p_price numeric, p_pack int, p_pack_price numeric, p_langs text, p_years int)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare v_code text;
begin
  if exists (select 1 from rk_instructors where phone = p_phone) then
    raise exception 'هذا الرقم مسجّل من قبل — ادخل برمز الدخول حقك';
  end if;
  if (select count(*) from rk_instructors where created_at > now() - interval '1 hour') > 30 then
    raise exception 'ضغط تسجيلات كثير، حاول بعد شوي';
  end if;
  v_code := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8));
  insert into rk_instructors(name, sex, phone, lic, car, gear, areas, price, pack, pack_price, langs, years, code_hash)
  values (trim(p_name), p_sex, p_phone, trim(p_lic), nullif(trim(p_car), ''), p_gear, p_areas, p_price, p_pack, p_pack_price,
          nullif(trim(p_langs), ''), p_years, crypt(v_code, gen_salt('bf')));
  return json_build_object('code', v_code);
end $$;

create or replace function public.rk_me(p_phone text, p_code text)
returns json language plpgsql security definer set search_path = public as $$
declare d rk_instructors := _rk_me(p_phone, p_code);
begin
  return json_build_object('id', d.id, 'name', d.name, 'sex', d.sex, 'phone', d.phone, 'lic', d.lic, 'car', d.car, 'gear', d.gear,
    'areas', d.areas, 'price', d.price, 'pack', d.pack, 'pack_price', d.pack_price, 'langs', d.langs, 'years', d.years,
    'available', d.available, 'status', d.status);
end $$;

create or replace function public.rk_update(p_phone text, p_code text, p_name text, p_car text, p_gear text[], p_areas text[],
  p_price numeric, p_pack int, p_pack_price numeric, p_langs text, p_years int)
returns json language plpgsql security definer set search_path = public as $$
declare d rk_instructors := _rk_me(p_phone, p_code);
begin
  update rk_instructors set name = trim(p_name), car = nullif(trim(p_car), ''), gear = p_gear, areas = p_areas, price = p_price,
    pack = p_pack, pack_price = p_pack_price, langs = nullif(trim(p_langs), ''), years = p_years, updated_at = now()
  where id = d.id;
  return rk_me(p_phone, p_code);
end $$;

create or replace function public.rk_set_available(p_phone text, p_code text, p_available boolean)
returns json language plpgsql security definer set search_path = public as $$
declare d rk_instructors := _rk_me(p_phone, p_code);
begin
  update rk_instructors set available = p_available, updated_at = now() where id = d.id;
  return rk_me(p_phone, p_code);
end $$;

create or replace function public.rk_delete(p_phone text, p_code text)
returns json language plpgsql security definer set search_path = public as $$
declare d rk_instructors := _rk_me(p_phone, p_code);
begin
  delete from rk_instructors where id = d.id;
  return json_build_object('ok', true);
end $$;

-- admin (نفس رمز مدير سُقيا)
create or replace function public.rk_admin_list(p_pass text)
returns table(id uuid, created_at timestamptz, name text, sex text, phone text, lic text, car text, gear text[], areas text[], price numeric, available boolean, status text, reports int)
language plpgsql security definer set search_path = public as $$
begin
  perform _check_admin(p_pass);
  return query select i.id, i.created_at, i.name, i.sex, i.phone, i.lic, i.car, i.gear, i.areas, i.price, i.available, i.status,
    (select count(*)::int from rk_reports r where r.instructor_id = i.id)
  from rk_instructors i order by (i.status = 'pending') desc, i.created_at desc;
end $$;

create or replace function public.rk_admin_set_status(p_pass text, p_id uuid, p_status text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform _check_admin(p_pass);
  if p_status not in ('pending','approved','blocked') then raise exception 'حالة غير صحيحة'; end if;
  update rk_instructors set status = p_status, updated_at = now() where id = p_id;
end $$;

create or replace function public.rk_admin_delete(p_pass text, p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform _check_admin(p_pass);
  delete from rk_instructors where id = p_id;
end $$;

create or replace function public.rk_admin_reports(p_pass text)
returns table(id bigint, created_at timestamptz, instructor text, phone text, reason text)
language plpgsql security definer set search_path = public as $$
begin
  perform _check_admin(p_pass);
  return query select r.id, r.created_at, i.name, i.phone, r.reason
    from rk_reports r left join rk_instructors i on i.id = r.instructor_id order by r.created_at desc limit 200;
end $$;

revoke all on function public._rk_me(text, text) from public, anon, authenticated;
grant execute on function
  public.rk_list(), public.rk_report(uuid, text),
  public.rk_register(text, text, text, text, text, text[], text[], numeric, int, numeric, text, int),
  public.rk_me(text, text), public.rk_update(text, text, text, text, text[], text[], numeric, int, numeric, text, int),
  public.rk_set_available(text, text, boolean), public.rk_delete(text, text),
  public.rk_admin_list(text), public.rk_admin_set_status(text, uuid, text), public.rk_admin_delete(text, uuid), public.rk_admin_reports(text)
to anon, authenticated;
