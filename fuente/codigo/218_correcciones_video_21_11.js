// ============================================================ CORRECCIONES DEL VÍDEO DE PRUEBA (21/11): personajes
// 1. Estatuas: cualquier figura hecha con materiales de estatua (attrRoles) o con piel, pelo y ropa del mismo color es una estatua:
//    se queda quieta (sin respirar) y de piedra o de metal (186). Antes, las que no reconocía se convertían en personas que respiraban.
// 2. Modelos nuevos también para quien se quedaba con el antiguo: dioses y musas (con su brillo), soldados con casco, figuras con
//    atributos y niños pequeños (escala 0,45-0,6). Las figuritas diminutas (exvotos, adornos) siguen como estaban.
// 3. Más figuras con el modelo nuevo a la vez (BP.K): de lejos se veían muchos modelos antiguos.
const C21={};
{const f=stKind;stKind=function(c){const r=f(c);if(r||!c||c.glow||c.mask)return r;try{const n=s=>(s||'').toLowerCase(),sk=n(c.skin),hr=n(c.hair),ch=n(c.chiton);
  const same=sk&&ch&&sk===ch&&(!hr||hr===sk);if(!c.attrRoles&&!same)return null;const k=new THREE.Color(c.skin||c.chiton||'#ece4d6'),h={};k.getHSL(h);
  return h.l>0.72?'marble':(h.s>0.35&&h.l>0.45&&h.h>0.09&&h.h<0.16)?'gold':'bronze';}catch(e){return null;}};}
{const f=bpKind;bpKind=function(c){let r=f(c);if(r||!c)return r;if(c.statue||c.stKind)return null;
  if(c.scale&&c.scale<0.45)return null;   // figuritas y exvotos
  const ro=MODE==='roma';
  if(c.helmet||c.soldier)return ro?'legionario':'hoplita';
  if(c.glow||c.attrs||c.mask||(c.scale&&c.scale<0.6)){if(c.female)return ro?'romana':'mujer';if(c.toga&&ro)return 'togado';if(ro&&(c.short||c.noHimation))return 'tunicado';return ro?'togado':'ciudadano';}
  return r;};}
{const f=bpMake;bpMake=function(k,c){const g=f.apply(this,arguments);try{if(g&&c&&c.scale&&c.scale<0.6&&c.scale>=0.45){g.scale.multiplyScalar(c.scale);g.userData.young=1;BP_YOUNG.add(g);}
  if(g&&c&&c.glow&&typeof TORCH_TEX!=='undefined'){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:TORCH_TEX,color:c.glow,transparent:true,opacity:0.32,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.set(2.2,2.8,1);s.position.y=1.0;g.add(s);}}catch(e){}return g;};}   // dioses y musas: un halo suave (la figura antigua brillaba)
// las estatuas convertidas no deben tener la figura nueva animada: si alguna llega a bpConv, se marca y no se convierte
{const f=bpConv;bpConv=function(g,force){try{if(g&&g.userData&&(g.userData.stKind||g.userData.cfg&&stKind(g.userData.cfg)))return null;}catch(e){}return f.apply(this,arguments);};}
try{if(!ACC.lite)BP.K=Math.max(BP.K,typeof isTouch!=='undefined'&&isTouch?28:60);}catch(e){}
