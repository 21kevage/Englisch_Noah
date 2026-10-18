# Übergabe: Englisch_Noah auf GitHub aktualisieren

Diese Datei richtet sich an ChatGPT mit GitHub-Anbindung. Sie beschreibt, wie der Stand 1.2 der App ins Repository kommt und worauf bei späteren Änderungen zu achten ist. Auftraggeber ist Kevin Schmidt.

## Der Auftrag

Lade die Dateien aus `Englisch_Noah_1.2.zip` unverändert in das Repository `21kevage/Englisch_Noah` auf den Branch `main`, als einen einzigen Commit. Ändere dabei keinen Code.

## Eckdaten

| Punkt | Wert |
|---|---|
| Repository | https://github.com/21kevage/Englisch_Noah |
| Branch | `main` |
| Veröffentlichung | GitHub Pages aus `main`, Ordner `/` (root) |
| Erwartete Adresse | https://21kevage.github.io/Englisch_Noah/ |
| Stand auf GitHub vor diesem Auftrag | Commit `3c5772f`, App-Version 0.2 |
| Neuer Stand | App-Version 1.2 |

## Dateien im Paket

Die ZIP-Datei enthält einen Ordner `Englisch_Noah_1.2`. Dessen **Inhalt** gehört ins Wurzelverzeichnis des Repos, der Ordner selbst nicht.

| Pfad im Repo | Art | Aktion |
|---|---|---|
| `index.html` | Text | ersetzen |
| `sw.js` | Text | ersetzen |
| `manifest.webmanifest` | Text | ersetzen |
| `README.md` | Text | ersetzen |
| `icon.svg` | Bild | ersetzen |
| `icon-180.png` | Bild, binär | neu |
| `icon-192.png` | Bild, binär | neu |
| `icon-512.png` | Bild, binär | neu |
| `tests/core.cjs` | Text | ersetzen |
| `tests/e2e.py` | Text | neu |
| `tests/simulation.cjs` | Text | neu |
| `tests/fixtures/testvokabeln.json` | Text | neu |
| `docs/CHATGPT_UEBERGABE.md` | Text | neu (diese Datei) |

Im Repo liegen außerdem `docs/KONZEPT.md` und `.nojekyll`. Beide sind nicht im Paket und **bleiben unverändert stehen**. Insbesondere `.nojekyll` darf nicht gelöscht werden.

## Ablauf

1. **Stand prüfen.** Lies den aktuellen Commit auf `main`. Ist es nicht `3c5772f`, hat inzwischen jemand anderes etwas geändert. Dann nicht hochladen, sondern Kevin melden, welcher Commit oben liegt und welche Dateien er betrifft.
2. **Dateien anlegen oder ersetzen** genau unter den Pfaden aus der Tabelle. Groß- und Kleinschreibung der Dateinamen beachten.
3. **Inhalte nicht anfassen.** Keine Formatierung, keine Umbenennung, kein Zeilenumbruch-Ausgleich, keine „Verbesserungen“. `index.html` ist absichtlich kompakt geschrieben.
4. **PNG-Dateien binär übertragen.** Sie dürfen nicht als Text eingelesen, umkodiert oder neu erzeugt werden. Wenn deine Anbindung keine Binärdateien schreiben kann, lade die drei PNG-Dateien nicht hoch und sag Kevin Bescheid. Er lädt sie dann über die GitHub-Weboberfläche nach („Add file“, „Upload files“). Die App funktioniert auch ohne sie, nur das Symbol auf dem Home-Bildschirm fehlt dann.
5. **Ein Commit** mit der Nachricht aus dem nächsten Abschnitt.
6. Kannst du nicht direkt auf `main` schreiben, erstelle einen Pull Request gegen `main` mit derselben Nachricht. Kevin führt ihn dann zusammen.

## Commit-Nachricht

Titel:

```
Version 1.2: Lernlogik, Bedienung auf dem Handy, Tests
```

Beschreibung:

```
- Auswahl je Runde: Fehler und fällige Wiederholungen haben feste Plätze, Reihenfolge zufällig, Fälligkeit ab Tagesbeginn
- Wortmodus prüft streng gegen die Buchschreibweise
- Zurück-Knopf mit vollständiger Rücknahme der letzten Antwort, Home-Knopf in der Lernrunde
- Elternbereich ohne PIN, Einträge löschen und Änderungen verwerfen
- Neues kinderfreundliches Design, Zähler „heute dran“ je Übungsart
- Unlesbare gespeicherte Daten werden beiseitegelegt statt überschrieben
- Export über das Teilen-Menü auf dem iPhone, Apple-Icon, dauerhafter Speicher
- Service Worker installiert auch bei fehlenden Zusatzdateien
- Tests: Logik (core.cjs), Browser-Durchlauf (e2e.py), 90-Tage-Simulation (simulation.cjs)
```

