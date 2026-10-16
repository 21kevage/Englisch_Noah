# Englisch_Noah

Lokaler Vokabeltrainer für Noah. **Prototyp 0.1 – noch kein auf dem iPhone abgenommener Alltagsbetrieb.**

## Ausprobieren

1. Repository als ZIP herunterladen und entpacken (Code → Download ZIP).
2. Die enthaltene `index.html` öffnen. Alle Programmteile und Startdaten stecken in dieser Datei; keine Installation von Bibliotheken nötig.
3. Im Elternbereich eine PIN mit 4–8 Ziffern festlegen.
4. Einträge einzeln prüfen, gegebenenfalls korrigieren und freigeben.
5. Eine Lernrunde starten. Ohne Freigabe werden keine Buchinhalte abgefragt.

Die GitHub-Dateiansicht führt HTML nicht aus. Es wurde kein Hosting und keine GitHub-Pages-Veröffentlichung eingerichtet.
**Ob iOS die lokale Datei ausführbar öffnet und Daten dauerhaft behält, ist offen.** Zuerst auf Noahs iPhone testen; wenn dort nur eine Vorschau erscheint, ist dieser Verteilungsweg nicht bestätigt. Ein Desktop-Test ersetzt den iPhone-Test nicht.

## Enthalten

- 80 eindeutige Einträge aus dem Intro-Ausschnitt und S. 171–173, alle zunächst ungeprüft.
- Englische Buchsätze, ergänzte deutsche Satzübersetzungen und vorhandene Texthinweise.
- Wiederholte History-Wörter mit zusätzlicher Zuordnung statt doppeltem Lernstand.
- Satz- und Vokabeltraining mit groß-/kleinschreibungssensitivem Textvergleich.
- Wortweiser Vergleich mit Markierung fehlender, zusätzlicher und ersetzter Wörter.
- Mündliches Üben und Buchstabieren mit Selbstbewertung; Systemvorlesen soweit verfügbar.
- Getrennte Lernstände für Wort, Satz und Buchstabieren.
- Maximal acht Startaufgaben, fällige zuerst, ein zusätzlicher Versuch je fehlerhaftem Eintrag.
- Elternprüfung und neue Änderungsversion: bisherige Freigabe bleibt bis zur erneuten Freigabe aktiv.
- Sicherungsexport und validierter Import.

## Bewusste Grenzen von 0.1

- Keine Mikrofonerkennung und keine Aussprachebenotung. Diktierter Text im Texteingabefeld wird als Text bewertet, einschließlich Großschreibung.
- Keine Spielelemente, Konten, Synchronisierung oder bezahlten APIs.
- Lautschrift und Illustrationen sind noch nicht übertragen. Satzübersetzungen wurden ergänzt und benötigen Elternprüfung.
- Die Buchseite 170 ist nur durch den vorhandenen Intro-Ausschnitt abgedeckt.
- Abschnittszuordnung und Satz-/Zeilenzuordnung beim Prüfen mit den Fotos abgleichen.
- PIN ist eine lokale Bedienungssperre, kein sicherer Zugangsschutz; sie liegt auch in der Sicherungsdatei.
- Rückgabe mit Elternkommentar und PIN-Wiederherstellungsdialog sind noch nicht umgesetzt.
- Textvergleich normalisiert Leerraum, gerade/typografische Apostrophe und abschließende . ! ?. Groß-/Kleinschreibung, interne Satzzeichen und Kurzformen bleiben strikt.
- „Sicher“ ist eine vorläufige Regel: drei erfolgreiche Tage; ein Fehler setzt diese Reihe zurück. Direkte Wiederholung nach Lösung zählt nicht als weiterer erfolgreicher Lerntag.

## Speicherung und Sicherung

Der Ein-Datei-Prototyp verwendet zunächst **localStorage**, noch nicht IndexedDB. Er zeigt Speicherfehler an. Dateibasierter Browserspeicher ist browserabhängig; Verschieben, Umbenennen, Browserdatenlöschen oder ein Gerätewechsel kann den Zugriff auf den Lernstand verlieren lassen.
Regelmäßig im Elternbereich eine JSON-Sicherung exportieren und über die Dateiverwaltung aufbewahren. Import ersetzt nach Bestätigung den aktuellen Stand. Keine Sprachaufnahmen werden gespeichert.

## Prüfungen

```sh
node tests/core.cjs
```

Bestanden: Eintragsanzahl, ungeprüfter Startzustand, Großschreibung, Grammatikabweichungen, Apostrophe, Wortvergleich, Wiederholung, JSON-Sicherungsrunde, Ablehnung fehlerhafter Sicherungen, HTML-Escaping und Speicheraufruf.

Vollständiger Browser-/UI-Test wurde hier nicht ausgeführt: der benötigte Browserdownload schlug fehl. Keine iPhone-Kompatibilität behauptet.

### Checkliste für Noahs iPhone

- [ ] Lokale HTML startet mit bedienbaren Buttons.
- [ ] PIN setzen, ersten Eintrag prüfen und freigeben.
- [ ] Richtige und falsche Antwort prüfen; Wortmarkierung kontrollieren.
- [ ] Datei schließen und neu öffnen: Eintrag und Lernstand vorhanden?
- [ ] Sicherung exportieren und wieder importieren.
- [ ] Vorlesen deutscher Aufgaben und englischer Lösungen testen.
- [ ] Gerät offline schalten und Kernfunktionen prüfen.

## Projektverlauf

[Konzept und Entscheidungen](docs/KONZEPT.md). Entwicklung und Dokumentation liegen im Repository; persönliche Lerndaten bleiben auf dem Gerät.
