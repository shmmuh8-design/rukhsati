// رخصتي — الواجهة: التبويبات، الرئيسية (3D)، البحث، حصصي، تعلّم، مهاراتي، الاختبار التجريبي
(function(){
const RL = window.RK_LEARN || { lessons:[], signs:[], quiz:[], note:['',''] };
const P2 = a => Array.isArray(a) ? a[EN() ? 1 : 0] : a;

/* ---------- أيقونات ذهبية ---------- */
const ICON = {
  home:'<path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z"/>',
  pin:'<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  cal:'<rect x="4" y="5.5" width="16" height="15" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/><path d="M8 14h2M11 14h2M14 14h2M8 17h2M11 17h2"/>',
  book:'<path d="M12 6.5C10.3 5.3 7.7 4.8 4 5v13c3.7-.2 6.3.3 8 1.5 1.7-1.2 4.3-1.7 8-1.5V5c-3.7-.2-6.3.3-8 1.5z"/><path d="M12 6.5v13"/>',
  user:'<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5c1.2-3.7 4-5.5 7.5-5.5s6.3 1.8 7.5 5.5"/>',
  quiz:'<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4.5V3h6v1.5"/><path d="m8.5 12 2 2 4-4.5M8.5 17.5h7"/>',
  sign:'<path d="M12 3.5 21 19H3z"/><path d="M12 9.5v4.5M12 16.5v.3"/>',
  search:'<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  map:'<path d="M3.5 6.5 9 4l6 2.5L20.5 4v13.5L15 20l-6-2.5-5.5 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  star:'<path d="m12 3.8 2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5 2.7.9-5.6-4-3.9 5.6-.8z"/>',
  wa:'<path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.3 18.6z"/><path d="M9.2 8.8c.2 2.7 2.8 5.4 5.6 5.8l1-1.3-1.8-.9-.8.8c-1-.4-2.1-1.4-2.6-2.6l.8-.8-.8-1.8z"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>'
};
const ic = (k, cls) => `<svg class="ico ${cls||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]||''}</svg>`;
const H = (tag, attrs, html) => { const e = el(tag, attrs); if(html != null) e.innerHTML = html; return e; };

/* ---------- لوحات المرور (SVG) ---------- */
function signSVG(s, n){
  const R='#d62828', B='#1d5fbf', K='#151515';
  const circ = (f, b) => `<circle cx="50" cy="50" r="43" fill="${f}" stroke="${b}" stroke-width="10"/>`;
  const tri = `<path d="M50 9 93 85H7z" fill="#fff" stroke="${R}" stroke-width="8.5" stroke-linejoin="round"/>`;
  const man = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k||1})" stroke="${K}" stroke-width="4" stroke-linecap="round" fill="none"><circle cx="0" cy="-15" r="4.2" fill="${K}" stroke="none"/><path d="M0-9v13M0 4l-6 11M0 4l6 11M-7-4l7-3 7 3"/></g>`;
  const car = (x, y, c) => `<g transform="translate(${x} ${y})"><rect x="-9" y="-12" width="18" height="24" rx="5" fill="${c}"/><rect x="-6" y="-7" width="12" height="7" rx="2" fill="#fff" opacity=".8"/></g>`;
  let g = '';
  switch(s){
    case 'stop': { const p = []; for(let i=0;i<8;i++){ const a = Math.PI/8 + i*Math.PI/4; p.push((50+46*Math.cos(a)).toFixed(1)+','+(50+46*Math.sin(a)).toFixed(1)); }
      g = `<polygon points="${p.join(' ')}" fill="${R}" stroke="#fff" stroke-width="3"/><text x="50" y="47" font-size="20" font-weight="900" fill="#fff" text-anchor="middle" font-family="Cairo,sans-serif">قف</text><text x="50" y="68" font-size="17" font-weight="900" fill="#fff" text-anchor="middle" font-family="Arial,sans-serif">STOP</text>`; break; }
    case 'yield': g = `<path d="M7 14h86L50 90z" fill="#fff" stroke="${R}" stroke-width="9" stroke-linejoin="round"/>`; break;
    case 'noentry': g = `<circle cx="50" cy="50" r="45" fill="${R}"/><rect x="20" y="42" width="60" height="16" rx="2" fill="#fff"/>`; break;
    case 'speed': g = circ('#fff', R) + `<text x="50" y="62" font-size="${String(n||80).length>2?28:34}" font-weight="900" fill="${K}" text-anchor="middle" font-family="Arial,sans-serif">${n||80}</text>`; break;
    case 'noovertake': g = circ('#fff', R) + car(37, 52, R) + car(63, 52, K); break;
    case 'nouturn': g = circ('#fff', R) + `<path d="M40 70V44a10 10 0 0 1 20 0v14" fill="none" stroke="${K}" stroke-width="6"/><path d="m51 54 9 10 9-10" fill="none" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M22 22 78 78" stroke="${R}" stroke-width="8"/>`; break;
    case 'nopark': g = `<circle cx="50" cy="50" r="43" fill="${B}" stroke="${R}" stroke-width="10"/><path d="M22 22 78 78" stroke="${R}" stroke-width="9"/>`; break;
    case 'nostop': g = `<circle cx="50" cy="50" r="43" fill="${B}" stroke="${R}" stroke-width="10"/><path d="M22 22 78 78M78 22 22 78" stroke="${R}" stroke-width="9"/>`; break;
    case 'round': g = tri + `<g fill="none" stroke="${K}" stroke-width="5"><path d="M38 60a12 12 0 0 1 9-15"/><path d="M55 46a12 12 0 0 1 7 14"/><path d="M57 70a12 12 0 0 1-15-1"/></g><g fill="${K}"><path d="m46 41 6 4-6 5z"/><path d="m66 58-3 7-5-5z"/><path d="m40 73-1-7 7 1z"/></g>`; break;
    case 'lights': g = tri + `<rect x="42" y="36" width="16" height="40" rx="4" fill="${K}"/><circle cx="50" cy="44" r="4.5" fill="#e33"/><circle cx="50" cy="56" r="4.5" fill="#fb0"/><circle cx="50" cy="68" r="4.5" fill="#2c4"/>`; break;
    case 'ped': g = tri + man(50, 64) + `<path d="M28 77h44" stroke="${K}" stroke-width="3" stroke-dasharray="5 4"/>`; break;
    case 'kids': g = tri + man(42, 66, .85) + man(58, 68, .7); break;
    case 'camel': g = tri + `<text x="50" y="74" font-size="34" text-anchor="middle">🐪</text>`; break;
    case 'slip': g = tri + car(50, 50, K) + `<path d="M36 70c4-5 8 5 12 0s8 5 12 0M38 77c4-5 8 5 12 0s8 5 12 0" fill="none" stroke="${K}" stroke-width="3"/>`; break;
    case 'bump': g = tri + `<path d="M24 74h14c4 0 6-12 12-12s8 12 12 12h14" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>`; break;
    case 'keepr': g = `<circle cx="50" cy="50" r="45" fill="${B}" stroke="#fff" stroke-width="3"/><path d="M34 34 64 64" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M48 68h18V50" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`; break;
    case 'roundm': g = `<circle cx="50" cy="50" r="45" fill="${B}" stroke="#fff" stroke-width="3"/><g fill="none" stroke="#fff" stroke-width="7"><path d="M33 58a18 18 0 0 1 12-23"/><path d="M60 35a18 18 0 0 1 8 22"/><path d="M60 70a18 18 0 0 1-22-2"/></g><g fill="#fff"><path d="m42 28 11 7-11 7z"/><path d="m75 55-4 12-8-8z"/><path d="m32 74-2-12 11 2z"/></g>`; break;
  }
  return `<svg viewBox="0 0 100 100" class="sg" role="img">${g}</svg>`;
}
window.signSVG = signSVG;

