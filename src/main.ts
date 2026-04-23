import './styles/main.scss';

const homeScreen = document.getElementById('home-screen');
const settingsScreen = document.getElementById('settings-screen');
const gameScreen = document.getElementById('game-screen');
const gameBoard = document.getElementById('game-board');

const startBtn = document.getElementById('start-game');
const startActualGameBtn = document.getElementById('start-actual-game') as HTMLButtonElement;
const exitGameBtn = document.getElementById('exit-game');

const previewImg = document.getElementById('theme-preview') as HTMLImageElement;
const [sumTheme, sumPlayer, sumSize] = ['sum-theme', 'sum-player', 'sum-size'].map(id => document.getElementById(id));

const exitModal = document.getElementById('exit-modal');
const exitGameBtnHeader = document.getElementById('exit-game');
const btnBackToGame = document.getElementById('btn-back-to-game');
const btnConfirmExit = document.getElementById('btn-confirm-exit');

let flippedCards: HTMLElement[] = [];
let scores = { blue: 0, orange: 0 };
let currentPlayer: 'blue' | 'orange' = 'blue';
let isLocked = false;

const themeImages: Record<string, string> = {
  'code-vibes': '/assets/imgs/code vibes/theme-code-vibes.png',
  'gaming': '/assets/imgs/gaming/theme-gaming.png',
  'foods': '/assets/imgs/foods/theme-foods.png'
};

const themeFolderMap: Record<string, string> = {
  'code-vibes': 'code vibes',
  'gaming': 'gaming',
  'foods': 'foods'
};

const updateSettings = () => {
  const sel = (n: string) => document.querySelector(`input[name="${n}"]:checked`) as HTMLInputElement;
  const [t, p, s] = [sel('theme'), sel('player'), sel('size')];

  if (sumTheme) sumTheme.textContent = t?.parentElement?.querySelector('.radio-text')?.textContent ?? 'Theme';
  if (sumPlayer) sumPlayer.textContent = p ? `${p.value.charAt(0).toUpperCase() + p.value.slice(1)} Player` : 'Player';
  if (sumSize) sumSize.textContent = s ? `Board-${s.value} Cards` : 'Board size';

  if (previewImg && t) previewImg.src = themeImages[t.value];
  if (startActualGameBtn) startActualGameBtn.disabled = !(t && p && s);
};

function getCardValues(size: number): number[] {
  const pairs = Array.from({ length: size / 2 }, (_, i) => i + 1)
    .flatMap(val => [val, val]);
  return pairs.sort(() => Math.random() - 0.5);
}

function createCard(val: number, theme: string): HTMLElement {
  const temp = document.getElementById('card-template') as HTMLTemplateElement;
  const clone = temp.content.cloneNode(true) as DocumentFragment;
  const card = clone.querySelector('.card') as HTMLElement;
  const folder = themeFolderMap[theme];

  card.setAttribute('data-val', val.toString()); 
  (card.querySelector('.img-pattern') as HTMLImageElement).src = `/assets/imgs/${folder}/cards/${theme}-front.png`;
  (card.querySelector('.img-content') as HTMLImageElement).src = `/assets/imgs/${folder}/cards/${theme}-${val}.png`;

  card.onclick = () => onCardClick(card); 
  return card;
}

function initGame(theme: string, size: number) {
  scores = { blue: 0, orange: 0 };
  currentPlayer = 'blue';
  flippedCards = [];
  isLocked = false;
  updateUI();
  if (!gameBoard) return;
  gameBoard.innerHTML = '';
  gameBoard.style.gridTemplateColumns = `repeat(${size === 16 ? 4 : 6}, 1fr)`;
  
  getCardValues(size).forEach(val => {
    gameBoard.appendChild(createCard(val, theme));
  });
}

document.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', updateSettings));

startBtn?.addEventListener('click', () => {
  homeScreen?.classList.add('hidden');
  settingsScreen?.classList.remove('hidden');
});

startActualGameBtn?.addEventListener('click', () => {
  const selectedTheme = (document.querySelector('input[name="theme"]:checked') as HTMLInputElement).value;
  const selectedSize = parseInt((document.querySelector('input[name="size"]:checked') as HTMLInputElement).value);

  settingsScreen?.classList.add('hidden');
  gameScreen?.classList.remove('hidden');

  if (gameScreen) gameScreen.className = `game-page theme-${selectedTheme}`;
  initGame(selectedTheme, selectedSize);
});



exitGameBtnHeader?.addEventListener('click', () => {
  exitModal?.classList.remove('hidden');
});

btnBackToGame?.addEventListener('click', () => {
  exitModal?.classList.add('hidden');
});

btnConfirmExit?.addEventListener('click', () => {
  exitModal?.classList.add('hidden'); 
  gameScreen?.classList.add('hidden'); 
  settingsScreen?.classList.remove('hidden'); 
  
  if (gameBoard) gameBoard.innerHTML = '';
});

updateSettings();

function updateUI() {
  const blueScore = document.getElementById('score-blue');
  const orangeScore = document.getElementById('score-orange');
  const diamond = document.getElementById('active-player-diamond');
  
  if (blueScore) blueScore.textContent = scores.blue.toString();
  if (orangeScore) orangeScore.textContent = scores.orange.toString();
  diamond!.className = `diamond-icon diamond-icon--${currentPlayer}`;
}

function handleMismatch() {
  isLocked = true;
  setTimeout(() => {
    flippedCards.forEach(c => c.classList.remove('is-flipped'));
    flippedCards = [];
    currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';
    isLocked = false;
    updateUI();
  }, 1000);
}

function handleMatch() {
  flippedCards.forEach(c => c.classList.add('is-matched'));
  scores[currentPlayer]++;
  flippedCards = [];
  updateUI();
}

function checkMatch() {
  const [c1, c2] = flippedCards;
  const val1 = c1.getAttribute('data-val');
  const val2 = c2.getAttribute('data-val');

  val1 === val2 ? handleMatch() : handleMismatch();
}

function onCardClick(card: HTMLElement) {
  if (isLocked || flippedCards.includes(card) || card.classList.contains('is-matched')) return;

  card.classList.add('is-flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) checkMatch();
}