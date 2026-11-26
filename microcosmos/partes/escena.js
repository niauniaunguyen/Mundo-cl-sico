/* =====================================================================
   ESCENA 3D
   ===================================================================== */
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050c14, .026);
const camera = new THREE.PerspectiveCamera(48, 1, .1, 220);
const V = (x=0, y=0, z=0) => new THREE.Vector3(x, y, z);
const UP = V(0,1,0);

const hemi = new THREE.HemisphereLight(0x9fd0ff, 0x1a0820, .55); scene.add(hemi);
const key = new THREE.DirectionalLight(0xfff4e8, .62); key.position.set(-4,6,7); scene.add(key);
const back = new THREE.DirectionalLight(0x6c95ff, .9); back.position.set(2,3,-8); scene.add(back);
const pLight = new THREE.PointLight(0x5fd8ff, 1.2, 12); scene.add(pLight);
const eLight = new THREE.PointLight(0xff4f7b, 1.1, 12); scene.add(eLight);

const P_POS = V(-2.3, -.1, .9);
const E_POS = V(2.3, .25, -.5);   // posición del enemigo al que apuntas (cambia con el objetivo)
const E_BASE = V(2.3, .25, -.5);  // centro de la zona de los enemigos
let PORTRAIT = false;

// Generador pseudoaleatorio con semilla: cada organismo se construye siempre igual
let SEED = 1;
const sr = () => (SEED = SEED * 16807 % 2147483647) / 2147483647;
const srn = (a, b) => a + sr()*(b - a);

// ---- Texturas procedurales ----
function ctex(size, draw, opts={}){
  const c = document.createElement('canvas'); c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  if (opts.wrap !== false){ t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  if (opts.color) t.encoding = THREE.sRGBEncoding;
  return t;
}
const GLOW = ctex(64, g => { const r = g.createRadialGradient(32,32,0,32,32,32);
  r.addColorStop(0,'rgba(255,255,255,1)'); r.addColorStop(.35,'rgba(255,255,255,.5)'); r.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0,0,64,64); }, {wrap:false});
const RING = ctex(128, g => { const r = g.createRadialGradient(64,64,36,64,64,62);
  r.addColorStop(0,'rgba(255,255,255,0)'); r.addColorStop(.75,'rgba(255,255,255,.9)'); r.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0,0,128,128); }, {wrap:false});
// rugosidad de membrana (relieve)
const BUMP = ctex(256, (g, s) => { g.fillStyle = '#808080'; g.fillRect(0,0,s,s); SEED = 11;
  for (let i=0;i<1400;i++){ const x = sr()*s, y = sr()*s, r = 1 + sr()*7, v = sr() < .5 ? 255 : 0;
    const gr = g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,`rgba(${v},${v},${v},.32)`); gr.addColorStop(1,`rgba(${v},${v},${v},0)`);
    g.fillStyle = gr; g.fillRect(x-r,y-r,2*r,2*r); } });
// cromatina: eucromatina clara con grumos de heterocromatina
const CHROM = ctex(256, (g, s) => { g.fillStyle = '#6a7fe0'; g.fillRect(0,0,s,s); SEED = 23;
  for (let i=0;i<520;i++){ g.fillStyle = `rgba(${30+sr()*40|0},${20+sr()*30|0},${90+sr()*60|0},.38)`; g.beginPath(); g.arc(sr()*s, sr()*s, 2+sr()*10, 0, 7); g.fill(); }
  for (let i=0;i<220;i++){ g.fillStyle = 'rgba(210,220,255,.25)'; g.beginPath(); g.arc(sr()*s, sr()*s, 1+sr()*2, 0, 7); g.fill(); } }, {color:true});
// tilacoides apilados (grana)
const STRIPES = ctex(64, (g, s) => { for (let y=0;y<s;y+=8){ g.fillStyle = '#39e874'; g.fillRect(0,y,s,5); g.fillStyle = '#0a3a1a'; g.fillRect(0,y+5,s,3); } }, {color:true});
// crestas mitocondriales
const CRISTAE = ctex(128, (g, s) => { g.fillStyle = '#ff7a4a'; g.fillRect(0,0,s,s); g.strokeStyle = '#8a2a10'; g.lineWidth = 5;
  for (let x=8;x<s;x+=16){ g.beginPath(); g.moveTo(x,0); for (let y=0;y<=s;y+=16) g.lineTo(x + (y/16 % 2 ? 6 : -6), y); g.stroke(); } }, {color:true});
const SHAFT = ctex(64, (g, s) => { const gr = g.createLinearGradient(0,0,s,0);
  gr.addColorStop(0,'rgba(255,255,255,0)'); gr.addColorStop(.5,'rgba(255,255,255,1)'); gr.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0,0,s,s); }, {wrap:false});

// ---- Material de membrana: estándar + borde de Fresnel (las membranas brillan en el contorno, como en fluorescencia) ----
function mem(color, o={}){
  const transp = o.op != null;
  const m = new THREE.MeshStandardMaterial({
    color, roughness:o.rough ?? .5, metalness:0, map:o.map || null,
    transparent:transp, opacity:o.op ?? 1, depthWrite:!transp, side:o.side ?? THREE.FrontSide,
    emissive:new THREE.Color(o.emi ?? color).multiplyScalar(o.emiK ?? .12),
    bumpMap:o.bump === false ? null : BUMP, bumpScale:o.bumpScale ?? .012, flatShading:!!o.flat });
  const U = {rimC:{value:new THREE.Color(o.rim ?? color)}, rimK:{value:o.rimK ?? 1}, rimP:{value:o.rimP ?? 2.6}, rimA:{value:o.rimA ?? (transp ? .75 : 0)}};
  m.userData.U = U;
  m.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.fragmentShader = 'uniform vec3 rimC;\nuniform float rimK;\nuniform float rimP;\nuniform float rimA;\n' +
      sh.fragmentShader.replace('#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\n' +
        'float fr = pow(1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0), rimP);\n' +
        'totalEmissiveRadiance += rimC * fr * rimK;\n' +
        'diffuseColor.a = mix(diffuseColor.a, 1.0, fr * rimA);');
  };
  return m;
}

// ---- Geometría ----
const mesh = (geo, mat, ro) => { const m = new THREE.Mesh(geo, mat); if (ro != null) m.renderOrder = ro; return m; };
const sphG = (r, w=24, h=16) => new THREE.SphereGeometry(r, w, h);
// cápsula (bacilo) por revolución
function capG(len, r, seg=20, n=8){
  const pts = [];
  for (let i=0;i<=n;i++){ const a = -Math.PI/2 + i/n*Math.PI/2; pts.push(new THREE.Vector2(Math.max(1e-4, Math.cos(a)*r), -len/2 + Math.sin(a)*r)); }
  for (let i=0;i<=n;i++){ const a = i/n*Math.PI/2; pts.push(new THREE.Vector2(Math.max(1e-4, Math.cos(a)*r), len/2 + Math.sin(a)*r)); }
  return new THREE.LatheGeometry(pts, seg);
}
// caja redondeada (pared vegetal) con normales suaves
function rboxG(w, h, d, r, s=8){
  const g = new THREE.BoxGeometry(w, h, d, s, s, s), p = g.attributes.position, nrm = g.attributes.normal, v = V(), inn = V(), n = V();
  const hx = w/2 - r, hy = h/2 - r, hz = d/2 - r;
  for (let i=0;i<p.count;i++){
    v.fromBufferAttribute(p, i); inn.set(clamp(v.x,-hx,hx), clamp(v.y,-hy,hy), clamp(v.z,-hz,hz));
    n.copy(v).sub(inn).normalize(); v.copy(inn).addScaledVector(n, r);
    p.setXYZ(i, v.x, v.y, v.z); nrm.setXYZ(i, n.x, n.y, n.z);
  }
  return g;
}
// hélice (flagelos, ARN, hélices α)
function helixG(len, amp, turns, r, ramp=true, seg=90){
  const pts = [];
  for (let i=0;i<=60;i++){ const s = i/60, th = s*turns*Math.PI*2, A = amp*(ramp ? Math.min(1, s*3) : 1); pts.push(V(Math.cos(th)*A, s*len, Math.sin(th)*A)); }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, 6);
}
function randIn(a, b, c){ let d; do { d = V(srn(-1,1), srn(-1,1), srn(-1,1)); } while (d.lengthSq() > 1); return V(d.x*a, d.y*b, d.z*c); }
// ADN enmarañado (nucleoide)
function tangleG(n, a, b, c, r){ const pts = []; for (let i=0;i<n;i++) pts.push(randIn(a, b, c)); return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n*6, r, 5); }
function fibDirs(n){ const out = [], ga = Math.PI*(3 - Math.sqrt(5)); for (let i=0;i<n;i++){ const y = 1 - 2*(i+.5)/n, r = Math.sqrt(1 - y*y); out.push(V(Math.cos(ga*i)*r, y, Math.sin(ga*i)*r)); } return out; }
// puntos sobre la superficie de una cápsula
function capPts(n, L, R){ const out = [];
  for (let i=0;i<n;i++){
    if (sr() < .72){ const a = srn(0, Math.PI*2), y = srn(-L/2, L/2); out.push({p:V(Math.cos(a)*R, y, Math.sin(a)*R), n:V(Math.cos(a), 0, Math.sin(a))}); }
    else { const d = V(srn(-1,1), srn(-1,1), srn(-1,1)).normalize(); out.push({p:V(d.x*R, d.y*R + Math.sign(d.y)*L/2, d.z*R), n:d}); }
  } return out; }
const _M = new THREE.Matrix4(), _Q = new THREE.Quaternion(), _S = V();
// objetos repetidos (espículas, cilios, ribosomas...) con InstancedMesh
function inst(geo, mat, list, ro){
  const im = new THREE.InstancedMesh(geo, mat, list.length);
  list.forEach((it, i) => { _Q.setFromUnitVectors(UP, it.n || UP); const s = it.s ?? 1; _S.set(s, s, s); _M.compose(it.p, _Q, _S); im.setMatrixAt(i, _M); });
  im.instanceMatrix.needsUpdate = true; if (ro != null) im.renderOrder = ro; return im;
}
// esfera deformable: ondulación de membrana + lóbulos (pseudópodos)
function blob(r, mat, o={}){
  const geo = new THREE.SphereGeometry(r, o.w || 48, o.h || 32);
  if (o.shape){ const p = geo.attributes.position, v = V(); for (let i=0;i<p.count;i++){ v.fromBufferAttribute(p, i); o.shape(v, r); p.setXYZ(i, v.x, v.y, v.z); } geo.computeVertexNormals(); }
  const base = Float32Array.from(geo.attributes.position.array);
  const m = mesh(geo, mat, o.ro);
  const lobes = o.lobes || [];
  m.userData.wob = (t, amp=.08, f=2.2, sp=1, ruff=0) => {
    const a = geo.attributes.position.array;
    for (let i=0;i<a.length;i+=3){
      const x = base[i]/r, y = base[i+1]/r, z = base[i+2]/r;
      let s = 1 + amp*(Math.sin(x*f + t*sp)*Math.sin(y*f*1.3 + t*1.1*sp)*Math.sin(z*f*.9 + t*.7*sp) + .5*Math.sin((x+z)*f*1.7 - t*1.3*sp));
      if (ruff) s += ruff*Math.sin(x*12 + t*2.1)*Math.sin(y*14 - t*1.7)*Math.sin(z*13 + t*1.3);
      if (lobes.length){ const len = Math.max(.001, Math.sqrt(x*x + y*y + z*z));
        for (let k=0;k<lobes.length;k++){ const L = lobes[k]; if (!L.a) continue; const d = (x*L.d.x + y*L.d.y + z*L.d.z)/len; if (d > 0) s += L.a*Math.pow(d, L.k || 6); } }
      a[i] = base[i]*s; a[i+1] = base[i+1]*s; a[i+2] = base[i+2]*s;
    }
    geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
  };
  return m;
}
// núcleo arriñonado (macrófagos, paramecio)
const bean = (v, r) => { v.x *= 1.35; const k = Math.exp(-(v.x*v.x)/(r*r)*2.5); if (v.y > 0) v.y -= .55*k*v.y; };
// anticuerpo en forma de Y
function antibody(mat, s=1){
  const g = new THREE.Group();
  const stem = mesh(capG(.22*s, .03*s, 6, 3), mat); stem.position.y = -.13*s; g.add(stem);
  [-1, 1].forEach(k => { const arm = mesh(capG(.22*s, .03*s, 6, 3), mat); arm.position.set(k*.1*s, .1*s, 0); arm.rotation.z = -k*.75; g.add(arm); });
  return g;
}