/* ---------- البحث: شرائح المحافظات ---------- */
function findView(){
  $('govChips').replaceChildren(...Object.keys(GOV).map(g => el('button',{type:'button','aria-pressed':String(S.gov===g),text:gn(g),onclick:()=>{ S.gov = g; if(!GOV[g].includes(S.area)) S.area = GOV[g][0]; save(); fill(); draw(); findView(); }})));
}

/* ---------- ميل ثلاثي الأبعاد للبطاقات ---------- */
function tilt(card){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const reset = () => card.style.transform = '';
  card.addEventListener('pointermove', e => { const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; card.style.transform = `perspective(600px) rotateY(${(x*10).toFixed(1)}deg) rotateX(${(-y*10).toFixed(1)}deg) translateZ(4px)`; });
  card.addEventListener('pointerleave', reset); card.addEventListener('pointercancel', reset); card.addEventListener('pointerup', reset);
}

/* ---------- المهارات ---------- */
const SKILLS = [
  ['🚗', ['التحكم بالسيارة والانطلاق','Car control & moving off'], ['الكلتش أو البنزين بسلاسة، والوقوف بهدوء','Smooth pedals and gentle stops']],
  ['↩️', ['الرجوع للخلف','Reversing'], ['باستخدام المرايا والالتفات','Using mirrors and looking back']],
  ['🅿️', ['الوقوف الموازي','Parallel parking'], ['بين سيارتين بدون ما تلمس الرصيف','Between two cars without touching the kerb']],
  ['⛰️', ['الطلوع في المرتفع','Hill start'], ['بدون ما ترجع السيارة لورا','Without rolling back']],
  ['🔄', ['الدوّارات','Roundabouts'], ['المسار الصحيح والأولوية والإشارة','Right lane, priority and signalling']],
  ['🚦', ['التقاطعات والإشارات','Junctions & lights'], ['الوقوف عند الخط والانعطاف الآمن','Stopping at the line and turning safely']],
  ['↔️', ['تغيير المسار','Changing lanes'], ['المرايا والإشارة والنقطة العمياء','Mirrors, signal and blind spot']],
  ['🛣️', ['الطريق السريع','Highway driving'], ['الدخول والخروج والمسافة الآمنة','Merging, exiting and safe gaps']],
  ['🌙', ['السياقة بالليل','Night driving'], ['الأنوار والانتباه للحيوانات','Lights and watching for animals']],
  ['🔁', ['الدوران للخلف (U)','U-turns'], ['في المكان المسموح وبأمان','Only where allowed, safely']]
];
const LVL = [['ما بديت','Not started'],['أتدرب','Practising'],['أتقنتها ✓','Mastered ✓']];
const skills = () => LS.get('rk-skills', {});
function skillScore(){ const k = skills(); return SKILLS.reduce((a, _, i) => a + (k[i]||0), 0) / (SKILLS.length * 2); }
function skillsView(v){
  const k = skills(), m = SKILLS.filter((_, i) => k[i] === 2).length;
  v.append(el('div',{class:'gl prog'},
    el('div',{class:'prog-h'}, el('div',{}, el('b',{class:'num',text:m+' / '+SKILLS.length}), el('span',{text:L(' مهارة أتقنتها',' skills mastered')}))),
    el('div',{class:'bar'}, el('i',{style:'width:'+Math.round(skillScore()*100)+'%'})),
    el('p',{class:'hint',text:L('اضغط على المهارة بعد كل حصة عشان تغيّر مستواك. قول لمعلّمك يركّز على اللي ما أتقنتها.','Tap a skill after each lesson to update it. Ask your instructor to focus on the ones you haven’t mastered.')})));
  SKILLS.forEach(([icn, t, d], i) => {
    const lv = k[i] || 0;
    const b = el('button',{type:'button',class:'gl skl',onclick:()=>{ const s2 = skills(); s2[i] = ((s2[i]||0) + 1) % 3; LS.set('rk-skills', s2); if(s2[i] === 2) toast(L('أحسنت! أتقنت ','Well done! Mastered: ')+P2(t)+' 🏆'); learnView('skill'); }},
      el('span',{class:'si',text:icn}), el('span',{}, el('b',{text:P2(t)}), el('small',{text:P2(d)})), el('span',{class:'lvl l'+lv,text:P2(LVL[lv])}));
    v.append(b);
  });
}

