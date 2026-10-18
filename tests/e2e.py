# Browser-Durchlauf aller Abläufe im iPhone-Format.
# Start: pip install playwright && python -m playwright install chromium && python tests/e2e.py
from playwright.sync_api import sync_playwright
import http.server,threading,functools,os,json,sys
import tempfile
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));os.chdir(ROOT)
TMP=tempfile.mkdtemp();HARD=os.path.join(ROOT,'tests','fixtures','testvokabeln.json');BROKEN=os.path.join(TMP,'kaputt.json');open(BROKEN,'w').write('{"kaputt":')
h=functools.partial(http.server.SimpleHTTPRequestHandler,directory=os.getcwd());h.log_message=lambda *a:None
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8790),h);threading.Thread(target=srv.serve_forever,daemon=True).start()
URL='http://localhost:8790/index.html'
R=[];ok=lambda name,cond,info='':R.append(('PASS' if cond else 'FAIL',name,info))
with sync_playwright() as p:
    b=p.chromium.launch();dev=p.devices['iPhone 13'];ctx=b.new_context(**{k:v for k,v in dev.items() if k!='default_browser_type'},accept_downloads=True)
    pg=ctx.new_page();errs=[];dialogs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    def on_dialog(d):
        dialogs.append(d.message); d.accept() if d.type=='confirm' else d.dismiss()
    pg.on('dialog',on_dialog)
    toast=lambda:pg.inner_text('#toast') if pg.is_visible('#toast') else ''
    pg.goto(URL);pg.wait_for_timeout(300)
    # 1 Leerzustand
    ok('Leerzustand Startseite',('Noch nichts zum Üben' in pg.inner_text('#screen')))
    pg.click('nav >> text=Lernstand');ok('Leerzustand Lernstand','Noch keine' in pg.inner_text('#screen'))
    pg.click('nav >> text=Vokabeln');ok('Leerzustand Vokabelbuch',pg.locator('#list .card').count()==0)
    # 2 Import
    pg.click('nav >> text=Eltern');ok('Offline-Hinweis nur im Elternbereich',pg.is_visible('#offline'))
    pg.set_input_files('#vocabImport',BROKEN);pg.wait_for_timeout(200);ok('Kaputte Datei wird abgelehnt','nicht ausgeführt' in toast(),toast())
    pg.set_input_files('#vocabImport',HARD);pg.wait_for_timeout(200);ok('Import 6 Einträge','6 neue' in toast(),toast())
    pg.set_input_files('#vocabImport',HARD);pg.wait_for_timeout(200);ok('Doppelter Import ergänzt nichts','0 neue' in toast(),toast())
    pg.set_input_files('#import',HARD);pg.wait_for_timeout(200);ok('Vokabeldatei als Sicherung abgelehnt','nicht eingelesen' in toast(),toast())
    ok('Kein Schadcode ausgeführt (Import)',not any('1'==d for d in dialogs) and pg.locator('#screen img').count()==0)
    # 3 Freigabe, einen verwerfen
    n_pending=pg.locator('[data-review]').count();ok('6 Prüfkarten',n_pending==6,n_pending)
    pg.click('[data-review] >> nth=3');pg.click('#del');pg.wait_for_timeout(100)
    ok('Eintrag löschen mit Rückfrage',any('löschen' in d for d in dialogs) and pg.locator('[data-review]').count()==5)
    while pg.locator('[data-review]').count(): pg.click('[data-review] >> nth=0');pg.click('text=Freigeben')
    ok('Alle freigegeben',pg.evaluate("db.entries.filter(e=>e.approved).length")==5)
    # 4 Vokabelbuch
    pg.click('nav >> text=Vokabeln');pg.fill('#search','unit');ok('Suche trifft keine Feldnamen',pg.locator('#list .card').count()==5) # alle haben 'Unit 1' -> legit 5
    pg.fill('#search','section');ok('Suche "section" findet nichts',pg.locator('#list .card').count()==0)
    pg.fill('#search','Mauer');ok('Suche deutsch',pg.locator('#list .card').count()==1)
    pg.fill('#search','');pg.click('#add');pg.click('text=Zur Prüfung abgeben');ok('Pflichtfeld-Hinweis','ausfüllen' in toast(),toast())
    ok('Fokus auf fehlendem Feld',pg.evaluate("document.activeElement.id")=='f-section')
    pg.fill('#f-section','Station 2');pg.keyboard.press('Enter');ok('Enter springt zum nächsten Feld',pg.evaluate("document.activeElement.id")=='f-page')
    pg.fill('#f-en','castle');pg.fill('#f-de','Burg');pg.fill('#f-sentence','The castle is old.');pg.click('text=Zur Prüfung abgeben')
    ok('Satz ohne Übersetzung abgefangen','beide Satzfelder' in toast(),toast())
    pg.fill('#f-translation','Die Burg ist alt.');pg.click('text=Zur Prüfung abgeben');ok('Eigener Eintrag wartet',pg.evaluate("db.entries.filter(e=>e.pending&&!e.approved).length")==1)
    pg.click('[data-edit] >> nth=0');pg.fill('#f-de','dauern');pg.click('text=Zur Prüfung abgeben')
    ok('Änderung an Freigegebenem wartet',pg.evaluate("db.entries[0].pending&&db.entries[0].approved?1:0")==1)
    pg.click('[data-edit] >> nth=0');ok('Verwerfen-Knopf da','verwerfen' in pg.inner_text('#del'));pg.click('#del')
    ok('Änderung verworfen',pg.evaluate("db.entries[0].pending")is None)
    # 5 Lernen Wortmodus mit Abschnitt
    pg.click('nav >> text=Lernen');pg.select_option('#section','Intro');pg.wait_for_timeout(100)
    ok('Zähler "dran" auf Startseite','3 dran' in pg.inner_text('[data-mode=word]'),pg.inner_text('[data-mode=word]'))
    pg.click('[data-mode=word]')
    ok('Abschnitt gefiltert',pg.evaluate("session.queue.length")==3,pg.evaluate("session.queue.length"))
    seen=[]
    for i in range(3):
        q=pg.inner_text('.question');seen.append(q)
        ans={'dauern (hier)':'take','Reich, Imperium':'empire','viel, viele':'a lot'}[q]
        pg.fill('#answer',ans);pg.keyboard.press('Enter');pg.wait_for_timeout(150)
        good='Fast' not in pg.inner_text('#feedback')
        ok(f'Wortmodus streng: "{ans}" für {q}',good==(ans=='empire'))
        ok('Rückmeldung bleibt nach Enter stehen',pg.is_visible('#next') and pg.evaluate('session.index')==i)
        pg.keyboard.press('Enter');pg.wait_for_timeout(150)
    ok('Enter nach Prüfen geht weiter',pg.evaluate("session.index")==3)
    ok('Fehler werden wiederholt',pg.evaluate("session.queue.length")==5)
    while pg.is_visible('#answer'):
        pg.fill('#answer',pg.evaluate('target()'));pg.keyboard.press('Enter');pg.wait_for_timeout(100)
        ok('Exakte Buchschreibweise zählt','Fast' not in pg.inner_text('#feedback'))
        pg.keyboard.press('Enter');pg.wait_for_timeout(250)
    ok('Endbildschirm',pg.is_visible('#again'))
    pg.click('#again');ok('Noch eine Runde behält Abschnitt',pg.evaluate("session.queue.length")==3 and pg.evaluate("lastSection")=='Intro')
    pg.click('#quit');ok('Home aus Runde',pg.is_visible('[data-mode=word]'))
    ok('Abschnitt bleibt gewählt',pg.input_value('#section')=='Intro')
    # Satzmodus mit typografischem Apostroph
    pg.select_option('#section','Station 1');pg.click('[data-mode=sentence]')
    for i in range(pg.evaluate("session.queue.length")):
        t=pg.evaluate("target()")
        typed=t.replace("'","’") if "Hadrian" in t else t
        pg.click('#answer');pg.keyboard.type(typed);pg.keyboard.press('Enter');pg.wait_for_timeout(100)
        ok(f'Satz korrekt erkannt ({t[:25]}…)','Fast' not in pg.inner_text('#feedback'))
        if not pg.is_visible('#next'): print('DEBUG',repr(pg.input_value('#answer')),pg.evaluate("session.done"),pg.inner_text('#feedback')[:200],pg.evaluate("document.activeElement.id")); break
        pg.click('#next')
    pg.click('#back')
    # Buchstabieren
    pg.select_option('#section','');pg.click('[data-mode=spell]');ok('Spell ohne Textfeld',pg.locator('#answer').count()==0)
    pg.click('#reveal');ok('Buchstaben einzeln',' · ' in pg.inner_text('#feedback'));pg.click('#yes');pg.click('#next');pg.click('#back1')
    ok('Zurück nimmt zurück',pg.evaluate("session.index")==0)
    pg.click('#quit')
    # Lernstand
    pg.click('nav >> text=Lernstand');t=pg.inner_text('#screen');ok('Lernstand zeigt Fortschritt','Im Aufbau' in t)
    ok('Kein Schadcode in Lernstand',pg.locator('#screen img').count()==0)
    # Neu laden
    pg.reload();pg.wait_for_timeout(300);ok('Daten nach Neuladen da',pg.evaluate("db.entries.length")==6)
    # Sicherung
    pg.click('nav >> text=Eltern')
    with pg.expect_download() as d: pg.click('#export')
    path=os.path.join(TMP,'backup.json');d.value.save_as(path);bk=json.load(open(path));ok('Export enthält alles',len(bk['entries'])==6)
    pg.evaluate("db.entries=[];save()");pg.set_input_files('#import',path);pg.wait_for_timeout(300)
    ok('Wiederherstellen mit Rückfrage',any('ersetzen' in d for d in dialogs) and pg.evaluate("db.entries.length")==6)
    pg.set_input_files('#import',path);pg.wait_for_timeout(300);ok('Gleiche Datei erneut wählbar',sum('ersetzen' in d for d in dialogs)==2)
    # Offline
    pg.wait_for_timeout(800);reg=pg.evaluate("navigator.serviceWorker.controller?1:0") or (pg.reload(),pg.wait_for_timeout(800),pg.evaluate("navigator.serviceWorker.controller?1:0"))[2]
    ok('Service Worker aktiv',reg==1)
    ctx.set_offline(True);pg.reload();pg.wait_for_timeout(500);ok('App startet offline','Hallo Noah' in pg.inner_text('header'))
    ctx.set_offline(False)
    ok('Keine JS-Fehler',not errs,errs)
    ok('Keine unerwarteten Dialoge',all(('löschen' in d or 'ersetzen' in d) for d in dialogs),dialogs)
    # Layout-Checks
    pg.goto(URL);pg.wait_for_timeout(300)
    screens={'Lernen':lambda:pg.click('nav >> text=Lernen'),'Lernstand':lambda:pg.click('nav >> text=Lernstand'),'Vokabeln':lambda:pg.click('nav >> text=Vokabeln'),'Eltern':lambda:pg.click('nav >> text=Eltern'),
             'Runde':lambda:(pg.click('nav >> text=Lernen'),pg.select_option('#section','Station 1'),pg.click('[data-mode=sentence]'),pg.click('#reveal')),
             'Editor':lambda:(pg.click('#quit') if pg.is_visible('#quit') else None,pg.click('nav >> text=Vokabeln'),pg.click('#add'))}
    for w in [320,375,390,768]:
        pg.set_viewport_size({'width':w,'height':740})
        for name,go in screens.items():
            if pg.is_visible('#quit'): pg.click('#quit')
            go();pg.wait_for_timeout(120)
            ov=pg.evaluate("document.documentElement.scrollWidth>document.documentElement.clientWidth")
            small=pg.evaluate("""[...document.querySelectorAll('button,label.filebtn,select,input:not(.vh),textarea,summary')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.id||e.className||e.tagName,(e.innerText||'').trim().slice(0,18),Math.round(r.width),Math.round(r.height)]}).filter(x=>x[3]<44||x[2]<44)""")
            fs=pg.evaluate("""[...document.querySelectorAll('input:not(.vh),textarea,select')].filter(e=>parseFloat(getComputedStyle(e).fontSize)<16).length""")
            ok(f'{w}px {name}: kein Querscrollen',not ov)
            ok(f'{w}px {name}: Tippflächen >=44px',not small,small)
            ok(f'{w}px {name}: Eingaben >=16px (kein iOS-Zoom)',fs==0)
    b.close()
srv.shutdown()
fails=[r for r in R if r[0]=='FAIL']
for r in R:
    if r[0]=='FAIL' or '320px' not in r[1] and '375px' not in r[1] and '390px' not in r[1] and '768px' not in r[1]: print(*r)
print(f'\n{len(R)-len(fails)} von {len(R)} bestanden')
sys.exit(1 if fails else 0)
