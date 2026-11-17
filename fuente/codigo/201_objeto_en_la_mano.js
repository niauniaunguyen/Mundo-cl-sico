// ============================================================ EL OBJETO ELEGIDO, EN LA MANO
// Como la antorcha (040, updateTorch): el objeto elegido en la barra (087) se ve en la mano: en primera persona, abajo a la derecha de la
// vista; en tercera persona, en la mano derecha del personaje. Modelos sencillos hechos aquí, a tamaño real:
//  tablilla de cera: dos hojas de madera unidas por un lado, con la cera oscura dentro, y el punzón (stilus) de bronce
//  bolsa: de cuero, cerrada con un cordón · odre: piel de cabra con la boca atada · estrígilo de bronce con el aríbalo de aceite colgando
//  rollo (periplo / itinerario): papiro a medio desenrollar con sus varillas · amuleto: Lar de bronce (Roma); espino o laminilla de oro (Atenas)
// El caballo y las alas no se llevan en la mano.
const HELD={g:null,k:null,models:{},t:0};
function heldModel(k){const key=k==='amuleto'?k+'|'+hbAmuletoName():k;if(HELD.models[key])return HELD.models[key];const g=new THREE.Group(),L=c=>lam(c);
  const wood=L('#8a6238'),bronze=L('#b88a42'),leather=L('#6e4a2a');
  if(k==='tablilla'){for(const s of[-1,1]){const h=new THREE.Group();h.rotation.y=s*0.35;g.add(h);
      const fr=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.2,0.012),wood);fr.position.x=s*0.078;h.add(fr);
      const wx=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.17,0.004),L('#3a2c1e'));wx.position.set(s*0.078,0,0.006);h.add(wx);
      for(let i=0;i<4;i++){const ln=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.003,0.002),L('#c9b08a'));ln.position.set(s*0.078,0.05-i*0.03,0.009);h.add(ln);}}
    const st=new THREE.Mesh(new THREE.CylinderGeometry(0.003,0.004,0.13,6),bronze);st.rotation.z=1.1;st.position.set(0.05,-0.06,0.05);g.add(st);}
  else if(k==='bolsa'){const b=new THREE.Mesh(new THREE.SphereGeometry(0.07,14,10),leather);b.scale.set(1,0.95,0.85);g.add(b);
    const n=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.04,0.04,12),leather);n.position.y=0.075;g.add(n);
    const c=new THREE.Mesh(new THREE.TorusGeometry(0.03,0.004,6,16),L('#c9a46a'));c.rotation.x=Math.PI/2;c.position.y=0.07;g.add(c);
    const t=new THREE.Mesh(new THREE.CylinderGeometry(0.003,0.003,0.08,4),L('#c9a46a'));t.position.set(0.03,0.04,0.02);t.rotation.z=0.5;g.add(t);}
  else if(k==='odre'){const b=new THREE.Mesh(new THREE.SphereGeometry(0.1,14,10),L('#5e4028'));b.scale.set(0.8,1.25,0.7);g.add(b);
    const n=new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.03,0.07,10),L('#5e4028'));n.position.y=0.15;n.rotation.z=0.25;g.add(n);
    const c=new THREE.Mesh(new THREE.TorusGeometry(0.02,0.004,6,12),L('#c9a46a'));c.rotation.x=Math.PI/2;c.position.set(-0.012,0.17,0);g.add(c);
    for(const s of[-1,1]){const l=new THREE.Mesh(new THREE.ConeGeometry(0.018,0.06,6),L('#5e4028'));l.position.set(s*0.06,-0.1,0.02);l.rotation.z=s*0.6;g.add(l);}}
  else if(k==='strigil'){const cv=new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,-0.1,0),new THREE.Vector3(0.0,0.08,0.02),new THREE.Vector3(0.09,0.12,0.0));
    g.add(new THREE.Mesh(new THREE.TubeGeometry(cv,16,0.01,6,false),bronze));
    const hd=new THREE.Mesh(new THREE.BoxGeometry(0.018,0.08,0.012),bronze);hd.position.y=-0.13;g.add(hd);
    const ar=new THREE.Mesh(new THREE.SphereGeometry(0.03,10,8),L('#c8b48a'));ar.position.set(-0.04,-0.2,0.0);g.add(ar);
    const cd=new THREE.Mesh(new THREE.CylinderGeometry(0.002,0.002,0.08,4),L('#6a5040'));cd.position.set(-0.025,-0.15,0);cd.rotation.z=-0.5;g.add(cd);}
  else if(k==='rollo'){const pap=L('#e6d8b0');for(const s of[-1,1]){const r=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.22,12),pap);r.position.x=s*0.07;g.add(r);
      for(const e of[-1,1]){const kn=new THREE.Mesh(new THREE.SphereGeometry(0.012,8,6),L('#4a3020'));kn.position.set(s*0.07,e*0.12,0);g.add(kn);}}
    const sh=new THREE.Mesh(new THREE.PlaneGeometry(0.14,0.2),new THREE.MeshLambertMaterial({color:'#efe4c4',side:THREE.DoubleSide}));sh.position.z=0.022;g.add(sh);
    for(let i=0;i<5;i++){const ln=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.003,0.001),L('#5a4a3a'));ln.position.set(0,0.06-i*0.03,0.024);g.add(ln);}}
  else if(k==='amuleto'){if(MODE==='roma'){const b=new THREE.Mesh(new THREE.ConeGeometry(0.03,0.09,8),bronze);b.position.y=0.045;g.add(b);
      const h=new THREE.Mesh(new THREE.SphereGeometry(0.017,8,6),bronze);h.position.y=0.105;g.add(h);
      const r=new THREE.Mesh(new THREE.CylinderGeometry(0.004,0.004,0.06,5),bronze);r.position.set(0.03,0.08,0);r.rotation.z=-0.6;g.add(r);   // el cuerno de la abundancia (o la pátera) que lleva el Lar
      const p=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.028,0.012,10),bronze);g.add(p);}
    else if(state&&state.fest&&state.fest.orficos){const l=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.04,0.001),L('#e0b84a'));g.add(l);}
    else{const st=L('#5a4030');for(let i=0;i<4;i++){const b=new THREE.Mesh(new THREE.CylinderGeometry(0.003,0.004,0.08,4),st);b.position.set(i*0.015-0.02,i*0.02,0);b.rotation.z=0.4-i*0.25;g.add(b);
      const f=new THREE.Mesh(new THREE.SphereGeometry(0.008,6,4),L(i%2?'#f2ece0':'#5f7a45'));f.position.set(i*0.02-0.01,0.05+i*0.02,0);g.add(f);}}}
  else return null;
  g.traverse(o=>{if(o.isMesh){o.castShadow=false;o.renderOrder=2;}});HELD.models[key]=g;return g;}