/* ---------- جاهزية الاختبار ---------- */
function readiness(){
  const done = lessons().filter(x => x.done).length, goal = LS.get('rk-goal', 0) || 20;
  const N = Math.min(15, RL.quiz.length), best = LS.get('rk-quiz-best', 0) || 0;
  const parts = [ Math.min(1, done / goal), skillScore(), N ? best / N : 0 ];
  return { pct: Math.round(parts[0]*40 + parts[1]*35 + parts[2]*25), parts, done, goal, best, N };
}
function readyDraw(){
  const box = $('ready'); if(!box) return;
  const r = readiness(), weak = r.parts.indexOf(Math.min(...r.parts));
  const msg = r.pct >= 85 ? L('أنت جاهز تقريبًا! راجع الاختبار التجريبي واحجز موعدك 🎉','You’re nearly ready! Review the practice test and book your test 🎉')
    : r.pct >= 50 ? L('ماشي زين 👏 كمّل على اللي ناقصك.','Going well 👏 keep working on the gaps.') : L('بداية الطريق 🚗 خطوة خطوة وبتوصل.','Just starting 🚗 step by step you’ll get there.');
  const row = (t, v, txt) => el('div',{class:'rk-row'}, el('span',{text:t}), el('div',{class:'bar sm'}, el('i',{style:'width:'+Math.round(v*100)+'%'})), el('span',{class:'num',text:txt}));
  const ring = el('div',{class:'ring',style:'--p:'+r.pct}, el('b',{class:'num',text:r.pct+'%'}), el('small',{text:L('جاهزيتك','Ready')}));
  const go2 = [()=>go('book'), ()=>go('learn','skill'), ()=>go('learn','quiz')][weak];
  box.replaceChildren(ring, el('div',{class:'rk'},
    el('h3',{text:L('جاهزيتك للاختبار','Test readiness')}),
    row(L('الحصص','Lessons'), r.parts[0], r.done+'/'+r.goal),
    row(L('المهارات','Skills'), r.parts[1], Math.round(r.parts[1]*100)+'%'),
    row(L('الاختبار','Quiz'), r.parts[2], r.best+'/'+r.N),
    el('p',{class:'hint',style:'margin:2px 0 0',text:msg}),
    el('button',{class:'btn line sm',type:'button',style:'justify-self:start',text:[L('📅 أضف حصة','📅 Add a lesson'),L('🎯 حدّث مهاراتك','🎯 Update skills'),L('📝 جرّب الاختبار','📝 Try the quiz')][weak],onclick:go2})));
}

