-- رخصتي: تحديث 2 — المعلّم يظهر على طول بدون مراجعة، ورقم الترخيص اختياري، وتسجيل المتعلّمين
-- انسخ الملف كامل والصقه في SQL Editor (مشروع سُقيا) واضغط Run

-- 1) المعلّمين: موافقة تلقائية + الترخيص اختياري
alter table public.rk_instructors alter column status set default 'approved';
update public.rk_instructors set status = 'approved' where status = 'pending';
alter table public.rk_instructors alter column lic drop not null;
alter table public.rk_instructors drop constraint if exists rk_instructors_lic_check;
alter table public.rk_instructors add constraint rk_instructors_lic_check check (lic is null or char_length(lic) between 1 and 30);

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
  insert into rk_instructors(name, sex, phone, lic, car, gear, areas, price, pack, pack_price, langs, years, status, code_hash)
  values (trim(p_name), p_sex, p_phone, nullif(trim(coalesce(p_lic, '')), ''), nullif(trim(p_car), ''), p_gear, p_areas, p_price, p_pack, p_pack_price,
          nullif(trim(p_langs), ''), p_years, 'approved', crypt(v_code, gen_salt('bf')));
  return json_build_object('code', v_code);
end $$;

-- 2) المتعلّمين
create table if not exists public.rk_learners (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 70),
  sex         text not null check (sex in ('m','f')),
  phone       text not null unique check (phone ~ '^[0-9]{10,15}$'),
  gov         text not null check (char_length(gov) <= 40),
  area        text not null check (char_length(area) <= 40),
  gear        text not null default 'any' check (gear in ('auto','manual','any')),
  want        text not null default 'any' check (want in ('any','m','f')),
  notes       text check (char_length(notes) <= 200),
  active      boolean not null default true,
  code_hash   text not null
);
alter table public.rk_learners enable row level security;
revoke all on public.rk_learners from anon, authenticated;

create or replace function public._rk_lme(p_phone text, p_code text) returns public.rk_learners
language plpgsql security definer set search_path = public, extensions as $$
declare d rk_learners;
begin
  select * into d from rk_learners where phone = p_phone;
  if d.id is null or d.code_hash <> crypt(upper(coalesce(p_code,'')), d.code_hash) then
    perform pg_sleep(1);
    raise exception 'الرقم أو رمز الدخول غلط';
  end if;
  return d;
end $$;

create or replace function public.rk_learner_register(p_name text, p_sex text, p_phone text, p_gov text, p_area text, p_gear text, p_want text, p_notes text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare v_code text;
begin
  if exists (select 1 from rk_learners where phone = p_phone) then
    raise exception 'هذا الرقم مسجّل من قبل — ادخل برمز الدخول حقك';
  end if;
  if (select count(*) from rk_learners where created_at > now() - interval '1 hour') > 60 then
    raise exception 'ضغط تسجيلات كثير، حاول بعد شوي';
  end if;
  v_code := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8));
  insert into rk_learners(name, sex, phone, gov, area, gear, want, notes, code_hash)
  values (trim(p_name), p_sex, p_phone, p_gov, p_area, coalesce(p_gear,'any'), coalesce(p_want,'any'), nullif(trim(coalesce(p_notes,'')), ''), crypt(v_code, gen_salt('bf')));
  return json_build_object('code', v_code);
end $$;

create or replace function public.rk_learner_me(p_phone text, p_code text)
returns json language plpgsql security definer set search_path = public as $$
declare d rk_learners := _rk_lme(p_phone, p_code);
begin
  return json_build_object('id', d.id, 'name', d.name, 'sex', d.sex, 'phone', d.phone, 'gov', d.gov, 'area', d.area,
    'gear', d.gear, 'want', d.want, 'notes', d.notes, 'active', d.active);
end $$;

create or replace function public.rk_learner_update(p_phone text, p_code text, p_name text, p_gov text, p_area text, p_gear text, p_want text, p_notes text, p_active boolean)
returns json language plpgsql security definer set search_path = public as $$
declare d rk_learners := _rk_lme(p_phone, p_code);
begin
  update rk_learners set name = trim(p_name), gov = p_gov, area = p_area, gear = p_gear, want = p_want,
    notes = nullif(trim(coalesce(p_notes,'')), ''), active = p_active, updated_at = now() where id = d.id;
  return rk_learner_me(p_phone, p_code);
end $$;

create or replace function public.rk_learner_delete(p_phone text, p_code text)
returns json language plpgsql security definer set search_path = public as $$
declare d rk_learners := _rk_lme(p_phone, p_code);
begin
  delete from rk_learners where id = d.id;
  return json_build_object('ok', true);
end $$;

-- المعلّم المسجّل يشوف المتعلّمين اللي في ولاياته بس
create or replace function public.rk_learners_list(p_phone text, p_code text)
returns table(id uuid, created_at timestamptz, name text, sex text, phone text, gov text, area text, gear text, want text, notes text)
language plpgsql security definer set search_path = public as $$
declare i rk_instructors := _rk_me(p_phone, p_code);
begin
  if i.status = 'blocked' then raise exception 'حسابك موقوف'; end if;
  return query select l.id, l.created_at, l.name, l.sex, l.phone, l.gov, l.area, l.gear, l.want, l.notes
  from rk_learners l
  where l.active and (l.area = any(i.areas) or ('gov:' || l.gov) = any(i.areas))
    and (l.want = 'any' or l.want = i.sex)
    and (l.gear = 'any' or l.gear = any(i.gear))
  order by l.created_at desc limit 200;
end $$;

create or replace function public.rk_admin_learners(p_pass text)
returns table(id uuid, created_at timestamptz, name text, sex text, phone text, gov text, area text, gear text, want text, notes text, active boolean)
language plpgsql security definer set search_path = public as $$
begin
  perform _check_admin(p_pass);
  return query select l.id, l.created_at, l.name, l.sex, l.phone, l.gov, l.area, l.gear, l.want, l.notes, l.active
  from rk_learners l order by l.created_at desc limit 500;
end $$;

create or replace function public.rk_admin_learner_delete(p_pass text, p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform _check_admin(p_pass);
  delete from rk_learners where id = p_id;
end $$;

revoke all on function public._rk_lme(text, text) from public, anon, authenticated;
grant execute on function
  public.rk_register(text, text, text, text, text, text[], text[], numeric, int, numeric, text, int),
  public.rk_learner_register(text, text, text, text, text, text, text, text),
  public.rk_learner_me(text, text),
  public.rk_learner_update(text, text, text, text, text, text, text, text, boolean),
  public.rk_learner_delete(text, text),
  public.rk_learners_list(text, text),
  public.rk_admin_learners(text), public.rk_admin_learner_delete(text, uuid)
to anon, authenticated;
