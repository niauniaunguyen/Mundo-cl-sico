// ============================================================ ESTATUAS EN «MIRAR CON ATENCIÓN»
// El modo atención (085, 103, 126) no reconocía las estatuas: la de culto de un templo no decía de quién era. Ahora:
//  · las estatuas de culto (tpStatue, 113) llevan el nombre del dios y la ficha del templo (R.st, con su fuente R.src);
//  · las demás estatuas (STB, 186: de mármol pintado, de bronce o doradas) se nombran por su material, con una nota breve.
{const f=tpStatue;tpStatue=function(g,lz,ly,H,R){const n0=STB.list.length;const r=f.apply(this,arguments);
  try{for(let i=n0;i<STB.list.length;i++)STB.list[i].at={name:(MODE==='roma'?'Estatua de ':'Estatua de ')+R.god,sub:'estatua de culto',txt:R.st+(R.src?' ('+R.src+')':''),h:H};}catch(e){}return r;};}
const ST_NOTE={marble:['Estatua de mármol pintado','Las estatuas griegas y romanas no eran blancas: se pintaban con colores vivos (azul egipcio, cinabrio, ocre, púrpura) y los ojos y los labios se coloreaban. El color se ha perdido casi siempre; queda en restos que se ven con luz ultravioleta (Brinkmann, Gods in Color).'],
  bronze:['Estatua de bronce','Las estatuas de bronce se fundían a la cera perdida, en varias piezas que luego se unían. Brillaban como el oro recién pulidas; los ojos eran de piedra o de vidrio y los labios, de cobre. Casi todas se fundieron después para aprovechar el metal.'],
  gold:['Estatua dorada','Una estatua cubierta de oro, o de oro y marfil (crisoelefantina): el oro en la ropa y el marfil en la piel, sobre un armazón de madera. Era la forma más rica de representar a un dios.']};
{const f=atCands;atCands=function(){const C=f.apply(this,arguments);try{const v=new THREE.Vector3();
  for(const s of STB.list){const g=s.g;if(!g||!g.parent)continue;let r=g,vis=true;while(r.parent){if(!r.visible){vis=false;break;}r=r.parent;}if(!vis||r!==scene)continue;
    g.getWorldPosition(v);const sc=(s.c&&s.c.scale)||1,h=(s.at&&s.at.h)||1.8*sc,N=ST_NOTE[s.k]||ST_NOTE.marble,A=s.at;
    C.push({obj:g,x:v.x,y:v.y+h*0.6,z:v.z,r:Math.max(0.8,h*0.35),name:A?A.name:N[0],sub:A?A.sub:(MODE==='roma'?'estatua':'ἄγαλμα · estatua'),txt:()=>A?A.txt:N[1]});}}catch(e){}return C;};}