## Prüfung nach dem Hochladen

1. Alle Pfade aus der Tabelle existieren auf `main`, `.nojekyll` und `docs/KONZEPT.md` sind noch da.
2. `index.html` enthält die Zeichenfolge `class="tag">1.2`.
3. `sw.js` enthält `noah-english-shell-v12`.
4. Unter „Actions“ ist der Lauf „pages build and deployment“ grün. Falls GitHub Pages noch nicht aktiviert ist, steht dort nichts. Dann Kevin darauf hinweisen: Settings, Pages, Source „Deploy from a branch“, Branch `main`, Ordner `/ (root)`.
5. Wenn du Webseiten abrufen kannst: Die Adresse aus den Eckdaten liefert eine Seite, die „Hallo Noah!“ und oben rechts „1.2“ zeigt.

## Rückmeldung an Kevin

Kurz und konkret:

- Commit-Hash oder Link zum Pull Request
- welche Dateien hochgeladen wurden und ob alle drei PNG-Dateien dabei sind
- Ergebnis der fünf Prüfpunkte
- Hinweis: Auf dem iPhone die App einmal öffnen, ganz schließen und neu starten, dann erscheint 1.2

## Was du nicht tun sollst

- Kein Force-Push, keine Änderung oder Bereinigung der Git-Historie, kein Löschen von Branches
- Keine Dateien löschen, die nicht in der Tabelle stehen
- Keine Abhängigkeiten, Build-Schritte, Frameworks, Analyse- oder Tracking-Dienste hinzufügen
- Keine Repository-Einstellungen ändern (Sichtbarkeit, Pages, Schutzregeln)
- Keine Vokabel- oder Schulbuchinhalte ins Repository legen (siehe offener Punkt unten)

## Hintergrund zur App für spätere Änderungen

Nur lesen, wenn Kevin dich später um eine inhaltliche Änderung bittet.

**Aufbau.** Eine einzige Datei `index.html` mit HTML, CSS und JavaScript, ohne externe Bibliotheken und ohne Netzwerkzugriffe. `sw.js` macht die App offline nutzbar. `manifest.webmanifest` und die Icons sind für die Installation auf dem iPhone-Home-Bildschirm.

**Daten.** Alles liegt im `localStorage` des Geräts unter dem Schlüssel `noah-english-v01`. Unlesbare Altstände werden unter `noah-english-rescue-<Zeitstempel>` beiseitegelegt. Es gibt keinen Server und kein Konto. Vokabeln kommen über eine JSON-Datei (`type: "noah-vocabulary"`), die Kevin privat bereitstellt und im Elternbereich importiert.

**Fachliche Regeln, die Kevin ausdrücklich so will:**

- Getippte Antworten werden streng geprüft, auch Groß- und Kleinschreibung. Im Wortmodus zählt nur die exakte Buchschreibweise, zum Beispiel bei „(to) take“ nur „(to) take“. Die Lehrerin lässt keine Abweichungen zu. Toleriert werden nur Satzzeichen am Ende, mehrfache Leerzeichen und der typografische Apostroph.
- Der Elternbereich hat keine PIN.
- Eine Runde hat bis zu 8 Aufgaben in zufälliger Reihenfolge. Bis zu 3 Plätze für zuletzt falsche Wörter, bis zu 3 für fällige Wiederholungen, der Rest für neue Wörter.
- Ein Wort gilt als „sicher“ nach Erfolgen an drei verschiedenen Tagen. Wiederholungsabstände 1, 3, 7 und 14 Tage.

**Bei jeder neuen Version drei Stellen hochzählen**, sonst lädt das iPhone den neuen Stand nicht zuverlässig:

1. in `index.html` das Etikett `class="tag">…`
2. in `sw.js` die Konstante `CACHE` (`noah-english-shell-vNN`)
3. in `README.md` die Überschrift

**Tests vor jedem Commit mit Codeänderung:**

```
node tests/core.cjs
node tests/simulation.cjs
pip install playwright && python -m playwright install chromium && python tests/e2e.py
```

Alle drei müssen ohne Fehler durchlaufen. `e2e.py` endet mit „N von N bestanden“.

## Offener Punkt, nur nach ausdrücklicher Freigabe

Im älteren Verlauf des Repos (Commit `5701113`) stecken noch Vokabeln und Sätze aus dem Schulbuch. Das Repo ist öffentlich, diese Inhalte sind urheberrechtlich geschützt. Sie zu entfernen erfordert ein Umschreiben der Historie und einen Force-Push. Das ist **nicht** Teil dieses Auftrags und darf nur geschehen, wenn Kevin es ausdrücklich verlangt.

`docs/KONZEPT.md` beschreibt teilweise noch den alten Stand mit PIN. Nur auf Kevins Wunsch anpassen.

---
© 2026 Kevin Schmidt