/* ---------- Tu célula: macrófago ---------- */
// U = niveles de los orgánulos: cada mejora cambia la célula de forma visible
function buildMacrophage(cellId='mac', col=0x58c8ff, evos=0, U={}){
  SEED = 101;
  const lv = k => U[k] || 0;
  const CD = CELLS[cellId] || CELLS.mac, rimCol = new THREE.Color(col).lerp(new THREE.Color(0xffffff), .45).getHex();
  const g = new THREE.Group();
  const lobes = [{d:V(1,0,0), a:0, k:5},
    {d:V(-.3,.9,.3).normalize(), a:.16, k:7, b:.16, ph:0}, {d:V(-.7,-.6,.4).normalize(), a:.2, k:7, b:.2, ph:2},
    {d:V(.3,-.5,-.8).normalize(), a:.14, k:7, b:.14, ph:4}, {d:V(-.4,.2,-.9).normalize(), a:.12, k:7, b:.12, ph:1}];
  const sc = cellId === 'mac' ? 1 : cellId === 'neu' ? .82 : cellId === 'nk' ? .74 : .88; // tamaño relativo
  // membrana reforzada: contorno más grueso y brillante; desde el nivel 8, una segunda capa
  const memM = mem(col, {op:Math.min(.42, .34 + .008*lv('mem')), rim:rimCol, rimK:1.7 + .05*Math.min(lv('mem'), 15), rimP:2.2 - .04*Math.min(lv('mem'), 15), rimA:.85, rough:.25, bumpScale:.03 + .002*lv('mem')});
  const memb = blob(1.2*sc, memM, {lobes, ro:10});
  if (lv('mem') >= 8) g.add(blob(1.27*sc, mem(rimCol, {op:.06, rim:rimCol, rimK:1.2, rimA:.4, bump:false}), {w:32, h:20, ro:11}));
  const cyto = blob(1.0*sc, mem(new THREE.Color(col).multiplyScalar(.35).getHex(), {op:.16, rimK:.3, rimA:.2, bump:false}), {w:32, h:20, ro:4});
  g.add(memb, cyto);
  const inner = new THREE.Group(); g.add(inner);
  inner.scale.setScalar(sc);
  // núcleo: arriñonado (macrófago), multilobulado (neutrófilo), redondo y grande (NK) o bilobulado (eosinófilo)
  const nm = mem(0x7b8cff, {map:CHROM, rim:0xc4ceff, rimK:.7 + .08*lv('nuc'), emiK:.18 + .04*lv('nuc')});
  let nuc;
  if (CD.nuc === 'bean'){ nuc = blob(.42, nm, {w:36, h:24, shape:bean}); nuc.position.set(.12,.05,0); nuc.rotation.z = .3; inner.add(nuc); }
  else if (CD.nuc === 'round'){ nuc = blob(.55, nm, {w:36, h:24}); nuc.position.set(.08,.04,0); inner.add(nuc); }
  else {
    nuc = new THREE.Group(); nuc.userData.wob = () => {};
    const lobesN = CD.nuc === 'lobes' ? [V(-.42,.12,0), V(-.12,.28,.08), V(.2,.22,-.05), V(.42,-.02,.06)] : [V(-.25,.1,0), V(.25,.06,.05)];
    lobesN.forEach((p, i) => { const l = mesh(sphG(CD.nuc === 'lobes' ? .2 : .3, 24, 16), nm); l.position.copy(p); nuc.add(l);
      if (i){ const a = lobesN[i-1], len = a.distanceTo(p); const br = mesh(new THREE.CylinderGeometry(.05, .05, len, 8), nm); br.position.copy(a).lerp(p, .5); br.quaternion.setFromUnitVectors(UP, p.clone().sub(a).normalize()); nuc.add(br); } });
    inner.add(nuc);
  }
  if (lv('nuc')) nuc.scale.setScalar(1 + Math.min(.3, .03*lv('nuc')));
  // gránulos característicos (rojos en el NK, naranjas en el eosinófilo)
  if (cellId !== 'mac') inner.add(inst(sphG(.055, 10, 8), mem(CD.gran, {emiK:.7, rim:0xffffff, rimK:.5, bump:false}), Array.from({length:cellId === 'eos' ? 40 : 24}, () => ({p:randIn(.8,.65,.65)}))));
  // aparato de Golgi: cisternas curvas apiladas y vesículas
  const gm = mem(0xffc65c, {emiK:.3, rim:0xfff0b8, rimK:.8, side:THREE.DoubleSide, bump:false});
  const gol = new THREE.Group();
  for (let i=0;i<5 + Math.min(lv('gol'), 6);i++) gol.add(mesh(new THREE.SphereGeometry(.22 + i*.04, 20, 6, 0, Math.PI*.9, Math.PI*.36, Math.PI*.22), gm));
  for (let i=0;i<7 + 3*lv('gol');i++){ const v = mesh(sphG(.035, 10, 8), gm); const a = srn(0, Math.PI*.9); v.position.set(Math.cos(a)*.5, srn(-.12,.12), Math.sin(a)*.5); gol.add(v); }
  gol.position.set(-.55,.35,.25); gol.rotation.set(.4, 2.4, .3); inner.add(gol);
  // mitocondrias con crestas
  const mm = mem(0xff7a4a, {map:CRISTAE, rim:0xffb08a, rimK:.6, emiK:.15, bump:false});
  for (let i=0;i<Math.min(20, 6 + lv('mit'));i++){ const c = mesh(capG(.2, .07, 12, 5), mm); c.position.copy(randIn(.75,.6,.6)); c.rotation.set(srn(0,3), srn(0,3), srn(0,3)); inner.add(c); }
  // lisosomas
  const lyM = mem(0xd8ff6b, {emiK:.5 + .02*Math.min(lv('fue'), 25), rim:0xffffff, rimK:.4, bump:false});
  inner.add(inst(sphG(.055, 10, 8), lyM, Array.from({length:Math.min(44, 12 + 1.5*lv('fue') | 0)}, () => ({p:randIn(.85,.7,.7)}))));
  // citoesqueleto: filamentos de actina visibles
  if (lv('cit')){ const n = Math.min(90, 8*lv('cit')), pos = new Float32Array(n*6);
    for (let i=0;i<n;i++){ const a = randIn(.9,.75,.75), b = randIn(.9,.75,.75); pos.set([a.x,a.y,a.z,b.x,b.y,b.z], i*6); }
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    inner.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({color:0x8fdfff, transparent:true, opacity:.28, blending:THREE.AdditiveBlending, depthWrite:false}))); }
  // peroxisomas (verdes)
  if (lv('per')) inner.add(inst(sphG(.05, 10, 8), mem(0x8fff9a, {emiK:.7, rim:0xffffff, rimK:.4, bump:false}), Array.from({length:4*lv('per')}, () => ({p:randIn(.8,.65,.65)}))));
  // centrosoma: dos centríolos perpendiculares con su áster de microtúbulos
  if (lv('cen')){ const cg = new THREE.Group(), cM = mem(0xff9fd8, {emiK:.5, bump:false});
    [0, 1].forEach(k => { const c = new THREE.Group(); for (let i=0;i<9;i++){ const a = i/9*Math.PI*2, r = mesh(new THREE.CylinderGeometry(.008, .008, .12, 4), cM); r.position.set(Math.cos(a)*.035, 0, Math.sin(a)*.035); c.add(r); }
      if (k) c.rotation.z = Math.PI/2; cg.add(c); });
    const n = 10 + 4*lv('cen'), pos = new Float32Array(n*6);
    for (let i=0;i<n;i++){ const d = V(srn(-1,1), srn(-1,1), srn(-1,1)).normalize().multiplyScalar(.5); pos.set([0,0,0,d.x,d.y,d.z], i*6); }
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    cg.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({color:0xff9fd8, transparent:true, opacity:.3, blending:THREE.AdditiveBlending, depthWrite:false})));
    cg.position.set(-.35,-.3,.3); inner.add(cg); }
  // retículo endoplasmático rugoso alrededor del núcleo
  const erM = mem(0x4dd6c8, {op:.55, rimK:.6, bump:false});
  for (let k=0;k<2;k++){
    const pts = []; for (let i=0;i<=30;i++){ const a = i/30*Math.PI*1.6 + k*2.2; pts.push(V(Math.cos(a)*(.62 + .05*Math.sin(i*1.7)), Math.sin(i*.9 + k)*.25, Math.sin(a)*(.56 + .05*Math.cos(i*1.3)))); }
    const curve = new THREE.CatmullRomCurve3(pts);
    inner.add(mesh(new THREE.TubeGeometry(curve, 90, .028, 6), erM, 5));
    const nr = Math.min(200, 40 + 15*lv('rib')); // ribosomas: más con cada mejora
    inner.add(inst(sphG(.014, 5, 4), mem(0x9ff5e8, {emiK:.5 + .03*Math.min(lv('rib'), 15), bump:false}), Array.from({length:nr}, (_, i) => ({p:curve.getPoint(i/nr).add(randIn(.035,.035,.035))}))));
  }
  // retículo endoplasmático liso: tubos sin ribosomas
  for (let k=0;k<Math.min(4, lv('rel') ? 1 + Math.floor(lv('rel')/3) : 0);k++){
    const pts = []; for (let i=0;i<=20;i++) pts.push(randIn(.8,.6,.6));
    inner.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, .02, 5), mem(0x9ff0ff, {op:.5, rimK:.6, bump:false}), 5)); }
  // filopodios: tu linaje gana más con cada evolución
  const fil = inst(new THREE.ConeGeometry(.025, .35, 5).translate(0, .175, 0), mem(rimCol, {op:.6, rimK:.8, bump:false}), fibDirs(Math.min(44, 16 + evos*4)).map(d => ({p:d.clone().multiplyScalar(1.12*sc), n:d})), 9);
  g.add(fil);
  // orgánulos de élite: receptores tipo Toll, glucocáliz y gránulos secretores
  if (lv('tlr')) g.add(inst(new THREE.ConeGeometry(.03, .16, 5).translate(0, .08, 0), mem(0xffb547, {emiK:.6, bump:false}), fibDirs(Math.min(60, 6*lv('tlr'))).map(d => ({p:d.clone().multiplyScalar(1.06*sc), n:d})), 9));
  if (lv('glc')) g.add(mesh(new THREE.IcosahedronGeometry(1.2*sc, 3), mem(0x9be7ff, {op:.05 + .012*Math.min(lv('glc'), 12), rimA:.6, rimK:.9, side:THREE.DoubleSide, bump:false}), 9));
  if (lv('sec')) inner.add(inst(sphG(.045, 8, 6), mem(0xff7ad9, {emiK:.7, bump:false}), Array.from({length:Math.min(60, 6*lv('sec'))}, () => ({p:randIn(.85,.7,.7)}))));
  let reachA = 0;
  const mitK = Math.min(1, lv('mit')/12);
  return {g,
    reach(p, dirWorld){ lobes[0].d.copy(dirWorld).applyAxisAngle(UP, -g.rotation.y).normalize(); reachA = Math.sin(p*Math.PI)*.85; },
    up(t){
      lobes[0].a = reachA;
      for (let i=1;i<lobes.length;i++) lobes[i].a = lobes[i].b*(.6 + .6*Math.sin(t*.7 + lobes[i].ph));
      memb.userData.wob(t, .05, 2, 1, .02); cyto.userData.wob(t+3, .06, 2.4, .8); nuc.userData.wob(t+5, .03, 3, .5);
      inner.rotation.y = Math.sin(t*.2)*.25; inner.rotation.x = Math.sin(t*.17)*.1; fil.rotation.y = Math.sin(t*.5)*.1;
      mm.emissiveIntensity = 1 + mitK*1.2*(.5 + .5*Math.sin(t*2.2)); // las mitocondrias laten al producir ATP
      lyM.emissiveIntensity = .9 + .2*Math.sin(t*1.7);
    }};
}

