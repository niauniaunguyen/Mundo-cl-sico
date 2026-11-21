// ============================================================ ENTABLAMENTOS DE DETALLE (P7, arquitectura de detalle, segunda parte)
// entablature() (007) dibuja arquitrabe, friso y cornisa como cajas con textura: de lejos basta, pero de cerca el friso es plano.
// Aquí se añade el relieve de verdad, solo visible a menos de unos 500 m (trozos con chunked(), un dibujo por pieza y zona):
//  dórico  · ténia (la banda que corona el arquitrabe), régulas con sus seis gotas debajo de cada triglifo, triglifos en relieve
//            (con dos glifos y dos medios glifos; pintados de azul oscuro) y mútulos bajo la cornisa, encima de cada triglifo y de cada metopa
//            (Vitruvio IV 3; Coulton, Ancient Greek Architects at Work, 1977)
//  jónico  · arquitrabe de tres fascias que sobresalen una sobre otra, con una moldura de remate; en Roma, además, dentículos bajo la cornisa
//            (Vitruvio III 5; en el jónico ático del siglo V, como el Erecteion, no hay dentículos)
// Los triglifos se colocan exactamente donde la textura del friso dibuja los suyos, para que coincidan.
const ENTQ=[];
const ENTD={on:true,far:500,box:new THREE.BoxGeometry(1,1,1),gut:new THREE.CylinderGeometry(0.8,1,1,6),tri:null,n:0};
function entTriMat(){if(ENTD.tri)return ENTD.tri;const c=document.createElement('canvas');c.width=32;c.height=64;const x=c.getContext('2d');
  x.fillStyle='#2b4479';x.fillRect(0,0,32,64);x.fillStyle='#16244a';
  x.fillRect(0,6,2,58);x.fillRect(30,6,2,58);x.fillRect(9,6,3,58);x.fillRect(20,6,3,58);   // dos glifos enteros y dos medios en los cantos
  x.fillStyle='#3a5590';x.fillRect(0,0,32,5);
  const t=new THREE.CanvasTexture(c);t.magFilter=THREE.LinearFilter;ENTD.tri=new THREE.MeshLambertMaterial({map:t});return ENTD.tri;}
{const f=entablature;entablature=function(g,W,L,y,e,o){const r=f.apply(this,arguments);try{if(ENTD.on&&g&&W>1&&L>1)ENTQ.push({g,W,L,y,e,o:o||{}});}catch(err){}return r;};}
// las cuatro caras: origen (s=0) en la esquina donde empieza la textura del friso, dirección a lo largo y normal hacia fuera
function entFaces(W,L){return[{len:W,bx:-W/2,bz:L/2,ax:1,az:0,nx:0,nz:1,ry:0},{len:W,bx:W/2,bz:-L/2,ax:-1,az:0,nx:0,nz:-1,ry:Math.PI},
  {len:L,bx:W/2,bz:L/2,ax:0,az:-1,nx:1,nz:0,ry:Math.PI/2},{len:L,bx:-W/2,bz:-L/2,ax:0,az:1,nx:-1,nz:0,ry:-Math.PI/2}];}
function entPieces(E){const{W,L,y,e,o}=E,ah=e*0.4,fh=e*0.4,ch=e*0.2,P={m:[],t:[],g:[]};
  const put=(arr,F,s,off,yy,w,h,d)=>arr.push([F.bx+F.ax*s+F.nx*off,yy,F.bz+F.az*s+F.nz*off,F.ry,w,h,d]);
  if(o.ionic){const k=Math.min(0.05,e*0.02);
    P.m.push([0,y+ah*0.5,0,0,W+k,ah*0.34,L+k],[0,y+ah*0.81,0,0,W+2*k,ah*0.3,L+2*k],[0,y+ah*0.985,0,0,W+3*k,ah*0.05,L+3*k]);
    if(MODE==='roma'||o.dentils){const d=Math.max(0.1,ch*0.42),sp=d*1.6;for(const F of entFaces(W,L)){const n=Math.floor((F.len-d)/sp);const s0=(F.len-n*sp)/2;
      for(let i=0;i<=n;i++)put(P.m,F,s0+i*sp,d*0.45,y+ah+fh-d*0.5,d,d,d*0.9);}}
    return P;}
  const ia=o.ia||W/6,th=ah*0.12,rh=ah*0.07,gh=ah*0.08;
  for(const F of entFaces(W,L)){
    put(P.m,F,F.len/2,0.03,y+ah-th/2,F.len+0.06,th,0.06);                                   // ténia
    const u=Math.max(1,2*F.len/ia/4),sp=F.len/(4*u),tw=0.375*sp,n=Math.round(4*u);          // como en friezeTex(): 4 triglifos por repetición
    for(let i=0;i<n;i++){const sc=i*sp+tw/2;if(sc+tw/2>F.len+0.01)break;
      put(P.t,F,sc,0.035,y+ah+fh/2,tw,fh,0.1);                                              // triglifo
      put(P.m,F,sc,0.025,y+ah-th-rh/2,tw,rh,0.05);                                           // régula
      for(let j=0;j<6;j++)put(P.g,F,sc+(j-2.5)*tw/6.4,0.03,y+ah-th-rh-gh/2,tw/15,gh,tw/15);  // gotas
      const mh=Math.max(0.04,ch*0.14);put(P.m,F,sc,0.17,y+ah+fh-mh/2,tw,mh,0.32);            // mútulo sobre el triglifo
      const sm=sc+sp/2;if(sm+tw/2<F.len)put(P.m,F,sm,0.17,y+ah+fh-mh/2,tw,mh,0.32);}}       // y sobre la metopa
  return P;}
function entFlush(){if(!ENTQ.length)return;if(typeof ACC!=='undefined'&&ACC.lite){ENTQ.length=0;return;}
  const L={m:[],t:[],g:[]},mm=new THREE.Matrix4(),lm=new THREE.Matrix4(),q=new THREE.Quaternion(),p=new THREE.Vector3(),s=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
  for(const E of ENTQ.splice(0)){let r=E.g;while(r.parent)r=r.parent;if(r!==scene)continue;E.g.updateWorldMatrix(true,false);
    const P=entPieces(E);for(const k in P)for(const a of P[k]){p.set(a[0],a[1],a[2]);q.setFromAxisAngle(up,a[3]);s.set(a[4],a[5],a[6]);lm.compose(p,q,s);mm.multiplyMatrices(E.g.matrixWorld,lm);L[k].push({m:mm.clone()});}}
  const opt={far:ENTD.far,shadow:false,cell:420};
  if(L.m.length)chunked(ENTD.box,M.marble,L.m,opt);if(L.t.length)chunked(ENTD.box,entTriMat(),L.t,opt);if(L.g.length)chunked(ENTD.gut,M.marble,L.g,opt);
  ENTD.n+=L.m.length+L.t.length+L.g.length;}
{const f=finishColumns;finishColumns=function(){const r=f.apply(this,arguments);try{entFlush();}catch(e){console.warn('entablamentos',e);}return r;};}
{const f=colsTick;colsTick=function(dt){f.apply(this,arguments);if(ENTQ.length&&_colT===0)try{entFlush();}catch(e){}};}
