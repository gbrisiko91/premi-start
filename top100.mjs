// Missione 2K – Boss finale: la top 100 dei videogiochi votata dalla community.
// Pagina /top-100/ (solo italiano), voti salvati da netlify/functions/top100.mjs.
//
// apertura / chiusura: giorni compresi, ora italiana. Prima dell'apertura la pagina mostra
//   la data di inizio; dopo la chiusura ringrazia e rimanda all'Instagram per la classifica.
// maxScelte: quanti giochi può scegliere ogni persona (1 punto ciascuno).
// candidati: l'elenco tra cui si vota. Si possono AGGIUNGERE giochi in qualsiasi momento
//   (per esempio quelli proposti nei commenti); non cambiare l'id di un gioco già votato.
//   Chi non trova il suo gioco può scriverlo nel campo "proposta": le proposte compaiono nei risultati.
//
// Risultati: imposta su Netlify la variabile TOP100_CHIAVE (una parola segreta a tua scelta),
//   poi apri https://soffiacartuccia.it/top-100/?chiave=LA-TUA-PAROLA per vedere la classifica.

export const TOP100 = {
  apertura: "2026-11-14",
  chiusura: "2026-11-20",
  maxScelte: 10,
  maxPerConnessione: 15,
  candidati: [
    // anni '70–'80
    ["pong", "Pong", 1972], ["space-invaders", "Space Invaders", 1978], ["pac-man", "Pac-Man", 1980],
    ["donkey-kong", "Donkey Kong", 1981], ["tetris", "Tetris", 1984], ["super-mario-bros", "Super Mario Bros.", 1985],
    ["the-legend-of-zelda", "The Legend of Zelda", 1986], ["metroid", "Metroid", 1986], ["castlevania", "Castlevania", 1986],
    ["out-run", "Out Run", 1986], ["bubble-bobble", "Bubble Bobble", 1986], ["dragon-quest", "Dragon Quest", 1986],
    ["mega-man-2", "Mega Man 2", 1988], ["super-mario-bros-3", "Super Mario Bros. 3", 1988],
    ["prince-of-persia", "Prince of Persia", 1989], ["golden-axe", "Golden Axe", 1989],
    // anni '90
    ["super-mario-world", "Super Mario World", 1990], ["the-secret-of-monkey-island", "The Secret of Monkey Island", 1990],
    ["sonic-the-hedgehog", "Sonic the Hedgehog", 1991], ["street-fighter-2", "Street Fighter II", 1991],
    ["a-link-to-the-past", "The Legend of Zelda: A Link to the Past", 1991], ["lemmings", "Lemmings", 1991],
    ["super-mario-kart", "Super Mario Kart", 1992], ["mortal-kombat", "Mortal Kombat", 1992],
    ["sonic-2", "Sonic the Hedgehog 2", 1992], ["doom", "Doom", 1993], ["links-awakening", "The Legend of Zelda: Link's Awakening", 1993],
    ["day-of-the-tentacle", "Day of the Tentacle", 1993], ["super-metroid", "Super Metroid", 1994],
    ["donkey-kong-country", "Donkey Kong Country", 1994], ["final-fantasy-6", "Final Fantasy VI", 1994],
    ["chrono-trigger", "Chrono Trigger", 1995], ["earthbound", "EarthBound", 1994], ["tekken-3", "Tekken 3", 1997],
    ["super-mario-64", "Super Mario 64", 1996], ["pokemon-rosso-blu", "Pokémon Rosso e Blu", 1996],
    ["resident-evil", "Resident Evil", 1996], ["tomb-raider", "Tomb Raider", 1996], ["crash-bandicoot", "Crash Bandicoot", 1996],
    ["quake", "Quake", 1996], ["diablo", "Diablo", 1996], ["final-fantasy-7", "Final Fantasy VII", 1997],
    ["goldeneye-007", "GoldenEye 007", 1997], ["gran-turismo", "Gran Turismo", 1997], ["castlevania-sotn", "Castlevania: Symphony of the Night", 1997],
    ["mario-kart-64", "Mario Kart 64", 1996], ["age-of-empires-2", "Age of Empires II", 1999], ["starcraft", "StarCraft", 1998],
    ["half-life", "Half-Life", 1998], ["metal-gear-solid", "Metal Gear Solid", 1998], ["ocarina-of-time", "The Legend of Zelda: Ocarina of Time", 1998],
    ["spyro-the-dragon", "Spyro the Dragon", 1998], ["grim-fandango", "Grim Fandango", 1998], ["baldurs-gate", "Baldur's Gate", 1998],
    ["silent-hill", "Silent Hill", 1999], ["pokemon-oro-argento", "Pokémon Oro e Argento", 1999],
    ["tony-hawks-pro-skater-2", "Tony Hawk's Pro Skater 2", 2000], ["super-smash-bros-melee", "Super Smash Bros. Melee", 2001],
    ["counter-strike", "Counter-Strike", 2000], ["the-sims", "The Sims", 2000], ["diablo-2", "Diablo II", 2000],
    ["deus-ex", "Deus Ex", 2000], ["final-fantasy-9", "Final Fantasy IX", 2000], ["majoras-mask", "The Legend of Zelda: Majora's Mask", 2000],
    // anni 2000
    ["halo", "Halo: Combat Evolved", 2001], ["gta-3", "Grand Theft Auto III", 2001], ["metal-gear-solid-2", "Metal Gear Solid 2", 2001],
    ["final-fantasy-10", "Final Fantasy X", 2001], ["ico", "ICO", 2001], ["devil-may-cry", "Devil May Cry", 2001],
    ["gta-vice-city", "Grand Theft Auto: Vice City", 2002], ["kingdom-hearts", "Kingdom Hearts", 2002], ["metroid-prime", "Metroid Prime", 2002],
    ["wind-waker", "The Legend of Zelda: The Wind Waker", 2002], ["warcraft-3", "Warcraft III", 2002],
    ["pro-evolution-soccer-5", "Pro Evolution Soccer 5", 2005], ["prince-of-persia-sabbie", "Prince of Persia: Le Sabbie del Tempo", 2003],
    ["kotor", "Star Wars: Knights of the Old Republic", 2003], ["gta-san-andreas", "Grand Theft Auto: San Andreas", 2004],
    ["half-life-2", "Half-Life 2", 2004], ["world-of-warcraft", "World of Warcraft", 2004], ["metal-gear-solid-3", "Metal Gear Solid 3: Snake Eater", 2004],
    ["need-for-speed-underground-2", "Need for Speed: Underground 2", 2004], ["resident-evil-4", "Resident Evil 4", 2005],
    ["shadow-of-the-colossus", "Shadow of the Colossus", 2005], ["god-of-war", "God of War", 2005], ["guitar-hero", "Guitar Hero", 2005],
    ["oblivion", "The Elder Scrolls IV: Oblivion", 2006], ["wii-sports", "Wii Sports", 2006], ["okami", "Ōkami", 2006],
    ["twilight-princess", "The Legend of Zelda: Twilight Princess", 2006], ["gears-of-war", "Gears of War", 2006],
    ["bioshock", "BioShock", 2007], ["portal", "Portal", 2007], ["call-of-duty-4", "Call of Duty 4: Modern Warfare", 2007],
    ["mass-effect", "Mass Effect", 2007], ["super-mario-galaxy", "Super Mario Galaxy", 2007], ["uncharted-2", "Uncharted 2", 2009],
    ["assassins-creed-2", "Assassin's Creed II", 2009], ["gta-4", "Grand Theft Auto IV", 2008], ["fallout-3", "Fallout 3", 2008],
    ["left-4-dead-2", "Left 4 Dead 2", 2009], ["batman-arkham-asylum", "Batman: Arkham Asylum", 2009],
    ["demons-souls", "Demon's Souls", 2009], ["minecraft", "Minecraft", 2009],
    // anni 2010
    ["mass-effect-2", "Mass Effect 2", 2010], ["red-dead-redemption", "Red Dead Redemption", 2010], ["super-mario-galaxy-2", "Super Mario Galaxy 2", 2010],
    ["the-elder-scrolls-5-skyrim", "The Elder Scrolls V: Skyrim", 2011], ["dark-souls", "Dark Souls", 2011], ["portal-2", "Portal 2", 2011],
    ["batman-arkham-city", "Batman: Arkham City", 2011], ["terraria", "Terraria", 2011], ["league-of-legends", "League of Legends", 2009],
    ["journey", "Journey", 2012], ["the-walking-dead", "The Walking Dead (Telltale)", 2012], ["the-last-of-us", "The Last of Us", 2013],
    ["gta-5", "Grand Theft Auto V", 2013], ["bioshock-infinite", "BioShock Infinite", 2013], ["dark-souls-3", "Dark Souls III", 2016],
    ["the-witcher-3", "The Witcher 3: Wild Hunt", 2015], ["bloodborne", "Bloodborne", 2015], ["undertale", "Undertale", 2015],
    ["rocket-league", "Rocket League", 2015], ["metal-gear-solid-5", "Metal Gear Solid V: The Phantom Pain", 2015],
    ["stardew-valley", "Stardew Valley", 2016], ["overwatch", "Overwatch", 2016], ["uncharted-4", "Uncharted 4", 2016],
    ["doom-2016", "Doom (2016)", 2016], ["inside", "Inside", 2016], ["breath-of-the-wild", "The Legend of Zelda: Breath of the Wild", 2017],
    ["super-mario-odyssey", "Super Mario Odyssey", 2017], ["hollow-knight", "Hollow Knight", 2017], ["persona-5", "Persona 5", 2016],
    ["nier-automata", "NieR:Automata", 2017], ["horizon-zero-dawn", "Horizon Zero Dawn", 2017], ["cuphead", "Cuphead", 2017],
    ["fortnite", "Fortnite", 2017], ["celeste", "Celeste", 2018], ["god-of-war-2018", "God of War (2018)", 2018],
    ["red-dead-redemption-2", "Red Dead Redemption 2", 2018], ["spider-man-ps4", "Marvel's Spider-Man", 2018],
    ["super-smash-bros-ultimate", "Super Smash Bros. Ultimate", 2018], ["monster-hunter-world", "Monster Hunter: World", 2018],
    ["sekiro", "Sekiro: Shadows Die Twice", 2019], ["resident-evil-2-remake", "Resident Evil 2 (remake)", 2019],
    ["outer-wilds", "Outer Wilds", 2019], ["disco-elysium", "Disco Elysium", 2019], ["death-stranding", "Death Stranding", 2019],
    ["among-us", "Among Us", 2018],
    // anni 2020
    ["animal-crossing-new-horizons", "Animal Crossing: New Horizons", 2020], ["hades", "Hades", 2020],
    ["the-last-of-us-2", "The Last of Us Parte II", 2020], ["ghost-of-tsushima", "Ghost of Tsushima", 2020],
    ["final-fantasy-7-remake", "Final Fantasy VII Remake", 2020], ["cyberpunk-2077", "Cyberpunk 2077", 2020],
    ["it-takes-two", "It Takes Two", 2021], ["elden-ring", "Elden Ring", 2022], ["god-of-war-ragnarok", "God of War Ragnarök", 2022],
    ["vampire-survivors", "Vampire Survivors", 2022], ["tears-of-the-kingdom", "The Legend of Zelda: Tears of the Kingdom", 2023],
    ["baldurs-gate-3", "Baldur's Gate 3", 2023], ["super-mario-bros-wonder", "Super Mario Bros. Wonder", 2023],
    ["alan-wake-2", "Alan Wake 2", 2023], ["balatro", "Balatro", 2024], ["astro-bot", "Astro Bot", 2024],
    ["black-myth-wukong", "Black Myth: Wukong", 2024], ["metaphor-refantazio", "Metaphor: ReFantazio", 2024],
    ["clair-obscur-expedition-33", "Clair Obscur: Expedition 33", 2025], ["hollow-knight-silksong", "Hollow Knight: Silksong", 2025],
    ["mario-kart-world", "Mario Kart World", 2025], ["death-stranding-2", "Death Stranding 2: On the Beach", 2025],
  ].map(([id, nome, anno]) => ({ id, nome, anno })),
};

