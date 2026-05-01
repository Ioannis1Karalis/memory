import './styles/main.scss';
import { PAWN_IMAGES, THEME_IMAGES, THEME_FOLDER_MAP } from './constants';
import { state, getCardValues, resetGameState } from './game-logic';

/**
* Retrieves a DOM element by its unique identifier.
* 
* @param id - The ID of the element to retrieve.
* @returns The HTMLElement if found, or null if it does not exist.
*/
function getEl(id: string): HTMLElement | null {
  return document.getElementById(id);
}

/**
* Finds the currently checked radio input within a specific group name.
* 
* @param name - The name attribute of the radio button group.
* @returns The selected HTMLInputElement.
*/
function queryRadio(name: string): HTMLInputElement {
  return document.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement;
}

/**
* Updates the summary labels and the theme preview image on the settings screen
* based on the currently selected options.
*/
function updateSettings(): void {
  const themeInput = queryRadio('theme');
  const playerInput = queryRadio('player');
  const sizeInput = queryRadio('size');

  if (getEl('sum-theme')) {
    getEl('sum-theme')!.textContent = themeInput?.parentElement?.querySelector('.radio-text')?.textContent ?? 'Theme';
  }
  if (getEl('sum-player')) {
    getEl('sum-player')!.textContent = playerInput ? `${playerInput.value.charAt(0).toUpperCase() + playerInput.value.slice(1)} Player` : 'Player';
  }
  if (getEl('sum-size')) {
    getEl('sum-size')!.textContent = sizeInput ? `Board-${sizeInput.value} Cards` : 'Board size';
  }
  if (getEl('theme-preview') && themeInput) {
    (getEl('theme-preview') as HTMLImageElement).src = THEME_IMAGES[themeInput.value];
  }
  (getEl('start-actual-game') as HTMLButtonElement).disabled = !(themeInput && playerInput && sizeInput);
}

/**
* Synchronizes the score display and current player turn indicators in the game UI.
*/
function updateUI(): void {
  getEl('score-blue')!.textContent = state.scores.blue.toString();
  getEl('score-orange')!.textContent = state.scores.orange.toString();
  
  const screen = getEl('game-screen');
  if (screen) {
    screen.classList.remove('is-blue-active', 'is-orange-active');
    screen.classList.add(`is-${state.currentPlayer}-active`);
  }
}

/**
* Generates a card element, assigns its visual assets, and attaches event listeners.
* 
* @param val - The numerical value representing the card's pair identity.
* @param theme - The current visual theme name.
* @returns A fully constructed card HTMLElement.
*/
function createCard(val: number, theme: string): HTMLElement {
  const temp = getEl('card-template') as HTMLTemplateElement;
  const card = (temp.content.cloneNode(true) as DocumentFragment).querySelector('.card') as HTMLElement;
  const folder = THEME_FOLDER_MAP[theme];
  
  card.setAttribute('data-val', val.toString()); 
  (card.querySelector('.img-pattern') as HTMLImageElement).src = `assets/imgs/${folder}/cards/${theme}-front.png`;
  (card.querySelector('.img-content') as HTMLImageElement).src = `assets/imgs/${folder}/cards/${theme}-${val}.png`;
  
  card.onclick = () => onCardClick(card); 
  return card;
}

