import './styles/main.scss';
import { PAWN_IMAGES, THEME_IMAGES, THEME_FOLDER_MAP } from './constants';
import { state, getCardValues, resetGameState } from './game-logic';

/**
* Safely updates the text content of a DOM element if it exists.
* 
* @param id - The unique identifier of the target element.
* @param text - The string content to assign to the element.
*/
function setText(id: string, text: string): void {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

/**
* Safely updates the class name of a DOM element.
* 
* @param id - The unique identifier of the target element.
* @param className - The full class string to be applied.
*/
function setClass(id: string, className: string): void {
  const element = document.getElementById(id);
  if (element) element.className = className;
}

/**
* Finds the currently checked radio input within a specific group name.
* 
* @param name - The name attribute of the radio button group.
* @returns The selected HTMLInputElement, or null if none is selected.
*/
function queryRadio(name: string): HTMLInputElement | null {
  return document.querySelector(`input[name="${name}"]:checked`);
}

/**
* Updates the summary labels on the settings screen based on current selections.
*/
function updateSummary(): void {
  const theme = queryRadio('theme');
  const player = queryRadio('player');
  const size = queryRadio('size');

  const themeName = theme?.parentElement?.querySelector('.radio-text')?.textContent;
  setText('sum-theme', themeName ?? 'Theme');
  
  const pVal = player?.value ?? 'Player';
  setText('sum-player', `${pVal.charAt(0).toUpperCase() + pVal.slice(1)} Player`);
  setText('sum-size', size ? `Board-${size.value} Cards` : 'Board size');
}

/**
* Synchronizes the settings UI, updates previews, and manages button states.
*/
function updateSettings(): void {
  const theme = queryRadio('theme');
  const player = queryRadio('player');
  const size = queryRadio('size');

  if (theme) setImg('theme-preview', THEME_IMAGES[theme.value]);
  
  const startBtn = document.getElementById('start-actual-game') as HTMLButtonElement | null;
  if (startBtn) {
    startBtn.disabled = !(theme && player && size);
  }
  updateSummary();
}

/**
* Synchronizes the score display and current player turn indicators in the game UI.
*/
function updateUI(): void {
  setText('score-blue', state.scores.blue.toString());
  setText('score-orange', state.scores.orange.toString());
  
  const screen = document.getElementById('game-screen');
  if (screen) {
    screen.classList.remove('is-blue-active', 'is-orange-active');
    screen.classList.add(`is-${state.currentPlayer}-active`);
  }
}

/**
* Assigns visual assets to a card based on the current theme and card value.
* 
* @param card - The card HTMLElement to update.
* @param val - The numerical identity of the card.
* @param theme - The currently selected visual theme.
*/
function setupCardImages(card: HTMLElement, val: number, theme: string): void {
  const folder = THEME_FOLDER_MAP[theme];
  const front = card.querySelector('.img-pattern') as HTMLImageElement | null;
  const back = card.querySelector('.img-content') as HTMLImageElement | null;
  
  if (front) front.src = `assets/imgs/${folder}/cards/${theme}-front.png`;
  if (back) back.src = `assets/imgs/${folder}/cards/${theme}-${val}.png`;
}

/**
* Generates a single card element and attaches its event listeners.
* 
* @param val - The numerical value representing the card's pair identity.
* @param theme - The current visual theme name.
* @returns A fully constructed card HTMLElement, or null if template is missing.
*/
function createCard(val: number, theme: string): HTMLElement | null {
  const temp = document.getElementById('card-template') as HTMLTemplateElement | null;
  if (!temp) return null;
  
  const card = (temp.content.cloneNode(true) as DocumentFragment).querySelector('.card') as HTMLElement;
  card.setAttribute('data-val', val.toString()); 
  setupCardImages(card, val, theme);
  
  card.onclick = () => onCardClick(card); 
  return card;
}

/**
* Initializes a new game session, resets state, and renders the board.
* 
* @param theme - The name of the chosen design theme.
* @param size - The total number of cards to generate.
* @param startPlayer - The player who makes the first move.
*/
function initGame(theme: string, size: number, startPlayer: 'blue' | 'orange'): void {
  resetGameState(size, startPlayer);
  updateUI();
  
  const board = document.getElementById('game-board');
  if (!board) return;

  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${size === 16 ? 4 : 6}, 1fr)`;
  getCardValues(size).forEach(val => {
    const card = createCard(val, theme);
    if (card) board.appendChild(card);
  });
}

/**
* Handles logic for matching cards: updates scores and checks victory conditions.
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
* Handles logic for non-matching cards: locks board and switches players.
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
* Processes user interaction when a card is clicked.
* 
* @param card - The HTMLElement of the card that was clicked.
*/
function onCardClick(card: HTMLElement): void {
  const isInvalid = state.isLocked || state.flippedCards.includes(card);
  if (isInvalid || card.classList.contains('is-matched')) return;
  
  card.classList.add('is-flipped');
  state.flippedCards.push(card);
  
  if (state.flippedCards.length === 2) {
    const [card1, card2] = state.flippedCards;
    card1.getAttribute('data-val') === card2.getAttribute('data-val') ? handleMatch() : handleMismatch();
  }
}

/**
* Displays the final victory view and sets correct winner assets.
*/
function showWinner(): void {
  const isBlue = state.scores.blue > state.scores.orange;
  const color = isBlue ? 'blue' : 'orange';
  
  setText('winner-name', isBlue ? 'Blue Player' : 'Orange Player');
  const nameEl = document.getElementById('winner-name');
  if (nameEl) nameEl.className = `end-screen__winner-title text--${color}`;
  
  setImg('winner-pawn', isBlue ? PAWN_IMAGES.blue : PAWN_IMAGES.orange);
  document.getElementById('game-over-view')?.classList.add('hidden');
  document.getElementById('winner-view')?.classList.remove('hidden');
}

/**
* Initiates the game-ending sequence and displays final scores.
*/
function handleGameOver(): void {
  setText('final-blue', state.scores.blue.toString());
  setText('final-orange', state.scores.orange.toString());
  
  const selectedTheme = queryRadio('theme')?.value ?? 'default';
  setClass('end-screen', `end-screen theme-${selectedTheme}`);
  
  document.getElementById('end-screen')?.classList.remove('hidden');
  document.getElementById('game-over-view')?.classList.remove('hidden');
  document.getElementById('winner-view')?.classList.add('hidden');
  
  setTimeout(showWinner, 2000);
}

/**
 * Safely updates an image source and toggles its visibility.
 * Using an empty string for display prevents layout breaks.
 * 
 * @param id - The ID of the image element.
 * @param src - The image source URL (empty string hides the element).
 */
function setImg(id: string, src: string): void {
  const element = document.getElementById(id) as HTMLImageElement | null;
  if (element) {
    element.src = src;
    // '' entfernt den Inline-Style und nutzt das CSS der Klasse/des Browsers
    element.style.display = src ? '' : 'none';
  }
}

/**
 * Shows the theme preview image when hovering over a radio option.
 */
function themeEnter(radio: HTMLInputElement): void {
  radio.parentElement?.addEventListener('mouseenter', () => {
    setImg('theme-preview', THEME_IMAGES[radio.value]);
  });
}

/**
* Reverts the preview to the selected theme or hides it if nothing is chosen.
*/
function themeLeave(radio: HTMLInputElement): void {
  radio.parentElement?.addEventListener('mouseleave', () => {
    const selected = queryRadio('theme');
    setImg('theme-preview', selected ? THEME_IMAGES[selected.value] : '');
  });
}

/**
* Orchestrates the setup of hover effects for all theme buttons.
*/
function setupHover(): void {
  const inputs = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');
  inputs.forEach(radio => {
    themeEnter(radio);
    themeLeave(radio);
  });
}

/**
* Binds basic navigation and modal event listeners.
*/
function setupNav(): void {
  document.getElementById('start-game')?.addEventListener('click', () => {
    document.getElementById('home-screen')?.classList.add('hidden');
    document.getElementById('settings-screen')?.classList.remove('hidden');
  });

  document.getElementById('exit-game')?.addEventListener('click', () => {
    document.getElementById('exit-modal')?.classList.remove('hidden');
  });

  document.getElementById('btn-back-to-game')?.addEventListener('click', () => {
    document.getElementById('exit-modal')?.classList.add('hidden');
  });
}

/**
* Handles the logic for starting the actual game board with selected options.
*/
function handleActualStart(): void {
  const theme = queryRadio('theme')?.value ?? '';
  const size = parseInt(queryRadio('size')?.value ?? '0');
  const player = queryRadio('player')?.value as 'blue' | 'orange';

  setClass('app', `theme-${theme}`);
  setClass('game-screen', `game-page theme-${theme}`);
  
  initGame(theme, size, player);
  document.getElementById('settings-screen')?.classList.add('hidden');
  document.getElementById('game-screen')?.classList.remove('hidden');
}

setupHover();
setupNav();

document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', updateSettings);
});

document.getElementById('start-actual-game')?.addEventListener('click', handleActualStart);
document.getElementById('btn-confirm-exit')?.addEventListener('click', () => location.reload());
document.getElementById('btn-restart')?.addEventListener('click', () => location.reload());

updateSettings();