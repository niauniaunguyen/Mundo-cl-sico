// ============================================================ CRETA (1): herramientas para los mapas de Creta (modo Atenas)
// crDest(D) añade un mapa de tierra firme cretense (posición real, caminos con sus vecinos, estelas con fuentes, personaje, vida).
// mnSite(I,o) levanta un yacimiento minoico dos veces sobre la misma planta: como ruina (lo que se ve en el 386 a.C.: muros bajos, olivos)
// y como reconstrucción (cómo pudo ser hacia el 1600 a.C.); el objeto «Imaginarlo» cambia de una a otra. Los muros chocan igual en los dos
// modos. Las reconstrucciones son hipotéticas y se dice: se basan en las plantas excavadas y en las pinturas (Evans, Graham, Shaw).
// Colocación con posiciones fijas y forRng: no toca R().
const CRX={sites:{},anim:[],t:0,on:null};
const MNM={stone:lam('#b9ab8c'),ashlar:lam('#cdbf9f'),gyps:lam('#e6e0d2'),plaster:lam('#e9dfc8'),red:lam('#9e3b2a'),black:lam('#2a2420'),ochre:lam('#c9a24a'),blue:lam('#3f6f8f'),
  wood:lam('#7a5232'),earth:lam('#a08a62'),pave:lam('#cfc3a6'),clay:lam('#b4703e'),dark:lam('#1c1612'),roof:lam('#bfae8a'),water:lam('#4f8a96')};
// gente minoica de las pinturas: ellos con faldellín y piel rojiza; ellas con falda de volantes y piel clara (convención de pintura, como en Egipto)
const MN_LOOK={hombre:{short:true,noHimation:true,chiton:'#b53a2a',skin:'#9a5a34',hair:'#1a1210',noVary:true},hombre2:{short:true,noHimation:true,chiton:'#2f5f8f',skin:'#9a5a34',hair:'#1a1210',noVary:true},
  mujer:{female:true,chiton:'#2f5f8f',himation:'#c9a24a',skin:'#ecd2b4',hair:'#1a1210',noVary:true},mujer2:{female:true,chiton:'#b53a2a',himation:'#e8d8a8',skin:'#ecd2b4',hair:'#1a1210',noVary:true},
  sacerdotisa:{female:true,chiton:'#e8d8a8',himation:'#7a3a6a',skin:'#ecd2b4',hair:'#1a1210',noVary:true},
  campesino:{short:true,noHimation:true,chiton:'#8a7a5a',hair:'#2a1e14',beard:true},campesina:{female:true,chiton:'#7a6a50',himation:'#5a4a38',hair:'#2a1e14'}};
// ---- un mapa cretense
function crDest(D){if(typeof ISLANDS==='undefined')return;const I0=Object.assign({id:D.id,land:true,step:8,dir:[0,1]},D.isl);if(!ISLANDS.some(q=>q.id===D.id)){const i=ISLANDS.length;ISLANDS.push(I0);
    I0.x=ISL0+i*ISLD;I0.z=0;I0.pads=[];I0.blobs=[];const l=Math.hypot(I0.dir[0],I0.dir[1])||1;I0.dir=[I0.dir[0]/l,I0.dir[1]/l];}
  MED_POS[D.id]=D.pos;for(const l of D.links||[])WORLD_LINKS.atenas.push(l);
  for(const s of D.steles||[])if(s[4])PSRC[s[0]]=s[4];
  SIMPLE_GR[D.id]=Object.assign({early:true,label:D.label||null},D.cfg||{},{npc:D.npc?D.npc.id:undefined,steles:(D.steles||[]).map(s=>s.slice(0,4)),
    extra(I){try{if(D.build)D.build(I);}catch(e){console.warn('creta',D.id,e);}if(D.vida)vidaComun(I,D.vida);}});
  if(!SIMPLE_GR[D.id].label)delete SIMPLE_GR[D.id].label;if(!SIMPLE_GR[D.id].npc)delete SIMPLE_GR[D.id].npc;
  if(D.npc)destNPC(D.npc,D.src||{a:[],m:[]});
  if(D.trav&&typeof NAT_TRAV!=='undefined')NAT_TRAV[D.id]=D.trav;
  if(D.fauna&&typeof NAT_FA!=='undefined')NAT_FA[D.id]=D.fauna;
  if(D.ny&&typeof NAT_NY!=='undefined')NAT_NY[D.id]=D.ny;
  if(D.forest)RD_MAPS.push(D.id);}
