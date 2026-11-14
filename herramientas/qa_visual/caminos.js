module.exports=async(p)=>{await p.evaluate(()=>__d.startGame());await new Promise(r=>setTimeout(r,3000));
 console.log(await p.evaluate(()=>{const d=__d,R=d.ROADS,ff=d.AUD3().isFree,FP=d.AUD3().footprints;const hits=[];
  R.forEach((r,ri)=>{const P=r.pts;let run=0,start=null;for(let i=0;i<P.length-1;i++){const[ax,az]=P[i],[bx,bz]=P[i+1],L=Math.hypot(bx-ax,bz-az);for(let t=0;t<L;t+=2){const x=ax+(bx-ax)*t/L,z=az+(bz-az)*t/L;
    if(!ff(x,z,0.5)){if(!start)start=[x,z];run++;}else if(start){hits.push({ri,x:start[0],z:start[1],n:run});start=null;run=0;}}}if(start)hits.push({ri,x:start[0],z:start[1],n:run});});
  const near=(x,z)=>{let b=null,bd=1e9;for(const f of FP){if(!f.name)continue;const dd=Math.hypot(f.x-x,f.z-z);if(dd<bd){bd=dd;b=f;}}return b&&bd<60?b.name+'('+Math.round(bd)+'m)':'?';};
  return hits.filter(h=>h.n>=2).map(h=>'camino'+h.ri+' w'+R[h.ri].w+' @'+Math.round(h.x)+','+Math.round(h.z)+' x'+h.n+' '+near(h.x,h.z)).join('\n');}));};
