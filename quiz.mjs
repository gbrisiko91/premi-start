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
      ["In quale anno uscì il primo DOOM?", ["1993", "1989", "1997", "2001"], "DOOM, sviluppato da id Software, uscì nel dicembre 1993."]
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
      ["What year was the original DOOM released?", ["1993", "1989", "1997", "2001"], "DOOM, developed by id Software, was released in December 1993."]
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
      ["In welchem Jahr erschien das erste DOOM?",["1993","1989","1997","2001"],"DOOM von id Software erschien im Dezember 1993."]
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
      ["¿En qué año salió el primer DOOM?",["1993","1989","1997","2001"],"DOOM, desarrollado por id Software, salió en diciembre de 1993."]
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
      ["Hvilket år kom den første DOOM?",["1993","1989","1997","2001"],"DOOM fra id Software ble utgitt i desember 1993."]
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
      ["Vilket år släpptes första DOOM?",["1993","1989","1997","2001"],"DOOM från id Software släpptes i december 1993."]
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
      ["Minä vuonna ensimmäinen DOOM julkaistiin?",["1993","1989","1997","2001"],"id Softwaren DOOM julkaistiin joulukuussa 1993."]
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
      ["初代『DOOM』が発売されたのは何年？",["1993","1989","1997","2001"],"id Softwareの『DOOM』は1993年12月に登場しました。"]
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
      ["В каком году вышла первая DOOM?",["1993","1989","1997","2001"],"DOOM от id Software вышла в декабре 1993 года."]
    ]
  }
};
