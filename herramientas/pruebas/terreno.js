// Revisión del terreno de todos los mapas (la ciudad y cada destino) sin viajar: muestrea una rejilla y compara
//   · t = terrainH (relieve con el que se calcula todo), f = floorAt (suelo que se pisa: terreno o edificio),
//   · m = meshH (altura de la malla que se dibuja).
// Avisa de (salto: dentro del cuadrado jugable; sierra: en los montes del borde): suelo que se ve a distinta altura que el que se pisa fuera de los edificios (|m−t|), valores no válidos,
// picos o saltos bruscos entre puntos vecinos, pendientes imposibles y bordes del mapa que caen de golpe.
// Uso: node herramientas/pruebas/run.js "?modo=atenas#debug" herramientas/pruebas/terreno.js   → escribe terreno_<modo>.json en la carpeta de salida (SALIDA)
const fs=require('fs');
module.exports=async(p,P,shot)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));
 await p.setViewportSize({width:400,height:260});
 await p.evaluate(()=>{const s=__d.state;s.tut=1;s.pj={name:'Ann',g:'f',o:'x'};});await p.evaluate(()=>__d.startGame());await W(2500);
 const maps=await p.evaluate(()=>{const Q=__d.QA(),X=__d.RFX(),In=X.INNER();const L=[{id:'ciudad',name:'Ciudad',x:In.x,z:In.z,half:In.size/2-10,step:6}];
   for(const I of Q.ISLANDS)if(I&&I.mesh&&isFinite(I.x)){let sq=null;try{sq=Q.regionSquare&&Q.regionSquare(I.id);}catch(e){}L.push({id:I.id,name:I.name,x:I.x,z:I.z,half:I.R*1.42,step:Math.max(4,Math.round(I.R/90)),sq});}return L;});
 const out={modo:await p.evaluate(()=>__d.QA().MODE||(location.search.includes('roma')?'roma':'atenas')),mapas:[]};
 for(const M of maps){const r=await p.evaluate(M=>{const Q=__d.QA(),D=__d,X=__d.RFX();const T=(x,z)=>D.terrainH(x,z),F=(x,z)=>Q.floorAt(x,z),MH=(x,z)=>X.meshH(x,z);
   const N=Math.floor(M.half*2/M.step)+1,x0=M.x-M.half,z0=M.z-M.half,t=new Float32Array(N*N),m=new Float32Array(N*N),f=new Float32Array(N*N);
   for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=x0+i*M.step,z=z0+j*M.step,k=j*N+i;t[k]=T(x,z);f[k]=F(x,z);const mh=MH(x,z);m[k]=mh==null?NaN:mh;}
   const P={nan:[],desfase:[],salto:[],sierra:[],borde:[]},cnt={nan:0,desfase:0,salto:0,sierra:0,borde:0,total:N*N};   // sierra: salto fuera del cuadrado jugable (en los montes del borde)
   const inSq=(x,z)=>!M.sq||Math.max(Math.abs(x-M.sq.cx),Math.abs(z-M.sq.cz))<M.sq.h;let tmin=1e9,tmax=-1e9,maxd=0;
   const add=(k,a,i,j,v)=>{cnt[k]++;if(P[k].length<12)P[k].push([Math.round(x0+i*M.step),Math.round(z0+j*M.step),Math.round(v*10)/10]);};
   for(let j=0;j<N;j++)for(let i=0;i<N;i++){const k=j*N+i,tv=t[k];
     if(!isFinite(tv)||!isFinite(f[k])){add('nan',k,i,j,0);continue;}tmin=Math.min(tmin,tv);tmax=Math.max(tmax,tv);
     // suelo visible frente al de cálculo, solo donde no hay edificio (el suelo pisable es el terreno)
     if(isFinite(m[k])&&Math.abs(f[k]-tv)<0.05){const d=m[k]-tv;if(Math.abs(d)>0.5){add('desfase',k,i,j,d);maxd=Math.max(maxd,Math.abs(d));}}
     // salto: diferencia con los vecinos mucho mayor que la que daría una pendiente fuerte (70°)
     if(i>0&&j>0&&i<N-1&&j<N-1){const nb=[t[k-1],t[k+1],t[k-N],t[k+N]];const dmax=Math.max(...nb.map(v=>Math.abs(v-tv)));if(dmax>M.step*2.8)add(inSq(x0+i*M.step,z0+j*M.step)?'salto':'sierra',k,i,j,dmax);}
     // borde: el último anillo cae de golpe respecto al anterior
     if((i===0||j===0||i===N-1||j===N-1)){const ii=Math.min(N-2,Math.max(1,i)),jj=Math.min(N-2,Math.max(1,j)),ins=t[jj*N+ii];if(isFinite(ins)&&Math.abs(ins-tv)>M.step*2.5)add('borde',k,i,j,tv-ins);}}
   return {id:M.id,name:M.name,step:M.step,muestras:N*N,alt:[Math.round(tmin),Math.round(tmax)],cuenta:cnt,maxDesfase:Math.round(maxd*10)/10,puntos:P};},M);
   out.mapas.push(r);await W(20);}
 const dir=process.env.SALIDA||'.';fs.writeFileSync(dir+'/terreno_'+out.modo+'.json',JSON.stringify(out,null,1));
 const mal=out.mapas.filter(r=>r.cuenta.nan||r.cuenta.desfase>r.cuenta.total*0.002||r.cuenta.salto||r.cuenta.sierra||r.cuenta.borde);
 console.log(out.modo+': '+out.mapas.length+' mapas revisados, '+mal.length+' con avisos');
 for(const r of mal)console.log(' · '+r.name+' ('+r.id+'): '+['nan','desfase','salto','sierra','borde'].filter(k=>r.cuenta[k]).map(k=>k+' '+r.cuenta[k]+(k==='desfase'?' (máx '+r.maxDesfase+' m)':'')).join(', '));
};
