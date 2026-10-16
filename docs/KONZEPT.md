# Konzept: Englisch lernen für Noah

Stand: 16.10.2026. Status: Konzeptphase, noch keine App implementiert.

## Ziel und Rahmen

Eine schlanke Web-App/PWA für Noahs iPhone zur Vorbereitung auf überwiegend mündliche Vokabelkontrollen. Die Lehrerin gibt den Satz auf Deutsch vor; Noah soll ihn nahezu wortgetreu wie im Englischbuch formulieren. Englisch buchstabieren gehört ebenfalls zum Lernziel.

- Erste Version ohne spielerische Elemente. Gamification wird zurückgestellt.
- Nutzung und Elternprüfung auf demselben iPhone.
- Keine Benutzerkonten, Gerätesynchronisierung oder laufenden kostenpflichtigen KI-APIs.
- Entwicklung und Projektverlauf werden in diesem Repository dokumentiert.
- Lernstand und eigene Einträge bleiben lokal auf dem Gerät; Sicherungsexport und Wiederherstellung gehören zum Basisumfang.
- Das Repository dient der Entwicklung, nicht als Speicher für persönliche Lernstände oder Sprachaufnahmen.
- Hosting/Veröffentlichung ist noch nicht festgelegt. Ein Repository allein ist noch keine installierbare App.

## Inhalte und Buchstruktur

Ordnung: Schuljahr → Unit → Abschnitt; zusätzlich Buchseite.

Ein Eintrag umfasst:
- Englisches Wort oder Wendung.
- Eine oder mehrere deutsche Bedeutungen, gegebenenfalls mit Kontext wie „hier: dauern“.
- Englischen Originalsatz aus der dritten Buchspalte.
- Passende deutsche Übersetzung des Satzes als Aufgabenstellung.
- Optional Lautschrift und ergänzende Hinweise.
- Freigabestatus und gegebenenfalls eine noch ungeprüfte Änderung.

Bestehende Units werden zunächst gemeinsam aus Fotos übertragen und geprüft. Ein automatischer Fotoimport innerhalb der App ist damit nicht beauftragt.
Neue Vokabeln gibt Noah manuell ein. Für Satztraining sind englischer Originalsatz und deutsche Satzübersetzung erforderlich. Unvollständige Einträge können als Entwurf vorgesehen werden.

## Lernarten

### Satzübersetzung (Schwerpunkt)

1. Deutschen Satz anzeigen und auf Wunsch vorlesen.
2. Noah gibt den englischen Buchsatz mündlich wieder.
3. Falls Spracherkennung verfügbar ist: Erkannten Text anzeigen; Wiederholung oder Korrektur von Erkennungsfehlern ermöglichen.
4. Mit dem hinterlegten Buchsatz vergleichen.
5. Fehlende, zusätzliche und abweichende Wörter markieren.
6. Musterlösung anzeigen und vorlesen lassen.

Großschreibung, Satzzeichen und überflüssige Leerzeichen sind bei mündlicher Abfrage kein Fehler. Wortwahl, Wortfolge und grammatische Formen werden streng mit der Buchvorlage verglichen.
Andere Formulierungen werden als „Weicht vom Buchsatz ab“ bezeichnet, nicht pauschal als falsches Englisch.
Regeln für Kurzformen wie „it's“ gegenüber „it is“ sind noch festzulegen.

### Vokabeltraining

Deutsche Bedeutung mit erforderlichem Kontext vorgeben; englisches Wort oder vollständige Wendung laut abrufen. Musterlösung anschließend anzeigen und anhören.

### Buchstabieren

Englische Buchstabennamen laut sprechen; anschließend mit der richtigen Buchstabenfolge vergleichen.
Zunächst Selbst- oder Elternkontrolle. Automatische Erkennung einzelner Buchstaben ist nicht zugesagt.

## Sprachfunktionen ohne bezahlte API

