# Usare il generatore su Windows

Guida passo passo per Windows 10 e 11. Tutto è **gratuito**: servono solo programmi open source scaricati dai siti ufficiali. I comandi si scrivono in **PowerShell**: menu Start, digita "PowerShell", poi Invio.

## 1. Installazione (una volta sola)

### Python
1. Scarica **Python 3.12** (o più recente) da <https://www.python.org/downloads/windows/>: "Windows installer (64-bit)".
2. Nella prima schermata dell'installazione spunta **"Add python.exe to PATH"**, poi "Install Now".
3. Chiudi e riapri PowerShell, poi controlla:
   ```powershell
   py --version
   ```

### Playwright e Chromium (il "browser invisibile" che disegna le grafiche)
```powershell
py -m pip install playwright
py -m playwright install chromium
```
Il secondo comando scarica Chromium, circa 150 MB, solo la prima volta.

### Solo per rigenerare i trailer video (facoltativo)
- **Node.js LTS** da <https://nodejs.org/> (installazione standard).
- **ffmpeg**:
  ```powershell
  winget install --id Gyan.FFmpeg -e
  ```
  Poi chiudi e riapri PowerShell e controlla con `ffmpeg -version`.

## 2. Preparare la cartella
1. Estrai `Mondiale-3K-kit.zip`, per esempio in `Documenti\Mondiale-3K-kit`. Clic destro sul file, "Estrai tutto".
2. In PowerShell entra nella cartella del generatore:
   ```powershell
   cd "$env:USERPROFILE\Documents\Mondiale-3K-kit\08-generatore"
   ```
   Se hai estratto lo ZIP altrove, cambia il percorso e mettilo tra virgolette se contiene spazi.
3. Lancia i test (non creano immagini):
   ```powershell
   py -m unittest -v test_validazione
   ```
   In fondo deve comparire `OK`.

## 3. Durante il torneo

### Registrare un risultato
1. Alla chiusura del sondaggio (24 ore piene), apri la Storia dall'archivio e leggi i **voti effettivi**, non le percentuali.
2. Scrivi la riga in `07-documenti\REGISTRO-RISULTATI.csv`.
3. Apri `risultati-torneo.json` con il **Blocco note** e aggiungi il tentativo nella sfida giusta. Per esempio, per la sfida 1 degli ottavi:
   ```json
   "O1": {"tentativi": [{"voti_a": 812, "voti_b": 790, "chiusura": "2026-11-30T18:00", "verificato": true}]},
   ```
   - `voti_a` è la prima console della sfida (quella in alto nella Storia), `voti_b` la seconda.
   - Metti `"verificato": true` solo dopo aver ricontrollato lo screenshot.
   - Parità o zero voti: aggiungi il nuovo tentativo **dopo** quello precedente, nella stessa lista. Vale sempre l'ultimo.
   - Salva il file con codifica UTF-8: è l'impostazione predefinita del Blocco note.
4. Controlla il file:
   ```powershell
   py genera.py verifica --risultati risultati-torneo.json
   ```
   Il programma mostra lo stato di ogni sfida. Se trova un errore, come una console che non può essere lì o dei voti non validi, lo segnala e si ferma.

Codici delle sfide: ottavi `O1`–`O8`, quarti `Q1`–`Q4`, semifinali `S1`–`S2`, finale `F1`.

### Creare le grafiche del turno successivo
```powershell
py genera.py sfida --sfida Q1 --risultati risultati-torneo.json -o out\quarti-1.png
py genera.py tabellone --risultati risultati-torneo.json --stato "Quarti: si vota stasera alle 18:30" -o out\tabellone.png
```
Le console di ogni sfida vengono ricavate da sole dai risultati verificati. Se il turno precedente non è concluso, il programma si rifiuta di creare la grafica.

### Post della campionessa (solo dopo la finale verificata)
```powershell
py genera.py campione --risultati risultati-torneo.json -o out\campionessa.png
```
Senza una finale decisa e verificata non viene prodotto nulla.

### Prove (sempre con la filigrana "ESEMPIO · NON PUBBLICARE")
```powershell
py genera.py tabellone --prova --risultati esempio-risultati.json --stato "Prova" -o out\prova.png
```
`esempio-risultati.json` contiene **dati inventati**: il programma lo accetta solo con `--prova`.

### Rigenerare tutto il kit di partenza
```powershell
py produci.py ..\kit-rigenerato
```

## 4. Rigenerare i trailer (solo se cambiano le date)
1. Apri `trailer\scena.html` con il Blocco note e cambia il testo dentro `id="s6d"`, per esempio "Si parte sabato 28 novembre".
2. Poi:
   ```powershell
   cd trailer
   npm init -y
   npm install playwright
   npx playwright install chromium
   py deriva_storie.py
   py musica.py
   py musica-storie.py
   node render.mjs
   node render-storie.mjs
   ```
3. Unisci le scene e l'audio. La versione Reel è questa; per le Storie si usano gli stessi comandi con `storie-` e `musica-storie.wav`:
   ```powershell
   "file 'scena-s1.mp4'","file 'scena-s2.mp4'","file 'scena-s3.mp4'","file 'scena-s4.mp4'","file 'scena-s5.mp4'","file 'scena-s6.mp4'" | Set-Content -Encoding ascii lista.txt
   ffmpeg -y -f concat -safe 0 -i lista.txt -c copy video.mp4
   ffmpeg -y -i video.mp4 -i musica.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -af "volume=-2.5dB" -shortest trailer-reel.mp4
   ```
   Per `musica.py` servono `numpy`: `py -m pip install numpy`.

## Problemi frequenti
- **"py" non è riconosciuto:** Python non è nel PATH. Reinstallalo spuntando "Add python.exe to PATH".
- **"Executable doesn't exist" o errore su Chromium:** esegui di nuovo `py -m playwright install chromium`.
- **Lettere accentate strane nel terminale:** non incidono sulle immagini. Se danno fastidio, prima dei comandi esegui `chcp 65001`.
- **Errore "JSON non valido":** di solito manca una virgola o c'è una virgola di troppo prima di `}`. Il messaggio indica riga e colonna.
