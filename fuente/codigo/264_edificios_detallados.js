// ============================================================ EDIFICIOS DETALLADOS (27/11)
// Casas modeladas de nuevo en Blender (herramientas/blender/edificios.py → modelos/edificios.glb → #glbed), con las mismas medidas,
// origen y orientación que las sencillas de atenas_modelos.glb (H_gra, H_grb, H_grc, H_farm, H_dom, H_insa, H_insb):
// tejas planas y cobijas con antefijas, cumbrera, cabezas de vigas, zócalo de piedra, puertas de dos hojas con clavos, ventanas con
// postigos, patio empedrado con pórtico (pastas), altar y brocal de cisterna; granja con era, pithoi, horno y cerca de piedra seca;
// domus con tabernae, fauces, compluvio, impluvio y peristilo; ínsulas con tiendas de arco, balcón de madera y postigos.
// Cada zona de casas (chunked, celdas de 420 m) usa el modelo detallado si está a menos de ED.D y el sencillo si está más lejos:
// el juego ya decide por zonas (CHUNKS: near/far), así que no se dibujan los dos a la vez.
const ED={ok:false,D:650,map:{H_gra:'H2_gra',H_grb:'H2_grb',H_grc:'H2_grc',H_farm:'H2_farm',H_dom:'H2_dom',H_insa:'H2_insa',H_insb:'H2_insb'},n:0};
try{if(typeof ACC!=='undefined'&&ACC.lite)ED.D=420;if(typeof isTouch!=='undefined'&&isTouch)ED.D=Math.min(ED.D,480);}catch(e){}
function edParse(done){let p;try{p=bpBytes('glbed');}catch(e){done();return;}
  p.then(buf=>{if(!buf){done();return;}new THREE.GLTFLoader().parse(buf,'',gl=>{gl.scene.updateMatrixWorld(true);
    for(const o of gl.scene.children){if(!/^H2_/.test(o.name))continue;const inv=new THREE.Matrix4().copy(o.parent.matrixWorld).invert(),list=[];
      o.traverse(m=>{if(m.isMesh){m.geometry.computeBoundingSphere();list.push({geo:m.geometry,role:m.material.name,mat:new THREE.Matrix4().multiplyMatrices(inv,m.matrixWorld)});}});
      // cada objeto es una pieza «H2_x_papel», como en atenas_modelos.glb
      GLB.parts[o.name]={pos:new THREE.Vector3(),meshes:list.map(m=>Object.assign(m,{mat:m.mat}))};ED.n++;}
    ED.ok=ED.n>0;done();},e=>{console.warn('edificios',e);done();});}).catch(e=>{console.warn('edificios',e);done();});}
{const f=loadModels;loadModels=function(done){return f.call(this,()=>{try{edParse(done);}catch(e){console.warn('edificios',e);done();}});};}
{const f=placeModules;placeModules=function(prefix,items,opt){const k=ED.map[prefix];
  if(!ED.ok||!k||!Object.keys(GLB.parts).some(n=>n.indexOf(k+'_')===0))return f.apply(this,arguments);
  const o=Object.assign({},opt||{});f.call(this,prefix,items,Object.assign({},o,{near:ED.D}));   // sencilla, de lejos
  f.call(this,k,items,Object.assign({},o,{far:ED.D}));};}                                         // detallada, de cerca