// ---- textos de los objetos (crx:clave → [título, subtítulo, lo que se dice o se ve, lo que sabemos hoy, fuente])
const CRX_TX={};
function crObj(x,z,key,r,g){const T=CRX_TX[key];if(!T)return null;const o=egxObj(x,z,undefined,'crx:'+key,T[0],T[1],r||3);if(g)o.g=g;return o;}
function crAct(o){const k=String(o.act).slice(4);if(k.startsWith('ver:'))return mnVision(k.slice(4));const T=CRX_TX[k];if(!T)return;
  if(!state.seen['crx:'+k]){state.seen['crx:'+k]=1;qAdd('so',1,'Aprendes algo de la Creta antigua.');save();}
  return vmS(T[5]||'🏺',T[0],T[1],'<p>'+T[2]+'</p>'+(T[3]?'<p class="sub"><b>Lo que sabemos hoy.</b> '+T[3]+'</p>':'')+(T[4]?'<p class="src">'+T[4]+'</p>':''),[vmBye]);}
{const e0=egxAct0;egxAct0=function(o){if(String(o.act).startsWith('crx:'))return crAct(o);return e0.apply(this,arguments);};}
// ---- piezas sueltas (en un grupo g con coordenadas locales)
function mnColumn(g,x,z,h,y){h=h||3.4;y=y||0;const c=new THREE.Mesh(new THREE.CylinderGeometry(0.34,0.24,h,12),MNM.red);c.position.set(x,y+h/2,z);c.castShadow=true;g.add(c);   // la columna minoica: más ancha arriba que abajo
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(0.46,0.38,0.32,14),MNM.black);cap.position.set(x,y+h+0.16,z);g.add(cap);box(0.95,0.18,0.95,MNM.black,x,y+h+0.41,z,g);
  const b=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.42,0.14,14),MNM.gyps);b.position.set(x,y+0.07,z);g.add(b);}
function mnBase(g,x,z){const b=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.44,0.16,12),MNM.stone);b.position.set(x,0.08,z);g.add(b);}   // en la ruina solo queda la basa de piedra
function mnHorns(g,x,y,z,s,a){s=s||1;const h=new THREE.Group();h.position.set(x,y,z);h.rotation.y=a||0;h.scale.setScalar(s);g.add(h);box(1.2,0.22,0.4,MNM.plaster,0,0.11,0,h);   // los «cuernos de consagración» (nombre de Evans)
  for(const sg of[-1,1]){const k=new THREE.Mesh(new THREE.ConeGeometry(0.17,0.75,8),MNM.plaster);k.position.set(sg*0.42,0.55,0);k.rotation.z=-sg*0.28;h.add(k);}return h;}
function mnLabrys(g,x,y,z,s){s=s||1;const L=new THREE.Group();L.position.set(x,y,z);L.scale.setScalar(s);g.add(L);const p=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.05,1.8,6),MNM.wood);p.position.y=0.9;L.add(p);   // el hacha doble, labrys
  const gold=MNM.ochre;for(const sg of[-1,1]){const b=new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.32,0.04,3,1,false,0,Math.PI),gold);b.rotation.x=Math.PI/2;b.rotation.z=sg>0?Math.PI/2:-Math.PI/2;b.position.set(sg*0.18,1.6,0);L.add(b);}return L;}
