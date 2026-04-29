import './styles/main.scss';
import { PAWN_IMAGES, THEME_IMAGES, THEME_FOLDER_MAP } from './constants';
import { state, getCardValues, resetGameState } from './game-logic';

const getEl = (id: string) => document.getElementById(id);
const queryRadio = (n: string) => document.querySelector(`input[name="${n}"]:checked`) as HTMLInputElement;

const updateSettings = () => {
  const [t, p, s] = [queryRadio('theme'), queryRadio('player'), queryRadio('size')];
  const sumTheme = getEl('sum-theme'), sumPlayer = getEl('sum-player'), sumSize = getEl('sum-size');
  if (sumTheme) sumTheme.textContent = t?.parentElement?.querySelector('.radio-text')?.textContent ?? 'Theme';
  if (sumPlayer) sumPlayer.textContent = p ? `${p.value.charAt(0).toUpperCase() + p.value.slice(1)} Player` : 'Player';
  if (sumSize) sumSize.textContent = s ? `Board-${s.value} Cards` : 'Board size';
  if (getEl('theme-preview') && t) (getEl('theme-preview') as HTMLImageElement).src = THEME_IMAGES[t.value];
  (getEl('start-actual-game') as HTMLButtonElement).disabled = !(t && p && s);
};

function updateUI() {
  getEl('score-blue')!.textContent = state.scores.blue.toString();
  getEl('score-orange')!.textContent = state.scores.orange.toString();
  const gameScreen = getEl('game-screen');
  if (gameScreen) {
    gameScreen.classList.remove('is-blue-active', 'is-orange-active');
    gameScreen.classList.add(`is-${state.currentPlayer}-active`);
  }
}

function createCard(val: number, theme: string): HTMLElement {
  const temp = getEl('card-template') as HTMLTemplateElement;
  const clone = temp.content.cloneNode(true) as DocumentFragment;
  const card = clone.querySelector('.card') as HTMLElement;
  const folder = THEME_FOLDER_MAP[theme];
  card.setAttribute('data-val', val.toString()); 
  (card.querySelector('.img-pattern') as HTMLImageElement).src = `/assets/imgs/${folder}/cards/${theme}-front.png`;
  (card.querySelector('.img-content') as HTMLImageElement).src = `/assets/imgs/${folder}/cards/${theme}-${val}.png`;
  card.onclick = () => onCardClick(card); 
  return card;
}

function initGame(theme: string, size: number, startPlayer: 'blue' | 'orange') {
  resetGameState(size, startPlayer);
  updateUI();
  const board = getEl('game-board')!;
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${size === 16 ? 4 : 6}, 1fr)`;
  getCardValues(size).forEach(val => board.appendChild(createCard(val, theme)));
}

function handleMatch() {
  state.flippedCards.forEach(c => c.classList.add('is-matched'));
  state.scores[state.currentPlayer]++;
  state.matchedPairs++;
  state.flippedCards = [];
  updateUI();
  if (state.matchedPairs === state.currentSize / 2) setTimeout(handleGameOver, 600);
}

function handleMismatch() {
  state.isLocked = true;
  setTimeout(() => {
    state.flippedCards.forEach(c => c.classList.remove('is-flipped'));
    state.flippedCards = [];
    state.currentPlayer = state.currentPlayer === 'blue' ? 'orange' : 'blue';
    state.isLocked = false;
    updateUI();
  }, 1000);
}

function onCardClick(card: HTMLElement) {
  if (state.isLocked || state.flippedCards.includes(card) || card.classList.contains('is-matched')) return;
  card.classList.add('is-flipped');
  state.flippedCards.push(card);
  if (state.flippedCards.length === 2) {
    const [c1, c2] = state.flippedCards;
    c1.getAttribute('data-val') === c2.getAttribute('data-val') ? handleMatch() : handleMismatch();
  }
}

function showWinner() {
  const name = getEl('winner-name')!, pawn = getEl('winner-pawn') as HTMLImageElement;
  const isBlue = state.scores.blue > state.scores.orange;
  name.textContent = isBlue ? 'Blue Player' : 'Orange Player';
  name.className = `end-screen__winner-title text--${isBlue ? 'blue' : 'orange'}`;
  pawn.src = isBlue ? PAWN_IMAGES.blue : PAWN_IMAGES.orange;
  getEl('game-over-view')?.classList.add('hidden');
  getEl('winner-view')?.classList.remove('hidden');
}

function handleGameOver() {
  getEl('game-over-view')?.classList.remove('hidden');
  getEl('winner-view')?.classList.add('hidden');
  getEl('final-blue')!.textContent = state.scores.blue.toString();
  getEl('final-orange')!.textContent = state.scores.orange.toString();
  const theme = queryRadio('theme').value;
  const end = getEl('end-screen')!;
  end.classList.remove('hidden');
  end.className = `end-screen theme-${theme}`;

  setTimeout(showWinner, 2000);
}

document.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', updateSettings));
getEl('start-game')?.addEventListener('click', () => {
  getEl('home-screen')?.classList.add('hidden');
  getEl('settings-screen')?.classList.remove('hidden');
});

getEl('start-actual-game')?.addEventListener('click', () => {
  const theme = queryRadio('theme').value, size = parseInt(queryRadio('size').value), player = queryRadio('player').value as 'blue' | 'orange';
  getEl('app')!.className = `theme-${theme}`;
  getEl('settings-screen')?.classList.add('hidden');
  getEl('game-screen')?.classList.remove('hidden');
  getEl('game-screen')!.className = `game-page theme-${theme}`;
  initGame(theme, size, player);
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