-- رخصتي: تحديث 3 — المعلّم يقدر يبلّغ عن طلب متعلّم (مطلوب لمراجعة أبل)
-- انسخ الملف كامل والصقه في SQL Editor (مشروع سُقيا) واضغط Run
alter table public.rk_reports add column if not exists learner_id uuid references public.rk_learners(id) on delete cascade;

create or replace function public.rk_report_learner(p_id uuid, p_reason text)
returns void language sql security definer set search_path = public as $$
  insert into rk_reports(learner_id, reason) values (p_id, left(coalesce(p_reason, ''), 500));
$$;

drop function if exists public.rk_admin_reports(text);
create function public.rk_admin_reports(p_pass text)
returns table(id bigint, created_at timestamptz, instructor text, phone text, reason text, kind text)
language plpgsql security definer set search_path = public as $$
begin
  perform _check_admin(p_pass);
  return query select r.id, r.created_at, coalesce(i.name, l.name), coalesce(i.phone, l.phone), r.reason,
      case when r.learner_id is not null then 'learner' else 'instructor' end
    from rk_reports r left join rk_instructors i on i.id = r.instructor_id left join rk_learners l on l.id = r.learner_id
    order by r.created_at desc limit 200;
end $$;

grant execute on function public.rk_report_learner(uuid, text), public.rk_admin_reports(text) to anon, authenticated;
