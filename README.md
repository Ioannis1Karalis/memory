# 🧠 Multi-Theme Memory Game

An interactive memory game, developed with **TypeScript**, **Vite** and a modular **SCSS (7-1 architecture)**.

## 🚀 Features

- **Three unique themes:**
  - `Code Vibes` (Dark Mode for developers)
  - `Gaming` (Futuristic Orbitron look)
  - `Foods` (Warm colors & hand-drawn aesthetics)
- **Adjustable board sizes:** Choose between **16**, **24** or **36** cards.
- **Two-player mode:** Local mode for **"Blue Player"** and **"Orange Player"**.

## 🛠️ Tech Stack

- **Framework:** [Vite](https://vitejs.dev/)
- **Language:** **TypeScript**
- **Styling:** **SCSS** (7-1 architecture, Mixins, Functions)
- **Deployment:** Hosted on custom web server

## 📂 Folder Structure (Highlights)

src/
├── styles/
│   ├── abstracts/   # Mixins, variables, functions
│   ├── base/        # Reset & typography
│   ├── components/  # Buttons, cards, modals
│   ├── layout/      # Framework & structure
│   ├── pages/       # Page-specific styling (Game, Home)
│   └── theme/       # Design skins (Gaming, Foods, Code Vibes)
└── scripts/
    ├── main.ts      # UI & event handling
    ├── game-logic.ts# Game logic & state
    └── constants.ts # Assets & configuration


# ⚙️ Setup & Installation

Follow these instructions to start the game on your local machine:

1. Prerequisites
   Make sure you have Node.js installed on your computer. You can check this by typing node -v in your terminal. If it is not installed, download it from nodejs.org.

2. Download the Project
   Clone the repository or download and extract the ZIP folder. Navigate to the project folder in your terminal:

```text
Bash
cd your-project-folder
```

3. Install Dependencies
   Before the game can run, you need to install the necessary libraries (Vite, Sass, TypeScript). This command creates the node_modules folder:

```text
Bash
npm install
```

4. Start the Development Server
   Launch the project with the following command:

```text
Bash
npm run dev
```

5. Open the Game in Your Browser
   Once the server is running, the terminal will display a local address (usually http://localhost:5173).

Windows: Ctrl + Left Click on the link.
Mac: Cmd + Left Click on the link.
The game will open in your browser. Choose your theme and start playing!