/**
* Initializes a new game session, resets the game state, and renders the board.
* 
* @param theme - The name of the chosen design theme.
* @param size - The total number of cards to generate.
* @param startPlayer - The player ('blue' or 'orange') who makes the first move.
*/
function initGame(theme: string, size: number, startPlayer: 'blue' | 'orange'): void {
  resetGameState(size, startPlayer);
  updateUI();
  
  const board = getEl('game-board')!;
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${size === 16 ? 4 : 6}, 1fr)`;
  
  getCardValues(size).forEach(val => board.appendChild(createCard(val, theme)));
}

/**
* Handles logic for matching cards: updates scores, marks cards as matched,
* and checks for victory conditions.
*/
function handleMatch(): void {
  state.flippedCards.forEach(card => card.classList.add('is-matched'));
  state.scores[state.currentPlayer]++;
  state.matchedPairs++;
  state.flippedCards = [];
  updateUI();
  
  if (state.matchedPairs === state.currentSize / 2) {
    setTimeout(handleGameOver, 600);
  }
}

/**
* Handles logic for non-matching cards: locks the board temporarily,
* flips cards back, and switches to the next player.
*/
function handleMismatch(): void {
  state.isLocked = true;
  setTimeout(() => {
    state.flippedCards.forEach(card => card.classList.remove('is-flipped'));
    state.flippedCards = [];
    state.currentPlayer = state.currentPlayer === 'blue' ? 'orange' : 'blue';
    state.isLocked = false;
    updateUI();
  }, 1000);
}

/**
* Processes user interaction when a card is clicked. Manages flip state
* and triggers match comparison when two cards are revealed.
* 
* @param card - The HTMLElement of the card that was clicked.
*/
function onCardClick(card: HTMLElement): void {
  if (state.isLocked || state.flippedCards.includes(card) || card.classList.contains('is-matched')) return;
  
  card.classList.add('is-flipped');
  state.flippedCards.push(card);
  
  if (state.flippedCards.length === 2) {
    const [card1, card2] = state.flippedCards;
    card1.getAttribute('data-val') === card2.getAttribute('data-val') ? handleMatch() : handleMismatch();
  }
}

/**
* Displays the final victory view, determines the winner based on scores,
* and sets the correct player name and icon.
*/
function showWinner(): void {
  const isBlueWinner = state.scores.blue > state.scores.orange;
  getEl('winner-name')!.textContent = isBlueWinner ? 'Blue Player' : 'Orange Player';
  getEl('winner-name')!.className = `end-screen__winner-title text--${isBlueWinner ? 'blue' : 'orange'}`;
  (getEl('winner-pawn') as HTMLImageElement).src = isBlueWinner ? PAWN_IMAGES.blue : PAWN_IMAGES.orange;
  
  getEl('game-over-view')?.classList.add('hidden');
  getEl('winner-view')?.classList.remove('hidden');
}

/**
* Initiates the game-ending sequence by showing the result screen
* and calculating the final scores before revealing the winner.
*/
function handleGameOver(): void {
  getEl('game-over-view')?.classList.remove('hidden');
  getEl('winner-view')?.classList.add('hidden');
  getEl('final-blue')!.textContent = state.scores.blue.toString();
  getEl('final-orange')!.textContent = state.scores.orange.toString();
  
  const selectedTheme = queryRadio('theme').value;
  getEl('end-screen')!.className = `end-screen theme-${selectedTheme}`;
  getEl('end-screen')?.classList.remove('hidden');
  
  setTimeout(showWinner, 2000);
}

/**
* Attaches a mouseenter event listener to a theme's parent label.
* This task specifically handles updating the preview image when hovering.
* 
* @param radio - The radio input element representing a specific theme.
*/
function attachThemeMouseEnterListener(radio: HTMLInputElement): void {
  const parentLabel = radio.parentElement;

  if (parentLabel) {
    parentLabel.addEventListener('mouseenter', () => {
      const previewImg = getEl('theme-preview') as HTMLImageElement;

      if (previewImg) {
        const hoveredThemeValue = radio.value;
        const newImagePath = THEME_IMAGES[hoveredThemeValue];
        previewImg.src = newImagePath;
      }
    });
  }
}

/**
* Attaches a mouseleave event listener to a theme's parent label.
* This task ensures the preview image reverts to the currently selected theme.
* 
* @param radio - The radio input element representing a specific theme.
*/
function attachThemeMouseLeaveListener(radio: HTMLInputElement): void {
  const parentLabel = radio.parentElement;

  if (parentLabel) {
    parentLabel.addEventListener('mouseleave', () => {
      const selectedThemeInput = queryRadio('theme');
      const previewImg = getEl('theme-preview') as HTMLImageElement;

      if (previewImg) {
        const currentSelectedValue = selectedThemeInput?.value;
        const fallbackPath = 'assets/placeholder.png';

        previewImg.src = currentSelectedValue 
          ? THEME_IMAGES[currentSelectedValue] 
          : fallbackPath;
      }
    });
  }
}

/**
* Orchestrates the setup of hover effects for all theme radio buttons.
* It iterates through the inputs and delegates the listener attachment tasks.
*/
function setupThemeHoverEffects(): void {
  const themeSelector = 'input[name="theme"]';
  const themeInputs = document.querySelectorAll<HTMLInputElement>(themeSelector);

  themeInputs.forEach((radio) => {
    attachThemeMouseEnterListener(radio);
    attachThemeMouseLeaveListener(radio);
  });
}

setupThemeHoverEffects();

// --- LISTENERS ---
document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', updateSettings);
});

getEl('start-game')?.addEventListener('click', () => {
  getEl('home-screen')?.classList.add('hidden');
  getEl('settings-screen')?.classList.remove('hidden');
});

getEl('start-actual-game')?.addEventListener('click', () => {
  const selectedTheme = queryRadio('theme').value;
  const boardSize = parseInt(queryRadio('size').value);
  const startingPlayer = queryRadio('player').value as 'blue' | 'orange';

  getEl('app')!.className = `theme-${selectedTheme}`;
  getEl('settings-screen')?.classList.add('hidden');
  getEl('game-screen')?.classList.remove('hidden');
  getEl('game-screen')!.className = `game-page theme-${selectedTheme}`;
  
  initGame(selectedTheme, boardSize, startingPlayer);
});

getEl('exit-game')?.addEventListener('click', () => getEl('exit-modal')?.classList.remove('hidden'));
getEl('btn-back-to-game')?.addEventListener('click', () => getEl('exit-modal')?.classList.add('hidden'));

getEl('btn-confirm-exit')?.addEventListener('click', () => {
  getEl('exit-modal')?.classList.add('hidden'); 
  getEl('game-screen')?.classList.add('hidden'); 
  getEl('settings-screen')?.classList.remove('hidden'); 
  getEl('game-board')!.innerHTML = '';
});

getEl('btn-restart')?.addEventListener('click', () => {
  getEl('end-screen')?.classList.add('hidden'); 
  getEl('game-screen')?.classList.add('hidden');
  getEl('settings-screen')?.classList.remove('hidden');
});

updateSettings();