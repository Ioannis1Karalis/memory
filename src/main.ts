import './styles/main.scss';
import { PAWN_IMAGES, THEME_IMAGES, THEME_FOLDER_MAP } from './constants';
import { state, getCardValues, resetGameState } from './game-logic';

/**
 * Helper function to retrieve a DOM element by its ID.
 * @param id - The ID of the element.
 */
const getEl = (id: string): HTMLElement | null => document.getElementById(id);

/**
 * Helper function to retrieve the currently selected radio button of a group.
 * @param n - The name of the radio group.
 */
const queryRadio = (n: string): HTMLInputElement => document.querySelector(`input[name="${n}"]:checked`) as HTMLInputElement;

/**
 * Updates the preview and the summary in the settings screen.
 */
const updateSettings = (): void => {
  const [t, p, s] = [queryRadio('theme'), queryRadio('player'), queryRadio('size')];
  if (getEl('sum-theme')) getEl('sum-theme')!.textContent = t?.parentElement?.querySelector('.radio-text')?.textContent ?? 'Theme';
  if (getEl('sum-player')) getEl('sum-player')!.textContent = p ? `${p.value.charAt(0).toUpperCase() + p.value.slice(1)} Player` : 'Player';
  if (getEl('sum-size')) getEl('sum-size')!.textContent = s ? `Board-${s.value} Cards` : 'Board size';
  if (getEl('theme-preview') && t) (getEl('theme-preview') as HTMLImageElement).src = THEME_IMAGES[t.value];
  (getEl('start-actual-game') as HTMLButtonElement).disabled = !(t && p && s);
};

/**
 * Updates the score display and marks the active player in the UI.
 */
const updateUI = (): void => {
  getEl('score-blue')!.textContent = state.scores.blue.toString();
  getEl('score-orange')!.textContent = state.scores.orange.toString();
  const screen = getEl('game-screen');
  if (screen) {
    screen.classList.remove('is-blue-active', 'is-orange-active');
    screen.classList.add(`is-${state.currentPlayer}-active`);
  }
};

/**
 * Creates a card element including images and click event.
 * 
 * @param val - The numerical value of the card.
 * @param theme - The selected design theme.
 * @returns The generated card element.
 */
const createCard = (val: number, theme: string): HTMLElement => {
  const temp = getEl('card-template') as HTMLTemplateElement;
  const card = (temp.content.cloneNode(true) as DocumentFragment).querySelector('.card') as HTMLElement;
  const folder = THEME_FOLDER_MAP[theme];
  card.setAttribute('data-val', val.toString()); 
  (card.querySelector('.img-pattern') as HTMLImageElement).src = `assets/imgs/${folder}/cards/${theme}-front.png`;
  (card.querySelector('.img-content') as HTMLImageElement).src = `assets/imgs/${folder}/cards/${theme}-${val}.png`;
  card.onclick = () => onCardClick(card); 
  return card;
};

/**
 * Initializes a new game and renders the game board.
 * 
 * @param theme - The name of the chosen theme.
 * @param size - The total number of cards.
 * @param startPlayer - The player starting the game ('blue' or 'orange').
 */
const initGame = (theme: string, size: number, startPlayer: 'blue' | 'orange'): void => {
  resetGameState(size, startPlayer);
  updateUI();
  const board = getEl('game-board')!;
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${size === 16 ? 4 : 6}, 1fr)`;
  getCardValues(size).forEach(val => board.appendChild(createCard(val, theme)));
};

/**
 * Logic for when two cards match.
 */
const handleMatch = (): void => {
  state.flippedCards.forEach(c => c.classList.add('is-matched'));
  state.scores[state.currentPlayer]++;
  state.matchedPairs++;
  state.flippedCards = [];
  updateUI();
  if (state.matchedPairs === state.currentSize / 2) setTimeout(handleGameOver, 600);
};

/**
 * Logic for when two cards do not match (including player switch).
 */
const handleMismatch = (): void => {
  state.isLocked = true;
  setTimeout(() => {
    state.flippedCards.forEach(c => c.classList.remove('is-flipped'));
    state.flippedCards = [];
    state.currentPlayer = state.currentPlayer === 'blue' ? 'orange' : 'blue';
    state.isLocked = false;
    updateUI();
  }, 1000);
};

/**
 * Event handler for clicking a card.
 * @param card - The clicked card element.
 */
const onCardClick = (card: HTMLElement): void => {
  if (state.isLocked || state.flippedCards.includes(card) || card.classList.contains('is-matched')) return;
  card.classList.add('is-flipped');
  state.flippedCards.push(card);
  if (state.flippedCards.length === 2) {
    const [c1, c2] = state.flippedCards;
    c1.getAttribute('data-val') === c2.getAttribute('data-val') ? handleMatch() : handleMismatch();
  }
};

/**
 * Displays the winner view with the corresponding pawn icon.
 */
const showWinner = (): void => {
  const isBlue = state.scores.blue > state.scores.orange;
  getEl('winner-name')!.textContent = isBlue ? 'Blue Player' : 'Orange Player';
  getEl('winner-name')!.className = `end-screen__winner-title text--${isBlue ? 'blue' : 'orange'}`;
  (getEl('winner-pawn') as HTMLImageElement).src = isBlue ? PAWN_IMAGES.blue : PAWN_IMAGES.orange;
  getEl('game-over-view')?.classList.add('hidden');
  getEl('winner-view')?.classList.remove('hidden');
};

/**
 * Ends the game and initiates the game over sequence.
 */
const handleGameOver = (): void => {
  getEl('game-over-view')?.classList.remove('hidden');
  getEl('winner-view')?.classList.add('hidden');
  getEl('final-blue')!.textContent = state.scores.blue.toString();
  getEl('final-orange')!.textContent = state.scores.orange.toString();
  getEl('end-screen')!.className = `end-screen theme-${queryRadio('theme').value}`;
  getEl('end-screen')?.classList.remove('hidden');
  setTimeout(showWinner, 2000);
};

// --- LISTENERS ---
document.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', updateSettings));

getEl('start-game')?.addEventListener('click', (): void => {
  getEl('home-screen')?.classList.add('hidden');
  getEl('settings-screen')?.classList.remove('hidden');
});

getEl('start-actual-game')?.addEventListener('click', (): void => {
  const t = queryRadio('theme').value, s = parseInt(queryRadio('size').value), p = queryRadio('player').value as 'blue' | 'orange';
  getEl('app')!.className = `theme-${t}`;
  getEl('settings-screen')?.classList.add('hidden');
  getEl('game-screen')?.classList.remove('hidden');
  getEl('game-screen')!.className = `game-page theme-${t}`;
  initGame(t, s, p);
});

getEl('exit-game')?.addEventListener('click', (): void => getEl('exit-modal')?.classList.remove('hidden'));
getEl('btn-back-to-game')?.addEventListener('click', (): void => getEl('exit-modal')?.classList.add('hidden'));

getEl('btn-confirm-exit')?.addEventListener('click', (): void => {
  getEl('exit-modal')?.classList.add('hidden'); 
  getEl('game-screen')?.classList.add('hidden'); 
  getEl('settings-screen')?.classList.remove('hidden'); 
  getEl('game-board')!.innerHTML = '';
});

getEl('btn-restart')?.addEventListener('click', (): void => {
  getEl('end-screen')?.classList.add('hidden'); 
  getEl('game-screen')?.classList.add('hidden');
  getEl('settings-screen')?.classList.remove('hidden');
});

updateSettings();