// Recorridos automáticos: desde donde aparece el jugador, explora a pie toda la ciudad con la MISMA función de movimiento que el juego
// (tryMove: colisiones, cuestas, agua, gradas) y avisa de:
//   · personajes, estelas, dioses y objetos a los que no se llega andando (inaccesibles);
//   · sitios a los que se llega pero donde el suelo no está bien (NaN o un agujero hacia abajo).
// Uso: node herramientas/pruebas/run.js "?modo=atenas#debug" herramientas/pruebas/recorridos.js   (tarda uno o dos minutos)
module.exports=async(p,P,shot)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));
 // no hace falta dibujar: ventana pequeña y modo ligero (si no, en Roma el navegador sin pantalla se queda sin memoria)
 await p.setViewportSize({width:400,height:260});await p.evaluate(()=>{const a=JSON.parse(localStorage.getItem('nostos-acc')||'{}');a.lite=true;localStorage.setItem('nostos-acc',JSON.stringify(a));});await p.reload();await P.ready(p);
 await p.evaluate(()=>{const s=__d.state;s.pj={name:'Nía',g:'f',o:'quios'};s.tut=1;});await p.evaluate(()=>__d.startGame());await W(2500);
 // 1) preparar la rejilla; 2) explorar por tandas (el navegador respira entre una y otra); 3) comprobar los objetivos
 await p.evaluate(()=>{const X=__d.RFX(),Q=__d.QA(),pl=X.pl();try{Q.closeDialog();}catch(e){}__d.setUi('play');
  const C=1.5,SUB=3,inner=X.INNER(),half=inner.size/2-22,R={C,SUB,x0:inner.x-half,x1:inner.x+half,z0:inner.z-half,z1:inner.z+half,sx:pl.x,sz:pl.z,t0:performance.now(),n:0,holes:[]};
  R.NX=Math.ceil((R.x1-R.x0)/C)+1;R.NZ=Math.ceil((R.z1-R.z0)/C)+1;R.seen=new Uint8Array(R.NX*R.NZ);R.Q=new Int32Array(R.NX*R.NZ);R.qh=0;R.qt=0;
  const i=Math.round((R.sx-R.x0)/C),j=Math.round((R.sz-R.z0)/C);R.seen[j*R.NX+i]=1;R.Q[R.qt++]=j*R.NX+i;window.__rec=R;});
 for(let pass=0;pass<200;pass++){const left=await p.evaluate(()=>{const R=window.__rec,X=__d.RFX(),Q=__d.QA(),pl=X.pl(),C=R.C,SUB=R.SUB,fl=(x,z)=>Q.floorAt(x,z),wx=i=>R.x0+i*C,wz=j=>R.z0+j*C;
   // pasitos de medio metro; donde el suelo sube mucho, de 10 cm, como los pasos de un fotograma (así se sube trepando por las laderas, igual que en el juego)
   const mv=(tx,tz)=>{if(!X.tryMove(tx,tz))return false;pl.feet=fl(pl.x,pl.z);return isFinite(pl.feet);};
   const step=(ax,az,bx,bz)=>{pl.x=ax;pl.z=az;pl.feet=fl(ax,az);for(let k=1;k<=SUB;k++){const tx=ax+(bx-ax)*k/SUB,tz=az+(bz-az)*k/SUB;
       if(fl(tx,tz)-pl.feet>0.3){const px=pl.x,pz=pl.z;for(let m=1;m<=5;m++)if(!mv(px+(tx-px)*m/5,pz+(tz-pz)*m/5))return false;}else if(!mv(tx,tz))return false;}
     return Math.hypot(pl.x-bx,pl.z-bz)<C*0.45;};
   let m=0;while(R.qh<R.qt&&m<100000){const c=R.Q[R.qh++],i=c%R.NX,j=(c-i)/R.NX;m++;R.n++;const ax=wx(i),az=wz(j);
     for(const[di,dj]of[[1,0],[-1,0],[0,1],[0,-1]]){const ni=i+di,nj=j+dj;if(ni<0||nj<0||ni>=R.NX||nj>=R.NZ)continue;const k=nj*R.NX+ni;if(R.seen[k])continue;
       if(step(ax,az,wx(ni),wz(nj))){R.seen[k]=1;R.Q[R.qt++]=k;if(!isFinite(fl(wx(ni),wz(nj)))&&R.holes.length<50)R.holes.push([wx(ni),wz(nj),'suelo NaN']);}}}
   pl.x=R.sx;pl.z=R.sz;pl.feet=fl(R.sx,R.sz);return R.qt-R.qh;});if(!left)break;await W(200);}
 const r=await p.evaluate(()=>{const R=window.__rec,Q=__d.QA(),I=[],C=R.C;
  const reach=(x,z,r)=>{const i=Math.round((x-R.x0)/C),j=Math.round((z-R.z0)/C),D=Math.ceil(r/C);for(let a=-D;a<=D;a++)for(let b=-D;b<=D;b++){const ii=i+a,jj=j+b;if(ii>=0&&jj>=0&&ii<R.NX&&jj<R.NZ&&R.seen[jj*R.NX+ii])return true;}return false;};
  const T=[];
  for(const o of Q.npcObjs){const d=o.data;if(!o.g||o.g.visible===false)continue;const x=o.g.position.x,z=o.g.position.z;if(x>8000)continue;T.push(['personaje',d.name,x,z,3.5]);}
  for(const s of Q.signObjs){const d=s.data;if(!d||s.x>8000)continue;T.push(['estela',d.name,s.x,s.z,4]);}
  for(const g of Q.godObjs){if(!g.g||g.g.position.x>8000)continue;T.push(['dios',g.data.name,g.g.position.x,g.g.position.z,4.5]);}
  for(const o of Q.EGX_OBJS){if(!isFinite(o.x)||o.x>8000)continue;T.push(['objeto',(o.data&&o.data.name)||o.act,o.x,o.z,4]);}
  let ok=0;for(const[t,nm,x,z,r]of T){if(x<R.x0||x>R.x1||z<R.z0||z>R.z1)continue;if(reach(x,z,r))ok++;else I.push('INACCESIBLE · '+t+' «'+nm+'» ('+Math.round(x)+', '+Math.round(z)+')');}
  for(const h of R.holes)I.push('SUELO · '+h[2]+' ('+Math.round(h[0])+', '+Math.round(h[1])+')');
  let cells=0;for(let k=0;k<R.seen.length;k++)cells+=R.seen[k];
  return {capped:false,I,celdas:cells,area:Math.round(cells*C*C/10000)+' ha',ok,total:T.length,s:Math.round((performance.now()-R.t0)/1000)};});
 if(r.capped)console.log('AVISO: el recorrido llegó al tope de celdas; puede faltar terreno');console.log('Recorrido a pie: '+r.celdas+' celdas ('+r.area+') en '+r.s+' s · alcanzables '+r.ok+' de '+r.total);
 const g={};for(const l of r.I){const k=l.split(' · ')[0];(g[k]=g[k]||[]).push(l);}
 for(const k in g){console.log('\n'+k+' ('+g[k].length+')');g[k].slice(0,60).forEach(l=>console.log('  '+l.split(' · ').slice(1).join(' · ')));}
 if(!r.I.length)console.log('todo alcanzable');};
