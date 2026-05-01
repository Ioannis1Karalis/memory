🧠 Multi-Theme Memory Game
An interactive memory game built with TypeScript, Vite, and a modular SCSS (7-1 architecture). This project offers various difficulty levels and distinct visual themes for an engaging user experience.

🚀 Features
Three Unique Themes:

Code Vibes: A dark-mode aesthetic tailored for developers.

Gaming: A futuristic look featuring the Orbitron typeface.

Foods: Warm colors with a hand-drawn, cozy aesthetic.

Adjustable Board Sizes: Choose between 16, 24, or 36 cards to scale the difficulty.

Two-Player Mode: Local competitive play between "Blue Player" and "Orange Player".

Dynamic Previews: Hover over themes in the settings to see a live preview of the game board.

🛠️ Tech Stack
Framework: Vite

Language: TypeScript

Styling: SCSS (Utilizing 7-1 Architecture, Mixins, and Functions)

Deployment: Hosted on a custom web server

📂 Project Structure (Highlights)
Plaintext
src/
├── styles/
│ ├── abstracts/ # Mixins, variables, and functions
│ ├── base/ # CSS Reset and typography
│ ├── components/ # Reusable UI like buttons, cards, and modals
│ ├── layout/ # Core page structure
│ ├── pages/ # Page-specific styles (Game, Home)
│ └── theme/ # Visual skins (Gaming, Foods, Code Vibes)
└── scripts/
├── main.ts # UI logic and event handling
├── game-logic.ts# Core game mechanics and state management
└── constants.ts # Asset paths and configuration constants
⚙️ Setup & Installation
Follow these steps to get the game running on your local machine:

1. Prerequisites
   Ensure you have Node.js installed. You can check your version by running node -v in your terminal. If it's not installed, download it from nodejs.org.

2. Download the Project
   Clone the repository or download and extract the ZIP folder. Open your terminal and navigate to the project directory:

Bash
cd your-project-folder 3. Install Dependencies
Install the necessary libraries (Vite, Sass, TypeScript) by running:

Bash
npm install 4. Start the Development Server
Launch the project with the following command:

Bash
npm run dev 5. Open the Game
Once the server is running, the terminal will display a local address (usually http://localhost:5173).

Windows: Ctrl + Click on the link.

Mac: Cmd + Click on the link.

The game will open in your default browser. Select your preferred theme and enjoy!
