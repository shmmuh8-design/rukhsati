// رخصتي — الواجهة الجديدة: التبويبات، الرئيسية، الخريطة، حصصي، تعلّم، الاختبار التجريبي
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

/* ---------- خريطة عُمان (مبسطة) ---------- */
const OMAN = [[56.38,24.98],[56.47,24.74],[56.75,24.36],[57.1,23.98],[57.44,23.85],[57.88,23.71],[58.18,23.68],[58.6,23.62],[58.92,23.26],[59.25,22.82],[59.53,22.57],[59.8,22.52],[59.83,22.4],[59.58,21.85],[59.3,21.4],[58.7,20.75],[58.3,20.45],[57.85,19.95],[57.7,19.66],[57.82,19.05],[57.2,18.9],[56.6,18.55],[55.6,17.9],[55.27,17.45],[55.07,17.05],[54.69,16.99],[54.4,17.04],[54.09,17.02],[53.75,16.88],[53.42,16.74],[53.1,16.66],[52.99,16.65],[52.75,17.1],[52.4,17.9],[52.0,19.0],[53.4,19.5],[55.0,20.0],[55.67,22.0],[55.2,22.7],[55.55,23.4],[55.75,24.0],[55.8,24.25],[56.0,24.6],[56.2,24.8]];
const MASIRAH = [[58.95,20.7],[58.84,20.5],[58.68,20.2],[58.76,20.14],[58.9,20.38],[58.98,20.62]];
const MUSANDAM = [[56.08,26.05],[56.15,26.22],[56.24,26.4],[56.38,26.38],[56.45,26.25],[56.42,26.05],[56.35,25.88],[56.37,25.62],[56.27,25.62],[56.15,25.82]];
const WC = {"مسقط":[58.59,23.6],"مطرح":[58.56,23.63],"بوشر":[58.4,23.56],"السيب":[58.18,23.66],"العامرات":[58.5,23.5],"قريات":[58.91,23.26],
 "صلالة":[54.09,17.03],"طاقة":[54.4,17.05],"مرباط":[54.69,17.0],"رخيوت":[53.42,16.76],"ثمريت":[54.03,17.67],"ضلكوت":[53.25,16.72],"المزيونة":[52.67,17.85],"مقشن":[54.89,19.56],"شليم وجزر الحلانيات":[55.6,17.95],"سدح":[55.07,17.06],
 "خصب":[56.25,26.18],"دبا":[56.27,25.64],"بخا":[56.15,26.14],"مدحاء":[56.32,25.28],
 "البريمي":[55.79,24.25],"محضة":[55.97,24.4],"السنينة":[55.91,23.69],
 "نزوى":[57.53,22.93],"بهلاء":[57.3,22.97],"منح":[57.6,22.79],"الحمراء":[57.29,23.11],"أدم":[57.53,22.38],"إزكي":[57.77,22.93],"سمائل":[57.98,23.3],"بدبد":[58.13,23.41],"الجبل الأخضر":[57.67,23.07],
 "صحار":[56.71,24.34],"شناص":[56.47,24.74],"لوى":[56.57,24.53],"صحم":[56.89,24.17],"الخابورة":[57.1,23.97],"السويق":[57.44,23.84],
 "الرستاق":[57.42,23.39],"العوابي":[57.53,23.3],"نخل":[57.83,23.39],"وادي المعاول":[57.75,23.48],"بركاء":[57.89,23.68],"المصنعة":[57.63,23.77],
 "صور":[59.52,22.56],"الكامل والوافي":[59.2,22.22],"جعلان بني بو حسن":[59.33,22.1],"جعلان بني بو علي":[59.35,21.98],"مصيرة":[58.87,20.67],
 "إبراء":[58.53,22.69],"المضيبي":[58.12,22.57],"بدية":[58.8,22.45],"القابل":[58.7,22.57],"وادي بني خالد":[59.09,22.62],"دماء والطائيين":[58.66,23.06],
 "عبري":[56.51,23.23],"ينقل":[56.54,23.59],"ضنك":[56.26,23.55],
 "هيماء":[56.28,19.96],"محوت":[58.2,20.65],"الدقم":[57.7,19.66],"الجازر":[57.0,18.95]};
