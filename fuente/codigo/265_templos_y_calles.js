// ============================================================ TEMPLOS Y CALLES (27/11)
// Piezas de Blender (edificios.py, K2_*) y pintura para los templos y las calles:
//  · acróteras de palmeta (en el vértice y en las esquinas de los frontones) en lugar de los conos de antes, con las hojas pintadas
//    en rojo y azul alternos: es una reconstrucción a partir de los restos de pintura (el color exacto de cada templo no se conoce)
//  · gárgolas de cabeza de león en las cuatro esquinas de la sima (como en el Partenón, donde por las esquinas salía el agua)
//  · una banda pintada con meandro en la cornisa (geison) de los templos
//  · un cartel junto al Partenón que explica qué es reconstrucción y qué se sabe (pigmentos hallados: azul egipcio, ocres)
//  · en Atenas, hekataia (pilares de Hécate de tres cuerpos) en algunos cruces de caminos (Aristófanes, Avispas 804; Lisístrata 64)
//  · en Roma, compita (altares de los Lares de las encrucijadas) en algunos cruces, con los Lares pintados como en Pompeya
//  · en Roma, bordillos de piedra a los lados de las calles de la ciudad (aceras, crepidines)
const TK={meander:null,band:[],placed:false,signs:[]};
function tkPart(name){return typeof GLB!=='undefined'&&GLB.parts&&GLB.parts[name+'_marble']||Object.keys(GLB.parts||{}).some(n=>n.indexOf(name+'_')===0);}
function tkGroup(name,scale){const g=new THREE.Group();for(const k in GLB.parts){if(k.indexOf(name+'_')!==0)continue;const role=k.slice(name.length+1);
  for(const m of GLB.parts[k].meshes){const base=role==='marble'?M.marble:lam(ROLE_C[role]||'#cccccc');const mat=typeof edMat==='function'?edMat(base,role):base;const me=new THREE.Mesh(m.geo,mat);me.castShadow=true;g.add(me);}}
  g.scale.setScalar(scale);return g;}
// ---------------------------------------------------------------- acróteras y leones
{const f=acroteria;acroteria=function(g,W,L,y,h,mat,alongX){if(!tkPart('K2_acroc')||!g)return f.apply(this,arguments);
  const sc=Math.max(1.1,W*0.075),se=sc*0.75;
  for(const e of[-1,1]){const p=alongX?[e*(L/2+0.15),0]:[0,e*(L/2+0.15)];const a=tkGroup('K2_acroc',sc);a.position.set(p[0],y+h-0.05,p[1]);a.rotation.y=alongX?Math.PI/2:0;g.add(a);
    for(const s of[-1,1]){const q=alongX?[e*(L/2+0.15),s*(W/2-0.2)]:[s*(W/2-0.2),e*(L/2+0.15)];const c=tkGroup('K2_acroe',se);c.position.set(q[0],y+0.1,q[1]);c.rotation.y=alongX?Math.PI/2:0;g.add(c);
      if(tkPart('K2_lion')){const l=tkGroup('K2_lion',Math.max(1,W*0.05));const lq=alongX?[e*(L/2-0.4),s*(W/2+0.32)]:[s*(W/2+0.32),e*(L/2-0.4)];l.position.set(lq[0],y-0.12,lq[1]);
        l.rotation.y=alongX?(s>0?0:Math.PI):(s>0?Math.PI/2:-Math.PI/2);g.add(l);}}}};}
// ---------------------------------------------------------------- banda pintada con meandro en la cornisa
function tkMeander(){if(TK.meander)return TK.meander;const c=document.createElement('canvas');c.width=256;c.height=32;const x=c.getContext('2d');
  x.fillStyle='#2f4c86';x.fillRect(0,0,256,32);x.strokeStyle='#e9dcc0';x.lineWidth=3;x.beginPath();
  for(let k=0;k<8;k++){const o=k*32;x.moveTo(o+2,28);x.lineTo(o+2,4);x.lineTo(o+26,4);x.lineTo(o+26,22);x.lineTo(o+10,22);x.lineTo(o+10,12);x.lineTo(o+18,12);x.lineTo(o+18,16);}x.stroke();
  x.fillStyle='#a8392b';x.fillRect(0,0,256,3);x.fillRect(0,29,256,3);const t=new THREE.CanvasTexture(c);t.wrapS=THREE.RepeatWrapping;if(THREE.sRGBEncoding)t.encoding=THREE.sRGBEncoding;return TK.meander=t;}
{const f=entablature;entablature=function(g,W,L,y,e,o){const r=f.apply(this,arguments);try{if(g&&W>4&&L>4&&e>0.6){const h=e*0.09,yy=y+e*0.86;
  for(const[len,px,pz,ry]of[[W,0,L/2,0],[W,0,-L/2,Math.PI],[L,W/2,0,Math.PI/2],[L,-W/2,0,-Math.PI/2]]){const t=tkMeander().clone();t.needsUpdate=true;t.repeat.set(Math.max(1,Math.round(len/(h*8))),1);
    const m=new THREE.Mesh(new THREE.PlaneGeometry(len+0.12,h),new THREE.MeshLambertMaterial({map:t,polygonOffset:true,polygonOffsetFactor:-2}));const k=0.07;
    m.position.set(px+Math.sin(ry)*k,yy,pz+Math.cos(ry)*k);m.rotation.y=ry;g.add(m);TK.band.push(m);}}}catch(err){}return r;};}
