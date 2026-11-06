// Rubriche fisse: calendario delle uscite e sondaggio della settimana, in tutte le lingue del sito.
//
// CALENDARIO (USCITE): aggiungi o correggi una riga quando un gioco riceve o cambia data.
//   data: "AAAA-MM-GG" se il giorno è confermato, oppure anno: "2027" se c'è solo l'anno.
//   tipo (facoltativo): "versione" = nuova versione di un gioco già uscito altrove; "f2p" = uscita completa gratuita.
//   articolo (facoltativo): slug di un nostro articolo pubblicato sul gioco (es. "gta-6-preload-peso").
//   evidenza: true = il gioco più atteso del momento, con il conto alla rovescia grande.
//   Le uscite passate spariscono da sole dal calendario.
//
// SONDAGGI: uno per settimana, dal lunedì indicato in "dal". Ogni domanda ha da 2 a 5 risposte,
//   nello stesso ordine in tutte le lingue. Non cambiare l'ordine delle risposte di un sondaggio già
//   partito: i voti sono salvati per posizione. Aggiungi le domande nuove in fondo.

export const USCITE = [
  { gioco: "Football Manager 27", data: "2026-11-10", piattaforme: ["PC", "PS5", "Xbox Series X|S"], fonte: "https://www.altchar.com/game-news/football-manager-27-release-date-confirmed-for-november-10-anuUq0Z67TYa" },
  { gioco: "Metaphor: ReFantazio", data: "2026-11-12", piattaforme: ["Switch 2"], tipo: "versione", fonte: "https://www.videogameschronicle.com/guide/upcoming-game-release-dates-schedule/" },
  { gioco: "Pikmin 4 – Nintendo Switch 2 Edition", data: "2026-11-12", piattaforme: ["Switch 2"], tipo: "versione", fonte: "https://www.videogameschronicle.com/guide/upcoming-game-release-dates-schedule/" },
  { gioco: "Grand Theft Auto VI", data: "2026-11-19", piattaforme: ["PS5", "Xbox Series X|S"], articolo: "gta-6-preload-peso", evidenza: true, fonte: "https://www.rockstargames.com/newswire/article/k4ak9okk485712/grand-theft-auto-vi-pre-load-begins-on-november-10" },
  { gioco: "Thief: The Dark Project Remastered", data: "2026-12-03", piattaforme: ["PC", "PS5", "Xbox Series X|S", "Switch 2"], articolo: "thief-remastered-data-uscita", fonte: "https://store.steampowered.com/app/4200960/Thief_The_Dark_Project_Remastered/" },
  { gioco: "Dragon Quest Monsters: The Withered World", data: "2026-12-03", piattaforme: ["PC", "PS5", "Xbox Series X|S", "Switch 2", "Switch"], fonte: "https://www.gematsu.com/2026/06/dragon-quest-monsters-the-withered-world-launches-december-3" },
  { gioco: "Rayman Legends Retold", data: "2026-12-03", piattaforme: ["PC", "PS5", "Xbox Series X|S", "Switch 2"], fonte: "https://gematsu.com/2026/09/rayman-legends-retold-delayed-to-december-3" },
  { gioco: "Warhammer 40,000: Dawn of War IV", data: "2026-12-03", piattaforme: ["PC"], fonte: "https://www.deepsilver.com/games/dawn-of-war-iv/news/release-date-update" },
  { gioco: "Professor Layton and the New World of Steam", data: "2026-12-10", piattaforme: ["PS5", "Switch 2", "Switch", "PC"], fonte: "https://www.nintendolife.com/news/2026/09/professor-layton-and-the-new-world-of-steam-finally-has-a-release-date" },
  { gioco: "Path of Exile 2", data: "2026-12-11", piattaforme: ["PC", "PS5", "Xbox Series X|S"], tipo: "f2p", fonte: "https://www.pushsquare.com/news/2026/08/path-of-exile-2-reaches-1-0-on-11th-december-goes-free-to-play-on-ps5" },
  { gioco: "Forza Horizon 6", data: "2027-01-26", piattaforme: ["PS5"], tipo: "versione", fonte: "https://www.psu.com/news/forza-horizon-6-release-date-officially-set-for-jan-26-2027-on-ps5/" },
  { gioco: "Until Dawn 2", data: "2027-01-28", piattaforme: ["PS5"], fonte: "https://www.gematsu.com/2026/09/until-dawn-2-launches-january-28-2027" },
  { gioco: "Witchbrook", data: "2027-01-28", piattaforme: ["PC", "PS5", "Xbox Series X|S", "Switch 2", "Switch"], fonte: "https://www.invenglobal.com/articles/27856/witchbrook-officially-launching-on-january-28-2027" },
  { gioco: "Metro 2039", data: "2027-02-04", piattaforme: ["PC", "PS5", "Xbox Series X|S"], fonte: "https://www.gematsu.com/2026/09/metro-2039-launches-february-4-2027" },
  { gioco: "Tomb Raider: Legacy of Atlantis", data: "2027-02-12", piattaforme: ["PC", "PS5", "Xbox Series X|S", "Switch 2"], fonte: "https://videogameschronicle.com/news/tomb-raider-legacy-of-atlantis-has-been-delayed-to-2027/" },
  { gioco: "Persona 4 Revival", data: "2027-02-18", piattaforme: ["PC", "PS5", "Xbox Series X|S"], fonte: "https://outof.games/news/10208-the-biggest-games-coming-in-2027-a-release-calendar-roundup/" },
  { gioco: "Fable", data: "2027-02-23", piattaforme: ["PC", "Xbox Series X|S", "PS5"], fonte: "https://en.wikipedia.org/wiki/Fable_(2027_video_game)" },
  { gioco: "Wo Long 2: Wings of Ember", data: "2027-03-04", piattaforme: ["PC", "PS5", "Xbox Series X|S", "Switch 2"], fonte: "https://www.rpgsite.net/news/21411-wo-long-2-wings-of-ember-releases-on-march-4-new-alpha-demo-available" },
  { gioco: "Exodus", data: "2027-04-07", piattaforme: ["PC", "PS5", "Xbox Series X|S"], fonte: "https://www.rpgsite.net/news/21185-exodus-release-date-ps5-xbox-pc-steam" },
  { gioco: "Final Fantasy VII Revelation", data: "2027-04-08", piattaforme: ["PC", "PS5", "Xbox Series X|S", "Switch 2"], fonte: "https://www.videogameschronicle.com/news/square-enix-confirms-final-fantasy-7-revelation-release-date/" },
  { gioco: "God of War Laufey", data: "2027-05-20", piattaforme: ["PS5"], articolo: "god-of-war-laufey-rinvio", fonte: "https://www.videogameschronicle.com/news/god-of-war-laufey-has-officially-been-delayed/" },
  { gioco: "Persona 4 Revival", data: "2027-05-20", piattaforme: ["Switch 2"], tipo: "versione", fonte: "https://outof.games/news/10208-the-biggest-games-coming-in-2027-a-release-calendar-roundup/" },
  { gioco: "The Duskbloods", anno: "2027", piattaforme: ["Switch 2"], articolo: "the-duskbloods-rinvio-2027", fonte: "https://www.videogameschronicle.com/news/fromsoftwares-switch-2-exclusive-the-duskbloods-has-been-delayed-to-2027/" },
];

