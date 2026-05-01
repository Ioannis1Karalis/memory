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





🧠 Multi-Theme Memory Game
An interactive memory game developed with TypeScript, Vite, and a modular SCSS (7-1 architecture). The game offers various difficulty levels and unique visual themes.

🚀 Features
Three Unique Themes:

Code Vibes (Dark mode for developers)

Gaming (Futuristic Orbitron look)

Foods (Warm colors & hand-drawn aesthetics)

Adjustable Board Sizes: Choose between 16, 24, or 36 cards.

Two-Player Mode: Local mode for "Blue Player" and "Orange Player".

Interactive Previews: Hover over themes in the settings to see a live preview of the board.

🛠️ Tech Stack
Framework: Vite

Language: TypeScript

Styling: SCSS (7-1 Architecture, Mixins, Functions)

Deployment: Hosted on a custom web server

📂 Project Structure (Highlights)
Plaintext
src/
├── styles/
│   ├── abstracts/   # Mixins, variables, functions
│   ├── base/        # Reset & typography
│   ├── components/  # Buttons, cards, modals
│   ├── layout/      # Layout & structure
│   ├── pages/       # Page-specific styling (Game, Home)
│   └── theme/       # Design skins (Gaming, Foods, Code Vibes)
└── scripts/
    ├── main.ts      # UI & event handling
    ├── game-logic.ts# Game logic & state management
    └── constants.ts # Assets & configuration constants
⚙️ Setup & Installation
Follow these instructions to start the game on your local machine:

1. Prerequisites
Make sure you have Node.js installed on your computer. You can check this by typing node -v in your terminal. If it is not installed, download it from nodejs.org.

2. Download the Project
Clone the repository or download and extract the ZIP folder. Navigate to the project folder in your terminal:

Bash
cd your-project-folder
3. Install Dependencies
Before the game can run, you need to install the necessary libraries (Vite, Sass, TypeScript). This command creates the node_modules folder:

Bash
npm install
4. Start the Development Server
Launch the project with the following command:

Bash
npm run dev
5. Open the Game in Your Browser
Once the server is running, the terminal will display a local address (usually http://localhost:5173).

Windows: Ctrl + Left Click on the link.

Mac: Cmd + Left Click on the link.

The game will open in your browser. Choose your theme and start playing!
```