/* ---------- Organismos ---------- */
const BUILD = {
  // Estafilococo: racimo de cocos, algunos dividiéndose, envueltos en biopelícula
  gp(){ SEED = 201; const g = new THREE.Group();
    const m = mem(0x8a55f0, {rim:0xc8b0ff, rimK:.55, rimP:2.4, bumpScale:.02, rough:.65, emiK:.08});
    const pts = [V()]; let guard = 0;
    while (pts.length < 15 && guard++ < 3000){
      const b = pts[Math.floor(sr()*pts.length)], d = V(srn(-1,1), srn(-1,1), srn(-1,1)).normalize(), p = b.clone().addScaledVector(d, .7);
      if (p.length() > 1.05) continue; if (pts.every(q => q.distanceTo(p) > .66)) pts.push(p); }
    const geo = sphG(.36, 28, 20);
    const cs = pts.map(p => { const c = mesh(geo, m); c.position.copy(p); c.userData.ph = sr()*6; g.add(c); return c; });
    const sm = mem(0xe6dcff, {emiK:.5, bump:false});
    for (let k=0;k<2;k++){ // diplococos con tabique de división
      const a = cs[cs.length-1-k], d = a.position.clone().normalize();
      const b2 = mesh(geo, m); b2.position.copy(a.position).addScaledVector(d, .5); b2.scale.setScalar(.85); g.add(b2);
      const ring = mesh(new THREE.TorusGeometry(.27, .035, 8, 24), sm); ring.position.copy(a.position).addScaledVector(d, .26); ring.quaternion.setFromUnitVectors(V(0,0,1), d); g.add(ring); }
    const dots = []; cs.forEach(c => { for (let j=0;j<4;j++){ const d = V(srn(-1,1), srn(-1,1), srn(-1,1)).normalize(); dots.push({p:c.position.clone().addScaledVector(d, .36), n:d}); } });
    g.add(inst(new THREE.CylinderGeometry(.012, .012, .08, 4).translate(0, .04, 0), mem(0xffffff, {emiK:.6, bump:false}), dots));
    const slime = blob(1.35, mem(0xb48cff, {op:.06, rim:0xb48cff, rimK:.5, rimA:.25, bump:false}), {w:28, h:18, ro:10}); g.add(slime);
    return {g, up(t){ cs.forEach(c => c.scale.setScalar(1 + .04*Math.sin(t*2 + c.userData.ph))); slime.userData.wob(t, .08, 1.5, .4); g.rotation.y = t*.15; g.rotation.x = Math.sin(t*.3)*.15; }}; },

  // E. coli: dos membranas, nucleoide, ribosomas, fimbrias y flagelos perítricos
  gn(){ SEED = 301; const g = new THREE.Group(), body = new THREE.Group(); g.add(body); body.rotation.z = Math.PI/2;
    const L = 1.5, R = .48;
    body.add(mesh(capG(L, R, 40, 10), mem(0xff6fae, {op:.36, rim:0xffc0dc, rimK:1.5, rimA:.8, bumpScale:.02}), 10));
    body.add(mesh(capG(L*.96, R*.86, 32, 8), mem(0xb03a72, {op:.3, rimK:.4, rimA:.4, bump:false}), 6));
    body.add(mesh(tangleG(26, .18, .6, .18, .022), mem(0x7b9cff, {emiK:.5, bump:false})));
    body.add(inst(sphG(.022, 6, 4), mem(0xffd0e6, {emiK:.4, bump:false}), Array.from({length:150}, () => ({p:randIn(.32, .95, .32)}))));
    body.add(inst(new THREE.CylinderGeometry(.006, .006, .22, 3).translate(0, .11, 0), mem(0xffd6ea, {emiK:.5, bump:false}), capPts(170, L, R)));
    const fm = mem(0xffc4de, {emiK:.45, rimK:.6, bump:false}), fl = [];
    for (let i=0;i<6;i++){
      const a = i/6*Math.PI*2 + srn(-.3,.3), y = srn(-L/2, L/4);
      const piv = new THREE.Group(); piv.position.set(Math.cos(a)*R, y, Math.sin(a)*R);
      piv.quaternion.setFromUnitVectors(UP, V(Math.cos(a)*.5, -1, Math.sin(a)*.5).normalize());
      const spin = mesh(helixG(2.4, .14, 5, .018), fm); piv.add(spin); body.add(piv); fl.push(spin); }
    return {g, up(t){ fl.forEach((f, i) => f.rotation.y = t*9 + i); g.rotation.y = .5 + Math.sin(t*.6)*.3; body.position.y = Math.sin(t*1.4)*.08; }}; },

  // Virus de la gripe: envoltura con hemaglutinina y neuraminidasa, 8 segmentos de ARN
  vir(){ SEED = 401; const g = new THREE.Group(), core = new THREE.Group(); g.add(core);
    const R = .74;
    core.add(mesh(sphG(R, 48, 32), mem(0xffa63a, {op:.5, rim:0xffe2a0, rimK:1.4, rimA:.75, bumpScale:.05}), 10));
    core.add(mesh(sphG(R*.9, 32, 20), mem(0x8a3c10, {op:.3, rimK:.3, rimA:.4, bump:false}), 6));
    const rm = [mem(0x6c95ff, {emiK:.5, bump:false}), mem(0xff6fd8, {emiK:.5, bump:false})];
    for (let i=0;i<8;i++){ const s = mesh(helixG(srn(.35,.6), .045, 7, .022, false), rm[i%2]); s.position.copy(randIn(.3,.3,.3)); s.position.y -= .2; s.rotation.set(srn(-.6,.6), srn(0,6), srn(-.6,.6)); core.add(s); }
    const ha = [], na = [];
    fibDirs(110).forEach((d, i) => (i % 7 === 3 ? na : ha).push({p:d.clone().multiplyScalar(R*.98), n:d}));
    core.add(inst(new THREE.CylinderGeometry(.018, .022, .2, 5).translate(0, .1, 0), mem(0xffe2a0, {emiK:.2, bump:false}), ha));
    core.add(inst(sphG(.05, 8, 6).scale(1, 1.6, 1).translate(0, .24, 0), mem(0xffe9b8, {emiK:.25, bump:false}), ha));
    core.add(inst(new THREE.CylinderGeometry(.012, .012, .22, 4).translate(0, .11, 0), mem(0xff6b3d, {bump:false}), na));
    core.add(inst(new THREE.OctahedronGeometry(.07, 0).scale(1, .45, 1).translate(0, .25, 0), mem(0xff6b3d, {emiK:.3, flat:true, bump:false}), na));
    // célula huésped donde se esconde
    const hostM = mem(0x8fd3ff, {op:0, rim:0xc8f0ff, rimK:0, rimA:0});
    const host = blob(1.55, hostM, {w:36, h:24, ro:11}); host.visible = false; g.add(host);
    const hostN = mesh(sphG(.45, 24, 16), mem(0x6c95ff, {map:CHROM, op:0}), 9); hostN.position.set(-.7,.45,-.5); host.add(hostN);
    let h = 0;
    return {g, up(t, e){ core.rotation.y = t*.4; core.rotation.x = t*.25;
      h += ((e && e.hidden ? 1 : 0) - h)*.06; core.scale.setScalar(1 - .5*h);
      hostM.opacity = .3*h; hostM.userData.U.rimK.value = 1.2*h; hostM.userData.U.rimA.value = .7*h; hostN.material.opacity = .85*h;
      host.visible = h > .02; if (host.visible) host.userData.wob(t, .07, 1.6, .6); }}; },

  // Candida: pared de quitina, cicatrices de gemación, yema y pseudohifa
  lev(){ SEED = 501; const g = new THREE.Group();
    const wallM = mem(0xe8b860, {op:.45, rim:0xfff0c0, rimK:1.2, rimA:.8, bumpScale:.03});
    const cytM = mem(0xa8742a, {op:.42, rimK:.3, rimA:.3, bump:false});
    const cell = (r, sy) => { const c = new THREE.Group(); const w = mesh(sphG(r, 40, 28), wallM, 10); w.scale.set(1, sy, 1); const ci = mesh(sphG(r*.9, 32, 20), cytM, 6); ci.scale.set(1, sy, 1); c.add(w, ci); return c; };
    const mom = cell(.78, 1.22); g.add(mom);
    const nuc = mesh(sphG(.2, 20, 14), mem(0x7b8cff, {map:CHROM})); nuc.position.set(.15,.15,.2); mom.add(nuc);
    const vac = mesh(sphG(.32, 24, 16), mem(0x9fdcff, {op:.55, rim:0xe0f6ff, rimA:.7, bump:false}), 7); vac.position.set(-.12,-.25,.05); mom.add(vac);
    mom.add(inst(sphG(.04, 8, 6), mem(0xfff09a, {emiK:.5, bump:false}), Array.from({length:14}, () => ({p:randIn(.55,.75,.55)}))));
    const scarM = mem(0xc8954a, {bump:false});
    [V(.6,.4,.5), V(-.7,.1,.4), V(.2,-.6,.75)].forEach(d => { d.normalize(); const r = mesh(new THREE.TorusGeometry(.1, .025, 8, 20), scarM); r.position.set(d.x*.78, d.y*.78*1.22, d.z*.78); r.quaternion.setFromUnitVectors(V(0,0,1), d); mom.add(r); });
    const bud = cell(.42, 1.1); bud.position.set(.35, 1.05, .1); g.add(bud);
    const hy = new THREE.Group(); hy.position.set(-.25,-.9,.1); hy.rotation.z = -.75; g.add(hy);
    for (let i=0;i<1;i++){
      const y = -.38;
      const c = mesh(capG(.42, .22, 24, 6), wallM, 10); c.position.y = y; hy.add(c);
      const ci = mesh(capG(.38, .17, 20, 5), cytM, 6); ci.position.y = y; hy.add(ci);
      const sep = mesh(new THREE.TorusGeometry(.19, .03, 6, 20), scarM); sep.rotation.x = Math.PI/2; sep.position.y = y + .36; hy.add(sep); }
    return {g, up(t){ bud.scale.setScalar(.75 + .3*(.5 + .5*Math.sin(t*.6))); g.rotation.y = t*.2; vac.scale.setScalar(1 + .05*Math.sin(t*1.3)); }}; },

  // Ameba: ectoplasma claro, endoplasma granular, pseudópodos, vacuolas
  ame(){ SEED = 601; const g = new THREE.Group();
    const lobes = [V(1,.2,.1), V(-.2,1,.1), V(-.6,-.7,.3), V(.4,-.6,-.6), V(-.3,.1,-1)].map((d, i) => ({d:d.normalize(), a:0, k:4, ph:i*1.3}));
    const ilobes = lobes.map(L => ({d:L.d, a:0, k:4}));
    const ecto = blob(1.2, mem(0xb8f06a, {op:.3, rim:0xe6ffc0, rimK:1.4, rimA:.8, rough:.3, bumpScale:.03}), {lobes, ro:10});
    const endo = blob(.82, mem(0x6f9c2c, {op:.45, rimK:.4, rimA:.4, bumpScale:.05}), {lobes:ilobes, w:36, h:24, ro:6});
    g.add(ecto, endo);
    const nuc = mesh(sphG(.26, 24, 16), mem(0x7b8cff, {map:CHROM, rimK:.6})); nuc.scale.set(1, .6, 1); g.add(nuc);
    const cv = mesh(sphG(.2, 20, 14), mem(0xbfe8ff, {op:.55, rim:0xffffff, rimA:.7, bump:false}), 7); cv.position.set(-.5,.3,.35); g.add(cv);
    const fv = [];
    for (let i=0;i<4;i++){ const v = new THREE.Group(); v.add(mesh(sphG(.17, 20, 14), mem(0xd8ffd0, {op:.35, rimA:.6, bump:false}), 7));
      for (let j=0;j<2;j++){ const a = mesh(sphG(.06, 12, 8), mem(0x2fe36a, {emiK:.4})); a.position.copy(randIn(.07,.07,.07)); v.add(a); }
      v.position.copy(randIn(.55,.45,.45)); g.add(v); fv.push(v); }
    const N = 70, gp = Array.from({length:N}, () => ({r:srn(.15,.7), a:srn(0,6.28), y:srn(-.4,.4), s:srn(.3,1)}));
    const gran = new THREE.InstancedMesh(sphG(.025, 6, 4), mem(0xf6ffd8, {emiK:.6, bump:false}), N); g.add(gran);
    return {g, up(t){
      lobes.forEach((L, i) => { const w = Math.max(0, Math.sin(t*.45 + L.ph)); L.a = .55*w*w; ilobes[i].a = .35*w*w; });
      ecto.userData.wob(t, .06, 1.6, .7, .015); endo.userData.wob(t+2, .08, 2, .6);
      gp.forEach((p, i) => { const a = p.a + t*.25*p.s; _M.makeTranslation(Math.cos(a)*p.r, p.y + Math.sin(a*2)*.05, Math.sin(a)*p.r*.8); gran.setMatrixAt(i, _M); });
      gran.instanceMatrix.needsUpdate = true;
      const c = (t*.35) % 1; cv.scale.setScalar(c < .85 ? .3 + c*.9 : Math.max(.05, (1-c)/.15*1.05));
      fv.forEach((v, i) => v.rotation.y = t*.3 + i);
      g.rotation.y = Math.sin(t*.25)*.4; }}; },

  // Célula vegetal: pared de celulosa, tejido vecino, plasmodesmos, vacuola central, cloroplastos con grana
  veg(){ SEED = 701; const g = new THREE.Group();
    const W = 2.3, H = 1.7, D = 1.6;
    g.add(mesh(rboxG(W, H, D, .2), mem(0x5dff8a, {op:.15, rim:0xa8ffc4, rimK:1.1, rimA:.85, bumpScale:.02}), 10));
    g.add(mesh(rboxG(W-.16, H-.16, D-.16, .16), mem(0x2fbf5a, {op:.1, rimK:.5, rimA:.45, bump:false}), 9));
    const nbM = mem(0x1f7a3e, {op:.03, rim:0x5dff8a, rimK:.35, rimA:0, rough:1, bump:false}); nbM.metalness = 0; nbM.envMapIntensity = 0;
    [[0,H+.06,0], [0,-H-.06,0], [W+.06,0,0], [0,0,-D-.06], [W+.06,H+.06,0]].forEach(p => { const n = mesh(rboxG(W, H, D, .2, 5), nbM, 3); n.position.set(...p); g.add(n); });
    const pds = [];
    for (let i=0;i<10;i++){ pds.push({p:V(srn(-.8,.8), H/2 - .06, srn(-.6,.6)), n:UP}); pds.push({p:V(W/2 - .06, srn(-.6,.6), srn(-.6,.6)), n:V(1,0,0)}); }
    g.add(inst(new THREE.CylinderGeometry(.018, .018, .14, 5), mem(0xc8ffd8, {emiK:.5, bump:false}), pds));
    const vac = blob(.62, mem(0x9fdcff, {op:.16, rim:0xd8f6ff, rimK:.9, rimA:.6, bump:false}), {w:32, h:20, ro:6}); vac.scale.set(1.45, 1.05, .95); g.add(vac);
    const nuc = mesh(sphG(.24, 24, 16), mem(0x7b8cff, {map:CHROM, rimK:.6})); nuc.position.set(-.78,.48,.38); g.add(nuc);
    const chlM = mem(0x22c95a, {op:.7, rim:0xa8ffc4, rimK:.8, rimA:.6, bump:false});
    const grM = mem(0x2fe36a, {map:STRIPES, emiK:.25, bump:false});
    const grG = new THREE.CylinderGeometry(.04, .04, .09, 10), chG = sphG(.13, 20, 14);
    const chl = [];
    for (let i=0;i<20;i++){
      const c = new THREE.Group(); const e = mesh(chG, chlM, 7); e.scale.set(1.7, .75, 1); c.add(e);
      for (let k=-1;k<=1;k++){ const gr = mesh(grG, grM); gr.position.x = k*.1; c.add(gr); }
      c.userData = {a:i/20*Math.PI*2, z:srn(-.55,.55), r:srn(.88,.98)}; g.add(c); chl.push(c); }
    const mm = mem(0xff7a4a, {map:CRISTAE, bump:false});
    for (let i=0;i<5;i++){ const c = mesh(capG(.14, .05, 10, 4), mm); c.position.set(srn(-.9,.9), srn(-.6,.6), .62*(sr() < .5 ? -1 : 1)); c.rotation.set(srn(0,3), srn(0,3), 0); g.add(c); }
    return {g, up(t, e){ const dark = e && e.dark, sp = dark ? .08 : .45;
      chl.forEach(c => { const a = c.userData.a + t*.7*sp; c.position.set(Math.cos(a)*c.userData.r*.98, Math.sin(a)*.68*c.userData.r, c.userData.z); c.rotation.z = a + Math.PI/2; });
      chlM.userData.U.rimK.value = dark ? .12 : .8; grM.emissiveIntensity = dark ? .15 : 1; chlM.emissiveIntensity = dark ? .15 : 1;
      vac.userData.wob(t, .03, 1.6, .5);
      g.rotation.y = -.55 + Math.sin(t*.3)*.18; g.rotation.x = .12; }}; },

  // Paramecio: forma de zapatilla, surco oral, cilios con onda metacrónica, macro y micronúcleo, vacuolas contráctiles en estrella
  par(){ SEED = 801; const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
    const A = .62, Bv = .5, C = 1.85;
    const shape = v => { v.x *= A; v.y *= Bv; v.z *= C; const tz = v.z/C; const tp = 1 - .22*Math.max(0, tz) + .05*Math.max(0, -tz); v.x *= tp; v.y *= tp;
      v.x -= .2*Math.exp(-Math.pow((tz + .05)/.35, 2))*Math.max(0, v.x/A); };
    const pel = blob(1, mem(0xc6b3ff, {op:.34, rim:0xf0e8ff, rimK:1.4, rimA:.8, bumpScale:.02}), {w:64, h:40, shape, ro:10});
    body.add(pel);
    const pa = pel.geometry.attributes.position, na = pel.geometry.attributes.normal, cil = [];
    for (let i=0;i<pa.count;i+=3){ const n = V().fromBufferAttribute(na, i); if (n.lengthSq() < .5) continue; cil.push({p:V().fromBufferAttribute(pa, i), n:n.normalize()}); }
    const cIM = new THREE.InstancedMesh(new THREE.CylinderGeometry(.006, .004, .17, 3).translate(0, .085, 0), mem(0xf3ecff, {emiK:.6, bump:false}), cil.length); body.add(cIM);
    const q0 = cil.map(c => new THREE.Quaternion().setFromUnitVectors(UP, c.n));
    const ax = cil.map(c => { const a = V(0,0,1).cross(c.n); return a.lengthSq() < 1e-6 ? V(1,0,0) : a.normalize(); });
    const qq = new THREE.Quaternion(), one = V(1,1,1);
    const mac = mesh(sphG(.26, 24, 16), mem(0x8f7bff, {map:CHROM, rimK:.6})); mac.scale.set(1, .8, 1.6); mac.position.set(-.05, 0, .15); body.add(mac);
    const mic = mesh(sphG(.07, 12, 8), mem(0x4a5ad8)); mic.position.set(.2, .05, .45); body.add(mic);
    const cvs = [-1.05, 1.0].map(z => { const s = new THREE.Group(); s.position.set(0, .28, z);
      const c = mesh(sphG(.11, 16, 12), mem(0xbfe8ff, {op:.75, rim:0xffffff, rimA:.8, bump:false}), 8); s.add(c);
      const cm = mem(0x8fd3ff, {op:.6, bump:false}), canals = [];
      for (let k=0;k<6;k++){ const cn = mesh(new THREE.CylinderGeometry(.025, .012, .32, 6).translate(0, .16, 0), cm, 8); cn.rotation.z = -Math.PI/2; const piv = new THREE.Group(); piv.rotation.y = k/6*Math.PI*2; piv.add(cn); s.add(piv); canals.push(cn); }
      body.add(s); return {c, canals}; });
    const fcol = [0xffb547, 0x8fffb0, 0xff9fb2, 0xffe066], fvs = [];
    for (let i=0;i<7;i++){ const v = mesh(sphG(.09, 14, 10), mem(fcol[i%4], {op:.75, rimA:.6, bump:false}), 7); v.userData.ph = i/7; body.add(v); fvs.push(v); }
    body.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(.45,0,-.05), V(.3,-.05,-.2), V(.12,-.05,-.35)]), 20, .05, 8), mem(0x6a4fb8, {op:.6, bump:false}), 8));
    return {g, up(t){
      if (QL > 0 || FRAME % 2 === 0) for (let i=0;i<cil.length;i++){ qq.setFromAxisAngle(ax[i], Math.sin(t*10 - cil[i].p.z*5)*.7).multiply(q0[i]); _M.compose(cil[i].p, qq, one); cIM.setMatrixAt(i, _M); }
      cIM.instanceMatrix.needsUpdate = true;
      cvs.forEach(({c, canals}, k) => { const ph = (t*.4 + k*.5) % 1; const fill = ph < .8;
        c.scale.setScalar(fill ? .4 + ph*.9 : Math.max(.1, (1-ph)*5.5)); canals.forEach(cn => cn.scale.set(1, fill ? 1.15 - ph : .4 + (ph-.8)*3.5, 1)); });
      fvs.forEach(v => { const a = ((v.userData.ph + t*.05) % 1)*Math.PI*2; v.position.set(Math.sin(a)*.3, Math.cos(a*2)*.12, Math.cos(a)*1.2); });
      g.rotation.y = Math.PI/2 + Math.sin(t*.5)*.25; body.rotation.z = Math.sin(t*.8)*.12; }}; },

  // Micoplasma: pleomórfico, sin pared, con orgánulo de adhesión
  myc(){ SEED = 901; const g = new THREE.Group(), cells = [];
    const mk = (r, tip, pos, rot) => { const c = new THREE.Group(); c.position.copy(pos); c.rotation.set(...rot);
      const shape = (v, rr) => { const k = Math.max(0, v.y/rr); v.y *= 1 + tip*k*k*k; v.x *= 1 - .45*tip*k*k; v.z *= 1 - .45*tip*k*k; };
      const m = blob(r, mem(0xff9f6b, {op:.42, rim:0xffd2b8, rimK:1.4, rimA:.8, bumpScale:.03}), {w:36, h:24, shape, ro:10}); c.add(m);
      c.add(mesh(tangleG(14, r*.5, r*.5, r*.5, .015), mem(0x7b9cff, {emiK:.5, bump:false})));
      c.add(inst(sphG(.018, 6, 4), mem(0xffe0d0, {emiK:.4, bump:false}), Array.from({length:50}, () => ({p:randIn(r*.7, r*.7, r*.7)}))));
      const len = r*(1 + tip)*.95;
      c.add(mesh(new THREE.CylinderGeometry(.03, .03, len, 8).translate(0, len/2, 0), mem(0xffe9c0, {emiK:.5, bump:false})));
      const knob = mesh(sphG(.07, 12, 8), mem(0xfff2d8, {emiK:.6, bump:false})); knob.position.y = len; c.add(knob);
      g.add(c); cells.push({c, m}); };
    mk(.62, .9, V(0,-.1,0), [0,0,-.6]); mk(.36, .8, V(-.75,.6,-.2), [0,0,.9]); mk(.3, .7, V(.6,.75,.3), [.5,0,-1.4]);
    return {g, up(t){ cells.forEach(({c, m}, i) => { m.userData.wob(t + i*2, .12, 2.4, 1.1); c.rotation.y = t*.2 + i; }); g.rotation.y = Math.sin(t*.3)*.5; }}; },

  // Célula tumoral: forma irregular, varios núcleos, vesículas, microvellosidades, mitosis anómala y angiogénesis
  can(){ SEED = 1001; const g = new THREE.Group();
    const lobes = [V(.8,.5,.2), V(-.6,.7,-.2), V(.1,-.9,.4), V(-.5,-.3,-.8), V(.7,-.2,-.7)].map(d => ({d:d.normalize(), a:srn(.15,.35), k:3}));
    const surf = d => 1.1*(1 + lobes.reduce((s, L) => s + L.a*Math.pow(Math.max(0, d.dot(L.d)), L.k), 0));
    const main = blob(1.1, mem(0xff3b5c, {op:.42, rim:0xffa0b4, rimK:1.2, rimA:.8, rough:.6, bumpScale:.06}), {lobes, ro:10}); g.add(main);
    g.add(blob(.95, mem(0x9a1830, {op:.28, rimK:.3, rimA:.3, bump:false}), {lobes:lobes.map(L => ({d:L.d, a:L.a*.8, k:L.k})), w:32, h:20, ro:5}));
    const nuclei = [];
    for (let i=0;i<3;i++){ const n = blob(.3 + sr()*.08, mem(0x7b6cff, {map:CHROM, rim:0xc0b8ff, rimK:.6}), {w:28, h:18}); n.position.copy(randIn(.45,.4,.4)); g.add(n); nuclei.push(n);
      const nl = mesh(sphG(.09, 12, 8), mem(0x2a1a70, {emiK:.3})); nl.position.copy(n.position).add(V(.1,.12,.24)); g.add(nl); }
    const blebs = fibDirs(9).map((d, i) => { const b = mesh(sphG(.14, 16, 12), mem(0xff6b84, {op:.5, rimA:.7, bump:false}), 9); b.userData = {d, ph:i*1.7, r:surf(d)}; g.add(b); return b; });
    g.add(inst(new THREE.CylinderGeometry(.012, .016, .12, 4).translate(0, .06, 0), mem(0xff9fb2, {emiK:.3, bump:false}), fibDirs(240).map(d => ({p:d.clone().multiplyScalar(surf(d)*.99), n:d}))));
    const sat = blob(.5, mem(0xff3b5c, {op:.42, rim:0xffa0b4, rimA:.8, bump:false}), {w:28, h:18, ro:10}); sat.position.set(-1.1,.8,-.25); g.add(sat);
    const chrom = new THREE.Group(); sat.add(chrom);
    const chM = mem(0x6c95ff, {emiK:.5, bump:false});
    for (let i=0;i<7;i++){ const x = new THREE.Group(); const a = mesh(capG(.16, .025, 6, 3), chM), b = mesh(capG(.16, .025, 6, 3), chM); a.rotation.z = .5; b.rotation.z = -.5; x.add(a, b);
      x.position.copy(randIn(.25,.25,.25)); x.rotation.set(srn(0,3), srn(0,3), srn(0,3)); chrom.add(x); }
    const vm = mem(0x7a0c1c, {rim:0xff5a6e, rimK:.45, bumpScale:.03, emiK:.1}), vessels = [];
    [[V(-.6,-6,-3), V(-.3,-3,-1.6), V(.1,-1.8,-.6), V(.2,-1.15,-.1)], [V(3.5,-5,-3), V(2.2,-2.6,-1.4), V(1.3,-1.4,-.6), V(.8,-.9,-.2)], [V(-3.4,-5,-3), V(-2,-2.5,-1.6), V(-1.2,-1.5,-.8), V(-.62,-.98,-.4)]].forEach(pts => {
      const tube = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, .085, 10), vm); g.add(tube); vessels.push(tube);
      const end = pts[pts.length-1]; const br = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([pts[2].clone(), pts[2].clone().lerp(end,.5).add(V(.35,.1,.25)), end.clone().add(V(.4,.25,.2))]), 20, .045, 8), vm); g.add(br); });
    return {g, up(t, e){
      main.userData.wob(t, .05, 1.6, .5, .02); nuclei.forEach((n, i) => n.userData.wob(t + i, .08, 3, .5));
      blebs.forEach(b => { const k = .5 + .5*Math.sin(t*1.5 + b.userData.ph); b.position.copy(b.userData.d).multiplyScalar(b.userData.r*(.97 + .08*k)); b.scale.setScalar(.6 + .5*k); });
      const blocked = e && e.block > 0; if (!blocked) chrom.rotation.y = t*.8;
      sat.scale.setScalar(blocked ? .8 : .85 + .15*Math.sin(t*1.2)); sat.userData.wob(t + 3, .12, 2, .6);
      vm.emissiveIntensity = 1 + .8*Math.max(0, Math.sin(t*3.2)); vessels.forEach((v, i) => v.scale.setScalar(1 + .02*Math.sin(t*3.2 + i)));
      g.rotation.y = t*.12; }}; },

  // Bacillus: cadena de bacilos; la endospora tiene núcleo, córtex y cubierta
  bac(){ SEED = 1101; const g = new THREE.Group();
    const wm = mem(0x8f6bff, {op:.5, rim:0xd0c0ff, rimK:1.3, rimA:.8, bumpScale:.02});
    const im = mem(0x5a3fb0, {op:.35, rimK:.3, rimA:.3, bump:false});
    const rods = [-1.05, 0, 1.05].map((x, i) => { const r = new THREE.Group(); r.position.x = x; r.rotation.z = Math.PI/2 + (i-1)*.12;
      r.add(mesh(capG(.62, .3, 32, 8), wm, 10)); r.add(mesh(capG(.58, .24, 24, 6), im, 6));
      r.add(mesh(tangleG(12, .12, .3, .12, .016), mem(0x7b9cff, {emiK:.5, bump:false})));
      r.add(inst(sphG(.018, 6, 4), mem(0xe0d8ff, {emiK:.4, bump:false}), Array.from({length:40}, () => ({p:randIn(.2, .5, .2)}))));
      g.add(r); return r; });
    const sp = new THREE.Group(); sp.visible = false; g.add(sp);
    const core = mesh(sphG(.16, 24, 16), mem(0x8fffe8, {emiK:1.2, rim:0xffffff})); core.scale.set(1.5, 1, 1);
    const cortex = mesh(sphG(.21, 24, 16), mem(0x4dd6c8, {op:.45, rimA:.6, bump:false}), 8); cortex.scale.set(1.45, 1, 1);
    const coat = mesh(sphG(.26, 32, 20), mem(0xffe066, {op:.4, rim:0xfff3b0, rimK:1.5, rimA:.8, bumpScale:.05}), 9); coat.scale.set(1.4, 1, 1);
    sp.add(core, cortex, coat);
    let k = 0;
    return {g, up(t, e){ k += ((e && e.spore ? 1 : 0) - k)*.05;
      sp.visible = k > .02; sp.scale.setScalar(.3 + .7*k);
      wm.opacity = .5 - .38*k; wm.userData.U.rimA.value = .8 - .55*k; im.opacity = .35*(1 - k);
      rods[0].position.x = -1.05 - .6*k; rods[2].position.x = 1.05 + .6*k; rods[0].visible = rods[2].visible = k < .95;
      rods.forEach((r, i) => r.position.y = Math.sin(t*1.1 + i)*.05);
      g.rotation.y = .35 + Math.sin(t*.45)*.35; g.rotation.x = Math.sin(t*.35)*.15; coat.rotation.x = t*.6; }}; },

  // Prion: fibrilla amiloide de láminas β (dos protofilamentos) que recluta PrP sana (hélices α)
  pri(){ SEED = 1201; const g = new THREE.Group(), inner = new THREE.Group(); g.add(inner);
    const sh = new THREE.Shape(); sh.moveTo(-.28,-.035); sh.lineTo(.16,-.035); sh.lineTo(.16,-.07); sh.lineTo(.28,0); sh.lineTo(.16,.07); sh.lineTo(.16,.035); sh.lineTo(-.28,.035); sh.lineTo(-.28,-.035);
    const ag = new THREE.ExtrudeGeometry(sh, {depth:.025, bevelEnabled:false}); ag.translate(0, 0, -.0125); ag.rotateX(Math.PI/2);
    const fm = mem(0xe8a812, {rim:0xffd86a, rimK:.45, emiK:.12, flat:true, bump:false, rough:.4});
    const strands = [];
    for (let pf=0; pf<2; pf++) for (let i=0;i<44;i++) strands.push({y:-1.45 + i*.066, tw:i*.11 + pf*Math.PI, flip:i % 2});
    const fibril = new THREE.InstancedMesh(ag, fm, strands.length); inner.add(fibril);
    const one = V(1,1,1), off = V();
    const place = t => { strands.forEach((s, i) => { const a = s.tw + t*.3; _Q.setFromAxisAngle(UP, a + (s.flip ? Math.PI : 0)); off.set(Math.cos(a)*.3, s.y, -Math.sin(a)*.3); _M.compose(off, _Q, one); fibril.setMatrixAt(i, _M); }); fibril.instanceMatrix.needsUpdate = true; };
    const mons = [];
    for (let i=0;i<5;i++){ const mat = mem(0x4dffd2, {emiK:.35, rim:0xc8fff0, rimK:.6, bump:false}); const m = new THREE.Group();
      for (let k=0;k<3;k++){ const h = mesh(helixG(.32, .05, 4, .022, false), mat); h.position.set((k-1)*.11, -.16, srn(-.05,.05)); m.add(h); }
      m.userData = {mat, ph:i/5, ang:i*1.256, side:i % 2 ? 1 : -1}; inner.add(m); mons.push(m); }
    const teal = new THREE.Color(0x4dffd2), gold = new THREE.Color(0xffd84a), far = V(), tip = V();
    return {g, up(t, e){ place(t);
      mons.forEach(m => { const u = (m.userData.ph + t*.07) % 1, d = m.userData;
        far.set(Math.cos(d.ang)*1.7, d.side*.6, Math.sin(d.ang)*1.7); tip.set(0, d.side*1.55, 0);
        const k = Math.min(1, u/.8); m.position.lerpVectors(far, tip, k*k); m.rotation.y = t + d.ang; m.rotation.x = t*.7;
        const c = u > .7 ? (u - .7)/.3 : 0; d.mat.color.copy(teal).lerp(gold, c); d.mat.emissive.copy(d.mat.color).multiplyScalar(.35);
        m.scale.setScalar(u > .92 ? Math.max(.01, (1 - u)/.08) : 1); });
      const s = e ? Math.min(1.5, .85 + .15*(e.grow || 1)) : 1; inner.scale.lerp(V(s,s,s), .05);
      g.rotation.z = Math.sin(t*.3)*.2; }}; },
};