const NOMI_RETRO = ["NES", "Super Nintendo", "Mega Drive", "PlayStation", "Game Boy"];
const ATTESI_2027 = ["Fable", "Metro 2039", "God of War Laufey", "Tomb Raider: Legacy of Atlantis", "Final Fantasy VII Revelation"];

export const SONDAGGI = [
  { id: "gta-6-day-one", dal: "2026-11-06", testi: {
    it: ["Comprerai GTA 6 al day one?", ["Sì, il 19 novembre", "Prima aspetto le recensioni", "Aspetto la versione PC", "Non mi interessa"]],
    en: ["Will you buy GTA 6 on day one?", ["Yes, on 19 November", "I'll wait for the reviews", "I'm waiting for the PC version", "Not interested"]],
    de: ["Kaufst du GTA 6 direkt zum Release?", ["Ja, am 19. November", "Ich warte auf die Tests", "Ich warte auf die PC-Version", "Interessiert mich nicht"]],
    es: ["¿Comprarás GTA 6 el día de lanzamiento?", ["Sí, el 19 de noviembre", "Esperaré a las reseñas", "Espero la versión de PC", "No me interesa"]],
    no: ["Kjøper du GTA 6 på lanseringsdagen?", ["Ja, 19. november", "Jeg venter på anmeldelsene", "Jeg venter på PC-versjonen", "Ikke interessert"]],
    sv: ["Köper du GTA 6 på releasedagen?", ["Ja, den 19 november", "Jag väntar på recensionerna", "Jag väntar på PC-versionen", "Inte intresserad"]],
    fi: ["Ostatko GTA 6:n heti julkaisupäivänä?", ["Kyllä, 19. marraskuuta", "Odotan ensin arvosteluja", "Odotan PC-versiota", "Ei kiinnosta"]],
    ja: ["GTA 6は発売日に買う？", ["はい、11月19日に", "レビューを見てから", "PC版を待つ", "興味なし"]],
    ru: ["Купите GTA 6 в день релиза?", ["Да, 19 ноября", "Сначала дождусь обзоров", "Жду версию для ПК", "Не интересно"]],
  } },
  { id: "fisico-o-digitale", dal: "2026-11-16", testi: {
    it: ["Fisico o digitale: come compri i tuoi giochi?", ["Sempre in scatola", "Più fisico che digitale", "Più digitale che fisico", "Solo digitale"]],
    en: ["Physical or digital: how do you buy your games?", ["Always boxed copies", "More physical than digital", "More digital than physical", "Digital only"]],
    de: ["Physisch oder digital: Wie kaufst du deine Spiele?", ["Immer als Box", "Eher physisch", "Eher digital", "Nur digital"]],
    es: ["Físico o digital: ¿cómo compras tus juegos?", ["Siempre en caja", "Más físico que digital", "Más digital que físico", "Solo digital"]],
    no: ["Fysisk eller digitalt: hvordan kjøper du spill?", ["Alltid i eske", "Mest fysisk", "Mest digitalt", "Bare digitalt"]],
    sv: ["Fysiskt eller digitalt: hur köper du dina spel?", ["Alltid fysiska utgåvor", "Mest fysiskt", "Mest digitalt", "Bara digitalt"]],
    fi: ["Fyysinen vai digitaalinen: miten ostat pelisi?", ["Aina fyysisenä", "Enimmäkseen fyysisenä", "Enimmäkseen digitaalisena", "Vain digitaalisena"]],
    ja: ["パッケージ版とダウンロード版、どっち派？", ["いつもパッケージ版", "パッケージ版が多め", "ダウンロード版が多め", "ダウンロード版のみ"]],
    ru: ["Диск или цифра: как вы покупаете игры?", ["Всегда на дисках", "Чаще на дисках", "Чаще в цифре", "Только в цифре"]],
  } },
  { id: "remake-o-giochi-nuovi", dal: "2026-11-23", testi: {
    it: ["Remake o giochi nuovi: cosa vorresti vedere di più?", ["Più remake dei classici", "Più giochi completamente nuovi", "Un po' e un po'"]],
    en: ["Remakes or new games: what would you like to see more of?", ["More remakes of classics", "More brand-new games", "A bit of both"]],
    de: ["Remakes oder neue Spiele: Wovon willst du mehr sehen?", ["Mehr Remakes von Klassikern", "Mehr komplett neue Spiele", "Von beidem etwas"]],
    es: ["Remakes o juegos nuevos: ¿qué te gustaría ver más?", ["Más remakes de clásicos", "Más juegos completamente nuevos", "Un poco de todo"]],
    no: ["Remakes eller nye spill: hva vil du se mer av?", ["Flere remakes av klassikere", "Flere helt nye spill", "Litt av begge deler"]],
    sv: ["Remakes eller nya spel: vad vill du se mer av?", ["Fler remakes av klassiker", "Fler helt nya spel", "Lite av båda"]],
    fi: ["Uusioversiot vai uudet pelit: mitä haluaisit nähdä enemmän?", ["Lisää klassikoiden uusioversioita", "Lisää täysin uusia pelejä", "Vähän molempia"]],
    ja: ["リメイクと新作、もっと見たいのはどっち？", ["名作のリメイク", "完全新作", "どちらも同じくらい"]],
    ru: ["Ремейки или новые игры: чего хочется больше?", ["Больше ремейков классики", "Больше совершенно новых игр", "Всего понемногу"]],
  } },
  { id: "console-del-cuore", dal: "2026-11-30", testi: {
    it: ["Quale console d'epoca ti è rimasta nel cuore?", NOMI_RETRO],
    en: ["Which retro console still has a place in your heart?", ["NES", "Super Nintendo", "Mega Drive / Genesis", "PlayStation", "Game Boy"]],
    de: ["Welche Retro-Konsole liegt dir bis heute am Herzen?", NOMI_RETRO],
    es: ["¿Qué consola clásica llevas en el corazón?", NOMI_RETRO],
    no: ["Hvilken retrokonsoll har fortsatt en plass i hjertet ditt?", NOMI_RETRO],
    sv: ["Vilken retrokonsol har fortfarande en plats i ditt hjärta?", NOMI_RETRO],
    fi: ["Mikä retrokonsoli on yhä lähellä sydäntäsi?", NOMI_RETRO],
    ja: ["今も心に残るレトロゲーム機は？", ["ファミコン / NES", "スーパーファミコン", "メガドライブ", "プレイステーション", "ゲームボーイ"]],
    ru: ["Какая ретро-консоль навсегда в вашем сердце?", NOMI_RETRO],
  } },
  { id: "prezzo-massimo", dal: "2026-12-07", testi: {
    it: ["Quanto spenderesti al massimo per un gioco nuovo?", ["Meno di 30 €", "Tra 30 e 50 €", "Tra 50 e 70 €", "Anche più di 70 €"]],
    en: ["What's the most you'd pay for a new game?", ["Under €30", "€30 to €50", "€50 to €70", "More than €70"]],
    de: ["Wie viel würdest du höchstens für ein neues Spiel ausgeben?", ["Unter 30 €", "30 bis 50 €", "50 bis 70 €", "Auch über 70 €"]],
    es: ["¿Cuánto pagarías como máximo por un juego nuevo?", ["Menos de 30 €", "Entre 30 y 50 €", "Entre 50 y 70 €", "Incluso más de 70 €"]],
    no: ["Hva er det meste du ville betalt for et nytt spill?", ["Under 30 euro", "30–50 euro", "50–70 euro", "Over 70 euro"]],
    sv: ["Hur mycket skulle du som mest betala för ett nytt spel?", ["Under 30 euro", "30–50 euro", "50–70 euro", "Över 70 euro"]],
    fi: ["Paljonko maksaisit enintään uudesta pelistä?", ["Alle 30 €", "30–50 €", "50–70 €", "Yli 70 €"]],
    ja: ["新作ゲームに出せる金額は最大いくら？", ["30ユーロ未満", "30〜50ユーロ", "50〜70ユーロ", "70ユーロ以上"]],
    ru: ["Сколько вы максимум заплатите за новую игру?", ["Меньше 30 €", "30–50 €", "50–70 €", "Больше 70 €"]],
  } },
  { id: "abbonamenti", dal: "2026-12-14", testi: {
    it: ["Usi un abbonamento come Game Pass o PlayStation Plus?", ["Sì, più di uno", "Sì, uno solo", "L'avevo, ma l'ho disdetto", "No, mai"]],
    en: ["Do you use a subscription like Game Pass or PlayStation Plus?", ["Yes, more than one", "Yes, just one", "I had one but cancelled", "No, never"]],
    de: ["Nutzt du ein Abo wie Game Pass oder PlayStation Plus?", ["Ja, mehrere", "Ja, eins", "Hatte ich, aber gekündigt", "Nein, nie"]],
    es: ["¿Usas una suscripción como Game Pass o PlayStation Plus?", ["Sí, más de una", "Sí, solo una", "La tenía, pero la cancelé", "No, nunca"]],
    no: ["Bruker du et abonnement som Game Pass eller PlayStation Plus?", ["Ja, flere", "Ja, ett", "Hadde, men sa det opp", "Nei, aldri"]],
    sv: ["Använder du en prenumeration som Game Pass eller PlayStation Plus?", ["Ja, flera", "Ja, en", "Hade, men sa upp den", "Nej, aldrig"]],
    fi: ["Käytätkö tilauspalvelua, kuten Game Passia tai PlayStation Plusia?", ["Kyllä, useampaa", "Kyllä, yhtä", "Oli, mutta peruin", "En koskaan"]],
    ja: ["Game PassやPlayStation Plusなどのサブスクを使ってる？", ["はい、複数", "はい、1つだけ", "使っていたが解約した", "使ったことがない"]],
    ru: ["Пользуетесь подпиской вроде Game Pass или PlayStation Plus?", ["Да, несколькими", "Да, одной", "Была, но отменил", "Нет, никогда"]],
  } },
  { id: "dove-giochi", dal: "2026-12-21", testi: {
    it: ["Dove giochi di più?", ["Console da salotto", "PC", "Console portatile", "Smartphone"]],
    en: ["Where do you play the most?", ["Home console", "PC", "Handheld", "Smartphone"]],
    de: ["Wo spielst du am meisten?", ["Heimkonsole", "PC", "Handheld", "Smartphone"]],
    es: ["¿Dónde juegas más?", ["Consola de sobremesa", "PC", "Consola portátil", "Móvil"]],
    no: ["Hvor spiller du mest?", ["Stuekonsoll", "PC", "Håndholdt konsoll", "Mobil"]],
    sv: ["Var spelar du mest?", ["Hemkonsol", "PC", "Handhållen konsol", "Mobil"]],
    fi: ["Millä pelaat eniten?", ["Kotikonsolilla", "PC:llä", "Käsikonsolilla", "Puhelimella"]],
    ja: ["一番よく遊ぶのは？", ["据え置き機", "PC", "携帯ゲーム機", "スマホ"]],
    ru: ["На чём вы играете чаще всего?", ["Домашняя консоль", "ПК", "Портативная консоль", "Смартфон"]],
  } },
  { id: "piu-atteso-2027", dal: "2026-12-28", testi: {
    it: ["Il gioco che aspetti di più nel 2027?", ATTESI_2027],
    en: ["Which 2027 game are you most looking forward to?", ATTESI_2027],
    de: ["Auf welches Spiel 2027 freust du dich am meisten?", ATTESI_2027],
    es: ["¿Qué juego de 2027 esperas más?", ATTESI_2027],
    no: ["Hvilket 2027-spill gleder du deg mest til?", ATTESI_2027],
    sv: ["Vilket spel 2027 ser du mest fram emot?", ATTESI_2027],
    fi: ["Mitä vuoden 2027 peliä odotat eniten?", ATTESI_2027],
    ja: ["2027年に一番楽しみなゲームは？", ATTESI_2027],
    ru: ["Какую игру 2027 года вы ждёте больше всего?", ATTESI_2027],
  } },
];