function mnPithos(g,x,z,s,y){s=s||1;const P=new THREE.Group();P.position.set(x,y||0,z);P.scale.setScalar(s);g.add(P);const b=new THREE.Mesh(new THREE.SphereGeometry(0.6,12,10),MNM.clay);b.scale.set(1,1.45,1);b.position.y=0.85;P.add(b);
  const n=new THREE.Mesh(new THREE.CylinderGeometry(0.33,0.4,0.25,12),MNM.clay);n.position.y=1.7;P.add(n);for(let k=0;k<3;k++){const r=new THREE.Mesh(new THREE.TorusGeometry(0.62-k*0.03,0.035,4,16),lam('#8f5a30'));r.rotation.x=Math.PI/2;r.position.y=0.55+k*0.38;P.add(r);}return P;}
function mnKernos(g,x,z){const k=new THREE.Mesh(new THREE.CylinderGeometry(0.46,0.5,0.22,24),MNM.stone);k.position.set(x,0.11,z);g.add(k);   // la piedra con hoyuelos de Malia: 34 cazoletas alrededor de una mayor
  for(let i=0;i<17;i++){const a=i/17*TAU,c=new THREE.Mesh(new THREE.CircleGeometry(0.035,8),MNM.dark);c.rotation.x=-Math.PI/2;c.position.set(x+Math.cos(a)*0.38,0.225,z+Math.sin(a)*0.38);g.add(c);}
  const m=new THREE.Mesh(new THREE.CircleGeometry(0.1,12),MNM.dark);m.rotation.x=-Math.PI/2;m.position.set(x,0.225,z);g.add(m);}
function mnFresco(g,x,y,z,w,h,a,draw){const c=document.createElement('canvas');c.width=256;c.height=Math.round(256*h/w);const x2=c.getContext('2d');draw(x2,c.width,c.height);const t=new THREE.CanvasTexture(c);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=a||0;g.add(m);return m;}
// pinturas sencillas (motivos de los frescos: lirios, espirales, olas, delfines)
const MN_FR={
 lirios:(x,w,h)=>{x.fillStyle='#c9442e';x.fillRect(0,0,w,h);x.fillStyle='#e9dfc8';for(let i=0;i<5;i++){const cx=20+i*52;x.fillRect(cx,h*0.3,3,h*0.7);for(let k=0;k<3;k++){x.beginPath();x.ellipse(cx+1,h*0.3-k*6,10,5,(k-1)*0.6,0,TAU);x.fill();}}},
 espirales:(x,w,h)=>{x.fillStyle='#e9dfc8';x.fillRect(0,0,w,h);x.strokeStyle='#2f5f8f';x.lineWidth=5;for(let i=0;i<6;i++){x.beginPath();for(let t=0;t<12;t+=0.2){const r=2+t*1.4;x.lineTo(22+i*44+Math.cos(t)*r,h/2+Math.sin(t)*r);}x.stroke();}x.fillStyle='#9e3b2a';x.fillRect(0,0,w,6);x.fillRect(0,h-6,w,6);},
 delfines:(x,w,h)=>{x.fillStyle='#d8e6e6';x.fillRect(0,0,w,h);x.fillStyle='#2f5f8f';for(let i=0;i<3;i++){x.beginPath();x.ellipse(50+i*80,h*(0.35+0.25*(i%2)),30,9,-0.2,0,TAU);x.fill();x.fillStyle='#c9a24a';x.fillRect(30+i*80,h*(0.35+0.25*(i%2))-2,40,3);x.fillStyle='#2f5f8f';}},
 toro:(x,w,h)=>{x.fillStyle='#3f6f8f';x.fillRect(0,0,w,h);x.fillStyle='#e9dfc8';x.beginPath();x.ellipse(w/2,h*0.55,w*0.28,h*0.18,0,0,TAU);x.fill();x.fillRect(w*0.2,h*0.6,8,h*0.3);x.fillRect(w*0.75,h*0.6,8,h*0.3);
   x.fillStyle='#9a5a34';x.beginPath();x.ellipse(w/2,h*0.25,22,8,-0.3,0,TAU);x.fill();x.strokeStyle='#e9dfc8';x.lineWidth=3;x.beginPath();x.moveTo(w*0.22,h*0.45);x.quadraticCurveTo(w*0.1,h*0.2,w*0.18,h*0.1);x.stroke();}};
