// Traducción de los datos de la versión 4 (se añaden a DT)
(function(){
const add = (l, o) => { const D = DT[l]; for (const k in o){ if (Array.isArray(o[k]) && Array.isArray(D[k])) D[k].push(...o[k]); else if (k === 'E'){ for (const t in o.E) D.E[t] = Object.assign(D.E[t] || {}, o.E[t]); } else Object.assign(D[k], o[k]); } };
add('ca', {
  T:{
    tbc:['Bacil de la tuberculosi','Tuberculosi miliar','La seva paret té una gruixuda capa cèria d\'àcids micòlics que la protegeix de gairebé tot: colorants, anticossos i molts antibiòtics. Sobreviu dins dels macròfags, perquè impedeix que el fagosoma es fusioni amb el lisosoma. Creix molt a poc a poc (es divideix cada 18–24 hores), així que només ataca un torn de cada dos, però és molt resistent.',['Bacteri àcid-alcohol resistent','Paret cèria d\'àcids micòlics','Viu dins dels macròfags','Creixement lent']],
    mal:['Plasmodi de la malària','Malària greu','Protozou que transmet el mosquit Anopheles. Passa la major part del temps dins dels glòbuls vermells, que no tenen MHC-I: cap limfòcit T no el pot veure allà. Durant dos torns està amagat en un eritròcit i al tercer el rebenta i en surten merozoïts exposats. Cada pocs torns provoca un accés de febre que colpeja més fort.',['Protozou apicomplex','S\'amaga als eritròcits','Invisible per als limfòcits T','Cicles de febre']],
    vih:['VIH','Sida','Retrovirus: copia el seu ARN a ADN amb la transcriptasa inversa i s\'integra en el genoma de la cèl·lula. Infecta els limfòcits T CD4, els que coordinen la resposta immunitària: cada torn que passa, els teus anticossos i limfòcits T funcionen pitjor. Cada tres torns s\'amaga en estat latent.',['Retrovirus','Ataca els teus limfòcits T CD4','Muta molt de pressa','S\'integra en el teu ADN'],null,'Virus de la immunodeficiència humana 1'],
    ten:['Tènia','Teniasi','Un animal pluricel·lular, no una cèl·lula: un cuc pla que viu a l\'intestí i pot fer diversos metres. S\'agafa amb les ventoses i els ganxos del seu escòlex i no para de formar nous segments (proglòtides) des del coll: recupera vida cada torn. És massa gran per fagocitar-la; contra ella lluiten els eosinòfils.',['Cuc pla pluricel·lular','Diversos metres de llarg','Tegument protector','Regenera proglòtides']],
  },
  TL:{
    iso:['Isoniazida','Antibiòtic que impedeix fabricar els àcids micòlics, els lípids cerosos de la paret dels micobacteris. Sense ells, la paret s\'esfondra.'],
    art:['Artemisinina','Fàrmac extret de l\'artemísia anual (Artemisia annua). El ferro de l\'hemo que digereix el paràsit activa el seu pont de peròxid i genera radicals lliures. Tu Youyou va rebre el Nobel el 2015 per descobrir-la.'],
    arv:['Antiretrovirals','Inhibidors de la transcriptasa inversa: impedeixen que l\'ARN del VIH es copiï a ADN i s\'integri en el teu genoma.'],
    pzq:['Praziquantel','Antiparasitari que obre l\'entrada de calci al tegument dels cucs plans: el cuc es contrau, es paralitza i es deixa anar de l\'intestí.'],
  },
  E:{
    fago:{tbc:'Mycobacterium tuberculosis sobreviu dins dels macròfags: impedeix que el fagosoma es fusioni amb el lisosoma.',mal:'Només pots engolir els merozoïts solts o els eritròcits infectats.',vih:'El VIH és diminut i a més pot infectar els mateixos macròfags.',ten:'Una tènia fa diversos metres: és impossible fagocitar-la.'},
    lis:{tbc:'La paret cèria d\'àcids micòlics protegeix el seu peptidoglicà.'},
    pen:{tbc:'Els micobacteris resisteixen els β-lactàmics: la seva paret cèria en frena l\'entrada i fabriquen β-lactamases.'},
    uv:{tbc:'La paret gruixuda la protegeix una mica, tot i que la UV sí que la danya: s\'utilitza per desinfectar l\'aire a les sales de tuberculosi.',mal:'És dins dels eritròcits, a la sang: la UV amb prou feines hi arriba.',vih:'La UV danya el seu ARN.',ten:'Un cuc pluricel·lular té teixits que protegeixen el seu ADN.'},
    ac:{tbc:'Els anticossos serveixen de poc contra un bacteri que viu dins dels macròfags.',vih:'Hi ha anticossos neutralitzants contra el VIH, però el virus muta tan de pressa que se\'ls escapa.',ten:'La IgE marca el cuc perquè els eosinòfils l\'ataquin.'},
    anf:{tbc:'Els bacteris no tenen esterols a la membrana.',vih:'El seu embolcall prové de la membrana de la cèl·lula hoste i no té ergosterol.'},
    osm:{mal:'Ni l\'eritròcit ni el paràsit tenen paret: l\'aigua els infla.',vih:'Un virus no és una cèl·lula: no hi ha osmosi que el faci rebentar.',ten:'Un cuc pluricel·lular regula l\'aigua amb les seves cèl·lules excretores (protonefridis).'},
    tc:{tbc:'Els limfòcits T ajuden a tancar el micobacteri en un granuloma, però no l\'eliminen del tot.',mal:'Els eritròcits no tenen MHC-I: els limfòcits T només detecten el paràsit en la fase hepàtica.',vih:'Destrueix les cèl·lules infectades, tot i que el VIH ataca precisament els limfòcits T col·laboradors.'},
    tax:{tbc:'Els bacteris no tenen microtúbuls ni mitosi: es divideixen per fissió binària.',vih:'Un virus no es divideix: el copia la maquinària de la cèl·lula que infecta.',ten:'Els cucs són sensibles als fàrmacs que ataquen els seus microtúbuls: així funciona l\'albendazole.'},
    iso:{def:'Només afecta els micobacteris: els altres organismes no fabriquen àcids micòlics.',tbc:'La isoniazida bloqueja la síntesi d\'àcids micòlics: sense la seva capa cèria, el micobacteri queda indefens.',gp:'Els estafilococs no tenen àcids micòlics a la paret.',bac:'Bacillus no té àcids micòlics a la paret.'},
    art:{def:'L\'artemisinina actua sobre els paràsits de la malària: necessita el ferro de l\'hemo que digereixen dins de l\'eritròcit.',mal:'El ferro de l\'hemo que digereix el paràsit activa l\'artemisinina, que el destrueix amb radicals lliures, fins i tot dins de l\'eritròcit.',can:'S\'investiga contra alguns tumors rics en ferro, però aquí amb prou feines els afecta.'},
    arv:{def:'Només actua sobre els retrovirus, que copien el seu ARN a ADN amb la transcriptasa inversa.',vih:'Sense transcriptasa inversa, l\'ARN del VIH no pot passar a ADN ni integrar-se: el virus deixa de multiplicar-se.',vir:'La grip no té transcriptasa inversa: copia el seu ARN directament a ARN.'},
    pzq:{def:'El praziquantel actua sobre els cucs plans: els organismes unicel·lulars no tenen el seu tegument.',ten:'El calci entra de cop al seu tegument: la tènia es contrau, es paralitza i es deixa anar.'},
  },
  LB:{tbc:['Tinció de Ziehl-Neelsen (àcid-alcohol resistent)','2–4 × 0,3 µm'],mal:['Frotis de sang amb Giemsa','≈ 2 µm dins d\'un eritròcit de 7,5 µm'],vih:['Microscopi electrònic de transmissió','≈ 120 nm'],ten:['Lupa binocular (proglòtides)','2–7 m']},
  SP:[['Malària cerebral','Citoadherència: els eritròcits infectats s\'enganxen als vasos del cervell i el paràsit recupera un 8 % cada torn.']],
});
add('en', {
  T:{
    tbc:['Tuberculosis bacillus','Miliary tuberculosis','Its wall has a thick waxy layer of mycolic acids that protects it from almost everything: dyes, antibodies and many antibiotics. It survives inside macrophages, because it stops the phagosome fusing with the lysosome. It grows very slowly (dividing every 18–24 hours), so it only attacks every other turn, but it is very tough.',['Acid-fast bacterium','Waxy mycolic-acid wall','Lives inside macrophages','Slow growth']],
    mal:['Malaria parasite','Severe malaria','A protozoan spread by the Anopheles mosquito. It spends most of its time inside red blood cells, which have no MHC-I: no T cell can see it there. For two turns it hides in a red cell, and on the third it bursts it and exposed merozoites come out. Every few turns it triggers a fever attack that hits harder.',['Apicomplexan protozoan','Hides in red blood cells','Invisible to T cells','Fever cycles']],
    vih:['HIV','AIDS','A retrovirus: it copies its RNA into DNA with reverse transcriptase and integrates into the cell\'s genome. It infects CD4 T cells, the ones that coordinate the immune response: with every turn that passes, your antibodies and T cells work worse. Every three turns it hides in a latent state.',['Retrovirus','Attacks your CD4 T cells','Mutates very fast','Integrates into your DNA'],null,'Human immunodeficiency virus 1'],
    ten:['Tapeworm','Taeniasis','A multicellular animal, not a cell: a flatworm that lives in the gut and can be several metres long. It holds on with the suckers and hooks of its scolex and keeps growing new segments (proglottids) from its neck: it recovers health every turn. It is far too big to engulf; eosinophils are the ones that fight it.',['Multicellular flatworm','Several metres long','Protective tegument','Regrows proglottids']],
  },
  TL:{
    iso:['Isoniazid','An antibiotic that stops mycobacteria from making mycolic acids, the waxy lipids of their wall. Without them, the wall falls apart.'],
    art:['Artemisinin','A drug extracted from sweet wormwood (Artemisia annua). The iron in the haem the parasite digests activates its peroxide bridge and releases free radicals. Tu Youyou won the 2015 Nobel Prize for discovering it.'],
    arv:['Antiretrovirals','Reverse transcriptase inhibitors: they stop HIV RNA from being copied into DNA and integrating into your genome.'],
    pzq:['Praziquantel','An antiparasitic drug that lets calcium flood into the tegument of flatworms: the worm contracts, is paralysed and lets go of the gut.'],
  },
  E:{
    fago:{tbc:'Mycobacterium tuberculosis survives inside macrophages: it stops the phagosome fusing with the lysosome.',mal:'You can only engulf loose merozoites or infected red cells.',vih:'HIV is tiny and can even infect macrophages themselves.',ten:'A tapeworm is several metres long: there is no way to engulf it.'},
    lis:{tbc:'The waxy mycolic-acid wall protects its peptidoglycan.'},
    pen:{tbc:'Mycobacteria resist β-lactams: their waxy wall keeps them out and they make β-lactamases.'},
    uv:{tbc:'Its thick wall protects it somewhat, though UV does damage it: it is used to disinfect the air in TB wards.',mal:'It is inside red cells, in the blood: UV barely reaches it.',vih:'UV damages its RNA.',ten:'A multicellular worm has tissues that shield its DNA.'},
    ac:{tbc:'Antibodies are of little use against a bacterium that lives inside macrophages.',vih:'There are neutralising antibodies against HIV, but the virus mutates so fast it escapes them.',ten:'IgE tags the worm so eosinophils attack it.'},
    anf:{tbc:'Bacteria have no sterols in their membrane.',vih:'Its envelope comes from the host cell membrane and has no ergosterol.'},
    osm:{mal:'Neither the red cell nor the parasite has a wall: water swells them.',vih:'A virus is not a cell: there is no osmosis to make it burst.',ten:'A multicellular worm controls its water with excretory cells (protonephridia).'},
    tc:{tbc:'T cells help wall the mycobacterium off in a granuloma, but they don\'t wipe it out.',mal:'Red blood cells have no MHC-I: T cells only spot the parasite in its liver stage.',vih:'It destroys infected cells, even though HIV attacks precisely the helper T cells.'},
    tax:{tbc:'Bacteria have no microtubules and no mitosis: they divide by binary fission.',vih:'A virus does not divide: it is copied by the machinery of the cell it infects.',ten:'Worms are sensitive to drugs that attack their microtubules: that is how albendazole works.'},
    iso:{def:'It only affects mycobacteria: other organisms don\'t make mycolic acids.',tbc:'Isoniazid blocks mycolic acid synthesis: without its waxy layer, the mycobacterium is defenceless.',gp:'Staphylococci have no mycolic acids in their wall.',bac:'Bacillus has no mycolic acids in its wall.'},
    art:{def:'Artemisinin acts on malaria parasites: it needs the iron in the haem they digest inside the red cell.',mal:'The iron in the haem the parasite digests activates artemisinin, which destroys it with free radicals, even inside the red cell.',can:'It is being studied against some iron-rich tumours, but here it barely affects them.'},
    arv:{def:'It only acts on retroviruses, which copy their RNA into DNA with reverse transcriptase.',vih:'Without reverse transcriptase, HIV RNA can\'t become DNA or integrate: the virus stops multiplying.',vir:'Flu has no reverse transcriptase: it copies its RNA straight into RNA.'},
    pzq:{def:'Praziquantel acts on flatworms: single-celled organisms don\'t have their tegument.',ten:'Calcium floods into its tegument: the tapeworm contracts, is paralysed and lets go.'},
  },
  LB:{tbc:['Ziehl-Neelsen stain (acid-fast)','2–4 × 0.3 µm'],mal:['Giemsa blood smear','≈ 2 µm inside a 7.5 µm red cell'],vih:['Transmission electron microscope','≈ 120 nm'],ten:['Stereo microscope (proglottids)','2–7 m']},
  SP:[['Cerebral malaria','Cytoadherence: infected red cells stick to the brain\'s blood vessels and the parasite recovers 8 % every turn.']],
});
})();

