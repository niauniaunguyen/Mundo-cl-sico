// ============================================================ personas
const V2=a=>a.map(v=>new THREE.Vector2(v[0],v[1]));
const PGEO={
  skirt:new THREE.CylinderGeometry(0.19,0.32,1.12,12),skirtF:new THREE.CylinderGeometry(0.19,0.36,1.14,12),torso:new THREE.CylinderGeometry(0.23,0.19,0.52,12),
  drape:new THREE.CylinderGeometry(0.27,0.35,0.95,12,1,true,0.4,Math.PI*1.35),sash:new THREE.BoxGeometry(0.52,0.12,0.5),
  head:new THREE.SphereGeometry(0.13,14,12),neck:new THREE.CylinderGeometry(0.05,0.06,0.12,8),nose:new THREE.BoxGeometry(0.03,0.055,0.05),
  hair:new THREE.SphereGeometry(0.14,12,8,0,TAU,0,Math.PI*0.55),bun:new THREE.SphereGeometry(0.075,8,6),beard:new THREE.SphereGeometry(0.09,8,6),
  arm:new THREE.CylinderGeometry(0.055,0.05,0.62,6),hand:new THREE.SphereGeometry(0.05,6,5),foot:new THREE.BoxGeometry(0.1,0.06,0.24),
  jar:new THREE.LatheGeometry(V2([[0,0],[0.08,0],[0.13,0.08],[0.16,0.2],[0.13,0.32],[0.06,0.38],[0.05,0.46],[0.08,0.48]]),12),
  basket:new THREE.CylinderGeometry(0.17,0.12,0.18,10)
};
// c: chiton, himation, skin, hair, beard, beardC, female, carry (hydria|amphora|basket), staff, spear, scale;
// solo con modelos: mask (color), helmet ('attic'), attrs (piezas extra; las *_hand van en la mano derecha), attrRoles, glow (color del brillo), noHimation, leaf
function makePerson(c){
  if(GLB.ok)return makePersonGLB(c);
  const g=new THREE.Group();
  const add=(geo,mat,x,y,z)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;g.add(m);return m;};
  const skin=lam(c.skin||'#c99a74'),cloth=lam(c.chiton),hairM=lam(c.hair||'#3b2a1e'),sand=lam('#5a3d26');
  add(PGEO.foot,sand,-0.1,0.03,0.06);add(PGEO.foot,sand,0.1,0.03,0.06);
  add(c.female?PGEO.skirtF:PGEO.skirt,cloth,0,c.female?0.6:0.62,0);
  add(PGEO.torso,cloth,0,1.43,0);
  const dr=add(PGEO.drape,lam(c.himation,{side:THREE.DoubleSide}),0,1.05,0);dr.rotation.z=0.1;
  const sh=add(PGEO.sash,lam(c.himation),0.02,1.45,0);sh.rotation.z=0.8;
  add(PGEO.neck,skin,0,1.71,0);add(PGEO.head,skin,0,1.82,0);add(PGEO.nose,skin,0,1.81,0.125);
  const hr=add(PGEO.hair,hairM,0,1.84,-0.01);hr.rotation.x=-0.25;
  if(c.female)add(PGEO.bun,hairM,0,1.88,-0.13);
  if(c.beard){const b=add(PGEO.beard,lam(c.beardC||c.hair||'#3b2a1e'),0,1.74,0.07);b.scale.set(1.1,1.2,0.8);}
  const la=add(PGEO.arm,skin,-0.27,1.35,0.02),ra=add(PGEO.arm,skin,0.27,1.35,0.02);la.rotation.z=0.12;ra.rotation.z=-0.12;
  for(const a of[la,ra]){const h=new THREE.Mesh(PGEO.hand,skin);h.position.y=-0.33;a.add(h);}
  if(c.carry==='hydria')add(PGEO.jar,lam('#a8532f'),0,1.96,0);
  else if(c.carry==='amphora'){const j=add(PGEO.jar,lam('#b5603a'),0.2,1.62,-0.05);j.rotation.z=-0.6;j.scale.setScalar(1.4);}
  else if(c.carry==='basket'){const bk=new THREE.Mesh(PGEO.basket,lam('#a8864f'));bk.position.set(0,-0.42,0.08);ra.add(bk);}
  if(c.staff)add(new THREE.CylinderGeometry(0.025,0.025,1.9,5),M.wood,0.38,0.95,0.12);
  if(c.spear){add(new THREE.CylinderGeometry(0.025,0.025,2.6,5),M.wood,0.38,1.3,0.1);add(new THREE.CylinderGeometry(0.45,0.45,0.08,16),M.bronze,-0.38,1.2,0.08).rotation.z=Math.PI/2;
    add(new THREE.SphereGeometry(0.16,10,8,0,TAU,0,Math.PI*0.6),M.bronze,0,1.86,0);}
  if(c.scale)g.scale.setScalar(c.scale);
  g.userData.arms=[la,ra];
  return g;
}
// ------------------------------------------------------------ acabado de las personas
// Oclusión ambiental horneada en los vértices (más oscuro hacia los pies y en las caras que miran al suelo), pliegues en la ropa y
// mechones en el pelo (texturas proyectadas en el espacio de cada pieza, para que no «resbalen» cuando la persona anda), y variedad
// de tez y de complexión.
const PSKIN=['#c99a74','#b98761','#d4a67f','#c08e66','#ab7b54','#dcb391','#b3805a'];
function bakePersonAO(P){if(P.ao)return;P.ao=1;const v=new THREE.Vector3(),nv=new THREE.Vector3();
  for(const m of P.meshes){const g=m.geo;if(g.attributes.color||!g.attributes.normal)continue;const pos=g.attributes.position,nor=g.attributes.normal,nm=new THREE.Matrix3().getNormalMatrix(m.mat),col=new Float32Array(pos.count*3);
    for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i).applyMatrix4(m.mat);const y=v.y+P.pos.y;nv.fromBufferAttribute(nor,i).applyMatrix3(nm).normalize();
      const ao=(0.58+0.42*sstep(clamp(y/1.2,0,1)))*(0.8+0.2*(nv.y*0.5+0.5));col[i*3]=col[i*3+1]=col[i*3+2]=ao;}
    g.setAttribute('color',new THREE.BufferAttribute(col,3));}}