/* ---------- سؤال اليوم ---------- */
function dailyDraw(){
  const box = $('daily'); if(!box || !RL.quiz.length) return;
  const day = Math.floor((Date.now() + 4*36e5) / 864e5), qi = day % RL.quiz.length, q = RL.quiz[qi];
  const st = LS.get('rk-daily', {}), mine = st.day === day ? st.pick : null;
  const streak = LS.get('rk-streak', { n:0, last:0 });
  const opts = el('div',{class:'qopts'});
  q.o.forEach((o, oi) => {
    const b = el('button',{type:'button',class:'qo',text:P2(o),onclick:()=>{
      if(LS.get('rk-daily', {}).day === day) return;
      LS.set('rk-daily', { day, pick: oi });
      if(oi === q.a){ const s2 = LS.get('rk-streak', { n:0, last:0 }); LS.set('rk-streak', { n: s2.last === day - 1 ? s2.n + 1 : 1, last: day }); }
      else { const w = LS.get('rk-wrong', []); if(!w.includes(qi)) LS.set('rk-wrong', w.concat(qi)); }
      dailyDraw(); }});
    if(mine != null){ b.disabled = true; if(oi === q.a) b.classList.add('right'); else if(oi === mine) b.classList.add('wrong'); }
    opts.append(b);
  });
  const sn = streak.last >= day - 1 ? streak.n : 0;
  box.replaceChildren(...[
    el('div',{class:'dq-h'}, el('b',{text:L('🌟 سؤال اليوم','🌟 Question of the day')}), sn ? el('span',{class:'tag ok',text:'🔥 '+sn+L(' يوم متتالي',' day streak')}) : null),
    q.sign ? H('div',{class:'qsign'}, signSVG(q.sign, (RL.signs.find(s=>s.s===q.sign)||{}).n)) : null,
    el('h4',{text:P2(q.q)}), opts,
    mine != null ? el('p',{class:'qwhy '+(mine===q.a?'ok':'no'),text:(mine===q.a?L('✅ صح! ','✅ Correct! '):L('❌ غلط. ','❌ Not quite. '))+P2(q.w)+L(' · سؤال جديد بكره',' · New question tomorrow')}) : null].filter(Boolean));
}

/* ---------- المفضلين ---------- */
function instCard(d){
  const ini = d.name.replace(/^(أم|أبو|Umm|Abu)\s+/,'').trim()[0];
  const area = d.areas[0] ? (d.areas[0].startsWith('gov:') ? L('كل ','All ') + gn(d.areas[0].slice(4)) : gn(d.areas[0])) : '';
  const c = el('article',{class:'fc'+(d.sex==='f'?' f':'')},
    el('div',{class:'fc-top'}, el('div',{class:'fc-av',text:ini}),
      el('div',{style:'display:grid;gap:4px;justify-items:end'}, el('button',{type:'button',class:'fav','aria-label':L('مفضّل','Favorite'),text:isFav(d.id)?'❤️':'🤍',onclick:()=>{ toggleFav(d.id); homeDraw(); }}),
        el('span',{class:'tag '+(d.available?'ok':'busy'),text:d.available?L('يستقبل','Available'):L('مشغول','Busy')}))),
    el('h4',{text:d.name}),
    H('p',{class:'fc-l'}, ic('pin') + '<span></span>'),
    H('p',{class:'fc-l'}, ic('gear') + '<span></span>'),
    el('p',{class:'fc-p'}, el('b',{class:'num',text:omr(d.price)}), el('span',{text:' '+L('ر.ع / حصة','OMR / lesson')})),
    el('button',{class:'btn sign',type:'button',text:L('💬 تواصل الآن','💬 Contact'),onclick:()=>request(d)}));
  const ls = c.querySelectorAll('.fc-l span'); ls[0].textContent = area; ls[1].textContent = gearTxt(d.gear);
  tilt(c); return c;
}

/* ---------- الرئيسية ---------- */
function homeDraw(){
  if(!$('v-home')) return;
  readyDraw(); dailyDraw(); if(!LOADING) favDraw();
  const hidden = new Set(LS.get('rk-hide', []));
  const all = DATA.filter(d => !hidden.has(d.id));
  const cov = new Set(); all.forEach(d => d.areas.forEach(a => a.startsWith('gov:') ? (GOV[a.slice(4)]||[]).forEach(w => cov.add(w)) : cov.add(a)));
  const minP = all.length ? Math.min(...all.map(d => d.price)) : null;
  $('stN').textContent = LOADING ? '…' : all.length;
  $('stW').textContent = LOADING ? '…' : cov.size;
  $('stP').textContent = LOADING ? '…' : (minP == null ? '—' : omr(minP));
  let list = all.filter(covers), local = true;
  if(!list.length){ list = all; local = false; }
  list = list.slice().sort((a,b) => (b.available - a.available) || a.price - b.price).slice(0, 12);
  $('featT').textContent = local ? L('معلّمين في ','Instructors in ') + gn(S.area) : L('معلّمين في عُمان','Instructors in Oman');
  const box = $('feat'); box.replaceChildren();
  if(LOADING){ box.append(el('div',{class:'empty',text:L('جاري التحميل…','Loading…')})); return; }
  if(!list.length){ box.append(el('div',{class:'empty',text:L('للحين ما فيه معلّمين مسجّلين. كن أول واحد!','No instructors listed yet. Be the first!')})); return; }
  list.forEach(d => box.append(instCard(d)));
}
function favDraw(){
  const hidden = new Set(LS.get('rk-hide', [])), f = LS.get('rk-fav', []);
  const favs = DATA.filter(d => f.includes(d.id) && !hidden.has(d.id));
  $('favSec').hidden = !favs.length; $('favT').textContent = L('❤️ معلّميني المفضلين','❤️ My favorite instructors');
  $('favRail').replaceChildren(...favs.map(instCard));
}

