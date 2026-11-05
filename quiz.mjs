// Curiosità videoludiche storiche, senza notizie recenti o ipotesi da verificare.
// Ogni domanda contiene quattro risposte. La prima è sempre quella esatta; il
// client mescola le opzioni in modo deterministico per la data locale.
export const QUIZ = {
  it: {
    nome: "La Cartuccia del Giorno", intro: "Una domanda gaming al giorno. Quanto ne sai davvero?",
    data: "Sfida del giorno", scegli: "Scegli una risposta", verifica: "Conferma risposta",
    giusto: "Risposta esatta!", sbagliato: "Non proprio!", risposta: "La risposta corretta è:",
    torna: "Torna domani per una nuova sfida.", condividi: "Condividi il risultato",
    condiviso: "Risultato copiato", prepara: "Caricamento della sfida…",
    errore: "Il quiz richiede JavaScript.", altro: "Scopri le ultime notizie",
    items: [
      ["In quale anno debuttò la prima PlayStation in Giappone?", ["1994", "1991", "1998", "2000"], "La prima PlayStation arrivò in Giappone il 3 dicembre 1994."],
      ["In quale anno uscì il Game Boy originale in Giappone?", ["1989", "1985", "1993", "1996"], "Nintendo lanciò il Game Boy in Giappone il 21 aprile 1989."],
      ["Chi creò il videogioco Tetris?", ["Alexey Pajitnov", "Hideo Kojima", "John Carmack", "Yu Suzuki"], "Alexey Pajitnov progettò Tetris nel 1984."],
      ["In quale anno debuttò Sonic the Hedgehog su Mega Drive?", ["1991", "1986", "1995", "2001"], "Il primo Sonic the Hedgehog uscì nel 1991."],
      ["In quale anno debuttò il Famicom in Giappone?", ["1983", "1980", "1988", "1990"], "Il Family Computer di Nintendo arrivò sul mercato giapponese nel 1983."],
      ["Chi è il creatore di Super Mario?", ["Shigeru Miyamoto", "Satoshi Tajiri", "Gunpei Yokoi", "Yuji Naka"], "Shigeru Miyamoto ideò Mario per Nintendo."],
      ["In quale anno uscì il primo DOOM?", ["1993", "1989", "1997", "2001"], "DOOM, sviluppato da id Software, uscì nel dicembre 1993."],
      ["In quale anno debuttò PAC-MAN?",["1980","1975","1984","1990"],"Il gioco arcade di Bandai Namco debuttò in Giappone nel 1980."],
      ["In che anno uscì Game Boy Advance?",["2001","1997","2004","2007"],"Nintendo lanciò Game Boy Advance nel 2001."],
      ["In quale anno debuttò Nintendo DS in Giappone?",["2004","2000","2008","2011"],"Nintendo DS debuttò nel 2004."],
      ["In quale anno uscì Nintendo Wii?",["2006","2003","2010","2012"],"La console Wii arrivò nel 2006."],
      ["In che anno fu lanciato Nintendo Switch?",["2017","2014","2019","2020"],"Nintendo Switch debuttò nel 2017."],
      ["Quando debuttò Nintendo 64 in Giappone?",["1996","1992","1999","2002"],"Nintendo 64 arrivò in Giappone il 23 giugno 1996."],
      ["In quale anno uscì la prima Xbox in Nord America?",["2001","1998","2004","2006"],"La Xbox originale arrivò in Nord America il 15 novembre 2001."]
    ]
  },
  en: {
    nome: "Cartridge of the Day", intro: "One gaming question a day. How much do you really know?",
    data: "Today's challenge", scegli: "Choose one answer", verifica: "Check answer",
    giusto: "Correct!", sbagliato: "Not quite!", risposta: "The correct answer is:",
    torna: "Come back tomorrow for a new challenge.", condividi: "Share your result",
    condiviso: "Result copied", prepara: "Loading today's challenge…",
    errore: "This quiz requires JavaScript.", altro: "Read the latest stories",
    items: [
      ["What year did the original PlayStation launch in Japan?", ["1994", "1991", "1998", "2000"], "The first PlayStation launched in Japan on December 3, 1994."],
      ["What year did the original Game Boy launch in Japan?", ["1989", "1985", "1993", "1996"], "Nintendo released the Game Boy in Japan on April 21, 1989."],
      ["Who created the video game Tetris?", ["Alexey Pajitnov", "Hideo Kojima", "John Carmack", "Yu Suzuki"], "Alexey Pajitnov designed Tetris in 1984."],
      ["In which year did Sonic the Hedgehog debut on Mega Drive?", ["1991", "1986", "1995", "2001"], "The first Sonic the Hedgehog came out in 1991."],
      ["In which year did the Famicom launch in Japan?", ["1983", "1980", "1988", "1990"], "Nintendo's Family Computer launched in Japan in 1983."],
      ["Who created Super Mario?", ["Shigeru Miyamoto", "Satoshi Tajiri", "Gunpei Yokoi", "Yuji Naka"], "Shigeru Miyamoto created Mario for Nintendo."],
      ["What year was the original DOOM released?", ["1993", "1989", "1997", "2001"], "DOOM, developed by id Software, was released in December 1993."],
      ["What year did PAC-MAN debut?",["1980","1975","1984","1990"],"Bandai Namco's arcade game debuted in Japan in 1980."],
      ["What year was Game Boy Advance released?",["2001","1997","2004","2007"],"Nintendo launched Game Boy Advance in 2001."],
      ["When did Nintendo DS debut in Japan?",["2004","2000","2008","2011"],"Nintendo DS debuted in 2004."],
      ["In which year was Nintendo Wii released?",["2006","2003","2010","2012"],"Wii was released in 2006."],
      ["What year was Nintendo Switch launched?",["2017","2014","2019","2020"],"Nintendo Switch debuted in 2017."],
      ["When did Nintendo 64 launch in Japan?",["1996","1992","1999","2002"],"Nintendo 64 launched in Japan on June 23, 1996."],
      ["In what year did the first Xbox launch in North America?",["2001","1998","2004","2006"],"The original Xbox launched in North America on November 15, 2001."]
    ]
  },
  de: {
    nome:"Modul des Tages",intro:"Eine Gaming-Frage pro Tag. Wie viel weißt du wirklich?",data:"Die heutige Frage",scegli:"Wähle eine Antwort",verifica:"Antwort prüfen",giusto:"Richtig!",sbagliato:"Nicht ganz!",risposta:"Die richtige Antwort lautet:",torna:"Komm morgen für eine neue Frage zurück.",condividi:"Ergebnis teilen",condiviso:"Ergebnis kopiert",prepara:"Frage wird geladen…",errore:"Dieses Quiz benötigt JavaScript.",altro:"Aktuelle Nachrichten lesen",
    items:[
      ["In welchem Jahr erschien die erste PlayStation in Japan?",["1994","1991","1998","2000"],"Die erste PlayStation erschien am 3. Dezember 1994 in Japan."],
      ["In welchem Jahr erschien der erste Game Boy in Japan?",["1989","1985","1993","1996"],"Nintendo veröffentlichte den Game Boy am 21. April 1989 in Japan."],
      ["Wer entwickelte das Spiel Tetris?",["Alexey Pajitnov","Hideo Kojima","John Carmack","Yu Suzuki"],"Alexey Pajitnov entwickelte Tetris 1984."],
      ["In welchem Jahr debütierte Sonic the Hedgehog auf dem Mega Drive?",["1991","1986","1995","2001"],"Das erste Sonic the Hedgehog erschien 1991."],
      ["In welchem Jahr erschien das Famicom in Japan?",["1983","1980","1988","1990"],"Nintendos Family Computer erschien 1983 in Japan."],
      ["Wer erschuf Super Mario?",["Shigeru Miyamoto","Satoshi Tajiri","Gunpei Yokoi","Yuji Naka"],"Shigeru Miyamoto erschuf Mario für Nintendo."],
      ["In welchem Jahr erschien das erste DOOM?",["1993","1989","1997","2001"],"DOOM von id Software erschien im Dezember 1993."],
      ["In welchem Jahr erschien PAC-MAN?",["1980","1975","1984","1990"],"Das Arcade-Spiel von Bandai Namco erschien 1980 in Japan."],
      ["In welchem Jahr erschien der Game Boy Advance?",["2001","1997","2004","2007"],"Nintendo brachte den Game Boy Advance 2001 auf den Markt."],
      ["Wann erschien Nintendo DS in Japan?",["2004","2000","2008","2011"],"Nintendo DS erschien 2004."],
      ["In welchem Jahr erschien die Nintendo Wii?",["2006","2003","2010","2012"],"Die Wii erschien 2006."],
      ["Wann wurde Nintendo Switch veröffentlicht?",["2017","2014","2019","2020"],"Nintendo Switch erschien 2017."],
      ["Wann erschien Nintendo 64 in Japan?",["1996","1992","1999","2002"],"Nintendo 64 erschien am 23. Juni 1996 in Japan."],
      ["In welchem Jahr erschien die erste Xbox in Nordamerika?",["2001","1998","2004","2006"],"Die erste Xbox erschien dort am 15. November 2001."]
    ]
  },
  es: {
    nome:"Cartucho del Día",intro:"Una pregunta sobre videojuegos cada día. ¿Cuánto sabes?",data:"El reto de hoy",scegli:"Elige una respuesta",verifica:"Comprobar respuesta",giusto:"¡Correcto!",sbagliato:"¡No exactamente!",risposta:"La respuesta correcta es:",torna:"Vuelve mañana para un nuevo reto.",condividi:"Comparte tu resultado",condiviso:"Resultado copiado",prepara:"Cargando el reto…",errore:"Este cuestionario necesita JavaScript.",altro:"Lee las últimas noticias",
    items:[
      ["¿En qué año se lanzó la primera PlayStation en Japón?",["1994","1991","1998","2000"],"La primera PlayStation llegó a Japón el 3 de diciembre de 1994."],
      ["¿En qué año se lanzó la Game Boy original en Japón?",["1989","1985","1993","1996"],"Nintendo lanzó Game Boy en Japón el 21 de abril de 1989."],
      ["¿Quién creó el videojuego Tetris?",["Alexey Pajitnov","Hideo Kojima","John Carmack","Yu Suzuki"],"Alexey Pajitnov diseñó Tetris en 1984."],
      ["¿En qué año debutó Sonic the Hedgehog en Mega Drive?",["1991","1986","1995","2001"],"El primer Sonic the Hedgehog apareció en 1991."],
      ["¿En qué año salió Famicom en Japón?",["1983","1980","1988","1990"],"El Family Computer de Nintendo se lanzó en Japón en 1983."],
      ["¿Quién creó a Super Mario?",["Shigeru Miyamoto","Satoshi Tajiri","Gunpei Yokoi","Yuji Naka"],"Shigeru Miyamoto creó a Mario para Nintendo."],
      ["¿En qué año salió el primer DOOM?",["1993","1989","1997","2001"],"DOOM, desarrollado por id Software, salió en diciembre de 1993."],
      ["¿En qué año debutó PAC-MAN?",["1980","1975","1984","1990"],"El arcade de Bandai Namco debutó en Japón en 1980."],
      ["¿En qué año salió Game Boy Advance?",["2001","1997","2004","2007"],"Nintendo lanzó Game Boy Advance en 2001."],
      ["¿Cuándo debutó Nintendo DS en Japón?",["2004","2000","2008","2011"],"Nintendo DS debutó en 2004."],
      ["¿En qué año salió Nintendo Wii?",["2006","2003","2010","2012"],"La consola Wii llegó en 2006."],
      ["¿En qué año se lanzó Nintendo Switch?",["2017","2014","2019","2020"],"Nintendo Switch debutó en 2017."],
      ["¿Cuándo se lanzó Nintendo 64 en Japón?",["1996","1992","1999","2002"],"Nintendo 64 llegó a Japón el 23 de junio de 1996."],
      ["¿En qué año salió la primera Xbox en Norteamérica?",["2001","1998","2004","2006"],"La Xbox original salió allí el 15 de noviembre de 2001."]
    ]
  },
  no: {
    nome:"Dagens kassett",intro:"Ett spillspørsmål hver dag. Hvor mye kan du?",data:"Dagens utfordring",scegli:"Velg ett svar",verifica:"Sjekk svaret",giusto:"Riktig!",sbagliato:"Ikke helt!",risposta:"Riktig svar er:",torna:"Kom tilbake i morgen for en ny utfordring.",condividi:"Del resultatet",condiviso:"Resultat kopiert",prepara:"Laster dagens utfordring…",errore:"Denne quizen krever JavaScript.",altro:"Les siste nytt",
    items:[
      ["Hvilket år kom den første PlayStation i Japan?",["1994","1991","1998","2000"],"Den første PlayStation ble lansert i Japan 3. desember 1994."],
      ["Hvilket år kom den originale Game Boy i Japan?",["1989","1985","1993","1996"],"Nintendo lanserte Game Boy i Japan 21. april 1989."],
      ["Hvem skapte spillet Tetris?",["Alexey Pajitnov","Hideo Kojima","John Carmack","Yu Suzuki"],"Alexey Pajitnov utviklet Tetris i 1984."],
      ["Hvilket år debuterte Sonic the Hedgehog på Mega Drive?",["1991","1986","1995","2001"],"Det første Sonic the Hedgehog kom i 1991."],
      ["Hvilket år kom Famicom i Japan?",["1983","1980","1988","1990"],"Nintendos Family Computer ble lansert i Japan i 1983."],
      ["Hvem skapte Super Mario?",["Shigeru Miyamoto","Satoshi Tajiri","Gunpei Yokoi","Yuji Naka"],"Shigeru Miyamoto skapte Mario for Nintendo."],
      ["Hvilket år kom den første DOOM?",["1993","1989","1997","2001"],"DOOM fra id Software ble utgitt i desember 1993."],
      ["Hvilket år debuterte PAC-MAN?",["1980","1975","1984","1990"],"Arkadespillet fra Bandai Namco debuterte i Japan i 1980."],
      ["Hvilket år kom Game Boy Advance?",["2001","1997","2004","2007"],"Nintendo lanserte Game Boy Advance i 2001."],
      ["Når debuterte Nintendo DS i Japan?",["2004","2000","2008","2011"],"Nintendo DS debuterte i 2004."],
      ["Hvilket år kom Nintendo Wii?",["2006","2003","2010","2012"],"Wii kom i 2006."],
      ["Hvilket år ble Nintendo Switch lansert?",["2017","2014","2019","2020"],"Nintendo Switch debuterte i 2017."],
      ["Når ble Nintendo 64 lansert i Japan?",["1996","1992","1999","2002"],"Nintendo 64 kom til Japan 23. juni 1996."],
      ["Når kom den første Xbox i Nord-Amerika?",["2001","1998","2004","2006"],"Den originale Xbox kom i Nord-Amerika 15. november 2001."]
    ]
  },
  sv: {
    nome:"Dagens kassett",intro:"En spelfråga varje dag. Hur mycket kan du?",data:"Dagens utmaning",scegli:"Välj ett svar",verifica:"Kontrollera svaret",giusto:"Rätt!",sbagliato:"Inte riktigt!",risposta:"Rätt svar är:",torna:"Kom tillbaka i morgon för en ny utmaning.",condividi:"Dela resultatet",condiviso:"Resultatet kopierat",prepara:"Laddar dagens utmaning…",errore:"Det här quizet kräver JavaScript.",altro:"Läs de senaste nyheterna",
    items:[
      ["Vilket år lanserades första PlayStation i Japan?",["1994","1991","1998","2000"],"Första PlayStation lanserades i Japan den 3 december 1994."],
      ["Vilket år lanserades den ursprungliga Game Boy i Japan?",["1989","1985","1993","1996"],"Nintendo lanserade Game Boy i Japan den 21 april 1989."],
      ["Vem skapade spelet Tetris?",["Alexey Pajitnov","Hideo Kojima","John Carmack","Yu Suzuki"],"Alexey Pajitnov skapade Tetris 1984."],
      ["Vilket år debuterade Sonic the Hedgehog på Mega Drive?",["1991","1986","1995","2001"],"Första Sonic the Hedgehog släpptes 1991."],
      ["Vilket år släpptes Famicom i Japan?",["1983","1980","1988","1990"],"Nintendos Family Computer lanserades i Japan 1983."],
      ["Vem skapade Super Mario?",["Shigeru Miyamoto","Satoshi Tajiri","Gunpei Yokoi","Yuji Naka"],"Shigeru Miyamoto skapade Mario för Nintendo."],
      ["Vilket år släpptes första DOOM?",["1993","1989","1997","2001"],"DOOM från id Software släpptes i december 1993."],
      ["Vilket år debuterade PAC-MAN?",["1980","1975","1984","1990"],"Arkadsspelet från Bandai Namco debuterade i Japan 1980."],
      ["Vilket år släpptes Game Boy Advance?",["2001","1997","2004","2007"],"Nintendo lanserade Game Boy Advance 2001."],
      ["När debuterade Nintendo DS i Japan?",["2004","2000","2008","2011"],"Nintendo DS debuterade 2004."],
      ["Vilket år släpptes Nintendo Wii?",["2006","2003","2010","2012"],"Wii lanserades 2006."],
      ["När lanserades Nintendo Switch?",["2017","2014","2019","2020"],"Nintendo Switch debuterade 2017."],
      ["När lanserades Nintendo 64 i Japan?",["1996","1992","1999","2002"],"Nintendo 64 släpptes i Japan den 23 juni 1996."],
      ["Vilket år lanserades den första Xbox i Nordamerika?",["2001","1998","2004","2006"],"Den första Xbox släpptes där den 15 november 2001."]
    ]
  },
  fi: {
    nome:"Päivän pelikasetti",intro:"Yksi pelikysymys päivässä. Kuinka paljon tiedät?",data:"Päivän haaste",scegli:"Valitse vastaus",verifica:"Tarkista vastaus",giusto:"Oikein!",sbagliato:"Ei aivan!",risposta:"Oikea vastaus on:",torna:"Palaa huomenna uuden haasteen pariin.",condividi:"Jaa tuloksesi",condiviso:"Tulos kopioitu",prepara:"Ladataan päivän haastetta…",errore:"Tietovisa vaatii JavaScriptin.",altro:"Lue uusimmat uutiset",
    items:[
      ["Minä vuonna ensimmäinen PlayStation julkaistiin Japanissa?",["1994","1991","1998","2000"],"Ensimmäinen PlayStation julkaistiin Japanissa 3. joulukuuta 1994."],
      ["Minä vuonna alkuperäinen Game Boy julkaistiin Japanissa?",["1989","1985","1993","1996"],"Nintendo julkaisi Game Boyn Japanissa 21. huhtikuuta 1989."],
      ["Kuka loi Tetris-pelin?",["Alexey Pajitnov","Hideo Kojima","John Carmack","Yu Suzuki"],"Alexey Pajitnov suunnitteli Tetriksen vuonna 1984."],
      ["Minä vuonna Sonic the Hedgehog debytoi Mega Drivella?",["1991","1986","1995","2001"],"Ensimmäinen Sonic the Hedgehog ilmestyi vuonna 1991."],
      ["Minä vuonna Famicom julkaistiin Japanissa?",["1983","1980","1988","1990"],"Nintendon Family Computer julkaistiin Japanissa vuonna 1983."],
      ["Kuka loi Super Marion?",["Shigeru Miyamoto","Satoshi Tajiri","Gunpei Yokoi","Yuji Naka"],"Shigeru Miyamoto loi Marion Nintendolle."],
      ["Minä vuonna ensimmäinen DOOM julkaistiin?",["1993","1989","1997","2001"],"id Softwaren DOOM julkaistiin joulukuussa 1993."],
      ["Minä vuonna PAC-MAN julkaistiin?",["1980","1975","1984","1990"],"Bandai Namcon kolikkopeli julkaistiin Japanissa vuonna 1980."],
      ["Minä vuonna Game Boy Advance julkaistiin?",["2001","1997","2004","2007"],"Nintendo julkaisi Game Boy Advancen vuonna 2001."],
      ["Milloin Nintendo DS julkaistiin Japanissa?",["2004","2000","2008","2011"],"Nintendo DS julkaistiin vuonna 2004."],
      ["Minä vuonna Nintendo Wii julkaistiin?",["2006","2003","2010","2012"],"Wii julkaistiin vuonna 2006."],
      ["Milloin Nintendo Switch julkaistiin?",["2017","2014","2019","2020"],"Nintendo Switch julkaistiin vuonna 2017."],
      ["Milloin Nintendo 64 julkaistiin Japanissa?",["1996","1992","1999","2002"],"Nintendo 64 julkaistiin Japanissa 23. kesäkuuta 1996."],
      ["Minä vuonna ensimmäinen Xbox julkaistiin Pohjois-Amerikassa?",["2001","1998","2004","2006"],"Alkuperäinen Xbox julkaistiin Pohjois-Amerikassa 15. marraskuuta 2001."]
    ]
  },
  ja: {
    nome:"今日のカートリッジ",intro:"ゲームのクイズを毎日1問。あなたは何問わかる？",data:"今日のチャレンジ",scegli:"回答を選んでください",verifica:"答えを確認",giusto:"正解！",sbagliato:"惜しい！",risposta:"正しい答え：",torna:"明日も新しい問題に挑戦してください。",condividi:"結果を共有",condiviso:"結果をコピーしました",prepara:"問題を読み込み中…",errore:"このクイズにはJavaScriptが必要です。",altro:"最新ニュースを読む",
    items:[
      ["初代PlayStationが日本で発売されたのは何年？",["1994","1991","1998","2000"],"初代PlayStationは1994年12月3日に日本で発売されました。"],
      ["初代ゲームボーイが日本で発売されたのは何年？",["1989","1985","1993","1996"],"任天堂は1989年4月21日にゲームボーイを日本で発売しました。"],
      ["『テトリス』を制作したのは誰？",["Alexey Pajitnov","Hideo Kojima","John Carmack","Yu Suzuki"],"アレクセイ・パジトノフが1984年にテトリスを考案しました。"],
      ["『ソニック・ザ・ヘッジホッグ』がメガドライブで初登場したのは何年？",["1991","1986","1995","2001"],"初代ソニックは1991年に発売されました。"],
      ["ファミリーコンピュータが日本で発売されたのは何年？",["1983","1980","1988","1990"],"任天堂のファミリーコンピュータは1983年に日本で発売されました。"],
      ["マリオを生み出したのは誰？",["Shigeru Miyamoto","Satoshi Tajiri","Gunpei Yokoi","Yuji Naka"],"宮本茂が任天堂のマリオを生み出しました。"],
      ["初代『DOOM』が発売されたのは何年？",["1993","1989","1997","2001"],"id Softwareの『DOOM』は1993年12月に登場しました。"],
      ["『パックマン』が登場したのは何年？",["1980","1975","1984","1990"],"バンダイナムコのアーケードゲームは1980年に日本で登場しました。"],
      ["ゲームボーイアドバンスが発売されたのは何年？",["2001","1997","2004","2007"],"任天堂は2001年にゲームボーイアドバンスを発売しました。"],
      ["ニンテンドーDSが日本で登場したのは何年？",["2004","2000","2008","2011"],"ニンテンドーDSは2004年に登場しました。"],
      ["Wiiが発売されたのは何年？",["2006","2003","2010","2012"],"Wiiは2006年に発売されました。"],
      ["Nintendo Switchが発売されたのは何年？",["2017","2014","2019","2020"],"Nintendo Switchは2017年に登場しました。"],
      ["NINTENDO64が日本で発売されたのは何年？",["1996","1992","1999","2002"],"NINTENDO64は1996年6月23日に日本で発売されました。"],
      ["初代Xboxが北米で発売されたのは何年？",["2001","1998","2004","2006"],"初代Xboxは2001年11月15日に北米で発売されました。"]
    ]
  },
  ru: {
    nome:"Картридж дня",intro:"Один игровой вопрос каждый день. Сколько ты знаешь?",data:"Задание дня",scegli:"Выберите ответ",verifica:"Проверить ответ",giusto:"Правильно!",sbagliato:"Не совсем!",risposta:"Правильный ответ:",torna:"Возвращайтесь завтра за новым вопросом.",condividi:"Поделиться результатом",condiviso:"Результат скопирован",prepara:"Загружаем вопрос…",errore:"Для викторины нужен JavaScript.",altro:"Читать последние новости",
    items:[
      ["В каком году первая PlayStation вышла в Японии?",["1994","1991","1998","2000"],"Первая PlayStation вышла в Японии 3 декабря 1994 года."],
      ["В каком году оригинальная Game Boy вышла в Японии?",["1989","1985","1993","1996"],"Nintendo выпустила Game Boy в Японии 21 апреля 1989 года."],
      ["Кто создал видеоигру Tetris?",["Alexey Pajitnov","Hideo Kojima","John Carmack","Yu Suzuki"],"Алексей Пажитнов создал Tetris в 1984 году."],
      ["В каком году Sonic the Hedgehog дебютировал на Mega Drive?",["1991","1986","1995","2001"],"Первая игра Sonic the Hedgehog вышла в 1991 году."],
      ["В каком году Famicom вышла в Японии?",["1983","1980","1988","1990"],"Nintendo выпустила Family Computer в Японии в 1983 году."],
      ["Кто создал Super Mario?",["Shigeru Miyamoto","Satoshi Tajiri","Gunpei Yokoi","Yuji Naka"],"Сигэру Миямото создал Марио для Nintendo."],
      ["В каком году вышла первая DOOM?",["1993","1989","1997","2001"],"DOOM от id Software вышла в декабре 1993 года."],
      ["В каком году дебютировала PAC-MAN?",["1980","1975","1984","1990"],"Аркадная игра Bandai Namco появилась в Японии в 1980 году."],
      ["В каком году вышла Game Boy Advance?",["2001","1997","2004","2007"],"Nintendo выпустила Game Boy Advance в 2001 году."],
      ["Когда Nintendo DS дебютировала в Японии?",["2004","2000","2008","2011"],"Nintendo DS появилась в 2004 году."],
      ["В каком году вышла Nintendo Wii?",["2006","2003","2010","2012"],"Консоль Wii вышла в 2006 году."],
      ["Когда вышла Nintendo Switch?",["2017","2014","2019","2020"],"Nintendo Switch появилась в 2017 году."],
      ["Когда Nintendo 64 вышла в Японии?",["1996","1992","1999","2002"],"Nintendo 64 вышла в Японии 23 июня 1996 года."],
      ["В каком году первая Xbox вышла в Северной Америке?",["2001","1998","2004","2006"],"Первая Xbox вышла там 15 ноября 2001 года."]
    ]
  }
};