let PTEX_P=null;
function personTex(){if(!PTEX_P)PTEX_P={
  fold:procTex(128,(u,v)=>{const n=pfbm(u*4,v*2,4,91,3),f=0.5+0.5*Math.sin((u*5+n*1.7)*TAU);const val=0.8+0.2*Math.pow(f,0.6)-pfbm(u*32,v*32,32,7,2)*0.07;return g3(val);}),
  hair:procTex(128,(u,v)=>{const n=pfbm(u*6,v*1.5,6,33,3),f=0.5+0.5*Math.sin((u*22+n*3)*TAU);return g3(0.72+0.28*f);})};return PTEX_P;}
const PMAT={};let PILOS_G=null;
// cejas y boca, pegadas a la superficie de la cara (se busca con un rayo contra la cabeza una sola vez)
let FACE=null;
function faceSpots(){if(FACE)return FACE;FACE={};const P=GLB.parts.P_head;if(!P)return FACE;const grp0=new THREE.Group(),rc=new THREE.Raycaster();
  for(const m of P.meshes){const me=new THREE.Mesh(m.geo,new THREE.MeshBasicMaterial());me.applyMatrix4(m.mat);me.position.add(P.pos);grp0.add(me);}grp0.updateMatrixWorld(true);
  const hit=(x,y)=>{rc.set(new THREE.Vector3(x,y,1),new THREE.Vector3(0,0,-1));const h=rc.intersectObject(grp0,true);return h.length?h[0].point.z:null;};
  FACE.bl=hit(-0.034,1.872);FACE.br=hit(0.034,1.872);FACE.m=hit(0,1.772);
  FACE.mat=new THREE.MeshLambertMaterial({vertexColors:true});FACE.geo={};return FACE;}
