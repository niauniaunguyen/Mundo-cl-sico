# Envolturas

Generado por `herramientas/indice_modulos.py` al construir.

Muchos módulos amplían una función de otro sin tocarla: `{const f=X;X=function(…){f(…); …lo nuevo…}}`.
Esta tabla dice, para cada función ampliada, dónde nace y qué módulos la amplían, en orden (`número de módulo:línea`).
Al llamar a la función se ejecuta primero la última capa, que llama a la anterior, y así hasta la original.
`herramientas/pruebas/comprobar.js` falla si una capa apunta a algo que no es una función, y avisa si una capa no llama a la anterior.

279 funciones ampliadas, 518 capas.

| Función | Nace en | Capas | Ampliada en |
|---|---|---:|---|
| `uxTick` | `091_para_que_sirven_los_objetos.js` | 60 | `146`:39 · `146`:85 · `146`:138 · `146`:156 · `148`:158 · `149`:354 · `151`:84 · `154`:32 · `156`:62 · `157`:84 · `158`:44 · `160`:32 · `164`:18 · `165`:46 · `166`:41 · `168`:45 · `170`:24 · `171`:38 · `172`:68 · `172`:118 · `173`:11 · `174`:48 · `175`:118 · `176`:30 · `179`:75 · `180`:67 · `181`:57 · `182`:68 · `184`:62 · `184`:84 · `186`:119 · `186`:154 · `186`:176 · `196`:38 · `196`:48 · `196`:88 · `198`:60 · `199`:38 · `200`:61 · `202`:76 · `203`:89 · `204`:185 · `205`:174 · `206`:50 · `208`:25 · `208`:148 · `208`:207 · `209`:16 · `211`:120 · `212`:105 · `213`:161 · `214`:130 · `215`:50 · `216`:155 · `217`:91 · `218`:72 · `218`:83 · `219`:81 · `220`:35 · `222`:65 |
| `egxAct0` | `060_egipto_2.js` | 22 | `113`:116 · `114`:118 · `117`:78 · `118`:73 · `119`:84 · `120`:100 · `120`:149 · `125`:37 · `132`:208 · `139`:49 · `140`:34 · `149`:352 · `150`:16 · `152`:70 · `153`:46 · `172`:100 · `175`:117 · `177`:88 · `178`:64 · `179`:72 · `204`:184 · `211`:87 |
| `atCands` | `085_mirar_con_atencion.js` | 11 | `106`:201 · `126`:43 · `127`:121 · `133`:29 · `137`:46 · `146`:16 · `173`:21 · `197`:10 · `197`:16 · `214`:127 · `218`:49 |
| `gmDo` | `068_menu_del_juego.js` | 8 | `099`:138 · `101`:73 · `212`:22 · `213`:123 · `216`:142 · `219`:83 · `220`:104 · `223`:18 |
| `gmRight` | `121_menu_de_esc.js` | 8 | `134`:26 · `138`:40 · `148`:139 · `158`:40 · `166`:38 · `179`:73 · `180`:42 · `202`:74 |
| `dzReport` | `151_diez_ideas.js` | 7 | `154`:17 · `158`:43 · `162`:10 · `166`:44 · `169`:18 · `180`:27 · `192`:62 |
| `accMenu` | `099_para_aprender_y_ensenar.js` | 6 | `148`:150 · `151`:75 · `180`:60 · `189`:34 · `191`:14 · `200`:58 |
| `openDialog` | `015_dialogo.js` | 6 | `131`:88 · `151`:63 · `154`:10 · `170`:28 · `170`:45 · `211`:46 |
| `updateSky` | `003_escena.js` | 6 | `089`:6 · `090`:90 · `123`:74 · `207`:18 · `208`:206 · `212`:34 |
| `answer` | `015_dialogo.js` | 5 | `091`:38 · `092`:46 · `148`:58 · `154`:11 · `180`:22 |
| `bpMake` | `184_personajes_blender.js` | 5 | `186`:68 · `196`:42 · `214`:66 · `218`:17 · `221`:55 |
| `chunked` | `005_modelos_de_blender.js` | 5 | `155`:21 · `182`:51 · `182`:96 · `183`:58 · `215`:13 |
| `eduEntries` | `099_para_aprender_y_ensenar.js` | 5 | `100`:118 · `101`:71 · `102`:27 · `105`:504 · `106`:197 |
| `fareOf` | `016_viajes_en_barco.js` | 5 | `052`:509 · `090`:102 · `091`:52 · `097`:70 · `202`:60 |
| `int2Room` | `204_puertas_a_interiores.js` | 5 | `206`:52 · `208`:27 · `210`:39 · `214`:29 · `217`:85 |
| `renderOpts` | `015_dialogo.js` | 5 | `151`:23 · `166`:27 · `170`:37 · `175`:45 · `175`:79 |
| `bpKind` | `184_personajes_blender.js` | 4 | `196`:16 · `196`:41 · `196`:69 · `218`:11 |
| `regionName` | `052_las_nueve_musas_mnemosine_y.js` | 4 | `082`:49 · `084`:9 · `105`:503 · `900`:311 |
| `sail` | `016_viajes_en_barco.js` | 4 | `090`:99 · `091`:35 · `099`:102 · `151`:59 |
| `toast` | `014_hud.js` | 4 | `120`:131 · `128`:68 · `173`:8 · `200`:37 |
| `applyFlats` | `001_terreno.js` | 3 | `146`:60 · `185`:64 · `900`:406 |
| `buildIslandMesh` | `012_escenarios_cuadrados.js` | 3 | `161`:13 · `222`:45 · `900`:446 |
| `checkZone` | `014_hud.js` | 3 | `105`:502 · `204`:192 · `900`:310 |
| `destTrees` | `013_destinos_nuevos_grecia_italia_hispania.js` | 3 | `125`:39 · `222`:53 · `900`:451 |
| `finishColumns` | `007_campos_del_atica_y_de.js` | 3 | `113`:122 · `193`:46 · `900`:434 |
| `gsTick` | `128_gestos.js` | 3 | `128`:56 · `128`:110 · `129`:47 |
| `hbRender` | `087_la_barra_de_objetos_como.js` | 3 | `091`:57 · `097`:66 · `225`:213 |
| `interact` | `042_entrada.js` | 3 | `127`:138 · `168`:44 · `175`:64 |
| `makePerson` | `009_personas.js` | 3 | `116`:318 · `184`:12 · `186`:80 |
| `mgPay` | `177_oficios.js` | 3 | `179`:39 · `211`:47 · `213`:108 |
| `pdData` | `162_panel_docente.js` | 3 | `166`:46 · `169`:21 · `180`:28 |
| `personWalk` | `052_las_nueve_musas_mnemosine_y.js` | 3 | `129`:80 · `146`:162 · `184`:55 |
| `phToggle` | `086_el_anfiteatro_flavio_por_dentro.js` | 3 | `089`:37 · `134`:22 · `211`:114 |
| `readSign` | `015_dialogo.js` | 3 | `190`:53 · `192`:57 · `202`:62 |
| `updateTorch` | `040_caballo.js` | 3 | `090`:88 · `201`:57 · `202`:63 |
| `animal` | `052_las_nueve_musas_mnemosine_y.js` | 2 | `093`:23 · `198`:26 |
| `atDescOf` | `103_mirar_con_atencion.js` | 2 | `103`:33 · `103`:48 |
| `atShow` | `085_mirar_con_atencion.js` | 2 | `100`:142 · `134`:23 |
| `atTick` | `085_mirar_con_atencion.js` | 2 | `100`:143 · `134`:24 |
| `betterTrees` | `052_las_nueve_musas_mnemosine_y.js` | 2 | `159`:60 · `183`:49 |
| `bpConv` | `196_multitudes_con_modelos.js` | 2 | `196`:78 · `218`:20 |
| `bpTick` | `184_personajes_blender.js` | 2 | `214`:119 · `217`:32 |
| `buildAvatar` | `040_caballo.js` | 2 | `101`:52 · `900`:411 |
| `buildGeoGR` | `052_las_nueve_musas_mnemosine_y.js` | 2 | `125`:11 · `900`:412 |
| `buildTerrain` | `006_murallas_circuito_de_temistocles_reconstruido.js` | 2 | `161`:26 · `900`:427 |
| `colSetup` | `086_el_anfiteatro_flavio_por_dentro.js` | 2 | `120`:137 · `900`:405 |
| `drawCompass` | `014_hud.js` | 2 | `218`:27 · `225`:215 |
| `eduReport` | `099_para_aprender_y_ensenar.js` | 2 | `106`:216 · `111`:140 |
| `egxSetup` | `060_egipto_2.js` | 2 | `140`:98 · `900`:375 |
| `entablature` | `007_campos_del_atica_y_de.js` | 2 | `182`:12 · `193`:17 |
| `fireStart` | `175_actividades_dinamicas.js` | 2 | `180`:65 · `218`:85 |
| `floorAt` | `001_terreno.js` | 2 | `105`:501 · `900`:308 |
| `gdTick` | `115_rutinas_y_sonido_por_zonas.js` | 2 | `203`:73 · `206`:31 |
| `glbPart` | `005_modelos_de_blender.js` | 2 | `128`:139 · `176`:7 |
| `gsRest` | `128_gestos.js` | 2 | `128`:107 · `129`:84 |
| `gsRig` | `128_gestos.js` | 2 | `128`:105 · `129`:82 |
| `hbOdre` | `087_la_barra_de_objetos_como.js` | 2 | `090`:114 · `091`:29 |
| `hbSetup` | `087_la_barra_de_objetos_como.js` | 2 | `120`:108 · `900`:379 |
| `hbTablilla` | `087_la_barra_de_objetos_como.js` | 2 | `091`:42 · `097`:100 |
| `infAct` | `072_misiones_finales_de_las_cualidades.js` | 2 | `085`:52 · `097`:98 |
| `lrnSummary` | `148_aprender.js` | 2 | `151`:41 · `154`:25 |
| `natAct` | `093_la_naturaleza_entre_las_ciudades.js` | 2 | `093`:227 · `097`:89 |
| `natSetup` | `093_la_naturaleza_entre_las_ciudades.js` | 2 | `093`:228 · `900`:386 |
| `netList` | `045_modo_libre_en_linea_hasta.js` | 2 | `171`:49 · `180`:53 |
| `netPresence` | `045_modo_libre_en_linea_hasta.js` | 2 | `211`:117 · `213`:151 |
| `newDay` | `014_hud.js` | 2 | `090`:109 · `202`:61 |
| `pdRender` | `162_panel_docente.js` | 2 | `169`:23 · `180`:29 |
| `phShot` | `086_el_anfiteatro_flavio_por_dentro.js` | 2 | `211`:48 · `213`:113 |
| `playerLook` | `040_caballo.js` | 2 | `076`:135 · `101`:50 |
| `profeOpen` | `052_las_nueve_musas_mnemosine_y.js` | 2 | `162`:32 · `180`:41 |
| `progAct` | `076_progresion.js` | 2 | `083`:82 · `090`:104 |
| `rdAct` | `095_los_caminos_mas_vivos.js` | 2 | `095`:69 · `098`:81 |
| `spMenu` | `088_los_espiritus.js` | 2 | `090`:112 · `091`:54 |
| `toggleTorch` | `040_caballo.js` | 2 | `090`:84 · `091`:8 |
| `treesGLB` | `005_modelos_de_blender.js` | 2 | `126`:11 · `155`:23 |
| `updateStats` | `014_hud.js` | 2 | `077`:78 · `199`:35 |
| `v2Spd` | `114_vida_2.js` | 2 | `174`:16 · `202`:59 |
| `wxSpeed` | `090_el_tiempo.js` | 2 | `091`:31 · `097`:69 |
| `wxTick` | `090_el_tiempo.js` | 2 | `097`:68 · `204`:187 |
| `accApply` | `099_para_aprender_y_ensenar.js` | 1 | `189`:39 |
| `accSave` | `099_para_aprender_y_ensenar.js` | 1 | `154`:31 |
| `accSpeak` | `099_para_aprender_y_ensenar.js` | 1 | `160`:15 |
| `addRiver` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `188`:62 |
| `amb2Setup` | `104_ambientacion_2.js` | 1 | `900`:357 |
| `ambAct` | `102_ambientacion.js` | 1 | `150`:18 |
| `ambSetup` | `102_ambientacion.js` | 1 | `900`:358 |
| `amTalk` | `149_atenea_minerva.js` | 1 | `160`:28 |
| `animalGLB` | `011_construccion_del_mundo.js` | 1 | `198`:24 |
| `artPerson` | `073_artistas_del_386_a_c.js` | 1 | `100`:125 |
| `artSetup` | `073_artistas_del_386_a_c.js` | 1 | `900`:359 |
| `asEnd` | `152_asamblea_senado.js` | 1 | `170`:21 |
| `atalSetup` | `071_atalanta_atenas_y_camila_roma.js` | 1 | `900`:360 |
| `atGlowSet` | `100_paredes_solidas_en_todos_los.js` | 1 | `103`:19 |
| `atGround` | `127_mirar_con_atencion_3.js` | 1 | `146`:30 |
| `athensDecor` | `034_atenas.js` | 1 | `900`:407 |
| `atPick` | `085_mirar_con_atencion.js` | 1 | `127`:85 |
| `atUpdate` | `085_mirar_con_atencion.js` | 1 | `100`:141 |
| `boatExit` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `105`:500 |
| `boatTick` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `105`:499 |
| `bpCrowds` | `196_multitudes_con_modelos.js` | 1 | `196`:46 |
| `bpSetup` | `184_personajes_blender.js` | 1 | `186`:121 |
| `bpSwap` | `184_personajes_blender.js` | 1 | `196`:28 |
| `buildAcropolis` | `011_construccion_del_mundo.js` | 1 | `900`:408 |
| `buildAgora` | `011_construccion_del_mundo.js` | 1 | `900`:409 |
| `buildAthensSchools` | `033_escuelas_y_clases_atenas_y.js` | 1 | `900`:410 |
| `buildBarco` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `900`:361 |
| `buildBirds` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `900`:362 |
| `buildCarters` | `051_conversaciones_que_se_oyen_por.js` | 1 | `900`:363 |
| `buildCasa` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `900`:364 |
| `buildConvs` | `051_conversaciones_que_se_oyen_por.js` | 1 | `900`:365 |
| `buildDaedalus` | `047_dedalo_encerrado_en_su_propio.js` | 1 | `900`:366 |
| `buildFauna` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `900`:367 |
| `buildGods` | `041_dioses.js` | 1 | `900`:413 |
| `buildHandTorch` | `040_caballo.js` | 1 | `900`:368 |
| `buildHarbor` | `012_escenarios_cuadrados.js` | 1 | `900`:414 |
| `buildHouses` | `011_construccion_del_mundo.js` | 1 | `900`:415 |
| `buildIslands` | `013_destinos_nuevos_grecia_italia_hispania.js` | 1 | `900`:416 |
| `buildKerameikos` | `011_construccion_del_mundo.js` | 1 | `900`:417 |
| `buildLandRoute` | `013_destinos_nuevos_grecia_italia_hispania.js` | 1 | `900`:418 |
| `buildMount` | `040_caballo.js` | 1 | `900`:419 |
| `buildMusas` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `900`:369 |
| `buildMyHouse` | `039_tu_casa_atenas.js` | 1 | `900`:420 |
| `buildOutskirts` | `011_construccion_del_mundo.js` | 1 | `900`:421 |
| `buildPerformers` | `013_destinos_nuevos_grecia_italia_hispania.js` | 1 | `900`:422 |
| `buildPort` | `012_escenarios_cuadrados.js` | 1 | `900`:447 |
| `buildRaphaelHall` | `037_la_escuela_de_atenas_de.js` | 1 | `900`:423 |
| `buildRome` | `029_roma.js` | 1 | `900`:424 |
| `buildSimple` | `012_escenarios_cuadrados.js` | 1 | `900`:448 |
| `buildSocial` | `013_destinos_nuevos_grecia_italia_hispania.js` | 1 | `900`:425 |
| `buildSouthSlope` | `011_construccion_del_mundo.js` | 1 | `900`:426 |
| `buildSpheres` | `038_esferas_de_sueno.js` | 1 | `900`:370 |
| `buildTorches` | `011_construccion_del_mundo.js` | 1 | `900`:428 |
| `buildTour` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `900`:371 |
| `buildTrees` | `011_construccion_del_mundo.js` | 1 | `900`:429 |
| `buildTucGR` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `900`:430 |
| `buildWalls` | `011_construccion_del_mundo.js` | 1 | `900`:431 |
| `buildWorld` | `011_construccion_del_mundo.js` | 1 | `900`:442 |
| `chooseMode` | `900_creta_y_arranque.js` | 1 | `147`:63 |
| `closeDialog` | `015_dialogo.js` | 1 | `080`:145 |
| `colsTick` | `?` | 1 | `193`:47 |
| `cvSetup` | `083_el_camino_del_forastero.js` | 1 | `900`:372 |
| `cyAct` | `096_la_ciudad_mas_viva.js` | 1 | `097`:102 |
| `cySetup` | `096_la_ciudad_mas_viva.js` | 1 | `900`:373 |
| `definePlaces` | `011_construccion_del_mundo.js` | 1 | `900`:432 |
| `defineRiversGR` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `900`:433 |
| `defineSimple` | `012_escenarios_cuadrados.js` | 1 | `900`:449 |
| `delfosPlus` | `069_delfos_y_las_termopilas_ampliados.js` | 1 | `900`:374 |
| `destHouses` | `013_destinos_nuevos_grecia_italia_hispania.js` | 1 | `900`:450 |
| `dogTick` | `179_coleccionar.js` | 1 | `216`:139 |
| `drawMap` | `020_plano.js` | 1 | `151`:12 |
| `eduTeacher` | `099_para_aprender_y_ensenar.js` | 1 | `111`:144 |
| `egxAct` | `060_egipto_2.js` | 1 | `103`:15 |
| `egxObj` | `060_egipto_2.js` | 1 | `085`:6 |
| `evTick` | `?` | 1 | `194`:104 |
| `faceTick` | `128_gestos.js` | 1 | `129`:55 |
| `farmAct` | `066_la_granja.js` | 1 | `099`:134 |
| `farmDay` | `066_la_granja.js` | 1 | `099`:126 |
| `farmOfferSetup` | `066_la_granja.js` | 1 | `900`:376 |
| `farmRain` | `066_la_granja.js` | 1 | `090`:106 |
| `farmSetup` | `066_la_granja.js` | 1 | `900`:377 |
| `faunaTalk` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `098`:11 |
| `faunaTick` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `205`:176 |
| `festOfDay` | `050_calendario_de_fiestas.js` | 1 | `055`:44 |
| `findFocus` | `042_entrada.js` | 1 | `218`:25 |
| `finishRoofs` | `008_edificios.js` | 1 | `900`:435 |
| `finSetup` | `072_misiones_finales_de_las_cualidades.js` | 1 | `900`:378 |
| `fxCuadTxt` | `053_forastero_a.js` | 1 | `192`:63 |
| `fxJournal` | `053_forastero_a.js` | 1 | `083`:37 |
| `fxRostral` | `173_arreglos_video.js` | 1 | `173`:38 |
| `gateTravel` | `012_escenarios_cuadrados.js` | 1 | `091`:36 |
| `gmRender` | `068_menu_del_juego.js` | 1 | `134`:44 |
| `grTick` | `156_hierba.js` | 1 | `156`:82 |
| `gsApply` | `128_gestos.js` | 1 | `128`:108 |
| `gsSet` | `128_gestos.js` | 1 | `128`:106 |
| `guideTarget` | `014_hud.js` | 1 | `205`:173 |
| `hbBolsa` | `087_la_barra_de_objetos_como.js` | 1 | `097`:80 |
| `hbIcon` | `087_la_barra_de_objetos_como.js` | 1 | `097`:15 |
| `hbSelect` | `087_la_barra_de_objetos_como.js` | 1 | `218`:32 |
| `hbStrigil` | `087_la_barra_de_objetos_como.js` | 1 | `097`:71 |
| `hdAct` | `084_el_hades_griego.js` | 1 | `097`:96 |
| `hdSetup` | `084_el_hades_griego.js` | 1 | `900`:380 |
| `heldModel` | `201_objeto_en_la_mano.js` | 1 | `205`:164 |
| `honCheck` | `158_honra.js` | 1 | `160`:30 |
| `horaRomana` | `055_los_fastos.js` | 1 | `207`:39 |
| `horseXP` | `046_el_caballo.js` | 1 | `077`:94 |
| `hourLabel` | `003_escena.js` | 1 | `090`:96 |
| `houseApply` | `039_tu_casa_atenas.js` | 1 | `900`:436 |
| `huntTick` | `175_actividades_dinamicas.js` | 1 | `179`:40 |
| `infBuild` | `072_misiones_finales_de_las_cualidades.js` | 1 | `085`:49 |
| `int2Enter` | `204_puertas_a_interiores.js` | 1 | `210`:19 |
| `int2Setup` | `204_puertas_a_interiores.js` | 1 | `208`:17 |
| `islandBase` | `011_construccion_del_mundo.js` | 1 | `188`:29 |
| `jrSetup` | `079_la_jornada_romana_a_partir.js` | 1 | `900`:381 |
| `jump` | `042_entrada.js` | 1 | `174`:28 |
| `ldRun` | `900_creta_y_arranque.js` | 1 | `161`:22 |
| `leySfx` | `208_portal_de_las_leyendas.js` | 1 | `211`:49 |
| `leyTick` | `208_portal_de_las_leyendas.js` | 1 | `210`:103 |
| `libPlain` | `019_biblioteca.js` | 1 | `167`:45 |
| `libSections` | `019_biblioteca.js` | 1 | `167`:44 |
| `loadModels` | `005_modelos_de_blender.js` | 1 | `900`:443 |
| `m386Setup` | `061_sacar_partido_a_los_diez.js` | 1 | `900`:382 |
| `makeBeast` | `038_esferas_de_sueno.js` | 1 | `198`:25 |
| `mareShow` | `046_el_caballo.js` | 1 | `900`:383 |
| `mktSetup` | `058_dias_de_mercado.js` | 1 | `900`:384 |
| `msgBtn` | `200_el_mensajero.js` | 1 | `225`:214 |
| `mtSetup` | `092_ayuda_sin_llevar_de_la.js` | 1 | `900`:385 |
| `natSpring` | `093_la_naturaleza_entre_las_ciudades.js` | 1 | `102`:84 |
| `obSay` | `157_llegada.js` | 1 | `160`:18 |
| `ofSetup` | `057_oficios.js` | 1 | `900`:387 |
| `openJournal` | `019_biblioteca.js` | 1 | `128`:74 |
| `openMap` | `020_plano.js` | 1 | `154`:12 |
| `ovidSetup` | `075_las_metamorfosis_de_ovidio_libros.js` | 1 | `900`:388 |
| `pad` | `011_construccion_del_mundo.js` | 1 | `188`:35 |
| `personMat` | `009_personas.js` | 1 | `183`:18 |
| `phCaption` | `086_el_anfiteatro_flavio_por_dentro.js` | 1 | `151`:81 |
| `pjAvatar` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `101`:51 |
| `pjGreet` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `129`:79 |
| `placeNewNPCs` | `013_destinos_nuevos_grecia_italia_hispania.js` | 1 | `900`:438 |
| `placeNPCs` | `011_construccion_del_mundo.js` | 1 | `900`:437 |
| `placeReliefs` | `013_destinos_nuevos_grecia_italia_hispania.js` | 1 | `900`:439 |
| `placeWalkers` | `011_construccion_del_mundo.js` | 1 | `900`:440 |
| `popSetup` | `100_paredes_solidas_en_todos_los.js` | 1 | `900`:389 |
| `poseDream` | `037_la_escuela_de_atenas_de.js` | 1 | `900`:441 |
| `progSetup` | `076_progresion.js` | 1 | `900`:390 |
| `qcSetup` | `082_canteras_y_pigmentos.js` | 1 | `900`:391 |
| `rcSetup` | `098_el_campo.js` | 1 | `900`:392 |
| `rdSetup` | `095_los_caminos_mas_vivos.js` | 1 | `900`:393 |
| `recarveIsland` | `052_las_nueve_musas_mnemosine_y.js` | 1 | `185`:55 |
| `rfFloor` | `091_para_que_sirven_los_objetos.js` | 1 | `173`:14 |
| `rfSetup` | `091_para_que_sirven_los_objetos.js` | 1 | `146`:62 |
| `romaColosseum` | `029_roma.js` | 1 | `086`:7 |
| `romaTheatres` | `032_glosario_lateral.js` | 1 | `900`:394 |
| `sealFootprints` | `002_colisiones.js` | 1 | `900`:395 |
| `sfxCoin` | `004_sonido_sintesis_sin_archivos.js` | 1 | `077`:24 |
| `sfxOficio` | `057_oficios.js` | 1 | `128`:79 |
| `showArticle` | `019_biblioteca.js` | 1 | `167`:46 |
| `spAct` | `088_los_espiritus.js` | 1 | `150`:20 |
| `spSetup` | `088_los_espiritus.js` | 1 | `900`:396 |
| `startQuiz` | `015_dialogo.js` | 1 | `087`:74 |
| `startStory` | `044_modo_historia.js` | 1 | `111`:137 |
| `stKind` | `186_caras_cuerpos_y_estatuas.js` | 1 | `218`:8 |
| `storyFinale` | `044_modo_historia.js` | 1 | `111`:133 |
| `storyNext` | `044_modo_historia.js` | 1 | `128`:73 |
| `swAct` | `105_mar_abierto.js` | 1 | `106`:86 |
| `swAction` | `105_mar_abierto.js` | 1 | `106`:93 |
| `swEnterSeg` | `105_mar_abierto.js` | 1 | `106`:75 |
| `swLand` | `105_mar_abierto.js` | 1 | `106`:81 |
| `swLeaveBoat` | `105_mar_abierto.js` | 1 | `106`:85 |
| `swOwnerTalk` | `105_mar_abierto.js` | 1 | `111`:103 |
| `swRow` | `105_mar_abierto.js` | 1 | `106`:97 |
| `swTick` | `105_mar_abierto.js` | 1 | `106`:100 |
| `termoPlus` | `069_delfos_y_las_termopilas_ampliados.js` | 1 | `900`:397 |
| `terrainH` | `001_terreno.js` | 1 | `900`:309 |
| `terrainH0` | `001_terreno.js` | 1 | `001`:94 |
| `thfSpawn` | `174_movimiento_dinamico.js` | 1 | `180`:66 |
| `thfTick` | `174_movimiento_dinamico.js` | 1 | `179`:68 |
| `tpDecorate` | `113_templos_por_dentro.js` | 1 | `173`:36 |
| `tpStatue` | `113_templos_por_dentro.js` | 1 | `197`:5 |
| `trPrice` | `099_para_aprender_y_ensenar.js` | 1 | `211`:52 |
| `tryMove` | `043_bucle.js` | 1 | `168`:43 |
| `ttSetup` | `094_petteia_y_ludus_latrunculorum.js` | 1 | `900`:398 |
| `tutStart` | `049_discipulos.js` | 1 | `157`:82 |
| `twStart` | `064_game_feel_2.js` | 1 | `078`:345 |
| `urbScaffold` | `074_urbanismo.js` | 1 | `173`:35 |
| `urbSetup` | `074_urbanismo.js` | 1 | `900`:399 |
| `uxThiefTick` | `091_para_que_sirven_los_objetos.js` | 1 | `174`:43 |
| `visSetup` | `089_mejoras_visuales_2.js` | 1 | `900`:400 |
| `vmFrum` | `081_vida_y_muerte.js` | 1 | `083`:80 |
| `vmSetup` | `081_vida_y_muerte.js` | 1 | `900`:401 |
| `vocSetup` | `078_vocabulario.js` | 1 | `900`:402 |
| `vtProbe` | `168_saltar_muretes.js` | 1 | `174`:22 |
| `vtTick` | `168_saltar_muretes.js` | 1 | `174`:24 |
| `vuSetup` | `056_vida_urbana.js` | 1 | `900`:403 |
| `warSetup` | `093_la_naturaleza_entre_las_ciudades.js` | 1 | `900`:404 |
| `wildBuild` | `093_la_naturaleza_entre_las_ciudades.js` | 1 | `093`:232 |
| `windMat` | `064_game_feel_2.js` | 1 | `155`:14 |
| `windTick` | `064_game_feel_2.js` | 1 | `214`:58 |
| `wxBolt` | `090_el_tiempo.js` | 1 | `129`:36 |
| `wxPick` | `090_el_tiempo.js` | 1 | `098`:80 |