function heldWant(){try{if(typeof ui==='undefined'||(ui!=='play'&&ui!=='dialog')||typeof HBAR==='undefined')return null;if(document.body.classList.contains('photo'))return null;
  const it=hbSlots()[HBAR.sel];if(!it||!it.has()||it.k==='antorcha'||it.k==='caballo'||it.k==='alas')return null;if(typeof FLY!=='undefined'&&FLY.on)return null;return it.k;}catch(e){return null;}}
const _hv=new THREE.Vector3();
function heldUpdate(dt){const k=heldWant();HELD.t+=dt||0;
  if(k!==HELD.k){if(HELD.g)scene.remove(HELD.g);HELD.g=null;HELD.k=k;if(k){const m=heldModel(k);if(m){HELD.g=m;scene.add(m);}}}
  const g=HELD.g;if(!g)return;
  const bob=Math.sin(HELD.t*1.6)*0.006;
  if(AVATAR.view3){const body=MOUNT.riding?AVATAR.rider:AVATAR.walk,arm=body&&body.visible!==false&&body.userData.arms&&body.userData.arms[1];
    if(arm){arm.rotation.x=-0.6;body.updateMatrixWorld(true);_hv.set(0,-0.58,0.08);arm.localToWorld(_hv);g.position.copy(_hv);g.rotation.set(0,player.yaw,0);g.rotateX(-0.4);g.scale.setScalar(1);}
    else{const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw),rx=Math.cos(player.yaw),rz=-Math.sin(player.yaw);g.position.set(player.x+rx*0.32+fx*0.3,player.feet+(MOUNT.riding?2.2:1.15),player.z+rz*0.32+fz*0.3);g.rotation.set(0,player.yaw,0);}}
  else{camera.updateMatrixWorld();_hv.set(0.3,-0.3+bob,-0.62);camera.localToWorld(_hv);g.position.copy(_hv);g.quaternion.copy(camera.quaternion);g.rotateY(-0.35);g.rotateX(0.25);g.scale.setScalar(1);}}
{const f=updateTorch;updateTorch=function(dt,t){const r=f.apply(this,arguments);try{heldUpdate(dt);}catch(e){if(!HELD.err){HELD.err=1;console.warn('objeto en la mano',e);}}return r;};}
