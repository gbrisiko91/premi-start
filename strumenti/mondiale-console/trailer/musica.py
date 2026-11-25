# Musica chiptune originale per il trailer (128 BPM, La minore), sincronizzata con scena.html
import numpy as np, wave

SR = 44100
BPM = 128
B = 60 / BPM
TOT_BEATS = 52
N = int(SR * (TOT_BEATS * B + 0.6))
out = np.zeros(N)
rng = np.random.default_rng(7)

def hz(m): return 440 * 2 ** ((m - 69) / 12)

def env(n, a=0.004, d=0.0, r=0.03, sustain=1.0):
    e = np.ones(n) * sustain
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na)
    if d > 0:
        nd = int(d * SR); e[na:na + nd] = np.linspace(1, sustain, len(e[na:na + nd]))
    e[-nr:] *= np.linspace(1, 0, nr)
    return e

def square(f, dur, duty=0.5, vol=0.2, slide=0.0):
    n = int(dur * SR); t = np.arange(n) / SR
    ff = f * (1 + slide * t / max(dur, 1e-3))
    ph = np.cumsum(ff) / SR
    return vol * np.where((ph % 1) < duty, 1.0, -1.0)

def tri(f, dur, vol=0.3):
    n = int(dur * SR); t = np.arange(n) / SR
    ph = (f * t) % 1
    return vol * (4 * np.abs(ph - 0.5) - 1)

def noise(dur, vol=0.2, lp=1.0):
    n = int(dur * SR); x = rng.uniform(-1, 1, n)
    if lp < 1.0:
        y = np.zeros(n); a = lp
        for i in range(1, n): y[i] = y[i - 1] + a * (x[i] - y[i - 1])
        x = y / max(1e-9, np.abs(y).max())
    return vol * x

def put(sig, beat):
    i = int(beat * B * SR)
    j = min(N, i + len(sig)); out[i:j] += sig[: j - i]

def kick(beat, vol=0.9):
    dur = 0.18; n = int(dur * SR); t = np.arange(n) / SR
    f = 150 * np.exp(-t * 28) + 45
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 16)
    put(vol * s, beat)

def snare(beat, vol=0.35):
    s = noise(0.14, vol) * np.exp(-np.arange(int(0.14 * SR)) / SR * 30)
    tone = square(190, 0.06, 0.5, 0.12) * np.exp(-np.arange(int(0.06 * SR)) / SR * 50)
    s[: len(tone)] += tone
    put(s, beat)

def hat(beat, vol=0.08):
    d = 0.035; put(noise(d, vol) * np.exp(-np.arange(int(d * SR)) / SR * 120), beat)

def crash(beat, vol=0.25, dur=1.4):
    put(noise(dur, vol) * np.exp(-np.arange(int(dur * SR)) / SR * 3.2), beat)

def impact(beat):            # colpo per VS e titoli
    kick(beat, 1.0); crash(beat, 0.22, 1.0)
    put(square(hz(33), 0.35, 0.5, 0.16, slide=-0.5) * env(int(0.35 * SR), r=0.2), beat)

def blip(beat, m, vol=0.12):  # suono "moneta"
    put(np.concatenate([square(hz(m), 0.06, 0.5, vol), square(hz(m + 7), 0.16, 0.5, vol) * env(int(0.16 * SR), r=0.12)]), beat)

# progressione: Am F C G (una battuta = 4 beat)
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
ROOT = [45, 41, 36, 43]

for bar in range(TOT_BEATS // 4):
    c = CHORDS[bar % 4]; r = ROOT[bar % 4]; b0 = bar * 4
    full = 8 <= b0 < 40
    # arpeggio in sedicesimi (in S6 rallenta in ottavi)
    step = 0.25 if b0 < 40 else 0.5
    k = 0; x = 0.0
    while x < 4:
        if b0 + x >= 50: break
        m = c[k % 3] + 12 * (1 + (k // 3) % 2)
        v = 0.045 if b0 < 4 else (0.065 if b0 < 8 else 0.075)
        if b0 >= 40: v = 0.06
        put(square(hz(m), step * B * 0.9, 0.125, v) * env(int(step * B * 0.9 * SR), r=0.02), b0 + x)
        k += 1; x += step
    # basso
    if b0 >= 8 and b0 < 40:
        for e in range(8):
            put(tri(hz(r + (12 if e % 2 else 0)), B * 0.45, 0.28) * env(int(B * 0.45 * SR), r=0.03), b0 + e * 0.5)
    elif b0 >= 40:
        put(tri(hz(r), B * 3.8, 0.26) * env(int(B * 3.8 * SR), r=0.6), b0)
        for m in c:  # pad di accordi
            put(square(hz(m), B * 3.8, 0.25, 0.035) * env(int(B * 3.8 * SR), a=0.05, r=0.8), b0)
    # batteria
    if full:
        half = 32 <= b0 < 40
        for e in range(4):
            if not half or e in (0,):
                kick(b0 + e)
            if e in (1, 3) and not half: snare(b0 + e)
            if half and e == 2: snare(b0 + e, 0.4)
        for e in range(8): hat(b0 + e * 0.5, 0.06 if e % 2 else 0.04)

# intro: blip sui flash (beat 1 e 3), riser verso S2
blip(1.0, 76); blip(3.0, 81)
rs = int(4 * B * SR); t = np.arange(rs) / SR
riser = noise(4 * B, 0.12) * (t / t[-1]) ** 2
put(riser, 4)
put(square(hz(57), 4 * B, 0.5, 0.05, slide=1.0) * (t / t[-1]), 4)

# colpi sincronizzati con la scena
impact(8)                      # "16 CONSOLE"
crash(12, 0.18)                # inizio montaggio
for b in (21.05, 25.05, 29.05): impact(b)   # VS
impact(32)                     # 5 GIORNI
impact(40); crash(40, 0.3, 2.5)  # titolo finale
blip(44.0, 88, 0.09)           # "Attiva le notifiche"

# fine: dissolvenza dagli ultimi 2 beat
fade_i = int(50 * B * SR); fade_n = int(1.6 * SR)
out[fade_i:fade_i + fade_n] *= np.linspace(1, 0, len(out[fade_i:fade_i + fade_n]))
out[fade_i + fade_n:] = 0

# mastering semplice
out = np.tanh(out * 1.4) / np.tanh(1.4)
out /= np.abs(out).max() / 0.89
st = np.stack([out, out], 1)
with wave.open('musica.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())
print('durata', round(len(out) / SR, 2), 's')
