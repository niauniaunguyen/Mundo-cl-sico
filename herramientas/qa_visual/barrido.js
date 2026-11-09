// barrido automático de errores visuales en una región: relieve visto≠suelo, objetos flotando/enterrados, árboles, personas
module.exports=async(p,P,shot)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const roma=(await p.evaluate(()=>__d.QA().MODE))==='roma';const ids=(process.env.REG||'ciudad').split(',');
 await p.evaluate((roma)=>{const s=__d.state;s.pj={name:'Nía',g:'f',o:roma?'roma':'quios'};s.tut=1;},roma);await p.evaluate(()=>__d.startGame());await W(3000);
 const all={};
 for(const id of ids){
  const reg=await p.evaluate((id)=>{const d=__d,pl=d.getP();let cx,cz,h;if(id==='ciudad'){const I=d.INNER;cx=I.x;cz=I.z;h=I.size/2;}else{const I=d.ISL().find(i=>i.id===id);if(!I)return null;cx=I.x;cz=I.z;h=I.R*(I.land?1.25:1.4);}
    pl.x=cx;pl.z=cz;pl.feet=d.floorAt(cx,cz);pl.camY=pl.feet+pl.eye;d.setUi('play');return{cx,cz,h};},id);if(!reg){console.log(id,'no existe');continue;}
  await W(id==='ciudad'?2000:9000);
  const r={terr:[],flota:[],hunde:[],arb:{},gente:[]};for(const CHK of ['A','B','C','D']){const q=await p.evaluate(({id,reg,CHK})=>{const d=__d,S=d.SC(),out={terr:[],flota:[],hunde:[],arb:{},gente:[]};const{cx,cz,h}=reg;const inR=(x,z)=>Math.abs(x-cx)<h&&Math.abs(z-cz)<h;
   const terr=S.children.filter(o=>o.isMesh&&o.geometry&&o.geometry.type==='PlaneGeometry'&&o.geometry.attributes.position.count>3000);
   if(CHK==='A'){const G=terr.map(m=>{const P=m.geometry.parameters,pos=m.geometry.attributes.position,n=P.widthSegments;return{pos,n,x0:pos.getX(0),z0:pos.getZ(0),st:P.width/n};});
    const mh=(g,x,z)=>{const u=(x-g.x0)/g.st,w=(z-g.z0)/g.st;if(u<0||w<0||u>=g.n||w>=g.n)return null;const ix=Math.floor(u),iy=Math.floor(w),fu=u-ix,fv=w-iy,N=g.n+1,Y=i=>g.pos.getY(i);const a=Y(iy*N+ix),b=Y((iy+1)*N+ix),c=Y((iy+1)*N+ix+1),dd=Y(iy*N+ix+1);return fu+fv<=1?a+(dd-a)*fu+(b-a)*fv:c+(b-c)*(1-fu)+(dd-c)*(1-fv);};
    const st=Math.max(8,h/120);for(let x=cx-h;x<=cx+h;x+=st)for(let z=cz-h;z<=cz+h;z+=st){let top=-1e9;for(const g of G){const y=mh(g,x,z);if(y!==null&&y>top)top=y;}if(top<-1e8)continue;const df=top-d.terrainH(x,z);if(Math.abs(df)>1.5)out.terr.push([Math.round(x-cx),Math.round(z-cz),+df.toFixed(1)]);}
    out.terr.sort((a,b)=>Math.abs(b[2])-Math.abs(a[2]));return out;}
   // B) objetos sueltos (grupos y mallas de primer nivel)
   if(CHK==='B'){   const bb=new THREE.Box3();for(const o of S.children){if(!o.visible||o.isLight||o.isSprite||o.userData.chunk||o.isInstancedMesh||terr.includes(o))continue;if(o.isMesh&&o.geometry&&o.geometry.type==='PlaneGeometry')continue;
     const c=o.position;if(!inR(c.x,c.z))continue;bb.setFromObject(o);if(bb.isEmpty())continue;const sx=bb.max.x-bb.min.x,sz=bb.max.z-bb.min.z,sy=bb.max.y-bb.min.y;if(sx>80||sz>80||sy<0.2)continue;
     const pts=[[bb.min.x,bb.min.z],[bb.max.x,bb.min.z],[bb.min.x,bb.max.z],[bb.max.x,bb.max.z],[(bb.min.x+bb.max.x)/2,(bb.min.z+bb.max.z)/2]].map(q=>d.terrainH(q[0],q[1]));const mx=Math.max(...pts),mn=Math.min(...pts),mid=pts[4];
     let spr=false;o.traverse(q=>{if(q.isSprite||q.isPoints||q.isLine)spr=true;});
     const tag=(o.name||'')+(o.isMesh?o.geometry.type:'G'+o.children.length)+'@'+Math.round(c.x-cx)+','+Math.round(c.z-cz)+' '+sx.toFixed(0)+'x'+sz.toFixed(0)+'x'+sy.toFixed(1);
     if(!spr&&bb.min.y>mx+0.6&&bb.min.y<mx+40&&bb.min.y>-100){const rc=new THREE.Raycaster(new THREE.Vector3((bb.min.x+bb.max.x)/2,bb.min.y+0.05,(bb.min.z+bb.max.z)/2),new THREE.Vector3(0,-1,0),0,bb.min.y-mid+0.5);rc.camera=d.camera;
       const sup=rc.intersectObjects(S.children.filter(q=>q!==o&&q.visible&&!q.isSprite&&!q.userData.chunk),true).some(h=>h.object.isMesh&&!h.object.isSprite);if(!sup)out.flota.push(tag+' +'+(bb.min.y-mx).toFixed(1));}
     if(bb.min.y>-100&&bb.min.y>mid-20&&sy<6&&sx<6&&sz<6&&mid-bb.min.y>0.5*sy&&mid>bb.min.y+0.4)out.hunde.push(tag+' -'+(mid-bb.min.y).toFixed(1));}
   return out;}
   if(CHK==='C'){
   const m4=new THREE.Matrix4(),v=new THREE.Vector3();for(const im of S.children){if(!im.userData.chunk||!im.userData.veg)continue;const ims=[];im.traverse(q=>{if(q.isInstancedMesh)ims.push(q);});
     for(const q of ims){q.updateMatrixWorld();const k=(q.geometry.name||q.geometry.type)+':'+(q.material.color?q.material.color.getHexString():'');for(let i=0;i<q.count;i++){q.getMatrixAt(i,m4);v.setFromMatrixPosition(m4).applyMatrix4(q.matrixWorld);if(!inR(v.x,v.z))continue;
       if(v.y<-100)continue;const t=d.floorAt(v.x,v.z),dy=v.y-t;if(dy>0.8||dy<-2.5){const a=out.arb[k]||(out.arb[k]={n:0,ej:[]});a.n++;if(a.ej.length<3)a.ej.push([Math.round(v.x-cx),Math.round(v.z-cz),+dy.toFixed(1)]);}}}}
   return out;}
   // D) personas
   if(CHK!=='D')return out;
   const W=d.getW(),ff=d.AUD3().isFree;for(const w of W){const g=w.g;if(!g.visible||!inR(g.position.x,g.position.z))continue;const t=d.floorAt(g.position.x,g.position.z),dy=g.position.y-t;if(Math.abs(dy)>0.5)out.gente.push('paseante@'+Math.round(g.position.x-cx)+','+Math.round(g.position.z-cz)+' dy'+dy.toFixed(1));}
   for(const n of d.QA().npcObjs){if(n.hidden||!inR(n.x,n.z))continue;const t=d.floorAt(n.x,n.z),dy=n.g.position.y-t;if(Math.abs(dy)>0.4)out.gente.push(n.data.id+' dy'+dy.toFixed(1));}
   return out;},{id,reg,CHK});for(const k in q){if(Array.isArray(q[k]))r[k]=r[k].concat(q[k]);else Object.assign(r[k],q[k]);}}
  all[id]=r;console.log('== '+id+' relieve:'+r.terr.length+' flotan:'+r.flota.length+' hundidos:'+r.hunde.length+' repetidos:'+JSON.stringify(r.arb)+' gente:'+r.gente.length);
  console.log('  relieve',JSON.stringify(r.terr.slice(0,6)));console.log('  flotan',JSON.stringify(r.flota.slice(0,12)));console.log('  hundidos',JSON.stringify(r.hunde.slice(0,12)));console.log('  gente',JSON.stringify(r.gente.slice(0,8)));}
 require('fs').writeFileSync((process.env.SALIDA||require('os').tmpdir()+'/nostos')+'_vis_'+(roma?'roma':'atenas')+'.json',JSON.stringify(all));};