// cejas (y boca, si no hay barba) en una sola pieza con colores por vértice: una llamada de dibujo por persona
function faceGeo(browHex,mouth){const F=faceSpots(),k=browHex+(mouth?'m':'');if(F.geo[k])return F.geo[k];const parts=[];
  const put=(geo,x,y,z,rz,hex)=>{const g=geo.toNonIndexed();g.rotateZ(rz);g.translate(x,y,z);const c=new THREE.Color(hex),n=g.attributes.position.count,col=new Float32Array(n*3);for(let i=0;i<n;i++){col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}g.setAttribute('color',new THREE.BufferAttribute(col,3));g.deleteAttribute('uv');parts.push(g);};
  const gb=new THREE.BoxGeometry(0.038,0.009,0.016);if(F.bl!=null)put(gb,-0.034,1.874,F.bl-0.003,0.14,browHex);if(F.br!=null)put(gb,0.034,1.874,F.br-0.003,-0.14,browHex);
  if(mouth&&F.m!=null)put(new THREE.BoxGeometry(0.036,0.0065,0.014),0,1.772,F.m-0.004,0,'#8a4a3c');
  let n=0;for(const p of parts)n+=p.attributes.position.count;const pos=new Float32Array(n*3),nor=new Float32Array(n*3),col=new Float32Array(n*3);let o=0;
  for(const p of parts){pos.set(p.attributes.position.array,o*3);nor.set(p.attributes.normal.array,o*3);col.set(p.attributes.color.array,o*3);o+=p.attributes.position.count;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('normal',new THREE.BufferAttribute(nor,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));return F.geo[k]=g;}
// o.bare: 'exo' (exomis: hombro y pecho derechos al aire, prendida en el hombro izquierdo) o 'chest' (sin quitón: torso desnudo y el manto
// envolviendo las piernas, color o.drape); o.border: color de la cenefa, a o.by metros del bajo de la prenda
function personMat(hex,kind,o){o=o||{};const k=hex+kind+(o.bare||'')+(o.skin||'')+(o.drape||'')+(o.border||'')+(o.by||'')+(o.clavus||'')+(o.praet?'p':'')+(o.pat||'')+(o.patC||'');if(PMAT[k])return PMAT[k];const m=new THREE.MeshLambertMaterial({color:hex,vertexColors:true});
  const t=kind==='cloth'?personTex().fold:kind==='hair'?personTex().hair:null,sc=kind==='cloth'?2.2:7,base=new THREE.Color(hex);
  if(t){m.map=t;const mode=(o.bare||'')+(o.border?'b':'')+(o.clavus||'')+(o.praet?'p':'')+(o.pat||'');m.customProgramCacheKey=()=>'pm'+kind+mode;m.onBeforeCompile=sh=>{
    sh.uniforms.pmS={value:sc};const rel=h=>{const c=new THREE.Color(h);c.r/=base.r+0.0001;c.g/=base.g+0.0001;c.b/=base.b+0.0001;return c;};sh.uniforms.pmSkin={value:rel(o.skin||'#c99a74')};
    sh.uniforms.pmDrape={value:rel(o.drape||hex)};
    sh.uniforms.pmBorder={value:rel(o.border||hex)};sh.uniforms.pmBY={value:o.by||0.05};sh.uniforms.pmPur={value:rel(PURPURA)};sh.uniforms.pmPat={value:rel(o.patC||'#7a2a1e')};
    let extra='';
    if(o.clavus)extra+='if(vOP.y>0.42&&vOP.y<1.62&&abs(abs(vOP.x)-0.085)<'+(o.clavus==='lati'?'0.03':'0.011')+')diffuseColor.rgb*=pmPur;';
    if(o.praet)extra+='{float dg=vOP.y-(1.3-vOP.x*0.8);if((abs(dg)<0.024&&vOP.y>0.7)||(vOP.y>0.1&&vOP.y<0.155))diffuseColor.rgb*=pmPur;}';
    if(o.pat)extra+='{vec2 q=vec2(vOP.x+vOP.z,vOP.y)*vec2(24.0,20.0);vec2 f=fract(q+vec2(floor(q.y)*0.5,0.0))-0.5;float d='+(o.pat==='stars'?'abs(f.x)+abs(f.y)':'length(f)')+';if(d<'+(o.pat==='stars'?'0.16':'0.12')+'&&vOP.y<1.42&&vOP.y>0.12)diffuseColor.rgb*=pmPat;}';
    if(o.bare==='exo')extra+='if(vOP.y>1.14&&vOP.x>-0.01+(1.63-vOP.y)*0.72){diffuseColor.rgb=diffuseColor.rgb/max(tc,vec3(0.01))*pmSkin;}';
    if(o.bare==='chest')extra+='if(vOP.y>1.02){diffuseColor.rgb=diffuseColor.rgb/max(tc,vec3(0.01))*pmSkin;}else{diffuseColor.rgb*=pmDrape;}';
    if(o.border)extra+='float bh=vOP.y-pmBY;if((bh>0.03&&bh<0.085)||(bh>0.11&&bh<0.125))diffuseColor.rgb*=pmBorder;';
    sh.vertexShader='varying vec3 vOP;\nvarying vec3 vON;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvOP=transformed;vON=objectNormal;');
    sh.fragmentShader='uniform float pmS;uniform vec3 pmSkin;uniform vec3 pmDrape;uniform vec3 pmBorder;uniform float pmBY;uniform vec3 pmPur;uniform vec3 pmPat;\nvarying vec3 vOP;\nvarying vec3 vON;\n'+sh.fragmentShader.replace('#include <map_fragment>','vec3 tb=pow(abs(normalize(vON)),vec3(4.0));tb/=(tb.x+tb.y+tb.z);vec3 tc=texture2D(map,vOP.xy*pmS).rgb*tb.z+texture2D(map,vOP.zy*pmS).rgb*tb.x+texture2D(map,vOP.xz*pmS).rgb*tb.y;diffuseColor.rgb*=tc;'+extra);};}
  return PMAT[k]=m;}