// Testi dell'interfaccia
export const R = {
  it: {
    seg: { uscite: "uscite", sondaggio: "sondaggio" },
    uscite: { nome: "Calendario uscite", intro: "Le date dei giochi più attesi, con il conto alla rovescia.", descr: "Calendario delle uscite dei videogiochi: date confermate per PS5, Xbox, Switch 2 e PC, con il conto alla rovescia dei giochi più attesi.", prossime: "Prossime uscite", conto: "Conto alla rovescia", uscito: "Già disponibile", senzaData: "Data da annunciare", anno: "Nel {y}", fonte: "Fonte", notizia: "La nostra notizia", tipi: { versione: "Nuova versione", f2p: "Versione completa, gratis" }, nota: "Le date possono cambiare: le aggiorniamo quando editori e sviluppatori le confermano o le spostano.", tutto: "Apri il calendario" },
    poll: { nome: "Il sondaggio della settimana", intro: "Una domanda nuova ogni lunedì: vota e scopri come la pensa la community.", vota: "Vota", grazie: "Grazie per il voto! Ecco i risultati.", gia: "Hai già votato: ecco i risultati.", voti: { one: "{n} voto", other: "{n} voti" }, errore: "Il voto non è riuscito: riprova tra poco.", passati: "I sondaggi precedenti", caricamento: "Carico i risultati…", scegli: "Scegli una risposta" },
  },
  en: {
    seg: { uscite: "releases", sondaggio: "poll" },
    uscite: { nome: "Release calendar", intro: "Release dates for the most anticipated games, with a countdown.", descr: "Video game release calendar: confirmed dates for PS5, Xbox, Switch 2 and PC, with a countdown to the most anticipated games.", prossime: "Coming soon", conto: "Countdown", uscito: "Out now", senzaData: "Date to be announced", anno: "In {y}", fonte: "Source", notizia: "Our story", tipi: { versione: "New version", f2p: "Full release, free-to-play" }, nota: "Dates can change: we update them when publishers and developers confirm or move them.", tutto: "Open the calendar" },
    poll: { nome: "Poll of the week", intro: "A new question every Monday: vote and see what the community thinks.", vota: "Vote", grazie: "Thanks for voting! Here are the results.", gia: "You've already voted: here are the results.", voti: { one: "{n} vote", other: "{n} votes" }, errore: "Your vote didn't go through. Please try again shortly.", passati: "Previous polls", caricamento: "Loading results…", scegli: "Choose an answer" },
  },
  de: {
    seg: { uscite: "release-kalender", sondaggio: "umfrage" },
    uscite: { nome: "Release-Kalender", intro: "Die Termine der meisterwarteten Spiele, mit Countdown.", descr: "Release-Kalender für Videospiele: bestätigte Termine für PS5, Xbox, Switch 2 und PC, mit Countdown für die meisterwarteten Spiele.", prossime: "Demnächst", conto: "Countdown", uscito: "Jetzt erhältlich", senzaData: "Termin noch offen", anno: "Im Jahr {y}", fonte: "Quelle", notizia: "Unsere Meldung", tipi: { versione: "Neue Version", f2p: "Vollversion, Free-to-play" }, nota: "Termine können sich ändern: Wir aktualisieren sie, sobald Publisher und Entwickler sie bestätigen oder verschieben.", tutto: "Kalender öffnen" },
    poll: { nome: "Umfrage der Woche", intro: "Jeden Montag eine neue Frage: Stimm ab und sieh, was die Community denkt.", vota: "Abstimmen", grazie: "Danke fürs Abstimmen! Hier sind die Ergebnisse.", gia: "Du hast schon abgestimmt: Hier sind die Ergebnisse.", voti: { one: "{n} Stimme", other: "{n} Stimmen" }, errore: "Die Abstimmung hat nicht geklappt. Bitte versuch es gleich noch einmal.", passati: "Frühere Umfragen", caricamento: "Ergebnisse werden geladen…", scegli: "Wähle eine Antwort" },
  },
  es: {
    seg: { uscite: "lanzamientos", sondaggio: "encuesta" },
    uscite: { nome: "Calendario de lanzamientos", intro: "Las fechas de los juegos más esperados, con cuenta atrás.", descr: "Calendario de lanzamientos de videojuegos: fechas confirmadas para PS5, Xbox, Switch 2 y PC, con cuenta atrás para los juegos más esperados.", prossime: "Próximos lanzamientos", conto: "Cuenta atrás", uscito: "Ya disponible", senzaData: "Fecha por anunciar", anno: "En {y}", fonte: "Fuente", notizia: "Nuestra noticia", tipi: { versione: "Nueva versión", f2p: "Versión completa, gratis" }, nota: "Las fechas pueden cambiar: las actualizamos cuando editores y desarrolladores las confirman o las retrasan.", tutto: "Abrir el calendario" },
    poll: { nome: "La encuesta de la semana", intro: "Una pregunta nueva cada lunes: vota y descubre qué opina la comunidad.", vota: "Votar", grazie: "¡Gracias por votar! Estos son los resultados.", gia: "Ya has votado: estos son los resultados.", voti: { one: "{n} voto", other: "{n} votos" }, errore: "No se pudo registrar el voto. Inténtalo de nuevo en un momento.", passati: "Encuestas anteriores", caricamento: "Cargando resultados…", scegli: "Elige una respuesta" },
  },
  no: {
    seg: { uscite: "lanseringer", sondaggio: "avstemning" },
    uscite: { nome: "Lanseringskalender", intro: "Datoene for de mest etterlengtede spillene, med nedtelling.", descr: "Lanseringskalender for dataspill: bekreftede datoer for PS5, Xbox, Switch 2 og PC, med nedtelling til de mest etterlengtede spillene.", prossime: "Kommer snart", conto: "Nedtelling", uscito: "Ute nå", senzaData: "Dato kommer", anno: "I {y}", fonte: "Kilde", notizia: "Vår sak", tipi: { versione: "Ny versjon", f2p: "Fullversjon, gratis" }, nota: "Datoer kan endres: vi oppdaterer dem når utgivere og utviklere bekrefter eller flytter dem.", tutto: "Åpne kalenderen" },
    poll: { nome: "Ukens avstemning", intro: "Et nytt spørsmål hver mandag: stem og se hva fellesskapet mener.", vota: "Stem", grazie: "Takk for stemmen! Her er resultatene.", gia: "Du har allerede stemt: her er resultatene.", voti: { one: "{n} stemme", other: "{n} stemmer" }, errore: "Stemmen ble ikke registrert. Prøv igjen om litt.", passati: "Tidligere avstemninger", caricamento: "Laster resultater…", scegli: "Velg et svar" },
  },
  sv: {
    seg: { uscite: "releaser", sondaggio: "omrostning" },
    uscite: { nome: "Releasekalender", intro: "Datumen för de mest efterlängtade spelen, med nedräkning.", descr: "Releasekalender för tv-spel: bekräftade datum för PS5, Xbox, Switch 2 och PC, med nedräkning till de mest efterlängtade spelen.", prossime: "Kommer snart", conto: "Nedräkning", uscito: "Ute nu", senzaData: "Datum ej klart", anno: "Under {y}", fonte: "Källa", notizia: "Vår artikel", tipi: { versione: "Ny version", f2p: "Fullversion, gratis" }, nota: "Datum kan ändras: vi uppdaterar dem när utgivare och utvecklare bekräftar eller flyttar dem.", tutto: "Öppna kalendern" },
    poll: { nome: "Veckans omröstning", intro: "En ny fråga varje måndag: rösta och se vad communityn tycker.", vota: "Rösta", grazie: "Tack för din röst! Här är resultatet.", gia: "Du har redan röstat: här är resultatet.", voti: { one: "{n} röst", other: "{n} röster" }, errore: "Rösten kunde inte registreras. Försök igen om en stund.", passati: "Tidigare omröstningar", caricamento: "Laddar resultat…", scegli: "Välj ett svar" },
  },
  fi: {
    seg: { uscite: "julkaisut", sondaggio: "kysely" },
    uscite: { nome: "Julkaisukalenteri", intro: "Odotetuimpien pelien julkaisupäivät ja lähtölaskenta.", descr: "Videopelien julkaisukalenteri: vahvistetut julkaisupäivät PS5:lle, Xboxille, Switch 2:lle ja PC:lle sekä lähtölaskenta odotetuimpiin peleihin.", prossime: "Tulossa pian", conto: "Lähtölaskenta", uscito: "Saatavilla nyt", senzaData: "Päivä vahvistamatta", anno: "Vuonna {y}", fonte: "Lähde", notizia: "Uutisemme", tipi: { versione: "Uusi versio", f2p: "Täysi versio, ilmainen" }, nota: "Päivät voivat muuttua: päivitämme ne, kun julkaisijat ja kehittäjät vahvistavat tai siirtävät niitä.", tutto: "Avaa kalenteri" },
    poll: { nome: "Viikon kysely", intro: "Uusi kysymys joka maanantai: äänestä ja katso, mitä yhteisö ajattelee.", vota: "Äänestä", grazie: "Kiitos äänestäsi! Tässä tulokset.", gia: "Olet jo äänestänyt: tässä tulokset.", voti: { one: "{n} ääni", other: "{n} ääntä" }, errore: "Ääntä ei saatu tallennettua. Yritä hetken päästä uudelleen.", passati: "Aiemmat kyselyt", caricamento: "Ladataan tuloksia…", scegli: "Valitse vastaus" },
  },
  ja: {
    seg: { uscite: "releases", sondaggio: "poll" },
    uscite: { nome: "発売日カレンダー", intro: "注目ゲームの発売日をカウントダウン付きで。", descr: "ゲーム発売日カレンダー：PS5、Xbox、Switch 2、PCの確定発売日と、注目タイトルのカウントダウン。", prossime: "発売予定", conto: "カウントダウン", uscito: "発売中", senzaData: "発売日未定", anno: "{y}年", fonte: "出典", notizia: "関連記事", tipi: { versione: "新バージョン", f2p: "正式版・基本無料" }, nota: "発売日は変更される場合があります。パブリッシャーや開発元の発表に合わせて更新します。", tutto: "カレンダーを見る" },
    poll: { nome: "今週のアンケート", intro: "毎週月曜日に新しい質問。投票して、みんなの意見をチェックしよう。", vota: "投票する", grazie: "投票ありがとう！結果はこちら。", gia: "投票済みです。結果はこちら。", voti: { other: "{n}票" }, errore: "投票できませんでした。少し時間をおいてもう一度お試しください。", passati: "過去のアンケート", caricamento: "結果を読み込み中…", scegli: "回答を選んでください" },
  },
  ru: {
    seg: { uscite: "relizy", sondaggio: "opros" },
    uscite: { nome: "Календарь релизов", intro: "Даты выхода самых ожидаемых игр с обратным отсчётом.", descr: "Календарь релизов видеоигр: подтверждённые даты выхода на PS5, Xbox, Switch 2 и ПК с обратным отсчётом до самых ожидаемых игр.", prossime: "Скоро выйдут", conto: "Обратный отсчёт", uscito: "Уже вышла", senzaData: "Дата не объявлена", anno: "В {y} году", fonte: "Источник", notizia: "Наша новость", tipi: { versione: "Новая версия", f2p: "Полный релиз, бесплатно" }, nota: "Даты могут меняться: мы обновляем их, когда издатели и разработчики подтверждают или переносят релиз.", tutto: "Открыть календарь" },
    poll: { nome: "Опрос недели", intro: "Каждый понедельник — новый вопрос: голосуйте и узнайте, что думает сообщество.", vota: "Голосовать", grazie: "Спасибо за голос! Вот результаты.", gia: "Вы уже проголосовали: вот результаты.", voti: { one: "{n} голос", few: "{n} голоса", many: "{n} голосов", other: "{n} голоса" }, errore: "Не удалось отправить голос. Попробуйте ещё раз чуть позже.", passati: "Предыдущие опросы", caricamento: "Загружаем результаты…", scegli: "Выберите ответ" },
  },
};

// Newsletter (per ora solo in italiano)
export const NEWSLETTER = {
  nome: "Il Soffio della settimana",
  intro: "Ogni domenica le 5 notizie gaming più importanti della settimana, direttamente nella tua email. Niente spam, ti cancelli con un clic.",
  segnaposto: "La tua email",
  consenso: "Voglio ricevere la newsletter e ho letto l'<a href=\"{privacy}\">informativa privacy</a>.",
  bottone: "Iscriviti",
  grazieTitolo: "Iscrizione ricevuta!",
  grazieTesto: "Grazie: da domenica prossima il Soffio della settimana arriverà nella tua casella. Se non lo trovi, controlla la cartella spam o promozioni.",
  torna: "Torna alle notizie",
};