// ---------------------------------------------------------------- cartel: los colores de los templos
function tkColorInfo(){jmDlg('🎨','Los colores de los templos','Pintados, no blancos','<p>Los templos y las estatuas griegas estaban pintados: molduras con meandros y ovas, triglifos azul oscuro, fondos del friso y del frontón en azul o rojo, acróteras de colores y detalles dorados. El mármol blanco que vemos hoy es lo que quedó al perderse la pintura.</p>'+
  '<p><b>Qué se sabe y qué es reconstrucción:</b> en el Partenón se han encontrado restos de azul egipcio en las esculturas de los frontones y del friso, y huellas de los motivos pintados en las molduras. Los colores exactos de cada pieza no se conservan: los de este juego son una reconstrucción prudente, como las de las exposiciones «Dioses en color» de Vinzenz y Ulrike Brinkmann.</p>'+
  '<p class="sub">Fuentes: G. Verri (Museo Británico), estudios con luminiscencia del azul egipcio en las esculturas del Partenón (2009); V. Brinkmann (ed.), Gods in Color (2007); Vitruvio IV 2, 2 (los triglifos pintados con cera azul).</p>',[['Entendido',()=>{}]]);}
// ---------------------------------------------------------------- cruces: hekataia (Atenas) y compita (Roma); bordillos (Roma)
function tkJunctions(C){   // cruces: donde se cortan los tramos de dos calles distintas (o se tocan sus extremos)
  const S=[];ROADS.forEach((R,ri)=>{if(!R.pts)return;for(let i=0;i+1<R.pts.length;i++){const a=R.pts[i],b=R.pts[i+1];if(C&&Math.hypot(a[0]-C.x,a[1]-C.z)>C.r+400&&Math.hypot(b[0]-C.x,b[1]-C.z)>C.r+400)continue;S.push([ri,a[0],a[1],b[0],b[1]]);}});
  const out=[],near=(x,z)=>out.some(o=>Math.hypot(o.x-x,o.z-z)<25);
  for(let i=0;i<S.length&&out.length<80;i++)for(let j=i+1;j<S.length;j++){const A=S[i],B=S[j];if(A[0]===B[0])continue;
    const dx1=A[3]-A[1],dz1=A[4]-A[2],dx2=B[3]-B[1],dz2=B[4]-B[2],den=dx1*dz2-dz1*dx2;let x,z;
    if(Math.abs(den)>1e-6){const t=((B[1]-A[1])*dz2-(B[2]-A[2])*dx2)/den,u=((B[1]-A[1])*dz1-(B[2]-A[2])*dx1)/den;if(t<-0.02||t>1.02||u<-0.02||u>1.02)continue;x=A[1]+dx1*t;z=A[2]+dz1*t;}
    else continue;if(!near(x,z))out.push({x,z});}
  return out;}
function tkCenter(){const ro=MODE==='roma';const L=PLACES.filter(p=>ro?/^ro_/.test(p.id):['mercado','partenon','pnyx','eponimos','teatro','ceramico'].includes(p.id));if(!L.length)return null;
  const cx=L.reduce((a,p)=>a+p.x,0)/L.length,cz=L.reduce((a,p)=>a+p.z,0)/L.length;let r=0;for(const p of L)r=Math.max(r,Math.hypot(p.x-cx,p.z-cz));return{x:cx,z:cz,r:Math.max(500,r*1.1)};}
