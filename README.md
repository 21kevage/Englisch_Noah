# Englisch_Noah – Prototyp 0.2

Web-App für Noahs Englischtraining. GitHub Pages übernimmt die statische Bereitstellung; keine eigene Serververwaltung, kein Konto und keine kostenpflichtigen APIs.

## Einmalig GitHub Pages einschalten

Unter Settings → Pages:
- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/(root)**
- Save

Einstellungsseite: https://github.com/21kevage/Englisch_Noah/settings/pages

Die erwartete Adresse nach erfolgreicher Bereitstellung ist https://21kevage.github.io/Englisch_Noah/ .
**Pages war bei Vorbereitung dieser Version noch nicht aktiviert. Diese URL ist daher noch nicht als erreichbar bestätigt.**
Der verwendete GitHub-Zugang kann Dateien bearbeiten, bietet aber keine Pages-Aktivierungsfunktion.

## Auf dem iPhone

1. Nach erfolgreicher Bereitstellung die Webadresse in Safari öffnen.
2. Teilen → Zum Home-Bildschirm hinzufügen.
3. Die App über dieses Symbol öffnen; abwarten, bis „App für Offline-Nutzung gespeichert“ erscheint.
4. Im Elternbereich eine PIN festlegen.
5. Die separat bereitgestellte Datei `Noah-Vokabeln-Unit1.json` unter **Vokabeldatei importieren** auswählen.
6. Einträge prüfen und freigeben.
7. Schließen, wieder öffnen und im Flugmodus erneut testen.

**Die lokale HTML-Datei funktioniert in der iPhone-Dateivorschau nicht als App.** Dieses Problem wurde beim Test beobachtet. Der HTTPS-/PWA-Weg ist auf Noahs iPhone noch zu testen.

## Daten und Funktionen

Die veröffentlichte App enthält keine Buchvokabeln. Das separate Importpaket enthält 80 ungeprüfte Einträge aus dem Intro-Ausschnitt und S. 171–173. Lautschrift fehlt noch; deutsche Satzübersetzungen benötigen Prüfung.
Import ergänzt neue IDs, überspringt vorhandene IDs und verändert weder bestehende Freigaben noch Lernstände. Neue Inhalte starten ungeprüft.
**Wichtig:** Der öffentliche Git-Verlauf enthält weiterhin den früheren Prototyp mit Buchdaten. Die aktuelle Version entfernt diese aus der ausgelieferten App, nicht rückwirkend aus der Historie.

- Groß-/kleinschreibungssensitive Textprüfung mit Wortvergleich.
- Mündliche Übungen und Buchstabieren mit Selbstbewertung.
- Vorlesen per Systemstimme; keine Mikrofonerkennung oder Aussprachebenotung.
- Getrennte Lernstände und Wiederholungen.
- Elternfreigabe, Änderungen bleiben bis zur Prüfung getrennt von der gültigen Fassung.
- Sicherungsexport und Wiederherstellung.

## Speicherung und Offline-Nutzung

Lerndaten und Vokabeln bleiben im lokalen Browserspeicher (localStorage). Keine Übertragung an einen Datenbankserver. Sie werden nicht automatisch zwischen Android, Safari und installierter App übertragen.
Sicherung regelmäßig exportieren. Löschen von Websitedaten oder ein Gerätewechsel kann Daten entfernen.
Die App-Dateien werden per Service Worker zwischengespeichert; erster Besuch benötigt Internet. Offline funktioniert nur solange der Cache auf dem Gerät erhalten bleibt.
Systemvorlesen kann von heruntergeladenen Stimmen und Gerät abhängen.
Neue Programmversionen können nach Schließen aller App-Fenster und erneutem Online-Öffnen aktiv werden. Die Datenbank wird dabei nicht zurückgesetzt.

## Grenzen und Prüfungen

Die PIN ist nur eine lokale Bedienungssperre und steht auch in Sicherungsdateien.
Rückgabe mit Elternkommentar und PIN-Wiederherstellung sind noch offen.
Textvergleich normalisiert Leerraum, Apostrophvarianten und abschließende . ! ?. Großschreibung, interne Satzzeichen und Kurzformen bleiben strikt.
„Sicher“ benötigt vorläufig drei erfolgreiche Tage; unmittelbare Wiederholung nach Lösung zählt nicht als zusätzlicher erfolgreicher Tag.

```sh
node tests/core.cjs
```

Kernprüfungen bestanden: leerer App-Start, Importvalidierung, Großschreibung, Wortunterschiede, Wiederholung, JSON-Rundlauf und HTML-Escaping. Service-Worker-Syntax geprüft.
Kein vollständiger Browser-/iPhone-Test durchgeführt; der Browserdownload in der Entwicklungsumgebung scheiterte.
Noch am Gerät prüfen: Installation, Import, Freigabe, Speichern nach Neustart, Export/Import, Flugmodus, Vorlesen.

[Konzept und Entscheidungsverlauf](docs/KONZEPT.md)