const PX = ([lo, la]) => [(lo - 51.7) * 93, (26.7 - la) * 100];
const FULL = [0, 0, 780, 1040];
let VB = FULL.slice(), mapGov = null, anim = 0;
const poly = pts => 'M' + pts.map(p => PX(p).map(v => v.toFixed(1)).join(',')).join('L') + 'Z';
function govOf(w){ return Object.keys(GOV).find(g => GOV[g].includes(w)); }
function countIn(w){ const g = govOf(w), hidden = new Set(LS.get('rk-hide', [])); return DATA.filter(d => !hidden.has(d.id) && (d.areas.includes(w) || d.areas.includes('gov:' + g))).length; }
function govBox(g){
  const pts = GOV[g].map(w => PX(WC[w] || [57, 22]));
  let x0 = Math.min(...pts.map(p => p[0])), x1 = Math.max(...pts.map(p => p[0])), y0 = Math.min(...pts.map(p => p[1])), y1 = Math.max(...pts.map(p => p[1]));
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, w = Math.max(x1 - x0 + 90, 150), h = Math.max(y1 - y0 + 110, w * 1.3);
  return [cx - w / 2, cy - h / 2, w, h];
}
function zoomTo(box){
  const from = VB.slice(), t0 = performance.now(), dur = 420; cancelAnimationFrame(anim);
  const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); VB = from.map((v, i) => v + (box[i] - v) * e); drawMap(); if(k < 1) anim = requestAnimationFrame(step); };
  anim = requestAnimationFrame(step);
}
function drawMap(){
  const svg = $('omMap'); if(!svg) return;
  const r = svg.getBoundingClientRect(), s = Math.max(VB[2] / (r.width || 350), VB[3] / (r.height || 460)) * 0.9;
  svg.setAttribute('viewBox', VB.map(v => v.toFixed(1)).join(' '));
  const pins = [];
  Object.keys(WC).forEach(w => {
    const [x, y] = PX(WC[w]), n = countIn(w), sel = w === S.area;
    if(n){
      pins.push(`<g class="pin${sel?' sel':''}" data-w="${w}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})">${sel?'<circle r="26" class="pulse"/>':''}<path d="M0 0c-9-12-16-19-16-28a16 16 0 0 1 32 0c0 9-7 16-16 28z" class="pp"/><text y="-23" text-anchor="middle">${n}</text></g>`);
    } else {
      pins.push(`<g class="dot${sel?' sel':''}" data-w="${w}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})">${sel?'<circle r="18" class="pulse"/>':''}<circle r="${sel?7:4.5}"/><circle r="14" fill="transparent"/></g>`);
    }
    if(sel) pins.push(`<g transform="translate(${x.toFixed(1)} ${(y + 22 * s).toFixed(1)}) scale(${s.toFixed(3)})"><text class="lbl" text-anchor="middle">${gn(w)}</text></g>`);
  });
  $('omPins').innerHTML = pins.join('');
}
function mapView(){
  const v = $('v-map');
  if(!v.dataset.ok){
    v.dataset.ok = 1;
    $('mapBox').innerHTML = `<svg id="omMap" viewBox="${FULL.join(' ')}" preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id="land" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2418"/><stop offset="1" stop-color="#16130d"/></linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0v40" fill="none" stroke="rgba(242,193,78,.06)"/></pattern></defs>
      <rect x="-400" y="-400" width="1600" height="1900" fill="url(#grid)"/>
      <g filter="url(#glow)"><path d="${poly(OMAN)}" fill="url(#land)" stroke="#f2c14e" stroke-width="2.4" stroke-linejoin="round"/><path d="${poly(MUSANDAM)}" fill="url(#land)" stroke="#f2c14e" stroke-width="2"/><path d="${poly(MASIRAH)}" fill="url(#land)" stroke="#f2c14e" stroke-width="1.6"/></g>
      <g id="omPins"></g></svg>`;
    $('omMap').addEventListener('click', e => { const g = e.target.closest('[data-w]'); if(!g) return; const w = g.dataset.w; S.gov = govOf(w); S.area = w; save(); fill(); draw(); mapInfo(); });
  }
  $('govChips').replaceChildren(el('button',{type:'button','aria-pressed':String(!mapGov),text:L('كل عُمان','All Oman'),onclick:()=>{ mapGov = null; zoomTo(FULL); mapView(); }}),
    ...Object.keys(GOV).map(g => el('button',{type:'button','aria-pressed':String(mapGov===g),text:gn(g),onclick:()=>{ mapGov = g; S.gov = g; if(!GOV[g].includes(S.area)) S.area = GOV[g][0]; save(); fill(); draw(); zoomTo(govBox(g)); mapView(); }})));
  drawMap(); mapInfo();
}
function mapInfo(){
  const n = countIn(S.area), box = $('mapInfo'); if(!box) return;
  box.replaceChildren(el('div',{}, el('b',{text:'📍 '+gn(S.area)+' · '+gn(S.gov)}), el('span',{text:n ? (EN() ? n+' instructor'+(n>1?'s':'') : n+(n>2?' معلّمين':n===2?' معلّمَين':' معلّم')) : L('ما فيه معلّمين للحين','No instructors yet')})),
    el('button',{class:'btn sign sm',type:'button',text:L('عرض القائمة ↓','Show list ↓'),onclick:()=>$('resT').scrollIntoView({behavior:'smooth',block:'start'})}));
}