// ---------- utilità condivise (funzione Netlify e test) ----------
const CANDIDATI = new Map(TOP100.candidati.map((c) => [c.id, c]));
export const oggiRoma = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());
export const statoVoto = (giorno = oggiRoma()) =>
  giorno < TOP100.apertura ? "prima" : giorno > TOP100.chiusura ? "chiuso" : "aperto";

export function pulisciVoto({ scelte, proposta }) {
  if (!Array.isArray(scelte)) return null;
  const uniche = [...new Set(scelte)].filter((id) => CANDIDATI.has(id));
  const testo = typeof proposta === "string" ? proposta.replace(/\s+/g, " ").trim().slice(0, 60) : "";
  if (uniche.length !== scelte.length || uniche.length > TOP100.maxScelte) return null;
  if (!uniche.length && !testo) return null;
  return { scelte: uniche, proposta: testo };
}

export function contaVoti(voti) {
  const punti = new Map();
  const proposte = new Map();
  for (const v of voti) {
    for (const id of v.scelte || []) punti.set(id, (punti.get(id) || 0) + 1);
    if (v.proposta) {
      const k = v.proposta.toLowerCase();
      const p = proposte.get(k) || { testo: v.proposta, n: 0 };
      p.n += 1;
      proposte.set(k, p);
    }
  }
  const classifica = [...punti]
    .map(([id, n]) => ({ id, nome: CANDIDATI.get(id)?.nome || id, anno: CANDIDATI.get(id)?.anno, voti: n }))
    .sort((a, b) => b.voti - a.voti || a.nome.localeCompare(b.nome, "it"));
  let pos = 0;
  classifica.forEach((r, i) => { if (i === 0 || classifica[i - 1].voti !== r.voti) pos = i + 1; r.posizione = pos; });
  return { votanti: voti.length, classifica, proposte: [...proposte.values()].sort((a, b) => b.n - a.n || a.testo.localeCompare(b.testo, "it")) };
}

