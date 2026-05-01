# 🧠 Multi-Theme Memory Game

Ein interaktives Memory-Spiel, entwickelt mit **TypeScript**, **Vite** und einer modularen **SCSS (7-1 Architektur)**. Das Spiel bietet verschiedene Schwierigkeitsgrade und visuelle Themes.

## 🚀 Features

- **Drei einzigartige Themes:** 
  - `Code Vibes` (Dark Mode für Entwickler)
  - `Gaming` (Futuristischer Orbitron-Look)
  - `Foods` (Warme Farben & handgezeichnete Ästhetik)
- **Einstellbare Board-Größen:** Wähle zwischen 16, 24 oder 36 Karten.
- **Zwei-Spieler-Modus:** Lokaler Modus für "Blue Player" und "Orange Player".

## 🛠️ Tech Stack

- **Framework:** [Vite](https://vitejs.dev/)
- **Sprache:** TypeScript
- **Styling:** SCSS (7-1 Architektur, Mixins, Functions)
- **Deployment:** Gehostet auf eigenem Webserver

## 📂 Ordnerstruktur (Highlights)
```text
src/
├── styles/
│   ├── abstracts/   # Mixins, Variablen, Funktionen
│   ├── base/        # Reset & Typografie
│   ├── components/  # Buttons, Karten, Modals
│   ├── layout/      # Grundgerüst & Struktur
│   ├── pages/       # Seitenspezifisches Styling (Game, Home)
│   └── theme/       # Design-Skins (Gaming, Foods, Code Vibes)
└── scripts/
    ├── main.ts      # UI & Event-Handling
    ├── game-logic.ts# Spiellogik & State
    └── constants.ts # Assets & Konfiguration


⚙️ Setup & Installation
Damit jeder – auch ohne Vorwissen – das Spiel starten kann, folge dieser Anleitung:

1. Voraussetzungen
Stelle sicher, dass du Node.js auf deinem Rechner installiert hast. Du kannst das prüfen, indem du node -v in dein Terminal eingibst. Falls nicht, lade es hier herunter: nodejs.org.

2. Projekt herunterladen
Klone das Repository oder lade den ZIP-Ordner herunter und entpacke ihn. Navigiere im Terminal in den entsprechenden Ordner:

Bash
cd dein-projekt-ordner
3. Abhängigkeiten installieren
Bevor das Spiel läuft, müssen die notwendigen Bibliotheken (Vite, Sass, TypeScript) geladen werden. Dieser Befehl erstellt den node_modules-Ordner:

Bash
npm install
4. Entwicklungsserver starten
Erwecke das Projekt mit folgendem Befehl zum Leben:

Bash
npm run dev
5. Spiel im Browser öffnen
Sobald der Befehl läuft, zeigt das Terminal eine Adresse an (meistens http://localhost:5173).

Klicke mit Strg + Linksklick (Windows) oder Cmd + Linksklick (Mac) auf diesen Link.

Das Spiel öffnet sich in deinem Browser. Wähle dein Theme und leg los!