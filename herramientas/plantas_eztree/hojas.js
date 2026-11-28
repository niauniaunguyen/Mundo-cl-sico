// Atlas de hojas de los arbustos (1024×512). Lo usan el generador (para la vista previa) y el juego (203_arbustos_de_detalle.js lleva
// una copia: si se cambia aquí, cámbiese allí). Fila de arriba: 4 celdas de 256×256 con un ramillete de hojas; fila de abajo: celda 0, la
// retama (tallos verdes con flores amarillas); celda 1, la corteza. Hojas pintadas a mano según su forma real:
//  0 lentisco: hojas compuestas de foliolos pequeños, ovalados, verde oscuro brillante · 1 mirto: hojas pequeñas, lanceoladas, opuestas,
//  con alguna flor blanca · 2 adelfa: hojas largas y estrechas, coriáceas, y flores rosas · 3 coscoja: hojitas onduladas y dentadas, verde gris
export function hojasAtlas(doc){const c=doc.createElement('canvas');c.width=1024;c.height=512;const x=c.getContext('2d');let s=7;const R=()=>(s=(s*16807)%2147483647)/2147483647;
  const stem=(cx,cy,len,w,col)=>{x.strokeStyle=col;x.lineWidth=w;x.lineCap='round';x.beginPath();x.moveTo(cx,cy);x.quadraticCurveTo(cx+6,cy-len*0.5,cx,cy-len);x.stroke();};
  const leaf=(cx,cy,ang,w,h,col,edge)=>{x.save();x.translate(cx,cy);x.rotate(ang);x.fillStyle=col;x.beginPath();
    if(edge){for(let i=0;i<=16;i++){const t=i/16*Math.PI*2,r=1+(i%2?0.18:0);x.lineTo(Math.sin(t)*w*r,-h/2-Math.cos(t)*h/2*r);} }else x.ellipse(0,-h/2,w,h/2,0,0,Math.PI*2);
    x.fill();x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=1.2;x.beginPath();x.moveTo(0,0);x.lineTo(0,-h*0.9);x.stroke();x.restore();};
  const cell=(i,row,f)=>{x.save();x.translate(i*256+128,row*256+250);f();x.restore();};
  // 0 lentisco
  cell(0,0,()=>{for(let b=0;b<3;b++){const a=(b-1)*0.45;x.save();x.rotate(a);stem(0,0,210,4,'#6a4e36');for(let k=0;k<8;k++){const y=-40-k*21;
      for(const sd of[-1,1])leaf(0,y,sd*1.15,11,30,['#3e5c30','#4a6a38','#36522a'][Math.floor(R()*3)]);}leaf(0,-212,0,11,30,'#45633a');x.restore();}});
  // 1 mirto
  cell(1,0,()=>{for(let b=0;b<3;b++){x.save();x.rotate((b-1)*0.5);stem(0,0,215,3,'#5e4630');for(let k=0;k<10;k++){const y=-30-k*18;
      for(const sd of[-1,1])leaf(0,y,sd*(0.7+R()*0.3),7,26,['#3c5e2c','#466a32','#35552a'][Math.floor(R()*3)]);}
      if(b!==1){x.fillStyle='#f4f0e6';for(let p=0;p<5;p++){x.beginPath();x.arc(Math.cos(p*1.26)*7,-200+Math.sin(p*1.26)*7,5,0,7);x.fill();}x.fillStyle='#e8d070';x.beginPath();x.arc(0,-200,3,0,7);x.fill();}x.restore();}});
  // 2 adelfa
  cell(2,0,()=>{for(let b=0;b<2;b++){x.save();x.rotate((b-0.5)*0.5);stem(0,0,200,4,'#7a6a48');for(let k=0;k<4;k++){const y=-60-k*38;
      for(let w=0;w<3;w++)leaf(0,y,(w-1)*0.9,7,70,['#4f6a3c','#5a7444','#466236'][w]);}
      for(let p=0;p<5;p++){x.fillStyle=['#e6869c','#d9708a','#f0a0b2'][p%3];x.beginPath();x.arc((p-2)*11,-205+Math.abs(p-2)*5,10,0,7);x.fill();}x.restore();}});
  // 3 coscoja
  cell(3,0,()=>{for(let b=0;b<3;b++){x.save();x.rotate((b-1)*0.55);stem(0,0,200,4,'#5c4a38');for(let k=0;k<7;k++){const y=-35-k*24;
      for(const sd of[-1,1])leaf(sd*4,y,sd*(0.9+R()*0.4),12,26,['#5b6a46','#66744e','#4f5e3e'][Math.floor(R()*3)],true);}x.restore();}});
  // retama (fila de abajo, celda 0): varillas verdes casi sin hojas, con flores amarillas en racimo
  cell(0,1,()=>{for(let b=0;b<9;b++){x.save();x.rotate((b-4)*0.11);stem(0,0,230,8,['#5f7a3a','#6a8440','#56703a'][b%3]);
      for(let k=0;k<6;k++){if(k%2&&b%2)continue;x.fillStyle=['#e8c22a','#f0d040','#d9b020'][k%3];x.beginPath();x.ellipse(5,-150-k*14,4,6,0.4,0,7);x.fill();}x.restore();}});
  // corteza (fila de abajo, celda 1): pardo grisáceo con vetas
  x.fillStyle='#6a5a46';x.fillRect(256,256,256,256);for(let i=0;i<60;i++){x.strokeStyle=R()<0.5?'#584a3a':'#7c6c56';x.lineWidth=2+R()*3;const u=256+R()*256;x.beginPath();x.moveTo(u,256);x.lineTo(u+R()*10-5,512);x.stroke();}
  return c;}
// dónde cae cada especie en el atlas (u0,v0 de la celda en coordenadas de textura, con flipY: v=1 arriba del lienzo)
export const CELDA={lentisco:[0,0.5],mirto:[0.25,0.5],adelfa:[0.5,0.5],coscoja:[0.75,0.5],retama:[0,0],corteza:[0.25,0]};
