# Deriva la versione Storie (15 s) da scena.html
s=open('scena.html').read()
R=[("const S = {s1:[0,8],s2:[8,12],s3:[12,20],s4:[20,32],s5:[32,40],s6:[40,52]};","const S = {s1:[0,4],s2:[4,7],s3:[7,15],s4:[15,19],s5:[19,19],s6:[19,32]};"),
('const SFIDE = [["OTTAVI · SFIDA 1/8",0,1],["OTTAVI · SFIDA 2/8",2,3],["OTTAVI · SFIDA 8/8",14,15]];','const SFIDE = [["OTTAVI · SFIDA 8/8",14,15]];'),
("const k=Math.min(2,Math.floor(u/4))","const k=0"),
("set('s1marchio', eo(u/1.2), (1-eo(u/1.2))*-30);","set('s1marchio', eo(u/0.6), (1-eo(u/0.6))*-30);"),
("const n=(u-1)/0.9;","const n=(u-0.4)/0.7;"),
("set('s1fol', eo((u-1.8)/0.8), (1-eo((u-1.8)/0.8))*40);","set('s1fol', eo((u-1.0)/0.5), (1-eo((u-1.0)/0.5))*40);"),
("const b=(u-3)/0.6;","const b=(u-1.6)/0.5;"),
("set('s1grazie', eo((u-4)/1), (1-eo((u-4)/1))*30);","set('s1grazie', eo((u-2.2)/0.6), (1-eo((u-2.2)/0.6))*30);"),
("if(u>=1&&u<1.25) flash=.55*(1-(u-1)/.25);","if(u>=0.4&&u<0.65) flash=.55*(1-(u-0.4)/.25);"),
("if(u>=3&&u<3.25) flash=.45*(1-(u-3)/.25);","if(u>=1.6&&u<1.85) flash=.45*(1-(u-1.6)/.25);"),
("set('s2c', eo((u-2)/0.8), (1-eo((u-2)/0.8))*30);","set('s2c', eo((u-1.5)/0.6), (1-eo((u-1.5)/0.6))*30);"),
("const fine = cl((u-11.2)/0.8);","const fine = cl((u-12.2)/0.8);"),
(".marchio{top:120px;",".marchio{top:270px;"),
('<div class="abs c" style="top:130px;font-family:Anybody;','<div class="abs c" style="top:280px;font-family:Anybody;'),
('<div id="s4turno" class="abs" style="left:65px;top:230px">','<div id="s4turno" class="abs" style="left:65px;top:262px">'),
('<div id="s4cA" class="abs card" style="left:65px;top:350px;','<div id="s4cA" class="abs card" style="left:65px;top:370px;'),
('<div id="s4vs" class="abs vs" style="left:445px;top:840px">','<div id="s4vs" class="abs vs" style="left:445px;top:850px">'),
('<div id="s4cB" class="abs card" style="left:65px;top:1000px;','<div id="s4cB" class="abs card" style="left:65px;top:1010px;'),
('<div id="s4q" class="abs c big" style="top:1610px;','<div id="s4q" class="abs c big" style="top:1580px;'),
('left:40px;top:1620px;width:1000px','left:40px;top:1530px;width:1000px')]
for a,b in R:
    assert a in s, a[:60]
    s=s.replace(a,b)
open('scena-storie.html','w').write(s); print('ok')