/* ---------- Organismos del segundo acto ---------- */
// disco bicóncavo de un eritrocito
function rbcGeo(){
  const pts = [];
  for (let i=0;i<=20;i++){ const r = i/20, h = .12 + .28*r*r - .2*Math.pow(r, 8); pts.push(new THREE.Vector2(r, h)); }
  for (let i=20;i>=0;i--){ const r = i/20, h = .12 + .28*r*r - .2*Math.pow(r, 8); pts.push(new THREE.Vector2(r, -h)); }
  return new THREE.LatheGeometry(pts, 48);
}
Object.assign(BUILD, {
  // Tuberculosis: bacilos finos en cordón serpenteante, pared cérea (rojos como en la tinción de Ziehl-Neelsen)
  tbc(){ SEED = 1301; const g = new THREE.Group();
    const m = mem(0xd83a3a, {rim:0xff9a8a, rimK:.7, rough:.85, bumpScale:.04, emiK:.18});
    const wax = mem(0xfff0d8, {op:.15, rim:0xffe0d0, rimK:.45, rimA:.35, bump:false});
    const rods = [];
    for (let k=0;k<3;k++) for (let i=0;i<9;i++){
      const s = i/8, x = -1.6 + s*3.2, y = Math.sin(s*Math.PI*2 + k)*.35 + (k-1)*.32, z = Math.cos(s*Math.PI*1.5 + k)*.25;
      const r = new THREE.Group(); r.position.set(x + srn(-.05,.05), y, z);
      r.rotation.z = Math.PI/2 + Math.cos(s*Math.PI*2 + k)*.6 + srn(-.2,.2); r.rotation.x = srn(-.3,.3);
      r.add(mesh(capG(.42, .1, 14, 5), m)); r.add(mesh(capG(.44, .14, 14, 5), wax, 10));
      r.userData.ph = sr()*6; g.add(r); rods.push(r);
    }
    return {g, up(t){ rods.forEach(r => r.position.y += Math.sin(t*.8 + r.userData.ph)*.0008); g.rotation.y = Math.sin(t*.25)*.35 - .2; g.rotation.x = Math.sin(t*.2)*.15; }}; },

  // Malaria: eritrocito con un anillo (trofozoíto) dentro; al reventar salen merozoítos
  mal(){ SEED = 1401; const g = new THREE.Group();
    const rbcM = mem(0xc0283c, {op:.55, rim:0xff9aa8, rimK:1, rimA:.7, rough:.5, bumpScale:.01});
    const rbc = mesh(rbcGeo(), rbcM, 10); rbc.scale.set(1.3, 1.3, 1.3); rbc.rotation.x = Math.PI/2 - .35; g.add(rbc);
    const para = new THREE.Group(); rbc.add(para);
    const ringM = mem(0xa66bff, {emiK:.5, rim:0xe0c8ff, bump:false});
    const ring = mesh(new THREE.TorusGeometry(.32, .06, 10, 32), ringM); ring.rotation.x = Math.PI/2; para.add(ring);
    const dot = mesh(sphG(.1, 14, 10), mem(0x4a2a9a, {emiK:.4, bump:false})); dot.position.set(.32, 0, 0); para.add(dot);
    para.position.set(.2, .05, .1);
    const others = [];
    for (let i=0;i<2;i++){ const o = mesh(rbcGeo(), mem(0x9a1426, {rim:0xff7a7a, rimK:.6, bumpScale:.01})); o.scale.setScalar(.85); o.position.set(i ? 1.4 : -1.3, i ? -.9 : .9, -.6); o.rotation.set(srn(0,3), srn(0,3), 0); g.add(o); others.push(o); }
    const mzM = mem(0xc77dff, {emiK:.5, rim:0xffffff, rimK:.6, bump:false});
    const mzs = [];
    for (let i=0;i<12;i++){ const mz = mesh(sphG(.08, 10, 8), mzM); mz.scale.set(1, 1.5, 1); mz.userData.d = V(srn(-1,1), srn(-1,1), srn(-1,1)).normalize(); g.add(mz); mzs.push(mz); }
    let out = 0;
    return {g, up(t, e){ out += ((e && !e.inRbc ? 1 : 0) - out)*.06;
      rbc.scale.setScalar(1.3*(1 - .55*out)); rbcM.opacity = .55*(1 - .7*out);
      mzs.forEach((mz, i) => { mz.visible = out > .05; mz.position.copy(mz.userData.d).multiplyScalar(.3 + out*(1.1 + .2*Math.sin(t*2 + i))); mz.lookAt(0, 0, 0); });
      para.rotation.z = t*.6; others.forEach((o, i) => { o.rotation.y += .003; o.position.y += Math.sin(t + i)*.001; });
      g.rotation.y = Math.sin(t*.3)*.4; }}; },

  // VIH: envoltura con pocas espículas gp120 (trímeros) y cápside cónica con dos ARN
  vih(){ SEED = 1501; const g = new THREE.Group(), core = new THREE.Group(); g.add(core);
    const R = .62;
    core.add(mesh(sphG(R, 48, 32), mem(0xff8fab, {op:.42, rim:0xffd0dc, rimK:1.4, rimA:.8, bumpScale:.04}), 10));
    core.add(mesh(sphG(R*.92, 32, 20), mem(0x8a2a4a, {op:.22, rimK:.3, rimA:.3, bump:false}), 6));
    const pts = [];
    for (let i=0;i<=12;i++){ const s = i/12; pts.push(new THREE.Vector2(.04 + .22*s, -.42 + s*.84)); }
    pts.push(new THREE.Vector2(.001, .44)); pts.unshift(new THREE.Vector2(.001, -.44));
    const cone = mesh(new THREE.LatheGeometry(pts, 32), mem(0xffd36b, {op:.7, rim:0xfff0c0, rimK:.8, rimA:.6, bump:false}), 7);
    cone.rotation.z = .5; core.add(cone);
    const rna = mem(0x6c95ff, {emiK:.5, bump:false});
    [-.05, .05].forEach(x => { const h = mesh(helixG(.6, .04, 6, .015, false), rna); h.position.set(x, -.3, 0); cone.add(h); });
    const spM = mem(0xffe0ea, {emiK:.3, bump:false}), stM = mem(0xff6b8f, {bump:false});
    const knobs = [];
    fibDirs(14).forEach(d => { const k = new THREE.Group(); k.position.copy(d).multiplyScalar(R); k.quaternion.setFromUnitVectors(UP, d);
      k.add(mesh(new THREE.CylinderGeometry(.015, .015, .1, 5).translate(0, .05, 0), stM));
      for (let j=0;j<3;j++){ const a = j/3*Math.PI*2, b = mesh(sphG(.045, 10, 8), spM); b.position.set(Math.cos(a)*.04, .13, Math.sin(a)*.04); k.add(b); }
      core.add(k); knobs.push(k); });
    return {g, up(t, e){ core.rotation.y = t*.35; core.rotation.x = Math.sin(t*.3)*.3; const s = e && e.hidden ? .55 : 1; core.scale.lerp(V(s,s,s), .06); }}; },

  // Tenia: escólex con ventosas y ganchos, y una cadena de proglótides que ondula
  ten(){ SEED = 1601; const g = new THREE.Group();
    const m = mem(0xf1e3c8, {rim:0xffffff, rimK:.7, rough:.7, bumpScale:.05, emiK:.08});
    const segs = [], N = 16;
    for (let i=0;i<N;i++){ const w = .18 + .32*Math.min(1, i/9), l = .08 + .14*Math.min(1, i/8);
      const sg = mesh(rboxG(l, w*1.6, w*.35, Math.min(.06, w*.15), 4), m); sg.userData = {l, i}; g.add(sg); segs.push(sg); }
    const head = new THREE.Group(); g.add(head);
    head.add(mesh(sphG(.16, 20, 14), m));
    const suckM = mem(0xd9c4a0, {bump:false});
    for (let k=0;k<4;k++){ const a = k/4*Math.PI*2 + .4, su = mesh(new THREE.TorusGeometry(.055, .022, 8, 16), suckM); su.position.set(-.04, Math.cos(a)*.13, Math.sin(a)*.13); su.lookAt(su.position.clone().multiplyScalar(3)); head.add(su); }
    const hookM = mem(0xfff6e0, {emiK:.4, bump:false});
    for (let k=0;k<12;k++){ const a = k/12*Math.PI*2, hk = mesh(new THREE.ConeGeometry(.015, .08, 5), hookM); hk.position.set(-.16, Math.cos(a)*.07, Math.sin(a)*.07); hk.rotation.z = Math.PI/2; head.add(hk); }
    return {g, up(t){ let x = -1.75;
      head.position.set(x, Math.sin(t*1.5)*.12, 0);
      segs.forEach(sg => { const u = sg.userData; x += u.l*.5 + .03 + (u.i ? segs[u.i-1].userData.l*.5 : .16);
        sg.position.set(x, Math.sin(t*1.5 - u.i*.45)*.15, Math.cos(t*1.1 - u.i*.35)*.08); sg.rotation.z = Math.cos(t*1.5 - u.i*.45)*.25; });
      g.rotation.y = -.25 + Math.sin(t*.25)*.15; }}; },
});

