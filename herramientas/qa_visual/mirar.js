// capturas de puntos concretos: LOOK="nombre:x:z:dist:alt;..." (coordenadas del mundo)
module.exports=async(p,P,shot)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const roma=(await p.evaluate(()=>__d.QA().MODE))==='roma';
 await p.evaluate((roma)=>{const s=__d.state;s.pj={name:'Nía',g:'f',o:roma?'roma':'quios'};s.tut=1;},roma);await p.evaluate(()=>__d.startGame());await W(3000);
 for(const it of process.env.LOOK.split(';')){const[n,x,z,dd,al,az]=it.split(':');
  await p.evaluate(([x,z,dd,al,az])=>{const d=__d,pl=d.getP(),a=az||0.7;pl.x=x+Math.sin(a)*dd;pl.z=z+Math.cos(a)*dd;pl.feet=d.floorAt(pl.x,pl.z);pl.camY=pl.feet+pl.eye+(al||0);pl.fly=!!al;
    pl.yaw=Math.atan2(-(x-pl.x),-(z-pl.z));const ty=d.terrainH(x,z);pl.pitch=Math.atan2(ty-(pl.camY),dd)*0.9;d.setUi('play');d.setH(11);},[+x,+z,+dd,+(al||0),az!==undefined?+az:0.7]);
  await W(6000);await shot('lk_'+n);}};
