// ================= timeline: shots built from the narration =================
const P = (fn, o = {}, c = [CX, CY], z = 1) => ({ fn, o, c, z });
const LIB = {
  brain: P(brain3d), brainMis: P(brain3d, { mismatch: 1 }), neurons: P(neurons, {}, [540, 960], 1.05), eye: P(eye, { noblink: 1, film: .6 }, [540, 960], 1.3),
  eyeBlink: P(eye, { bl: s => Math.max(0, Math.sin(clamp((s - .6) / .7) * Math.PI)) }, [540, 960], 1.3), optics: P(optics, {}, [640, 960], 1.0),
  room: P(room), roomEcho: P(room, { echo: 1 }), roomDeja: P(room, { echo: 1, text: 'DÉJÀ VU' }), waves: P(waves), wavesSync: P(waves, { sync: 1 }),
  pocket: P(pocket, { buzz: 1 }), pocketPh: P(pocket, { buzz: 1, phantom: 1, text: 'PHANTOM VIBRATION SYNDROME' }), phone: P(phoneScreen, { cross: 1 }), phoneMsg: P(phoneScreen, { msg: 'Nothing. Again.' }),
  skin: P(skinTouch, { fire: 1 }), snakes: P(snakes, { spin: .04 }), snakesStill: P(snakes, { spin: 0 }), checker: P(checker), checkerRev: P(checker, { reveal: 1 }), muller: P(mullerLyer),
  clockFast: P(clockWarp, { text: 'AN HOUR… IN MINUTES' }), clockSlow: P(clockWarp, { slow: 1 }), shards: P(shards), shardsFocus: P(shards, { focus: 1, text: 'EVERY DETAIL RECORDED' }),
  memories: P(memories), memSwap: P(memories, { swap: 1 }), twoMinds: P(twoMinds), puzzle: P(puzzle), puzzleTxt: P(puzzle, { text: 'YOUR BRAIN BUILDS IT' }),
  pill: P(pill), pillTxt: P(pill, { text: 'PLACEBO' }), pillNo: P(pill, { text: 'NO ACTIVE INGREDIENT' }), synapse: P(synapse), synEndo: P(synapse, { endo: 1, text: 'NATURAL PAIN RELIEF' }),
  scratch: P(arm, { scratch: 1 }), bump: P(arm, { bump: 1 }), mosquito: P(arm, { mosquito: 1, text: 'NO BITE NEEDED' }), bonds: P(bonds, {}, [540, 820], 1.25),
  ear: P(ear), cochlea: P(ear, { cochlea: 1 }), fan: P(fan), fanVoice: P(fan, { voice: '"…HEY?"' }), court: P(court), courtFocus: P(court, { focus: 1 }), gorilla: P(court, { focus: 1, gorilla: 1 }), gorillaSeen: P(court, { gorilla: 1, text: 'DID YOU SEE IT?' }),
  dream: P(dream), dreamFade: P(dream, { fade: 1 }), heart: P(heart, {}, [540, 960], .85), axon: P(axonRace, {}, [540, 960], 1.0),
  finQ: P(finale, { mode: 'q' }), finSub: P(finale, { mode: 'sub' }), finCom: P(finale, { mode: 'com' }),
};
const RULES = {
  0: [[/trust|see, hear/, 'eye'], [/most powerful|organs/, 'brain'], [/millions of signals/, 'neurons'], [/perception of reality|understand the world/, 'puzzle'], [/record reality|interprets/, 'brain'], [/misleading/, 'snakes'], [/remembering things|vibrate/, 'pocket'], [/extraordinary/, 'snakes'], [/fascinating illusions|realizing/, 'neurons'], [/number 10|own memories/, 'memSwap']],
  1: [[/entered a room|ordinary/, 'room'], [/same thing before/, 'roomEcho'], [/called d/, 'roomDeja'], [/first time|familiar/, 'roomEcho'], [/mismatch|familiarity and memory/, 'waves'], [/simple terms|old memory/, 'brainMis'], [/recognizes|explain why/, 'wavesSync']],
  2: [[/reaching into|vibrating/, 'pocket'], [/check it|no messages|nothing/, 'phone'], [/known as/, 'pocketPh'], [/interprets ordinary|muscle|clothing/, 'skin'], [/expect messages|attention/, 'brain'], [/predict what|next/, 'neurons'], [/prediction wrong|gets the/, 'phoneMsg']],
  3: [[/movement where/, 'snakes'], [/identical colors/, 'checker'], [/why does this happen|just about your eyes/, 'eye'], [/collect light/, 'optics'], [/contrast|previous experiences/, 'checkerRev'], [/same color|surroundings/, 'checkerRev'], [/doesn't simply show|interpretation of what/, 'muller']],
  4: [[/frightening moment|actually did/, 'shards'], [/hour with friends|few minutes/, 'clockFast'], [/internal clock/, 'clockSlow'], [/attention, emotions|processing/, 'brain'], [/frightening or|closer attention/, 'shardsFocus'], [/remember the experience|seem longer/, 'memories'], [/slowed down/, 'clockSlow'], [/experience of time/, 'clockFast']],
  5: [[/truly surprising|confidently/, 'memories'], [/video recording|recording/, 'memories'], [/reconstructs/, 'puzzle'], [/mistakes/, 'memSwap'], [/describe an event|over time/, 'twoMinds'], [/two people/, 'twoMinds'], [/confidence/, 'memSwap']],
  6: [[/believing|feel better/, 'pill'], [/known as the placebo|sometimes, yes/, 'pillTxt'], [/medical research|active ingredient/, 'pillNo'], [/improvements|symptoms/, 'brain'], [/why\? because|pain, discomfort|influence how/, 'synapse'], [/pain-regulating|role in this/, 'synEndo'], [/positive thinking|every illness|however/, 'pill'], [/strongly|experience of the body/, 'brain']],
  7: [[/watched someone|scratch their arm/, 'scratch'], [/strange|happens/, 'scratch'], [/responsive to what other/, 'bonds'], [/activate attention|associated with itching/, 'brain'], [/awareness of sensations|own skin/, 'skin'], [/talking about itching/, 'bump'], [/insect bite/, 'mosquito'], [/simply seeing|thinking about/, 'scratch']],
  8: [[/called your name|nobody did/, 'ear'], [/passively|receive sounds/, 'cochlea'], [/context and expectations/, 'brain'], [/tired, distracted|familiar voice|interpreted as/, 'fanVoice'], [/pareidolia|paridolia|interesting example/, 'fan'], [/random noise|in a fan|background/, 'fanVoice'], [/searching for patterns|none are/, 'neurons']],
  9: [[/looking directly|without actually/, 'eye'], [/impossible/, 'court'], [/psychological phenomenon|called inattentional/, 'courtFocus'], [/attention is focused|field of vision|unexpected/, 'courtFocus'], [/basketball/, 'courtFocus'], [/gorilla/, 'gorilla'], [/eyes were open|somewhere else/, 'gorillaSeen'], [/reveals|consciously/, 'eye']],
  10: [[/woken up|dreamed/, 'dream'], [/realistic/, 'dream'], [/during sleep|imagination/, 'dream'], [/wake up|organize|distinguish/, 'eyeBlink'], [/vivid|wasn't real/, 'dreamFade'], [/perfect recordings|perception/, 'memories'], [/building, interpreting|reconstructing/, 'puzzleTxt']],
  11: [[/what have we learned/, 'brain'], [/feel familiar/, 'roomEcho'], [/sensations/, 'pocket'], [/perception of time/, 'clockSlow'], [/remember the past/, 'memSwap'], [/broken/, 'brain'], [/complex system|navigate/, 'neurons'], [/doesn't simply show/, 'puzzle'], [/builds the version/, 'puzzleTxt'], [/fascinating question|how much|interpreted/, 'finQ'], [/subscribe|enjoyed/, 'finSub'], [/comments|experienced yourself/, 'finCom']],
};
const POOL = { 0: ['brain', 'neurons', 'eye', 'axon'], 1: ['room', 'roomEcho', 'brainMis'], 2: ['pocket', 'phone', 'skin'], 3: ['snakes', 'checker', 'optics'], 4: ['clockSlow', 'shards', 'heart'], 5: ['memories', 'puzzle', 'twoMinds'], 6: ['pill', 'synapse', 'brain'], 7: ['scratch', 'bonds', 'skin'], 8: ['ear', 'fan', 'cochlea'], 9: ['courtFocus', 'eye'], 10: ['dream', 'memories'], 11: ['brain', 'puzzle', 'neurons'] };
const CAMS = [[0, 0, 1, 1.12, 0, .015], [60, -20, 1.14, 1.0, .01, -.01], [-90, 10, 1.05, 1.15, -.012, .008], [80, 30, 1.1, 1.02, 0, -.015], [-40, -30, 1.0, 1.1, .015, 0], [0, 40, 1.16, 1.04, -.01, .012]];
const SHOTS = []; let rot = 0;
(function build() {
  const add = (t, t1, key, extra) => { const L = LIB[key], cm = CAMS[SHOTS.length % CAMS.length]; SHOTS.push({ t, t1, fn: L.fn, o: Object.assign({}, L.o, extra || {}), cam: [L.c[0] + cm[0] / L.z, L.c[1] + cm[1] / L.z, L.z * cm[2], L.c[0] - cm[0] / L.z, L.c[1] - cm[1] / L.z, L.z * cm[3], cm[4], cm[5]], key }); };
  SHOTS.push({ t: 0, t1: CHAP[0].t0, fn: hook, o: {}, cam: [CX, CY, 1.25, CX, CY, 1.0, -.02, .01], hook: 1 });
  CHAP.forEach((c, ci) => {
    SHOTS.push({ t: c.t0, t1: c.h1, fn: chapterCard, o: { c }, cam: [CX, CY, 1.12, CX, CY, 1.0, .01, -.01], card: 1, ch: c });
    const end = ci + 1 < CHAP.length ? CHAP[ci + 1].t0 : window.DUR; let cuts = SEGS.map(s => s[0]).filter(t => t > c.h1 + 1.2 && t < end - 1.2); cuts = [c.h1].concat(cuts, [end]);
    const fine = []; for (let i = 0; i < cuts.length - 1; i++) { const a = cuts[i], b = cuts[i + 1], n = Math.max(1, Math.round((b - a) / 4.0)); for (let k = 0; k < n; k++) fine.push([a + (b - a) * k / n, a + (b - a) * (k + 1) / n]); }
    let last = ''; fine.forEach(([a, b], k) => { const mid = (a + b) / 2, sg = SEGS.find(s => s[0] <= mid + .3 && s[1] >= mid - .3) || SEGS.find(s => s[0] >= a) || ['', '', '']; const text = (sg[2] || '').toLowerCase(); let key = null;
      for (const [re, kk] of RULES[c.n] || []) if (re.test(text)) { key = kk; break; } if (!key || (key === last && k % 2)) { const pool = POOL[c.n]; key = pool[rot++ % pool.length]; if (key === last) key = pool[rot++ % pool.length]; }
      if (c.n === 11 && end - a < 4.2) key = 'finCom'; add(a, b, key); last = key; });
  });
  for (let i = 0; i < SHOTS.length; i++) SHOTS[i].t1 = i + 1 < SHOTS.length ? SHOTS[i + 1].t : window.DUR;
})();
function chapAt(t) { let c = null; for (const x of CHAP) if (t >= x.t0) c = x; return c; }
function shotAt(t) { let lo = 0, hi = SHOTS.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (SHOTS[m].t <= t) lo = m; else hi = m - 1; } return lo; }
function drawShot(sg, t, punch) {
  const d = sg.t1 - sg.t, s = t - sg.t, u = clamp(s / d, 0, 1.05), k = eio(clamp(s / d)), c = sg.cam;
  const z = lerp(c[2], c[5], k) * (1 + .16 * punch), x = lerp(c[0], c[3], k) + Math.sin(t * .9) * 3 / z + Math.sin(t * 2.3) * 1.5 / z, y = lerp(c[1], c[4], k) + Math.cos(t * .7) * 3 / z, r = lerp(c[6], c[7], k);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(r); ctx.scale(z, z); ctx.translate(-x, -y); sg.fn(u, s, sg.o); ctx.restore();
}
// ---------------- overlays ----------------
function txt(str, x, y, size, fill, stroke = 'rgba(0,0,0,.8)', sw = 12, font = '900', fam = 'Montserrat') { ctx.font = `${font} ${size}px ${fam}`; ctx.lineJoin = 'round'; if (sw > 0) { ctx.lineWidth = sw; ctx.strokeStyle = stroke; ctx.strokeText(str, x, y); } ctx.fillStyle = fill; ctx.fillText(str, x, y); }
const CHUNKS = (() => { const out = []; let cur = []; WORDS.forEach(w => { cur.push(w); if (/[.,?!:]$/.test(w[0]) || cur.length >= 7) { out.push(cur); cur = []; } }); if (cur.length) out.push(cur); return out; })();
function subs(t) {
  const ch = CHUNKS.find(c => t >= c[0][1] - .05 && t < c[c.length - 1][2] + .3); if (!ch) return;
  const ws = ch.map(w => w[0]), fs0 = 50; ctx.font = `800 ${fs0}px Montserrat`; const full = ws.join(' '), fs = Math.min(fs0, fs0 * 1500 / ctx.measureText(full).width); ctx.font = `800 ${fs}px Montserrat`;
  const sp = ctx.measureText(' ').width, wd = ws.map(w => ctx.measureText(w).width), tot = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1); let x = (W - tot) / 2; const y = 1000;
  ctx.fillStyle = 'rgba(0,0,0,.42)'; ctx.beginPath(); ctx.roundRect(x - 26, y - fs - 10, tot + 52, fs + 34, 16); ctx.fill(); ctx.textAlign = 'left';
  ws.forEach((w, i) => { const on = t >= ch[i][1] - .02 && t < ch[i][2] + .05; txt(w, x, y, fs, on ? '#ffd23f' : '#ffffff', 'rgba(0,0,0,.7)', 6, '800'); x += wd[i] + sp; });
}
function chapterTag(t, sg) { const c = chapAt(t); if (!c || sg.card || c.n === 0 && t < c.h1) return; const s = t - c.h1, k = eo(clamp(s / .5)); const lab = c.n >= 1 && c.n <= 10 ? String(c.n).padStart(2, '0') + '  ' + c.title : c.title; ctx.save(); ctx.globalAlpha = .92 * k; ctx.translate(-30 * (1 - k), 0); ctx.font = '900 30px Montserrat'; const w = ctx.measureText(lab).width + 60; ctx.fillStyle = 'rgba(8,4,8,.6)'; ctx.beginPath(); ctx.roundRect(48, 44, w, 60, 12); ctx.fill(); ctx.fillStyle = '#e0303a'; ctx.fillRect(48, 44, 8, 60); ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.fillText(lab, 78, 85); ctx.restore(); }
function hookText(t) {
  if (t < 2.6) { const k = eo(clamp((t - .05) / .25)), p = 1 + .6 * (1 - k); ctx.save(); ctx.translate(W / 2, 470); ctx.rotate(-.035); ctx.scale(p, p); ctx.globalAlpha = k; txt('YOUR BRAIN IS', 0, -40, 120, '#fff', '#000', 18, '400', 'Anton'); txt('LYING TO YOU', 0, 110, 170, '#ffd23f', '#8c0e18', 24, '400', 'Anton'); ctx.restore(); }
  else if (t < CHAP[0].t0) { const k = eo(clamp((t - 2.6) / .35)); ctx.save(); ctx.globalAlpha = k; ctx.translate(W / 2, 430); ctx.scale(1.1 - .1 * k, 1.1 - .1 * k); txt('BRAIN TRICKS', 0, 0, 180, '#fff', '#000', 22, '400', 'Anton'); txt('10 MIND-BENDING ILLUSIONS', 0, 110, 70, '#ffd23f', '#000', 12, '400', 'Anton'); ctx.restore(); }
}
// ---------------- cinematic post ----------------
const SM = document.createElement('canvas'); SM.width = 480; SM.height = 270; const smx = SM.getContext('2d');
const NZ = document.createElement('canvas'); NZ.width = NZ.height = 256; (() => { const g = NZ.getContext('2d'), im = g.createImageData(256, 256), R = RN(99); for (let i = 0; i < im.data.length; i += 4) { const v = R() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); })();
function post(t) {
  smx.filter = 'blur(5px)'; smx.drawImage(cv, 0, 0, 480, 270); smx.filter = 'none'; ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .32; ctx.drawImage(SM, 0, 0, W, H); ctx.restore();
  const v = ctx.createRadialGradient(W / 2, H / 2, 380, W / 2, H / 2, 1150); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(6,2,8,.62)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = .045; ctx.globalCompositeOperation = 'overlay'; const ox = Math.floor((t * 977) % 256), oy = Math.floor((t * 613) % 256); for (let x = -ox; x < W; x += 256) for (let y = -oy; y < H; y += 256) ctx.drawImage(NZ, x, y); ctx.restore();
}
window.draw = function (t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const i = shotAt(t), sg = SHOTS[i], k = clamp((t - sg.t) / .4);
  if (i > 0 && k < 1) { drawShot(SHOTS[i - 1], t, 0); ctx.globalAlpha = eio(k); }
  drawShot(sg, t, i > 0 ? Math.pow(1 - k, 2) : 0); ctx.globalAlpha = 1;
  if (sg.card) { const f = clamp(1 - (t - sg.t) / .25); if (f > 0) { ctx.fillStyle = `rgba(255,245,235,${f * .85})`; ctx.fillRect(0, 0, W, H); } }
  post(t); if (sg.hook) hookText(t); chapterTag(t, sg); if (!sg.card && !sg.hook) subs(t);
  if (t > window.DUR - .5) { ctx.fillStyle = `rgba(0,0,0,${clamp((t - (window.DUR - .5)) / .5)})`; ctx.fillRect(0, 0, W, H); }
};
draw(0);