/* ---------- Entorno: plasma sanguíneo ---------- */
let darkTarget = 0, tintTarget = new THREE.Vector3();
const setZoneTint = z => { const t = Array.isArray(z) ? z : (ZONES[z] || ZONES.san).tint; tintTarget.set(t[0], t[1], t[2]); setDecor(Array.isArray(z) ? 'xen' : z); };
// decorado de fondo de cada zona: alvéolos, vellosidades, neuronas, queratinocitos, algas
const DECOR = {}; let decorOn = null;
function buildDecor(z){
  SEED = 77; const g = new THREE.Group();
  if (z === 'pul') for (let i = 0; i < 9; i++){ const a = mesh(new THREE.SphereGeometry(srn(1.2, 2.2), 20, 14), mem(0xffb0c0, {op:.08, rimA:.5, rimK:.8, side:THREE.DoubleSide, bump:false})); a.position.set(srn(-12, 12), srn(-5, 6), srn(-14, -9)); g.add(a); }
  if (z === 'int') for (let i = 0; i < 16; i++){ const v = mesh(new THREE.CylinderGeometry(.35, .5, srn(3, 6), 10), mem(0xffb27a, {op:.14, rimA:.5, rimK:.6, bump:false})); v.position.set(-15 + i*2 + srn(-.4, .4), -6, srn(-13, -10)); v.rotation.z = srn(-.2, .2); g.add(v); }
  if (z === 'cer'){ const m = new THREE.LineBasicMaterial({color:0xc9a6ff, transparent:true, opacity:.25}); for (let n = 0; n < 6; n++){ const c = V(srn(-12, 12), srn(-5, 6), srn(-14, -9)); const pos = [];
      for (let k = 0; k < 9; k++){ let p = c.clone(); for (let j = 0; j < 4; j++){ const q = p.clone().add(V(srn(-1.5, 1.5), srn(-1.5, 1.5), srn(-.4, .4))); pos.push(p.x, p.y, p.z, q.x, q.y, q.z); p = q; } }
      const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.add(new THREE.LineSegments(lg, m));
      const so = mesh(new THREE.SphereGeometry(.45, 12, 10), mem(0xc9a6ff, {op:.2, emiK:.4, bump:false})); so.position.copy(c); g.add(so); } }
  if (z === 'pie') for (let i = 0; i < 22; i++){ const h = mesh(new THREE.CylinderGeometry(1.1, 1.1, .12, 6), mem(0xe8d2b0, {op:.1, rimA:.4, rimK:.5, bump:false})); h.position.set(-14 + (i % 11)*2.6, -6 + Math.floor(i/11)*1.2, srn(-13, -11)); h.rotation.x = Math.PI/2 - .3; g.add(h); }
  if (z === 'cha' || z === 'xen') for (let i = 0; i < 14; i++){ const a = mesh(new THREE.SphereGeometry(srn(.2, .5), 10, 8), mem(z === 'xen' ? 0x9dffe0 : 0x6dff8a, {op:.2, emiK:.5, bump:false})); a.position.set(srn(-12, 12), srn(-5, 6), srn(-13, -8)); a.userData.ph = srn(0, 6); g.add(a); }
  g.visible = false; scene.add(g); return g;
}
function setDecor(z){
  if (decorOn === z) return; decorOn = z;
  for (const k in DECOR) DECOR[k].visible = false;
  if (!z || z === 'san') return; // en la sangre ya están los glóbulos rojos
  (DECOR[z] = DECOR[z] || buildDecor(z)).visible = true;
}
// Calidad gráfica: 2 alta, 1 media, 0 baja
let QL = 2, FRAME = 0;
function applyQuality(lv){ QL = lv; renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lv === 2 ? 2 : lv === 1 ? 1.25 : 1)); if (typeof ENV !== 'undefined') ENV.quality(lv); resize(); }
// Plano cinematográfico al aparecer un jefe especial
let CINE = 0;
const setDark = on => { darkTarget = on ? 1 : 0; };
const ENV = (() => {
  SEED = 3;
  const sky = new THREE.Mesh(new THREE.SphereGeometry(100, 32, 16), new THREE.ShaderMaterial({side:THREE.BackSide, depthWrite:false, fog:false,
    uniforms:{t:{value:0}, dark:{value:0}, tint:{value:new THREE.Vector3()}},
    vertexShader:'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader:`varying vec3 vP; uniform float t; uniform float dark; uniform vec3 tint;
      float n3(vec3 p){ return sin(p.x*2.7 + t*.04)*sin(p.y*3.1 - t*.03)*sin(p.z*2.3 + t*.05); }
      void main(){ float y = vP.y*.5 + .5;
        vec3 c = mix(vec3(.010,.022,.040), vec3(.030,.012,.038), y);
        c += vec3(.015,.05,.07)*smoothstep(.15,.95,n3(vP*2.2));
        c += vec3(.07,.015,.035)*smoothstep(.35,1.,n3(vP*1.4 + vec3(1.7,.4,2.)));
        c += vec3(.02,.06,.05)*pow(max(0.,1. - abs(vP.y - .35)*2.5), 3.)*.6;
        c += tint*(.6 + .4*y); c *= 1. - dark*.85; gl_FragColor = vec4(c, 1.); }`}));
  scene.add(sky);
  // partículas en suspensión
  const N = 800, pos = new Float32Array(N*3), col = new Float32Array(N*3);
  const pal = [0x6c95ff, 0x4dffa0, 0xff4f7b, 0xa67bff, 0x8fd3ff].map(h => new THREE.Color(h));
  for (let i=0;i<N;i++){ pos[i*3] = srn(-30,30); pos[i*3+1] = srn(-14,16); pos[i*3+2] = srn(-30,8); const c = pal[i % pal.length]; col[i*3] = c.r*.5; col[i*3+1] = c.g*.5; col[i*3+2] = c.b*.5; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); dg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({size:.2, map:GLOW, vertexColors:true, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending}));
  scene.add(dust);
  // eritrocitos: discos bicóncavos
  const pts = [];
  for (let i=0;i<=20;i++){ const r = i/20, h = .12 + .28*r*r - .2*Math.pow(r, 8); pts.push(new THREE.Vector2(r, h)); }
  for (let i=20;i>=0;i--){ const r = i/20, h = .12 + .28*r*r - .2*Math.pow(r, 8); pts.push(new THREE.Vector2(r, -h)); }
  const rbcG = new THREE.LatheGeometry(pts, 48), rbcM = mem(0x8a1426, {rim:0xff6a6a, rimK:.35, rough:.55, emiK:.08, bumpScale:.008});
  const drifters = [];
  for (let i=0;i<9;i++){ const m = mesh(rbcG, rbcM); m.position.set(srn(-34,34), srn(-12,14), srn(-48,-30)); m.scale.setScalar(srn(1.5,2.1)); m.rotation.set(srn(0,3), srn(0,3), srn(0,3));
    m.userData = {spin:V(srn(-.2,.2), srn(-.2,.2), srn(-.2,.2)), drift:srn(.15,.4)}; scene.add(m); drifters.push(m); }
  // plaquetas
  const plM = mem(0xe8c8d8, {rim:0xffffff, rimK:.5, emiK:.2, bumpScale:.04});
  for (let i=0;i<7;i++){ const m = blob(.32, plM, {w:16, h:10, shape:v => { v.y *= .35; v.x *= 1 + .2*Math.sin(v.z*9); }}); m.position.set(srn(-24,24), srn(-9,11), srn(-26,-14)); m.rotation.set(srn(0,3), srn(0,3), 0);
    m.userData = {spin:V(srn(-.3,.3), srn(-.3,.3), 0), drift:srn(.2,.5)}; scene.add(m); drifters.push(m); }
  // anticuerpos libres
  const abM = mem(0xc99a3a, {emiK:.2, bump:false});
  for (let i=0;i<9;i++){ const y = antibody(abM, srn(.6,.9)); y.position.set(srn(-16,16), srn(-7,9), srn(-18,-8)); y.rotation.set(srn(0,6), srn(0,6), srn(0,6));
    y.userData = {spin:V(srn(-.5,.5), srn(-.5,.5), srn(-.5,.5)), drift:srn(.1,.3)}; scene.add(y); drifters.push(y); }
  // hebras de fibrina al fondo
  const fbM = mem(0xd9c2a0, {op:.35, rimA:.4, bump:false});
  for (let i=0;i<6;i++){ const a = V(srn(-30,30), srn(-12,14), srn(-40,-26)), b = V(srn(-30,30), srn(-12,14), srn(-40,-26)), m = a.clone().lerp(b, .5).add(V(srn(-4,4), srn(-4,4), srn(-2,2)));
    scene.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, m, b]), 30, .06, 5), fbM, 1)); }
  // haces de luz del condensador
  const shafts = [];
  for (let i=0;i<4;i++){ const m = new THREE.Mesh(new THREE.PlaneGeometry(3 + i, 44), new THREE.MeshBasicMaterial({map:SHAFT, color:0x5fb8ff, transparent:true, opacity:.035, blending:THREE.AdditiveBlending, depthWrite:false, fog:false}));
    m.position.set(-9 + i*6, 6, -19 - i*2); m.rotation.z = .35; scene.add(m); shafts.push(m); }
  const U = sky.material.uniforms;
  return {dark:U.dark, tint:U.tint, quality(lv){ dust.visible = lv > 0; drifters.forEach((m, i) => m.visible = lv > 1 || i % 2 === 0); shafts.forEach(s => s.visible = lv > 0); },
    up(t, dt, mot){
    U.t.value = t;
    dust.rotation.y = t*.01*mot; dust.position.y = Math.sin(t*.2)*.3;
    drifters.forEach(m => { const u = m.userData; m.rotation.x += u.spin.x*dt*mot; m.rotation.y += u.spin.y*dt*mot; m.rotation.z += u.spin.z*dt*mot; m.position.x += u.drift*dt*mot; if (m.position.x > 36) m.position.x = -36; });
    shafts.forEach((s, i) => { s.material.opacity = (.028 + .02*Math.sin(t*.3 + i))*(1 - U.dark.value); s.rotation.z = .35 + Math.sin(t*.07 + i)*.04; });
  }};
})();

/* ---------- Tu célula en escena ---------- */
let PL = buildMacrophage();
let player = PL.g;
player.position.copy(P_POS); scene.add(player);
function rebuildPlayer(){
  const pos = player.position.clone(); scene.remove(player);
  PL = buildMacrophage(S.cell, SKINS[S.skin].col, S.evos, S.upg); player = PL.g; player.position.copy(pos); scene.add(player);
  player.scale.setScalar(1 + .025*Math.min(S.evos, 12)); // tu linaje crece con cada evolución
  pLight.color.setHex(SKINS[S.skin].col); delete thumbCache.me;
}

let foeObj = null;  // modelo del enemigo al que apuntas
let FOES = [];      // [{e, obj}] todos los enemigos del combate
// huecos de cada enemigo respecto al centro (en horizontal y en vertical)
const SLOTS = {1:[[0,0,0]], 2:[[-.55,1,-.4],[.8,-.85,.3]], 3:[[-.8,1.2,-.5],[1.1,.15,-.1],[-.15,-1.1,.45]]};
const SLOTS_P = {1:[[0,0,0]], 2:[[-.3,.25,-.3],[.65,-1,.2]], 3:[[-.6,.4,-.4],[1.05,-.4,-.1],[-.15,-1.55,.35]]};
const foeScale = n => n === 1 ? 1 : n === 2 ? .74 : PORTRAIT ? .56 : .62;
function buildFoe(e, n){
  const o = BUILD[e.var && VARIANTS[e.var].vis.model || e.type](e);
  if (e.var) variantLook(o, VARIANTS[e.var]);
  if (e.blind) variantLook(o, {col:0xa0aab4, vis:{tint:.85}}); // sin teñir: solo se ve la forma
  const s = (e.boss ? 1.45 : 1)*foeScale(n);
  if (e.boss){ // aura del jefe
    const aura = new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW, color:TY(e).col, transparent:true, opacity:.22, depthWrite:false, blending:THREE.AdditiveBlending}));
    aura.scale.setScalar(5); o.g.add(aura); }
  o.g.scale.setScalar(.01); o.base = s; scene.add(o.g);
  tween(500, p => o.g.scale.setScalar(s*easeOut(p)));
  return o;
}
function layoutFoes(force){
  const n = FOES.length, sl = (PORTRAIT ? SLOTS_P : SLOTS)[n] || SLOTS[1];
  FOES.forEach((f, i) => { const o = sl[i] || [0,0,0]; f.e.pos = (f.e.pos || V()).copy(E_BASE).add(V(o[0], o[1], o[2])); if (force || !tweens.length) f.obj.g.position.copy(f.e.pos); });
  if (B && B.e && B.e.pos) aimAt(B.e);
}
function setFoes(es){
  FOES.forEach(f => scene.remove(f.obj.g));
  FOES = es.map(e => { const obj = buildFoe(e, es.length); e.obj = obj; return {e, obj}; });
  layoutFoes(true); aimAt(es[0]);
}
const setFoe = e => setFoes([e]);
// apunta al enemigo e: los proyectiles, los textos y la luz van hacia él
function aimAt(e){
  if (!e || !e.obj) return;
  foeObj = e.obj; E_POS.copy(e.pos);
  eLight.color.setHex(TY(e).col); eLight.intensity = e.boss ? 1.8 : 1.1; eLight.position.copy(E_POS).add(V(0,2,2));
}
function killFoeObj(e, tool){
  const o = e.obj; if (!o || o.dying) return; o.dying = true;
  const g = o.g, b = o.base, p0 = g.position.clone(), done = () => scene.remove(g);
  const mats = []; g.traverse(n => { if (n.material) [].concat(n.material).forEach(m => { if (m.color) mats.push([m, m.color.clone()]); }); });
  if (tool === 'fago'){ // fagocitosis: el organismo entra en tu célula y los lisosomas lo digieren
    tween(650, p => { const q = easeOut(p); g.position.lerpVectors(p0, P_POS, q); g.scale.setScalar(b*(1 - .85*q)); },
      () => { done(); burst(P_POS, 0xd8ff6b, 26, 1.4); floatText(tr('Digerido'), P_POS.clone().add(V(0,1.5,0)), 'great'); });
  } else if (tool === 'osm'){ // ósmosis: se hincha y revienta
    tween(520, p => g.scale.setScalar(b*(1 + .55*easeOut(p))), () => { done(); burst(p0, 0x6c95ff, 60, 5); impact(p0, 0x6c95ff); });
  } else if (tool === 'lis' || tool === 'pen' || tool === 'cel' || tool === 'iso'){ // la pared se deshace en trozos
    tween(560, p => { g.scale.set(b*(1 + .3*p), b*(1 - .7*p), b*(1 + .3*p)); g.rotation.z = p*.6; }, () => { done(); burst(p0, 0xffffff, 50, 3.5); burst(p0, TY(e).col, 40, 2.5); });
  } else if (tool === 'tc' || tool === 'ifn' || tool === 'tax'){ // apoptosis: se encoge y se rompe en burbujas
    tween(700, p => g.scale.setScalar(b*(1 - .75*easeOut(p))), () => { done(); for (let i = 0; i < 6; i++) setTimeout(() => burst(p0.clone().add(V(rnd(-.6,.6), rnd(-.6,.6), rnd(-.3,.3))), TY(e).col, 8, 1), i*60); });
  } else if (tool === 'aut'){ // desnaturalización: pierde el color y se arruga
    tween(700, p => { mats.forEach(([m, c]) => m.color.copy(c).lerp(new THREE.Color(0x8a7a6a), p)); g.scale.set(b*(1 - .3*p), b*(1 - .6*p), b*(1 - .2*p)); }, () => { done(); burst(p0, 0xc9b79c, 30, 2); });
  } else tween(450, p => g.scale.setScalar(b*(1 - easeOut(p))), done);
}
// el organismo se deforma al recibir un golpe
function squash(e){
  const o = e && e.obj; if (!o || o.dying) return;
  const g = o.g, b = o.base*(e.hp < e.max*.3 ? .9 : 1);
  tween(260, p => { const k = Math.sin(p*Math.PI)*.16; g.scale.set(b*(1 + k), b*(1 - k), b*(1 + k)); }, () => { if (!o.dying) g.scale.setScalar(b); });
}
// anticuerpos en forma de Y pegados al organismo opsonizado
function abCoat(o, on){
  if (on && !o.ab){ const grp = new THREE.Group(), m = mem(0xffd36b, {emiK:.7, bump:false});
    fibDirs(14).forEach(d => { const y = new THREE.Group();
      const st = mesh(new THREE.CylinderGeometry(.018, .018, .16, 4), m); st.position.y = .08; y.add(st);
      [-1, 1].forEach(s => { const a = mesh(new THREE.CylinderGeometry(.015, .015, .12, 4), m); a.position.set(s*.04, .2, 0); a.rotation.z = -s*.6; y.add(a); });
      y.position.copy(d.clone().multiplyScalar(1.05)); y.quaternion.setFromUnitVectors(V(0,1,0), d); grp.add(y); });
    o.ab = grp; o.g.add(grp); }
  if (!on && o.ab){ o.g.remove(o.ab); o.ab = null; }
}
// sacudida de cámara: acercamiento breve en los golpes importantes
let ZK = 1;
function camPunch(k){ if (S.calm || reduceMotion) return; tween(420, p => { ZK = 1 - (1 - k)*Math.sin(p*Math.PI); applyCam(); }, () => { ZK = 1; applyCam(); }); }
// anillo que señala al objetivo cuando hay varios enemigos
const TMARK = new THREE.Mesh(new THREE.TorusGeometry(1.3, .035, 6, 64), new THREE.MeshBasicMaterial({color:0xffc65c, transparent:true, opacity:.7, depthWrite:false}));
TMARK.visible = false; scene.add(TMARK);
function stepFoes(t, mot){
  for (const f of FOES) if (!f.e.dead){ f.obj.up(t*mot, f.e); abCoat(f.obj, f.e.marked > 0); }
  if (!tweens.length){ const far = S.range === 'far'; player.position.lerp(P_POS.clone().add(V(far ? -.9 : 0, far ? -.15 : 0, far ? -.4 : 0)), .08); }
  const many = B && B.es && B.es.filter(x => !x.dead).length > 1;
  TMARK.visible = !!many && !!foeObj;
  if (TMARK.visible){ TMARK.position.lerp(E_POS, .25); TMARK.scale.setScalar(foeObj.base*(1 + .04*Math.sin(t*3))); TMARK.rotation.z = t*.6; TMARK.material.opacity = .45 + .25*Math.sin(t*3); }
}
// tocar un enemigo en la escena lo convierte en el objetivo
canvas.addEventListener('pointerdown', ev => {
  if (!B || !B.es || B.es.filter(x => !x.dead).length < 2) return;
  const r = canvas.getBoundingClientRect(); let best = -1, bd = 1e9;
  B.es.forEach((x, i) => { if (x.dead) return; const v = x.pos.clone().project(camera);
    const dx = (v.x + 1)/2*r.width - (ev.clientX - r.left), dy = (1 - v.y)/2*r.height - (ev.clientY - r.top), d = Math.hypot(dx, dy);
    if (d < bd){ bd = d; best = i; } });
  if (best >= 0 && bd < 160) selectTarget(best);
});

// Variantes: el mismo modelo con su característica cambiada a la vista
function variantLook(o, Vr){
  const vis = Vr.vis || {}, c = new THREE.Color(Vr.col), k = vis.tint != null ? vis.tint : .35;
  o.g.updateMatrixWorld(true);
  const sph = new THREE.Box3().setFromObject(o.g).getBoundingSphere(new THREE.Sphere()), r = Math.min(sph.radius, 1.6);
  o.g.traverse(n => { const ms = n.material ? [].concat(n.material) : []; ms.forEach(m => {
    if (m.color) m.color.lerp(c, k);
    if (m.emissive) m.emissive.lerp(c.clone().multiplyScalar(.25), k);
    if (m.userData && m.userData.U) m.userData.U.rimC.value.lerp(c, k);
    if (vis.ghost && m.opacity != null){ m.transparent = true; m.opacity *= .72; m.depthWrite = false; }
  }); });
  const add = [];
  if (vis.shell){ // capa extra: membrana externa o caparazón
    const sh = new THREE.Mesh(new THREE.IcosahedronGeometry(r*1.08, 2), mem(vis.shell, {op:.16, rimA:.9, rimK:1.6, flat:true, side:THREE.DoubleSide, bump:false}));
    sh.position.copy(sph.center); add.push(sh);
  }
  if (vis.spikes){ // flagelos y prolongaciones nuevas
    const mat = mem(vis.spikes, {emiK:.2, rimK:.8});
    for (let i = 0; i < 7; i++){
      const d = V(Math.cos(i*2.4), Math.sin(i*1.7)*.8, Math.sin(i*2.4)).normalize();
      const pts = []; for (let j = 0; j <= 8; j++){ const t = j/8; pts.push(d.clone().multiplyScalar(r*(.85 + t*.75)).add(V(0, Math.sin(t*6 + i)*.08*t, Math.cos(t*6 + i)*.08*t))); }
      const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, .025, 5), mat);
      m.position.copy(sph.center); add.push(m);
    }
  }
  if (vis.dots){ // partículas: cloroplastos o ribosomas de sobra
    const [col, n, sz] = vis.dots, im = new THREE.InstancedMesh(new THREE.SphereGeometry(sz, 7, 5), mem(col, {emiK:.55, bump:false}), n), M = new THREE.Matrix4();
    SEED = 91; for (let i = 0; i < n; i++){ const d = V(srn(-1, 1), srn(-1, 1), srn(-1, 1)).normalize().multiplyScalar(r*.72*Math.cbrt(sr())); M.makeTranslation(d.x, d.y, d.z); im.setMatrixAt(i, M); }
    im.position.copy(sph.center); add.push(im);
  }
  add.forEach(m => o.g.add(m));
  if (vis.soft){ const w = o.up; o.up = (t, e) => { w(t, e); o.g.children.forEach((c, i) => c.scale.set(1 + .06*Math.sin(t*2.2 + i), 1 - .05*Math.sin(t*2.2 + i), 1)); }; }
  if (vis.mirror){ // imagen especular: toda la célula reflejada
    const inner = new THREE.Group(); [...o.g.children].forEach(ch => inner.add(ch)); inner.scale.x = -1; o.g.add(inner);
    o.g.traverse(n => { if (n.material) [].concat(n.material).forEach(m => { m.side = THREE.DoubleSide; }); });
  }
  const spin = o.up;
  if (vis.shell || vis.spikes) o.up = (t, e) => { spin(t, e); add.forEach((m, i) => m.rotation.y = Math.sin(t*.6 + i)*.15); };
}

// ---- Miniaturas para el Atlas y las fichas (renderizador aparte) ----
const thumbCache = {};
let TR = null, TS = null, TC = null;
function thumb(id){
  if (thumbCache[id]) return thumbCache[id];
  try{
    if (!TR){
      TR = new THREE.WebGLRenderer({antialias:true, alpha:true, preserveDrawingBuffer:true});
      TR.setPixelRatio(1); TR.setSize(256, 256); TR.outputEncoding = THREE.sRGBEncoding; TR.toneMapping = THREE.ACESFilmicToneMapping; TR.toneMappingExposure = 1.2;
      TS = new THREE.Scene(); TS.add(new THREE.HemisphereLight(0x9fd0ff, 0x1a0820, .7));
      const d = new THREE.DirectionalLight(0xffffff, .8); d.position.set(-3,4,6); TS.add(d);
      const b = new THREE.DirectionalLight(0x6c95ff, 1); b.position.set(2,2,-6); TS.add(b);
      TC = new THREE.PerspectiveCamera(32, 1, .1, 100);
    }
    const Vr = VARIANTS[id], fake = {type:Vr ? Vr.base : id, grow:1, hidden:false, dark:false, block:0, spore:false};
    const o = id === 'me' ? buildMacrophage(S.cell, SKINS[S.skin].col, S.evos, S.upg) : BUILD[Vr && Vr.vis.model || fake.type](fake);
    if (Vr) variantLook(o, Vr);
    o.up(2, fake); TS.add(o.g); o.g.updateMatrixWorld(true);
    const sph = new THREE.Box3().setFromObject(o.g).getBoundingSphere(new THREE.Sphere());
    const bt = Vr ? Vr.base : id, r = Math.min(sph.radius, bt === 'veg' ? 1.7 : bt === 'can' ? 1.6 : 9);
    const dist = r/Math.sin(THREE.MathUtils.degToRad(16))*.8;
    TC.position.copy(sph.center).add(V(-.25,.3,1).normalize().multiplyScalar(dist)); TC.lookAt(sph.center);
    TR.render(TS, TC);
    const url = TR.domElement.toDataURL('image/png');
    TS.remove(o.g);
    thumbCache[id] = url; return url;
  }catch(_){ return ''; }
}

// ---- Animaciones (tweens y partículas) ----
const tweens = [];
const easeOut = p => 1 - Math.pow(1-p, 3);
function tween(ms, fn, done){ tweens.push({t0:performance.now(), ms:ms/Math.max(1, (B && S.auto ? speed() : 1)), fn, done}); }
const parts = [];
function spark(pos, vel, color, life=.8, size=.35){
  const m = new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW, color, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending}));
  m.position.copy(pos); m.scale.setScalar(size); scene.add(m);
  parts.push({m, vel, life, max:life});
}
function burst(pos, color, n=24, sp=3){
  n = Math.round(n*(S.calm ? .35 : 1)*(QL === 0 ? .5 : 1));
  for (let i=0;i<n;i++) spark(pos, V(rnd(-1,1), rnd(-1,1), rnd(-1,1)).normalize().multiplyScalar(rnd(.5, sp)), color, rnd(.4,.9), rnd(.2,.45));
}
// onda de choque al acertar de lleno
function impact(pos, color){
  const m = new THREE.Sprite(new THREE.SpriteMaterial({map:RING, color, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending}));
  m.position.copy(pos); scene.add(m);
  tween(520, p => { m.scale.setScalar(.4 + p*3.6); m.material.opacity = 1 - p; }, () => { scene.remove(m); m.material.dispose(); });
}
// anillo que se expande desde un punto (señalización, centrosoma, compras)
function ring(pos, color, size=3.4, ms=700){
  const m = new THREE.Sprite(new THREE.SpriteMaterial({map:RING, color, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending}));
  m.position.copy(pos); scene.add(m);
  tween(ms, p => { m.scale.setScalar(.6 + p*size); m.material.opacity = (1 - p)*.8; }, () => { scene.remove(m); m.material.dispose(); });
}
// efecto al mejorar un orgánulo: destello del color del orgánulo y un pulso de la célula
function organelleFx(col, name){
  ring(P_POS, col, 4, 900); burst(P_POS, col, 30, 2.5);
  const s0 = player.scale.x; tween(600, p => player.scale.setScalar(s0*(1 + .12*Math.sin(p*Math.PI))), () => player.scale.setScalar(s0));
  floatText(name, P_POS.clone().add(V(0,1.7,0)), 'evt ev-org');
}
// proyectiles con forma propia de cada herramienta
const PM = {};
const pmat = (k, f) => PM[k] || (PM[k] = f());
function pac(col){ const m = mesh(new THREE.SphereGeometry(.13, 16, 12, .5, Math.PI*2 - 1), pmat('pac'+col, () => mem(col, {emiK:.5, side:THREE.DoubleSide, bump:false}))); m.userData.chomp = p => m.scale.y = .75 + .25*Math.abs(Math.sin(p*30)); return m; }
const PROJ = {
  lis: () => pac(0x9be7ff),
  cel: () => pac(0x5dff8a),
  pen: () => { const g = new THREE.Group(); g.add(mesh(capG(.14, .06, 12, 4), pmat('penw', () => mem(0xffffff, {emiK:.4, bump:false}))));
    const b = mesh(new THREE.CylinderGeometry(.063, .063, .08, 12), pmat('peng', () => mem(0x4dffa0, {emiK:.6, bump:false}))); b.position.y = .04; g.add(b); return g; },
  uv: () => mesh(new THREE.CylinderGeometry(.015, .015, .9, 5).rotateX(Math.PI/2), pmat('uv', () => new THREE.MeshBasicMaterial({color:0xd2b4ff, transparent:true, opacity:.9, blending:THREE.AdditiveBlending, depthWrite:false}))),
  ac: () => antibody(pmat('ac', () => mem(0xffd36b, {emiK:.6, bump:false})), .55),
  anf: () => mesh(capG(.14, .03, 8, 3), pmat('anf', () => mem(0xff9f6b, {emiK:.6, bump:false}))),
  osm: () => mesh(sphG(.09, 14, 10), pmat('osm', () => mem(0x6c95ff, {op:.7, rim:0xd8f0ff, rimK:1.2, rimA:.8, bump:false}))),
  tc: () => { const g = new THREE.Group(); g.add(mesh(sphG(.24, 20, 14), pmat('tc', () => mem(0xff6fd8, {rim:0xffc8f0, rimK:1, bumpScale:.04}))));
    g.add(inst(new THREE.CylinderGeometry(.015, .015, .09, 4).translate(0, .045, 0), pmat('tcr', () => mem(0xffe0f6, {emiK:.5, bump:false})), fibDirs(30).map(d => ({p:d.clone().multiplyScalar(.23), n:d})))); return g; },
  tax: () => mesh(capG(.1, .025, 8, 3), pmat('tax', () => mem(0xff4f7b, {emiK:.6, bump:false}))),
};
function projectile(from, to, color, n, ms, cb, kind){
  const fac = PROJ[kind], shots = [];
  const cnt = kind === 'tc' ? 1 : kind === 'uv' ? 7 : n;
  for (let i=0;i<cnt;i++){
    const o = new THREE.Group();
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW, color, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending}));
    glow.scale.setScalar(fac ? .5 : rnd(.25,.5)); o.add(glow);
    if (fac){ const m = fac(); o.add(m); o.userData.m = m; }
    o.visible = false; scene.add(o);
    shots.push({o, off:V(rnd(-.4,.4), rnd(-.4,.4), rnd(-.4,.4)), d:i/cnt*.35, arc:kind === 'uv' ? rnd(0,.2) : rnd(.5,1.4), spin:V(rnd(-.1,.1), rnd(-.1,.1), rnd(-.1,.1))});
  }
  tween(ms, p => { shots.forEach(s => { const q = clamp((p - s.d)/(1 - .35), 0, 1);
      s.o.position.lerpVectors(from, to, q).addScaledVector(s.off, Math.sin(q*Math.PI)); s.o.position.y += Math.sin(q*Math.PI)*s.arc; s.o.visible = q > 0 && q < 1;
      const m = s.o.userData.m;
      if (m){ if (kind === 'uv') m.lookAt(to); else { m.rotation.x += s.spin.x; m.rotation.y += s.spin.y; m.rotation.z += s.spin.z; } if (m.userData.chomp) m.userData.chomp(p); } }); },
    () => { shots.forEach(s => { scene.remove(s.o); s.o.children[0].material.dispose(); }); cb && cb(); });
}
function lunge(obj, dir, ms, cb){
  const o = obj.position.clone();
  tween(ms, p => obj.position.copy(o).addScaledVector(dir, Math.sin(p*Math.PI)), () => { obj.position.copy(o); cb && cb(); });
}
let shake = 0;

// ---- Números flotantes ----
const floats = $('#floats');
function worldToScreen(v){
  const p = v.clone().project(camera);
  return [(p.x*.5 + .5)*canvas.clientWidth, (-p.y*.5 + .5)*canvas.clientHeight];
}
function floatText(txt, pos, cls, col){
  const [x, y] = worldToScreen(pos);
  const d = document.createElement('div'); d.className = 'ft ' + cls; d.textContent = txt;
  if (col != null && /great|dmg/.test(cls)) d.style.color = hex(col);
  d.style.left = (x + rnd(-24,24)) + 'px'; d.style.top = (y + rnd(-10,10)) + 'px';
  floats.appendChild(d); setTimeout(() => d.remove(), 1700);
}

// ---- Cámara y tamaño ----
const LOOK = V(0, .2, 0);
const CAMT = {dist:9, off:0, w:1, h:1}, CAMC = {dist:9, off:0, ok:false};
function applyCam(){ camera.position.set(-.5, 1.7, CAMC.dist*(typeof ZK === 'number' ? ZK : 1)); camera.setViewOffset(CAMT.w, CAMT.h, 0, Math.round(CAMC.off), CAMT.w, CAMT.h); camera.updateProjectionMatrix(); }
function stepCam(dt){
  if (Math.abs(CAMT.dist - CAMC.dist) < .002 && Math.abs(CAMT.off - CAMC.off) < .5) return;
  const k = Math.min(1, dt*5); CAMC.dist += (CAMT.dist - CAMC.dist)*k; CAMC.off += (CAMT.off - CAMC.off)*k; applyCam();
}
let lastFoeH = 0;
function resize(){
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false); camera.aspect = w/h;
  // en vertical, las dos células se colocan en diagonal y la cámara se aleja lo justo para que quepan a lo ancho
  const a = w/h, portrait = a < .9;
  PORTRAIT = portrait;
  if (portrait){ P_POS.set(-1.3,-1.6,.9); E_BASE.set(1.3,1.1,-.5); } else { P_POS.set(-2.3,-.1,.9); E_BASE.set(2.3,.25,-.5); }
  if (!FOES.length) E_POS.copy(E_BASE);
  // franja libre entre las fichas: la escena se encuadra en ella
  document.documentElement.style.setProperty('--toolsH', $('#tools').offsetHeight + 'px');
  document.documentElement.style.setProperty('--hudH', $('#hud').offsetHeight + 'px');
  const r = el => $(el).getBoundingClientRect();
  const top = portrait ? r('#foe').bottom : Math.max(r('#hud').bottom, r('#foe').bottom - 70);
  document.documentElement.style.setProperty('--foeB', Math.round(r('#foe').bottom) + 'px');
  // un elemento oculto (modo «ver la batalla») no cuenta para el encuadre
  const topOf = el => { const n = $(el); return n && n.offsetParent !== null ? n.getBoundingClientRect().top : h; };
  document.documentElement.style.setProperty('--narrB', Math.round(h - Math.min(topOf('#msg'), topOf('#me')) + 6) + 'px');
  lastFoeH = $('#foe').offsetHeight;
  const bot = Math.min(topOf('#msg'), topOf('#me'));
  const band = Math.max(140, bot - top);
  const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
  const halfW = portrait ? 2.7 : 4.2, halfH = portrait ? 2.9 : 2.1;
  const dist = Math.max(8, halfW/(tanV*a), halfH*(h/band)/tanV);
  // destino del encuadre; si solo cambian las fichas, la cámara llega suavemente (stepCam), si cambia la ventana, de golpe
  const snap = !CAMC.ok || CAMT.w !== w || CAMT.h !== h;
  CAMT.dist = dist; CAMT.off = h/2 - (top + bot)/2; CAMT.w = w; CAMT.h = h;
  if (snap){ CAMC.dist = CAMT.dist; CAMC.off = CAMT.off; CAMC.ok = true; }
  LOOK.set(0, (P_POS.y + E_BASE.y)/2, 0);
  applyCam();
  if (!tweens.length) player.position.copy(P_POS);
  layoutFoes();
  pLight.position.copy(P_POS).add(V(0,2,2));
  eLight.position.copy(E_POS).add(V(0,2,2));
}
window.addEventListener('resize', resize);