// ---- el yacimiento: o={x,z,a (orientación), walls:[[x1,z1,x2,z2,(alto relativo)]], rooms:[[cx,cz,w,d,pisos]], courts:[[cx,cz,w,d]],
// cols:[[x,z]], horns:[[x,z]], H (altura de un piso reconstruido), people:[[x,z,look,a,pose]], fresco:[[x,z,a,motivo]], extra(ruina,recon,S)}
function mnSite(I,id,o){const gx=I.x+o.x,gz=I.z+o.z,a=o.a||0,gy=o.gy!==undefined?o.gy:terrainH(gx,gz);const ruin=grp(gx,gy,gz,a),recon=grp(gx,gy,gz,a);recon.visible=false;
  const c=Math.cos(a),s=Math.sin(a),W=(lx,lz)=>[gx+lx*c+lz*s,gz-lx*s+lz*c],rnd=forRng((Math.abs(gx*0.0137+gz*0.0071))%1),H=o.H||3.6,S={id,I,ruin,recon,W,gy,name:o.name,txt:o.txt};
  // suelo: patios enlosados (en los dos modos) y un zócalo para que nada flote en la ladera
  for(const[cx,cz,w,d]of o.courts||[]){const p=new THREE.Mesh(new THREE.PlaneGeometry(w,d),MNM.pave);p.rotation.x=-Math.PI/2;p.position.set(cx,0.04,cz);p.receiveShadow=true;ruin.add(p);const p2=p.clone();recon.add(p2);}
  if(o.plinth){const[w,d]=o.plinth;box(w,3,d,MNM.earth,0,-1.48,0,ruin);box(w,3,d,MNM.earth,0,-1.48,0,recon);}
  for(const wl of o.walls||[]){const[x1,z1,x2,z2,hr]=wl,len=Math.hypot(x2-x1,z2-z1),ang=Math.atan2(x2-x1,z2-z1),mx=(x1+x2)/2,mz=(z1+z2)/2,th=wl[5]||0.8;
    const hR=0.35+rnd()*1.0,b=box(th,hR,len+th,MNM.stone,mx,hR/2,mz,ruin);b.rotation.y=ang;   // ruina: muros a media altura, irregulares
    const hh=H*(hr||1),r=box(th,hh,len+th,MNM.plaster,mx,hh/2,mz,recon);r.rotation.y=ang;const d=box(th+0.04,0.5,len+th,MNM.red,mx,0.25,mz,recon);d.rotation.y=ang;   // reconstrucción: enlucido con zócalo rojo
    const ba=box(th+0.05,0.18,len+th,MNM.wood,mx,hh*0.62,mz,recon);ba.rotation.y=ang;   // las vigas de madera dentro de los muros, contra los terremotos
    const A=W(x1,z1),B=W(x2,z2);addSeg(A[0],A[1],B[0],B[1],th/2+0.15);}
  for(const[cx,cz,w,d,fl]of o.rooms||[]){const top=H*(fl||1);box(w,0.3,d,MNM.roof,cx,top+0.15,cz,recon);box(w+0.3,0.12,d+0.3,MNM.red,cx,top+0.36,cz,recon);}   // azoteas planas
  for(const[x,z]of o.cols||[]){mnBase(ruin,x,z);mnColumn(recon,x,z,H*0.92);const p=W(x,z);addCirc(p[0],p[1],0.35);}
  for(const[x,z,y]of o.horns||[])mnHorns(recon,x,(y!==undefined?y:H)+0.45,z,1.1);
  for(const[x,z,ang,mot]of o.fresco||[])mnFresco(recon,x,1.9,z,3.2,1.4,ang,MN_FR[mot]||MN_FR.espirales);
  for(const[x,z,look,ang,pose]of o.people||[]){const p=makePerson(Object.assign({},MN_LOOK[look]||MN_LOOK.hombre));p.position.set(x,0,z);p.rotation.y=ang||0;p.userData.noSnap=true;recon.add(p);if(pose)try{personPose(p,pose);}catch(e){}CRX.anim.push(p);}
  if(o.extra)o.extra(ruin,recon,S);
  // los olivos y la tierra que han cubierto la ruina en el 386
  for(let i=0;i<(o.olives||0);i++){const lx=(rnd()-0.5)*(o.span||60)*1.6,lz=(rnd()-0.5)*(o.span||60)*1.6,p=W(lx,lz);if(Math.abs(lx)<(o.fw||60)/2+3&&Math.abs(lz)<(o.fd||60)/2+3)continue;if(isFree(p[0],p[1],1.5)&&typeof treesGLB==='function')treesGLB([{x:p[0],z:p[1],kind:'olive',k:0.9}]);}   // alrededor, no dentro: en la reconstrucción no puede haber un olivo en el patio
  footprints.push({x:gx,z:gz,w:o.fw||60,d:o.fd||60,a,c:'#cdbf9f',name:o.name});
  CRX.sites[id]=S;
  if(o.see){const p=W(o.see[0],o.see[1]);const st=grp(p[0],terrainH(p[0],p[1]),p[1],a);box(0.5,1.1,0.5,MNM.ashlar,0,0.55,0,st);mnHorns(st,0,1.1,0,0.45);egxObj(p[0],p[1],undefined,'crx:ver:'+id,'Imaginarlo','cómo era hacia el '+(o.when||'1600 a.C.'),3);}
  return S;}
