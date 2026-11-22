// ============================================================ JUGAR DESDE EL ARCHIVO SUELTO (atenas_un_archivo.html, con doble clic)
// Abierto como archivo, la partida se guarda en el navegador, pero no siempre sobrevive a un cambio de archivo: Firefox la separa según la
// carpeta y el nombre del archivo; en otro ordenador, en una ventana privada o en equipos que se limpian al cerrar sesión, se pierde.
// Por eso, solo en ese caso: al empezar, un aviso con un botón para guardar la partida en un archivo; y cada 40 minutos de juego, un recordatorio breve.
// En la web (GitHub Pages, Moodle…) y en Claude no sale nada.
const AS={on:location.protocol==='file:',t:0,shown:false};
function asMsg(){vmS('💾','Tu partida','Estás jugando desde el archivo','<p>Tu progreso se guarda en este navegador, pero puede perderse si cambias el archivo del juego por otro nuevo, si juegas en otro ordenador o en una ventana privada, o si se borran los datos del navegador.</p>'+
  '<p><b>Antes de cambiar de archivo o de ordenador, guarda tu partida</b> (Esc → Partida → Guardar partida). Se descarga un archivo; en el juego nuevo, ábrelo con «Cargar partida».</p>',
  [['Guardar la partida ahora',()=>{closeDialog();try{exportSave();}catch(e){}},'quiz'],['Ahora no',()=>closeDialog()]]);}
function asTick(dt){if(!AS.on||!state||ui==='start')return;if(!AS.shown){if(ui!=='play')return;AS.shown=true;AS.t=0;setTimeout(()=>{if(ui==='play')asMsg();},4000);return;}
  if(ui==='play')AS.t+=dt;if(AS.t>=2400){AS.t=0;toast('<span class="label">Tu partida</span><br>Llevas un buen rato jugando: guarda una copia de tu partida (Esc → Partida → Guardar partida).');}}
{const f=gfTick;gfTick=function(dt){const r=f.apply(this,arguments);try{asTick(dt);}catch(e){}return r;};}
