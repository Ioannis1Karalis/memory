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