function tkStreets(){if(TK.placed||typeof ROADS==='undefined'||!ROADS.length||typeof PLACES==='undefined'||!PLACES.length)return;TK.placed=true;const ro=MODE==='roma',C=tkCenter();if(!C)return;
  const J=tkJunctions(C).filter(a=>Math.hypot(a.x-C.x,a.z-C.z)<C.r).slice(0,26),part=ro?'K2_compit':'K2_hekat',items=[];
  if(tkPart(part))for(const j of J){let x=j.x+4.2,z=j.z+3.6;try{const f=findFree(x,z,1.2);x=f[0];z=f[1];}catch(e){}if(Math.hypot(x-j.x,z-j.z)>9)continue;const a=Math.atan2(j.x-x,j.z-z);
    items.push({x,y:floorAt(x,z),z,a});addCirc(x,z,ro?1.0:0.5);
    if(TK.signs.length<10){const o=egxObj(x,z,undefined,()=>jmDlg(ro?'🏛':'🔱',ro?'Un compitum':'Un hekataion',ro?'Los Lares de la encrucijada':'Hécate de los caminos',ro?'<p>En cada cruce de calles hay un pequeño altar a los Lares Compitales, los protectores del barrio. En enero se celebran las Compitalia. Augusto reorganizó estos cultos por barrios (vici) y añadió su propio genio.</p><p class="sub">Pinturas de Lares en los compita de Pompeya; Suetonio, Augusto 31.</p>':'<p>En los cruces de caminos hay imágenes de Hécate, la diosa de las encrucijadas, a veces con tres cuerpos que miran a los tres caminos. Cada luna nueva se le dejan comidas, «la cena de Hécate».</p><p class="sub">Aristófanes, Avispas 804 y Pluto 594-597; el tipo de tres cuerpos se atribuye a Alcámenes (Pausanias II 30, 2).</p>',[['Seguir',()=>{}]]),ro?'Compitum':'Hekataion',ro?'altar de los Lares':'Hécate de los caminos',2.4);TK.signs.push(o);}}
  if(items.length)placeModules(part,items,{far:900});TK.n=items.length;
  if(ro){const B=[],R2=C.r*C.r,mats=[],q=new THREE.Quaternion(),up=new THREE.Vector3(0,1,0),s=new THREE.Vector3(),p=new THREE.Vector3();
    for(const R of ROADS){if(!R.pts||(R.w||3)<4)continue;for(let i=0;i+1<R.pts.length;i++){const a=R.pts[i],b=R.pts[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(L<3)continue;
      for(let u=0;u<L;u+=4){const x=a[0]+(b[0]-a[0])*(u+2)/L,z=a[1]+(b[1]-a[1])*(u+2)/L;if((x-C.x)**2+(z-C.z)**2>R2)continue;const nx=-(b[1]-a[1])/L,nz=(b[0]-a[0])/L,ang=Math.atan2(b[0]-a[0],b[1]-a[1]);
        for(const sd of[-1,1]){const px=x+nx*sd*(R.w/2+0.15),pz=z+nz*sd*(R.w/2+0.15);if(!isFinite(px))continue;q.setFromAxisAngle(up,ang);p.set(px,floorAt(px,pz)+0.07,pz);s.set(0.3,0.18,Math.min(4,L-u));mats.push(new THREE.Matrix4().compose(p,q,s));}
        if(mats.length>6000)break;}}}
    if(mats.length){const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),lam('#a8a090'),mats.length);mats.forEach((m,i)=>im.setMatrixAt(i,m));im.receiveShadow=true;im.userData.noSeal=1;im.userData.low=1;
      im.geometry.computeBoundingSphere();const bs=new THREE.Box3();const v=new THREE.Vector3();for(const m of mats){v.setFromMatrixPosition(m);bs.expandByPoint(v);}im.geometry.boundingSphere=bs.getBoundingSphere(new THREE.Sphere());scene.add(im);TK.curbs=mats.length;}}}
function tkSign(){if(TK.info||typeof PLACES==='undefined')return;const P=PLACES.find(p=>p.id==='partenon')||PLACES.find(p=>/Partenón/.test(p.name||''));if(!P||MODE!=='atenas'){TK.info=1;return;}
  let x=P.x+14,z=P.z+22;try{const f=findFree(x,z,1);x=f[0];z=f[1];}catch(e){}TK.info=egxObj(x,z,undefined,()=>tkColorInfo(),'Los colores de los templos','¿por qué están pintados?',2.6);}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{if(state&&ui!=='start'){TK.t=(TK.t||0)+dt;if(TK.t>3){TK.t=0;tkStreets();tkSign();}}}catch(e){if(!TK.err){TK.err=1;console.warn('tk',e);}}return r;};}