/* ---------- حصصي ---------- */
const LKEY = 'rk-lessons';
const lessons = () => LS.get(LKEY, []);
const setLessons = v => LS.set(LKEY, v);
function fmtDate(iso){ try{ return new Date(iso).toLocaleDateString(EN() ? 'en-GB' : 'ar-OM', { weekday:'long', day:'numeric', month:'long' }); }catch(e){ return iso; } }
function fmtTime(iso){ try{ return new Date(iso).toLocaleTimeString(EN() ? 'en-GB' : 'ar-OM', { hour:'numeric', minute:'2-digit' }); }catch(e){ return ''; } }
function rel(iso){
  const d = (new Date(iso) - Date.now()) / 60000;
  if(d < 0) return L('فات موعدها','Past');
  if(d < 60) return L('بعد '+Math.max(1,Math.round(d))+' دقيقة','In '+Math.max(1,Math.round(d))+' min');
  if(d < 1440) return L('بعد '+Math.round(d/60)+' ساعة','In '+Math.round(d/60)+' h');
  const n = Math.round(d/1440); return L(n===1?'بكره':n===2?'بعد يومين':'بعد '+n+' أيام', n===1?'Tomorrow':'In '+n+' days');
}
function bookView(){
  const all = lessons(), goal = LS.get('rk-goal', 0), done = all.filter(x => x.done).length;
  const up = all.filter(x => !x.done).sort((a,b) => a.when.localeCompare(b.when)), past = all.filter(x => x.done).sort((a,b) => b.when.localeCompare(a.when));
  const pct = goal ? Math.min(100, Math.round(done / goal * 100)) : 0;
  const v = $('bookBody'); v.replaceChildren();
  v.append(el('div',{class:'gl prog'},
    el('div',{class:'prog-h'}, el('div',{}, el('b',{class:'num',text:done+(goal?' / '+goal:'')}), el('span',{text:L(' حصة حضرتها',' lessons done')})),
      el('button',{class:'btn line sm',type:'button',text:goal?L('🎯 تعديل الهدف','🎯 Edit goal'):L('🎯 حدد عدد الحصص','🎯 Set your goal'),onclick:setGoal})),
    el('div',{class:'bar'}, el('i',{style:'width:'+pct+'%'})),
    el('p',{class:'hint',text:goal ? (done>=goal ? L('🎉 خلّصت الحصص! جاهز تحجز موعد الاختبار؟','🎉 All lessons done! Ready to book your test?') : L('باقي '+(goal-done)+' حصة على هدفك',(goal-done)+' lessons to go')) : L('حدد عدد الحصص في باقتك عشان تتابع تقدّمك.','Set how many lessons are in your package to track progress.')})));
  v.append(el('button',{class:'btn sign wide',type:'button',text:L('➕ أضف موعد حصة','➕ Add a lesson'),onclick:()=>addLesson()}));
  const card = x => {
    const d = DATA.find(i => i.id === x.iid);
    return el('article',{class:'gl lc'+(x.done?' done':'')},
      el('div',{class:'lc-d'}, el('b',{text:fmtDate(x.when)}), el('span',{class:'num',text:fmtTime(x.when)})),
      el('div',{class:'lc-m'}, el('p',{text:'🚗 '+(x.who || L('معلّم','Instructor'))}), x.note ? el('p',{class:'hint',text:x.note}) : null, x.done ? null : el('span',{class:'tag ok',text:rel(x.when)})),
      el('div',{class:'lc-a'},
        x.done ? el('button',{class:'btn line sm',type:'button',text:L('↩️ تراجع','↩️ Undo'),onclick:()=>{ setLessons(lessons().map(y => y.id===x.id ? {...y, done:false} : y)); bookView(); }})
               : el('button',{class:'btn sign sm',type:'button',text:L('✅ حضرتها','✅ Done'),onclick:()=>{ setLessons(lessons().map(y => y.id===x.id ? {...y, done:true} : y)); toast(L('ممتاز! حصة زيادة 💪','Nice! One more lesson 💪')); bookView(); }}),
        d ? el('a',{class:'btn wa sm',href:'https://wa.me/'+d.phone,target:'_blank',rel:'noopener',text:'💬'}) : null,
        el('button',{class:'btn line sm',type:'button','aria-label':L('حذف','Delete'),text:'🗑️',onclick:e=>{ const t=e.currentTarget; if(!t.dataset.sure){ t.dataset.sure=1; t.textContent=L('متأكد؟','Sure?'); return; } setLessons(lessons().filter(y => y.id!==x.id)); bookView(); }})));
  };
  v.append(el('h3',{class:'sec',text:L('الحصص الجاية','Upcoming lessons')}));
  v.append(...(up.length ? up.map(card) : [el('div',{class:'empty',text:L('ما فيه مواعيد. أضف موعد حصتك الجاية وتابعه هنا 📅','No lessons yet. Add your next lesson and track it here 📅')})]));
  if(past.length){ v.append(el('h3',{class:'sec',text:L('حصص حضرتها','Completed')})); v.append(...past.map(card)); }
  const TD = [[L('البطاقة الشخصية سارية','Valid ID card')],[L('ملف أو شهادة التدريب من معلّمك','Training file / certificate from your instructor')],[L('نظارتك الطبية إذا تحتاجها','Your glasses if you need them')],[L('تأكدت من موعد الاختبار ومكانه','Confirmed test time and place')],[L('راجعت الإشارات والاختبار التجريبي','Reviewed signs and the practice test')],[L('نمت زين، وبوصل قبل الموعد بربع ساعة','Slept well, arriving 15 minutes early')]];
  const td = LS.get('rk-testday', []);
  v.append(el('h3',{class:'sec',text:L('🎒 قائمة يوم الاختبار','🎒 Test-day checklist')}));
  v.append(el('div',{class:'gl',style:'padding:4px 0'}, ...TD.map(([t], i) => el('button',{type:'button',class:'chk'+(td.includes(i)?' on':''),onclick:()=>{ const x = LS.get('rk-testday', []); const k = x.indexOf(i); k<0 ? x.push(i) : x.splice(k,1); LS.set('rk-testday', x); bookView(); }}, el('i',{text:td.includes(i)?'✓':''}), el('span',{text:t})))));
  v.append(el('p',{class:'hint',text:L('ℹ️ قائمة عامة للتذكير. تأكد من المتطلبات الرسمية من شرطة عُمان السلطانية.','ℹ️ A general reminder list. Check the official requirements with the Royal Oman Police.')}));
  v.append(el('p',{class:'hint center',text:L('مواعيدك محفوظة في جوالك بس، وما توصل لأحد.','Your lessons are saved on your phone only.')}));
}
function setGoal(){
  sheet((b, close) => {
    const n = el('input',{type:'number',min:'1',max:'200',step:'1',dir:'ltr',value:String(LS.get('rk-goal', '') || ''),placeholder:'20'});
    b.append(el('h3',{text:L('🎯 كم حصة في باقتك؟','🎯 How many lessons in your package?')}), n,
      el('div',{class:'acts'}, el('button',{class:'btn sign',type:'button',text:L('حفظ','Save'),onclick:()=>{ const v = Math.round(+n.value); if(!(v>0)) return toast(L('اكتب رقم','Enter a number')); LS.set('rk-goal', v); close(); bookView(); }}), closeBtn(close)));
  });
}
function addLesson(){
  sheet((b, close) => {
    const now = new Date(Date.now() + 864e5), pad = x => String(x).padStart(2,'0');
    const dt = el('input',{type:'date',dir:'ltr',value:now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate())});
    const tm = el('input',{type:'time',dir:'ltr',value:'16:00'});
    const opts = DATA.slice().sort((a,b)=>a.name.localeCompare(b.name,'ar'));
    const who = el('select',{}, el('option',{value:'',text:L('— اختار معلّمك —','— Choose your instructor —')}), ...opts.map(d => el('option',{value:d.id,text:d.name})), el('option',{value:'other',text:L('معلّم ثاني (اكتب اسمه)','Someone else (type name)')}));
    const other = el('input',{type:'text',placeholder:L('اسم المعلّم','Instructor name'),hidden:true});
    who.onchange = () => { other.hidden = who.value !== 'other'; };
    const note = el('input',{type:'text',maxlength:'80',placeholder:L('ملاحظة (اختياري): مثلًا مكان اللقاء','Note (optional): e.g. meeting point')});
    const fld = (t, c) => el('div',{}, el('label',{class:'l',text:t}), c);
    b.append(el('h3',{text:L('📅 موعد حصة جديد','📅 New lesson')}),
      el('div',{class:'row2'}, fld(L('التاريخ','Date'), dt), fld(L('الوقت','Time'), tm)),
      fld(L('المعلّم','Instructor'), who), other, note,
      el('div',{class:'acts'}, el('button',{class:'btn sign',type:'button',text:L('حفظ الموعد','Save'),onclick:()=>{
        if(!dt.value || !tm.value) return toast(L('اختار التاريخ والوقت','Pick date and time'));
        const d = DATA.find(i => i.id === who.value);
        const name = d ? d.name : (who.value === 'other' ? other.value.trim() : '');
        setLessons(lessons().concat([{ id: Date.now().toString(36), when: dt.value + 'T' + tm.value, iid: d ? d.id : null, who: name, note: note.value.trim(), done: false }]));
        toast(L('انحفظ الموعد ✅','Saved ✅')); close(); bookView();
      }}), closeBtn(close)));
  });
}

