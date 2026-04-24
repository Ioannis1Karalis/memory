import './styles/main.scss';

// 1. Screens & Board
const homeScreen = document.getElementById('home-screen');
const settingsScreen = document.getElementById('settings-screen');
const gameScreen = document.getElementById('game-screen');
const gameBoard = document.getElementById('game-board');

// 2. Buttons
const startBtn = document.getElementById('start-game');
const startActualGameBtn = document.getElementById('start-actual-game') as HTMLButtonElement;
const exitGameBtnHeader = document.getElementById('exit-game');

// 3. Settings & Preview
const previewImg = document.getElementById('theme-preview') as HTMLImageElement;
const [sumTheme, sumPlayer, sumSize] = ['sum-theme', 'sum-player', 'sum-size'].map(id => document.getElementById(id));

// 4. Modals
const exitModal = document.getElementById('exit-modal');
const btnBackToGame = document.getElementById('btn-back-to-game');
const btnConfirmExit = document.getElementById('btn-confirm-exit');

// 5. Game UI Elemente
const activePlayerImg = document.getElementById('active-player-img') as HTMLImageElement; // Neu!
const endScreen = document.getElementById('end-screen');

// 6. Game State
let flippedCards: HTMLElement[] = [];
let scores = { blue: 0, orange: 0 };
let currentPlayer: 'blue' | 'orange' = 'blue';
let isLocked = false;
let matchedPairs = 0;
let currentSize = 0;

// 7. Assets / Mappings
const playerIcons = {
  blue: '/assets/icons/blue-player.png',
  orange: '/assets/icons/orange-player.png'
};

const pawnImages = {
  blue: '/assets/icons/pawn-winner-blue.png',
  orange: '/assets/icons/pawn-winner-orange.png'
};

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

function initGame(theme: string, size: number, startPlayer: 'blue' | 'orange') {
  scores = { blue: 0, orange: 0 };
  currentPlayer = startPlayer; 
  flippedCards = [];
  matchedPairs = 0;
  currentSize = size;
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
  const selectedPlayer = (document.querySelector('input[name="player"]:checked') as HTMLInputElement).value as 'blue' | 'orange';

  settingsScreen?.classList.add('hidden');
  gameScreen?.classList.remove('hidden');

  if (gameScreen) gameScreen.className = `game-page theme-${selectedTheme}`;
  
  initGame(selectedTheme, selectedSize, selectedPlayer);
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
  const currentPlayerImg = document.getElementById('active-player-img') as HTMLImageElement;
  
  if (blueScore) blueScore.textContent = scores.blue.toString();
  if (orangeScore) orangeScore.textContent = scores.orange.toString();
  
  if (currentPlayerImg) {
    currentPlayerImg.src = playerIcons[currentPlayer];
  }
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
  matchedPairs++;
  flippedCards = [];
  updateUI();
  //if (matchedPairs === currentSize / 2) handleGameOver();
  if (matchedPairs >= 1) handleGameOver();
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

function showWinner() {
  const winnerName = document.getElementById('winner-name')!;
  const winnerPawn = document.getElementById('winner-pawn') as HTMLImageElement;
  const isBlueWin = scores.blue > scores.orange;
  const winnerColor = isBlueWin ? '#00A3FF' : '#FF8A00'; 

  winnerName.textContent = isBlueWin ? 'BLUE PLAYER' : 'ORANGE PLAYER';
  winnerName.className = `end-screen__winner-title text--${isBlueWin ? 'blue' : 'orange'}`;

  winnerPawn.src = isBlueWin ? pawnImages.blue : pawnImages.orange;
  winnerPawn.alt = `${isBlueWin ? 'Blauer' : 'Orangener'} Gewinner-Spielfigur`;

  document.getElementById('game-over-view')?.classList.add('hidden');
  document.getElementById('winner-view')?.classList.remove('hidden');
}

function handleGameOver() {
  document.getElementById('final-blue')!.textContent = scores.blue.toString();
  document.getElementById('final-orange')!.textContent = scores.orange.toString();
  
  endScreen?.classList.remove('hidden');
  endScreen!.className = `end-screen theme-${(document.querySelector('input[name="theme"]:checked') as HTMLInputElement).value}`;
  
  setTimeout(showWinner, 3000); 
}

document.getElementById('btn-restart')?.addEventListener('click', () => {
  endScreen?.classList.add('hidden');
  gameScreen?.classList.add('hidden');
  settingsScreen?.classList.remove('hidden');
});