/* ---------- الرئيسية ---------- */
function homeDraw(){
  if(!$('v-home')) return;
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
  list.forEach(d => {
    const ini = d.name.replace(/^(أم|أبو|Umm|Abu)\s+/,'').trim()[0];
    const area = d.areas[0] ? (d.areas[0].startsWith('gov:') ? L('كل ','All ') + gn(d.areas[0].slice(4)) : gn(d.areas[0])) : '';
    box.append(el('article',{class:'fc'+(d.sex==='f'?' f':'')},
      el('div',{class:'fc-top'}, el('div',{class:'fc-av',text:ini}), el('span',{class:'tag '+(d.available?'ok':'busy'),text:d.available?L('يستقبل','Available'):L('مشغول','Busy')})),
      el('h4',{text:d.name}),
      H('p',{class:'fc-l'}, ic('pin') + '<span></span>'),
      H('p',{class:'fc-l'}, ic('gear') + '<span></span>'),
      el('p',{class:'fc-p'}, el('b',{class:'num',text:omr(d.price)}), el('span',{text:' '+L('ر.ع / حصة','OMR / lesson')})),
      el('button',{class:'btn sign',type:'button',text:L('💬 تواصل الآن','💬 Contact'),onclick:()=>request(d)})));
    const ls = box.lastChild.querySelectorAll('.fc-l span'); ls[0].textContent = area; ls[1].textContent = gearTxt(d.gear);
  });
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
  $('lrnSeg').replaceChildren(...[['les',L('📖 الدروس','📖 Lessons')],['sig',L('🚸 الإشارات','🚸 Signs')],['quiz',L('📝 اختبار تجريبي','📝 Practice test')]].map(([k,t]) => el('button',{type:'button','aria-pressed':String(LT===k),text:t,onclick:()=>learnView(k)})));
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
  } else quizView();
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
      el('button',{class:'btn sign wide',type:'button',text:L('ابدأ الاختبار ▶','Start ▶'),onclick:()=>{ QZ = { qs: shuf(RL.quiz).slice(0, N).map(q => ({ ...q, ord: shuf(q.o.map((_, i) => i)) })), i:0, score:0, wrong:[], pick:null }; quizView(); }}),
      el('p',{class:'note',text:'ℹ️ '+P2(RL.note)})));
    return;
  }
  if(QZ.i >= QZ.qs.length){
    const pct = Math.round(QZ.score / QZ.qs.length * 100);
    if(best == null || QZ.score > best) LS.set('rk-quiz-best', QZ.score);
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
  if(name === 'map') mapView();
  if(name === 'book') bookView();
  if(name === 'learn') learnView(sub);
  if(name === 'home') homeDraw();
}
window.go = go;

function tabbar(){
  const items = [['home','home',L('الرئيسية','Home')],['map','pin',L('الخريطة','Map')],['book','cal',L('حصصي','Lessons')],['learn','book',L('تعلّم','Learn')],['acct','user',L('حسابي','Account')]];
  $('tabbar').innerHTML = items.map(([k, i, t]) => `<button type="button" data-go="${k}" aria-current="${CUR===k?'page':'false'}">${ic(i)}<span>${t}</span></button>`).join('');
  $('tabbar').onclick = e => { const b = e.target.closest('[data-go]'); if(b) go(b.dataset.go); };
}
function homeStatic(){
  $('heroBtn').onclick = () => go('map');
  $('mapCta').onclick = () => go('map');
  $('allBtn').onclick = () => go('map');
  const tiles = [['book',L('تعلّم السياقة','Learn to drive'),()=>go('learn','les')],['quiz',L('اختبار تجريبي','Practice test'),()=>go('learn','quiz')],['sign',L('الإشارات','Road signs'),()=>go('learn','sig')],['cal',L('حصصي','My lessons'),()=>go('book')]];
  $('tiles').replaceChildren(...tiles.map(([i, t, f]) => { const b = el('button',{type:'button',class:'tile',onclick:f}); b.innerHTML = `<span class="tile-i">${ic(i)}</span>`; b.append(el('span',{text:t})); return b; }));
}
window.RKUI = {
  afterDraw(){ homeDraw(); if(CUR === 'map'){ drawMap(); mapInfo(); } },
  lang(){ tabbar(); homeStatic(); if(CUR === 'map') mapView(); if(CUR === 'book') bookView(); if(CUR === 'learn') learnView(); homeDraw(); }
};
RKUI.lang();
go(location.hash === '#map' ? 'map' : location.hash === '#learn' ? 'learn' : location.hash === '#book' ? 'book' : 'home');
})();
