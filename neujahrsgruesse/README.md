# 🎆 Neujahrsgrüße 2026 - Mehrsprachige Grußkarten-Generator

Eine interaktive, festliche Webseite zur Erstellung personalisierter Neujahrswünsche in **7 Sprachen**.

## ✨ Features

### 🌍 Mehrsprachigkeit
Die Website unterstützt folgende Sprachen:
- 🇩🇪 **Deutsch** (DE) - Standard
- 🇬🇧 **Englisch** (EN)
- 🇹🇷 **Türkisch** (TR)
- 🇪🇸 **Spanisch** (ES)
- 🇫🇷 **Französisch** (FR)
- 🇮🇹 **Italienisch** (IT)
- 🇧🇬 **Bulgarisch** (BG)

Die gewählte Sprache wird automatisch im **localStorage** gespeichert und beim nächsten Besuch wiederhergestellt.

### 🎨 Design
- **Knalliges Silvester-Design** mit Gold- und Neonfarben
- **Animierte Feuerwerke** im Hintergrund
- **Glitzernde Sparkle-Effekte**
- **Glasmorphism-Cards** mit modernem Look
- **Responsive Design** - perfekt auf Desktop & Smartphone

### 🤖 Intelligente Textgenerierung
Personalisierte Grüße basierend auf:

**Beziehungstypen:**
- Freundschaft
- Romantisch / Partner
- Familie
- Arbeitskollege/in
- Chef/in
- Bekannte/r
- Mentor/in

**Tonalitäten:**
- Warm + Herzlich
- Humorvoll & Lustig
- Formell & Professionell
- Poetisch & Kreativ
- Kurz & Knackig

**Personalisierung:**
- Empfängername
- Optionale persönliche Infos (Hobbys, Erlebnisse, etc.)

### 📤 Teilen-Funktionen
- **Kopieren** - in die Zwischenablage
- **WhatsApp** - direkter Sharing-Link
- **E-Mail** - öffnet E-Mail-Client mit vorausgefülltem Text

## 🚀 Verwendung

1. Öffne `index.html` im Browser
2. Wähle oben deine gewünschte Sprache aus
3. Fülle das Formular aus:
   - Name der Person
   - Beziehung auswählen
   - Optionale Zusatzinfos eingeben
   - Tonalität wählen
4. Klicke auf "Neujahrsgruß generieren"
5. Teile oder kopiere den generierten Text

## 📁 Dateistruktur

```
neujahrsgruesse/
├── index.html          # Hauptseite mit Formular
├── style.css           # Festliches Design + Animationen
├── script.js           # Logik + i18n + Textgenerierung
├── messages_i18n.js    # Zusätzliche mehrsprachige Templates (optional)
└── README.md           # Diese Datei
```

## 🔧 Technische Details

### Technologie-Stack
- **HTML5** - Semantisches Markup
- **CSS3** - Moderne Styles mit CSS Variables
- **Vanilla JavaScript** - Keine Frameworks

### Internationalisierung (i18n)
- Alle UI-Elemente haben `data-i18n` Attribute
- Übersetzungen in `translations` Objekt
- Automatisches Update bei Sprachwechsel
- LocalStorage-Persistenz

### Animationen
- CSS @keyframes für Feuerwerk
- JavaScript-generierte Sparkle-Effekte
- Smooth Transitions und Hover-Effekte

## 🎯 Erweiterungsmöglichkeiten

1. **KI-Integration:** 
   - Die `generateNewYearMessage()` Funktion kann durch einen API-Call ersetzt werden
   - OpenAI, Claude oder andere LLM-APIs können eingebunden werden

2. **Mehr Sprachen:**
   - Einfach neue Einträge in `translations` Objekt hinzufügen
   - Neue Language-Buttons im HTML hinzufügen

3. **Mehr Templates:**
   - Erweitere die Arrays in den Generator-Funktionen
   - Füge neue Beziehungstypen oder Tonalitäten hinzu

4. **Backend:**
   - Grüße in Datenbank speichern
   - Teilen-Funktionen erweitern
   - Statistiken über beliebte Grußkombinationen

## 📝 Lizenz

Dieses Projekt wurde für private Zwecke erstellt.

## 🎊 Viel Spaß beim Versenden von Neujahrsgrüßen!

Made with 💛 for 2026 | Frohes neues Jahr! 🎆