/* ---------- تعلّم + الإشارات + الاختبار ---------- */
let LT = 'les', QZ = null;
function learnView(tab){
  if(tab) LT = tab;
  $('lrnSeg').replaceChildren(...[['les',L('📖 الدروس','📖 Lessons')],['skill',L('🎯 مهاراتي','🎯 My skills')],['sig',L('🚸 الإشارات','🚸 Signs')],['quiz',L('📝 الاختبار','📝 Test')]].map(([k,t]) => el('button',{type:'button','aria-pressed':String(LT===k),text:t,onclick:()=>learnView(k)})));
  const v = $('lrnBody'); v.replaceChildren();
  if(LT === 'les'){
    v.append(el('p',{class:'note',text:'ℹ️ '+P2(RL.note)}));
    RL.lessons.forEach((x, i) => {
      const d = el('details',{class:'gl les'}); if(i===0) d.open = true;
      d.append(el('summary',{}, el('span',{class:'les-ic',text:x.ic}), el('b',{text:P2(x.t)})), el('ul',{}, ...P2(x.b).map(t => el('li',{text:t}))));
      v.append(d);
    });
  } else if(LT === 'sig'){
    v.append(el('p',{class:'note',text:L('🔴 الدائرة الحمراء = منع · 🔺 المثلث = تحذير · 🔵 الدائرة الزرقاء = إلزام','🔴 Red circle = prohibition · 🔺 Triangle = warning · 🔵 Blue circle = mandatory')}));
    const g = el('div',{class:'sgrid'});
    RL.signs.forEach(x => { const c = el('button',{type:'button',class:'gl sc',onclick:()=>{ sheet((b,close)=>{ b.append(H('div',{class:'sbig'}, signSVG(x.s, x.n)), el('h3',{class:'center',text:P2(x.t)}), el('p',{class:'center',text:P2(x.d)}), closeBtn(close)); }); }});
      c.innerHTML = signSVG(x.s, x.n); c.append(el('span',{text:P2(x.t)})); g.append(c); });
    v.append(g);
  } else if(LT === 'skill') skillsView(v);
  else quizView();
}
const shuf = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
function quizView(){
  const v = $('lrnBody'); v.replaceChildren();
  const best = LS.get('rk-quiz-best', null), N = Math.min(15, RL.quiz.length);
  if(!QZ){
    v.append(el('div',{class:'gl qstart'},
      H('div',{class:'qbig'}, ic('quiz')),
      el('h3',{text:L('اختبار تجريبي','Practice test')}),
      el('p',{text:L(N+' سؤال عشوائي عن الإشارات وقواعد السياقة الآمنة.',N+' random questions on signs and safe-driving rules.')}),
      best != null ? el('p',{class:'hint',text:L('أفضل نتيجة لك: ','Your best: ')+best+' / '+N}) : null,
      el('button',{class:'btn sign wide',type:'button',text:L('ابدأ الاختبار ▶','Start ▶'),onclick:()=>{ QZ = { qs: shuf(RL.quiz.map((q, qi) => ({ ...q, qi }))).slice(0, N).map(q => ({ ...q, ord: shuf(q.o.map((_, i) => i)) })), i:0, score:0, wrong:[], pick:null }; quizView(); }}),
      LS.get('rk-wrong', []).length ? el('button',{class:'btn line wide',type:'button',text:L('🔁 راجع أخطائي (','🔁 Review my mistakes (')+LS.get('rk-wrong', []).length+')',onclick:()=>{ const w = LS.get('rk-wrong', []); QZ = { review:true, qs: shuf(w.map(qi => ({ ...RL.quiz[qi], qi })).filter(q => q.o)).map(q => ({ ...q, ord: shuf(q.o.map((_, i) => i)) })), i:0, score:0, wrong:[], pick:null }; quizView(); }}) : null,
      el('p',{class:'note',text:'ℹ️ '+P2(RL.note)})));
    return;
  }
  if(QZ.i >= QZ.qs.length){
    const pct = Math.round(QZ.score / QZ.qs.length * 100);
    if(!QZ.review && (best == null || QZ.score > best)) LS.set('rk-quiz-best', QZ.score);
    v.append(el('div',{class:'gl qstart'},
      el('div',{class:'qscore num',text:QZ.score+' / '+QZ.qs.length}),
      el('h3',{text: pct >= 90 ? L('ممتاز! 🏆','Excellent! 🏆') : pct >= 70 ? L('زين جدًا 👏','Very good 👏') : L('تحتاج مراجعة شوي 📖','Needs a bit more review 📖')}),
      el('div',{class:'bar'}, el('i',{style:'width:'+pct+'%'})),
      el('button',{class:'btn sign wide',type:'button',text:L('🔁 اختبار جديد','🔁 New test'),onclick:()=>{ QZ = null; quizView(); }}),
      QZ.wrong.length ? el('h3',{class:'sec',text:L('راجع الأخطاء','Review mistakes')}) : null,
      ...QZ.wrong.map(q => el('div',{class:'qrev'}, el('b',{text:P2(q.q)}), el('p',{text:'✅ '+P2(q.o[q.a])}), el('p',{class:'hint',text:P2(q.w)})))));
    return;
  }
  const q = QZ.qs[QZ.i];
  const box = el('div',{class:'gl qcard'},
    el('div',{class:'qhead'}, el('span',{class:'num',text:(QZ.i+1)+' / '+QZ.qs.length}), el('div',{class:'bar sm'}, el('i',{style:'width:'+Math.round(QZ.i/QZ.qs.length*100)+'%'}))),
    q.sign ? H('div',{class:'qsign'}, signSVG(q.sign, (RL.signs.find(s=>s.s===q.sign)||{}).n)) : null,
    el('h3',{text:P2(q.q)}));
  const opts = el('div',{class:'qopts'});
  q.ord.forEach(oi => {
    const b = el('button',{type:'button',class:'qo',text:P2(q.o[oi]),onclick:()=>{
      if(QZ.pick != null) return; QZ.pick = oi;
      const ok = oi === q.a; if(ok) QZ.score++; else QZ.wrong.push(q);
      const W = LS.get('rk-wrong', []); if(ok){ if(QZ.review) LS.set('rk-wrong', W.filter(x => x !== q.qi)); } else if(!W.includes(q.qi)) LS.set('rk-wrong', W.concat(q.qi));
      opts.querySelectorAll('.qo').forEach((x, k) => { const id = q.ord[k]; if(id === q.a) x.classList.add('right'); else if(id === oi) x.classList.add('wrong'); x.disabled = true; });
      box.append(el('p',{class:'qwhy '+(ok?'ok':'no'),text:(ok?L('✅ صح! ','✅ Correct! '):L('❌ غلط. ','❌ Not quite. '))+P2(q.w)}),
        el('button',{class:'btn sign wide',type:'button',text:QZ.i+1<QZ.qs.length?L('التالي ←','Next →'):L('النتيجة 🏁','Result 🏁'),onclick:()=>{ QZ.i++; QZ.pick=null; quizView(); window.scrollTo({top:0}); }}));
    }});
    opts.append(b);
  });
  box.append(opts); v.append(box);
}