- System-/Browser-Sprachausgabe für Aufgaben und englische Lösungen.
- Safari-Spracherkennung als zu prüfende optionale Eingabe.
- Lokale Aufnahme und Wiedergabe als mögliche Vergleichshilfe; noch keine beschlossene Pflichtfunktion.
- Keine automatische Aussprachebenotung.
- Spracherkennung kann Betriebssystemdienste und Netzwerkzugriff benötigen. Kostenlos bedeutet nicht zwingend offline oder ausschließlich lokale Verarbeitung.
- Vor verbindlicher Integration auf Noahs tatsächlichem iPhone prüfen, sowohl in Safari als auch als installierte PWA.
- Bei fehlender Erkennung muss mündliches Üben mit Musterlösung und Selbst-/Elternbewertung möglich bleiben.
- Nicht erkannte Sprache darf nicht als Wissenslücke gespeichert werden.

## Lernstand und Wiederholung

Drei getrennte Bereiche je Eintrag:
1. Vokabel/Bedeutung und mündliche Antwort.
2. Vollständiger Buchsatz.
3. Buchstabieren.

Anzeigen sollen etwa „Noch offen“, „Noch üben“ und „Sicher“ unterscheiden.
Selbstbewertung, Elternbewertung und automatischer Textvergleich müssen unterscheidbar sein.
Wiederholte Erfolge an unterschiedlichen Tagen sind für „Sicher“ erforderlich; genaue Intervalle und Schwellen sind noch offen.
Unsichere Inhalte werden häufiger eingeplant.

## Elternfreigabe auf demselben iPhone

1. Noah erstellt einen Eintrag und gibt ihn zur Prüfung ab.
2. Status: „Wartet auf Freigabe“. Noch keine Abfrage im Lerntraining.
3. Eltern können korrigieren und freigeben oder mit Hinweis zurückgeben.
4. Erst freigegebene Einträge werden gelernt.
5. Änderungen an freigegebenen Inhalten benötigen erneute Prüfung. Bis dahin bleibt die bisherige freigegebene Version aktiv.
6. Auch aus Fotos übernommene Inhalte werden vor Freigabe geprüft.

Ein einfacher PIN-geschützter Elternbereich ist als Bedienungssperre vorgesehen, nicht als separate sichere Benutzeridentität. PIN-Einrichtung und Wiederherstellung sind noch zu gestalten.

## Vorgeschlagene Navigation

- Heute lernen
- Mein Lernstand
- Vokabelbuch (einschließlich manueller Eingabe)
- Elternbereich

## Nächste Schritte

- [x] Gerät, Schwerpunkt und Rahmen festlegen.
- [x] Elternfreigabe auf demselben Gerät vereinbaren.
- [x] Projektkonzept im Repository dokumentieren.
- [ ] Eine konkrete Lernrunde und Bewertungsregeln gemeinsam abstimmen.
- [ ] Regeln für Kurzformen und Erkennungskorrekturen festlegen.
- [ ] Sprachfunktionen auf Noahs iPhone erproben.
- [ ] Datenmodell, Freigabeversionen und Sicherungsformat konkretisieren.
- [ ] Grundstruktur erst nach Konzeptabstimmung implementieren.
- [ ] Erste Inhalte gemeinsam prüfen und übernehmen.
- [ ] Wiederholungen, Freigabe und Wiederherstellung praktisch testen.
- [ ] Hosting und Installation auf dem iPhone klären.

## Entscheidungsverlauf

### 16.10.2026
- Buchstruktur mit englischem Eintrag, Lautschrift, deutscher Bedeutung und Beispielsatz aufgenommen.
- Dritte Spalte als Schwerpunkt festgelegt: deutsche Satzvorgabe → mündliche englische Buchfassung.
- Buchstabieren auf Englisch und getrennte Lernstandsübersicht aufgenommen.
- Zielgerät iPhone; keine bezahlten Sprach-/KI-APIs.
- Spielelemente ausdrücklich bis nach Fertigstellung der Basis zurückgestellt.
- Elternprüfung vor Freigabe vereinbart.
- Alle Abläufe auf Noahs iPhone; keine Synchronisierung.
- Repository 21kevage/Englisch_Noah als Projektbasis festgelegt.

## Technische Quellen für spätere Sprachprüfung

- https://webkit.org/blog/11648/new-webkit-features-in-safari-14-1/
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API

Die Quellen belegen grundsätzliche Browserfunktionen, ersetzen jedoch keinen Test auf dem Zielgerät.
