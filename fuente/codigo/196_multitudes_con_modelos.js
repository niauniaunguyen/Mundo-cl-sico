// ============================================================ MULTITUDES Y PROCESIONES CON LOS MODELOS DE BLENDER
// bpSwap (184) solo cambiaba a los transeúntes que andan (walkers): la gente de las fiestas y acontecimientos (evCrowd, 014) y la de las
// procesiones (194) seguía con la figura sencilla de antes. Ahora se cambian también, con el mismo detalle por distancia (bpLod: de cerca
// el modelo de Blender, de lejos la figura sencilla). Quien lleva bastón ya no se queda fuera (el bastón no se ve en el modelo).
function bpConv(g){if(!g||!g.parent||g.userData.pj||g.userData.bpNo||!g.userData.cfg)return null;if(BP.list.length>=BP.MAXT)return null;
  const c=g.userData.cfg,k=bpKind(c.staff?Object.assign({},c,{staff:false}):c);if(!k||!BP.tpl[k]){g.userData.bpNo=1;return null;}
  const n=bpMake(k,c);if(!n){g.userData.bpNo=1;return null;}
  for(const key in g.userData)if(!['arms','legs','cfg','pvFine','pvFar','pvDone','pvNoBeard','part'].includes(key)&&n.userData[key]===undefined)n.userData[key]=g.userData[key];
  n.userData.cfg=c;n.position.copy(g.position);n.rotation.copy(g.rotation);n.visible=g.visible;const par=g.parent;par.add(n);par.remove(g);
  g.position.set(0,0,0);g.rotation.set(0,0,0);g.visible=false;n.add(g);n.userData.old=g;n.userData.arms=g.userData.arms||n.userData.arms;n.userData.legs=g.userData.legs;
  BP.list.push(n);BP.n[k]=(BP.n[k]||0)+1;return n;}
BP.MAXT+=ACC.lite?40:120;   // sitio para la multitud de una fiesta (solo los BP.K más cercanos se dibujan con el modelo de Blender)
{const f=bpKind;bpKind=function(c){return f(c&&c.staff?Object.assign({},c,{staff:false}):c);};}
function bpCrowds(){if(!Object.keys(BP.tpl).length)return 0;let made=0;
  // quien se fue con la multitud de un día anterior (evCrowd quita el grupo de la escena) deja su sitio en la lista
  const live=g=>{let r=g;while(r.parent)r=r.parent;return r===scene;};for(let i=BP.list.length-1;i>=0;i--)if(!live(BP.list[i]))BP.list.splice(i,1);
  if(typeof EVC!=='undefined'&&EVC.g)for(const o of[...EVC.g.children])if(bpConv(o))made++;
  if(typeof PROC!=='undefined'&&PROC.g)for(const m of PROC.ms){if(m.kind!=='p')continue;const n=bpConv(m.o);if(n){m.o=n;made++;}}
  return made;}
{const f=bpSwap;bpSwap=function(){let made=f.apply(this,arguments)||0;try{const k=bpCrowds();if(k){made+=k;bpLod();}}catch(e){console.warn('multitud',e);}return made;};}