/* ---------- التبويبات ---------- */
let CUR = 'home';
function go(name, sub){
  if(name === 'acct'){ hub(); return; }
  CUR = name;
  document.querySelectorAll('.view').forEach(x => x.hidden = x.id !== 'v-' + name);
  document.querySelectorAll('#tabbar [data-go]').forEach(b => b.setAttribute('aria-current', b.dataset.go === name ? 'page' : 'false'));
  window.scrollTo({ top: 0 });
  if(name === 'find') findView();
  if(name === 'book') bookView();
  if(name === 'learn') learnView(sub);
  if(name === 'home') homeDraw();
}
window.go = go;

function tabbar(){
  const items = [['home','home',L('الرئيسية','Home')],['find','search',L('ابحث','Search')],['book','cal',L('حصصي','Lessons')],['learn','book',L('تعلّم','Learn')],['acct','user',L('حسابي','Account')]];
  $('tabbar').innerHTML = items.map(([k, i, t]) => `<button type="button" data-go="${k}" aria-current="${CUR===k?'page':'false'}">${ic(i)}<span>${t}</span></button>`).join('');
  $('tabbar').onclick = e => { const b = e.target.closest('[data-go]'); if(b) go(b.dataset.go); };
}
function homeStatic(){
  $('heroBtn').onclick = () => go('find');
  $('allBtn').onclick = () => go('find');
  const tiles = [['book',L('تعلّم السياقة','Learn to drive'),()=>go('learn','les')],['quiz',L('اختبار تجريبي','Practice test'),()=>go('learn','quiz')],['sign',L('الإشارات','Road signs'),()=>go('learn','sig')],['cal',L('حصصي','My lessons'),()=>go('book')]];
  $('tiles').replaceChildren(...tiles.map(([i, t, f]) => { const b = el('button',{type:'button',class:'tile',onclick:f}); b.innerHTML = `<span class="tile-i">${ic(i)}</span>`; b.append(el('span',{text:t})); return b; }));
}
window.RKUI = {
  afterDraw(){ homeDraw(); if(CUR === 'find') findView(); },
  lang(){ tabbar(); homeStatic(); if(CUR === 'find') findView(); if(CUR === 'book') bookView(); if(CUR === 'learn') learnView(); homeDraw(); }
};
RKUI.lang();
go(/^#(map|find)$/.test(location.hash) ? 'find' : location.hash === '#learn' ? 'learn' : location.hash === '#book' ? 'book' : 'home');
})();