// «Imaginarlo»: pasar de la ruina a la reconstrucción
function mnVision(id){const S=CRX.sites[id];if(!S)return;const on=!S.recon.visible;
  const go=()=>{const f=()=>{S.recon.visible=on;S.ruin.visible=!on;CRX.on=on?id:null;};if(typeof swFade==='function')swFade(f);else f();
    if(on&&!state.seen['crx:ver:'+id]){state.seen['crx:ver:'+id]=1;qAdd('so',1,'Imaginas el pasado con lo que dicen las piedras.');save();}};
  if(!on){go();return toast('Vuelves a ver las ruinas, como están en el 386 a.C.');}
  return vmS('👁',S.name||'Imaginarlo','cómo pudo ser',(S.txt?'<p>'+S.txt+'</p>':'')+'<p class="sub">Lo que vas a ver es una <b>reconstrucción hipotética</b>: la planta es la de las excavaciones, pero las alturas, los colores y la gente se basan en las pinturas y en comparaciones. En el 386 a.C. nadie sabía ya cómo había sido: solo quedaban ruinas y leyendas.</p>',
    [['Imaginarlo',()=>{closeDialog();go();}],vmBye]);}
function crxTick(dt){if(!CRX.on||!CRX.anim.length)return;const t=performance.now()/1000;for(const p of CRX.anim){const ar=p.userData.arms;if(!ar||!p.parent||!p.parent.visible||p.userData.sitting)continue;ar[0].rotation.x=-0.3+0.25*Math.sin(t*1.3+p.position.x);ar[1].rotation.x=-0.3+0.25*Math.sin(t*1.1+p.position.z);}}
// ---- ayudas de colocación
function crPut(I,dx,dz,a,r){const p=findFree(I.x+dx,I.z+dz,r||2);return p&&isFinite(p[0])?grp(p[0],terrainH(p[0],p[1]),p[1],a||0):null;}
function crPerson(x,z,look,a,pose){const f=findFree(x,z,0.5)||[x,z],g=makePerson(Object.assign({},MN_LOOK[look]||look));g.position.set(f[0],floorAt(f[0],f[1]),f[1]);g.rotation.y=a||0;scene.add(g);if(pose)try{personPose(g,pose);}catch(e){}return g;}
function crCave(I,dx,dz,a,key){try{caveMouth(I.x+dx,I.z+dz,a||0);}catch(e){}if(key)crObj(I.x+dx,I.z+dz,key,5);}