// cenefas: colores de los bordes tejidos
const BORDER_C=['#7a2a1e','#2f4a6a','#8a6a2a','#3f5a3a','#2a2018','#6a3a5a'];
function makePersonGLB(c){
  const g=new THREE.Group(),hairC=c.hair||'#3b2a1e',skinC=c.skin||(c.glow?'#e9cba4':PSKIN[Math.floor(Math.random()*PSKIN.length)]);
  // exomis: túnica corta de trabajo con un hombro al aire; himOnly: solo el manto, sin quitón; cenefa en el bajo de algunos vestidos
  const exo=!!c.exomis,him=!!c.himOnly&&!c.female,border=c.border!==undefined?c.border:(!c.glow&&!c.soldier&&!c.toga&&!exo&&Math.random()<0.3?BORDER_C[Math.floor(Math.random()*BORDER_C.length)]:null);
  const ro={cloth:personMat(c.chiton,'cloth',{bare:exo?'exo':him?'chest':null,skin:skinC,drape:him?(c.himation||c.chiton):null,border:him?null:border,by:(c.short||exo)?0.5:(c.female?0.02:0.05),clavus:c.clavus,pat:c.pattern,patC:c.pattern?(c.patC||c.himation||'#7a2a1e'):null}),
    drape:personMat(c.himation||c.chiton,'cloth',Object.assign(c.female&&border?{border,by:0.47}:{},c.praetexta&&c.toga?{praet:true}:{})),skin:c.glow?glowSkin(skinC,c.glow):personMat(skinC,'skin'),hair:personMat(hairC,'hair'),
    eye:lam(c.glow?'#2a3d6a':'#1a120c'),sandal:lam(c.glow?'#b8862f':'#5a3d26'),mask:lam(c.mask||'#efe5d4'),leaf:lam(c.leaf||ROLE_C.leaf)};
  Object.assign(ro,c.attrRoles||{});
  const add=(n,par,roles)=>{const p=glbPart(n,roles||ro);if(p)(par||g).add(p);return p;};
  // Roma: short = túnica corta con las piernas al aire; toga; veil = palla sobre la cabeza; soldier = legionario
  const short=c.short||c.soldier||c.exomis;
  personLegs(g,short,ro);add(short?'P_tunic_short':(c.female?'P_chiton_f':'P_chiton_m'));   // children[0] = piernas (izquierda y derecha); children[1] = túnica (la respiración de los NPC la mece)
  if(c.toga)add('P_toga');else if(!c.noHimation&&!short)add(c.female?'P_himation_f':'P_himation_m');
  add('P_head');add('P_eyes');
  const corinth=!!c.spear&&(c.helmet==='corinth'||(!c.helmet&&c.glow)),pilos=!!c.spear&&!corinth&&c.helmet!=='attic';
  {const F=faceSpots();if(F.mat&&!c.mask&&!corinth)g.add(new THREE.Mesh(faceGeo('#'+new THREE.Color(c.beardC||hairC).multiplyScalar(0.55).getHexString(),!c.beard),F.mat));}
  if(c.soldier){add('P_lorica');add('P_galea');add('P_galea_crest');add('P_scutum');add('P_scutum_boss');if(c.soldier!=='nospear'){add('P_spear');add('P_spearhead');}}
  if(c.mask){add('P_mask');add('P_mask_hair',null,Object.assign({},ro,{hair:lam('#2a1a12')}));}
  else{if(!corinth&&!c.soldier)add(c.female?'P_hair_f':'P_hair_m');if(c.beard)add('P_beard',null,Object.assign({},ro,{hair:lam(c.beardC||hairC)}));}
  if(c.veil)add('P_veil',null,Object.assign({},ro,{drape:lam(c.veil===true?(c.himation||c.chiton):c.veil)}));
  const arms=['l','r'].map(k=>{const a=glbPart('P_arm_'+k,ro);if(!(him||(exo&&k==='r'))){const s=glbPart('P_sleeve_'+k,ro);s.position.set(0,0,0);a.add(s);}g.add(a);return a;});
  if(c.carry==='hydria'){add('P_hydria');add('P_hydria_band');}
  else if(c.carry==='amphora')add('P_amphora');
  else if(c.carry==='basket')add('P_basket',arms[1]);
  if(c.staff)add('P_staff');
  if(c.spear){add('P_spear');add('P_spearhead');add('P_shield');if(corinth){add('P_helmet');add('P_crest');}
    if(pilos){if(!PILOS_G)PILOS_G=[new THREE.ConeGeometry(0.132,0.3,18),new THREE.TorusGeometry(0.128,0.012,6,18)];const cn=new THREE.Mesh(PILOS_G[0],M.bronze);cn.position.set(0,2.03,-0.01);cn.castShadow=true;g.add(cn);
      const rim=new THREE.Mesh(PILOS_G[1],M.bronze);rim.rotation.x=Math.PI/2;rim.position.set(0,1.885,-0.01);g.add(rim);}}
  if(c.helmet==='attic')add('G_helmet_attic');
  for(const n of c.attrs||[])add(n,/_hand$/.test(n)?arms[1]:g);
  if(c.scale)g.scale.setScalar(c.scale);
  // complexión: unos más altos, otros más anchos (no en los niños ni en el propio jugador)
  else if(!c.noVary){const hf=0.95+Math.random()*0.09,wf=0.93+Math.random()*0.13;g.scale.set(wf,hf,wf);}
  dressExtras(g,c,ro);g.userData.arms=arms;
  return g;
}
function labelSprite(name,sub,fict){
  const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');
  x.fillStyle='rgba(22,16,12,0.78)';x.fillRect(16,14,480,100);x.fillStyle='#d9874a';x.fillRect(16,14,4,100);
  x.textAlign='center';x.fillStyle=fict?'#8fd3c4':'#f1e8d8';x.font='44px Marcellus, Georgia, serif';x.fillText(name,256,62);
  x.fillStyle='#ecc29a';x.font='italic 28px Alegreya, Georgia, serif';x.fillText(sub||'',256,100);
  const t=new THREE.CanvasTexture(c);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true,fog:false}));s.scale.set(2.6,0.65,1);s.renderOrder=10;return s;
}
function markerSprite(){
  const c=document.createElement('canvas');c.width=64;c.height=64;const x=c.getContext('2d');
  x.fillStyle='#f0b45c';x.beginPath();x.moveTo(32,4);x.lineTo(56,32);x.lineTo(32,60);x.lineTo(8,32);x.closePath();x.fill();
  x.fillStyle='#16100c';x.font='bold 30px Georgia';x.textAlign='center';x.fillText('!',32,43);
  const t=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true,fog:false}));s.scale.set(0.5,0.5,1);s.renderOrder=11;return s;
}

