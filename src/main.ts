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
  const cardBtn = clone.querySelector('.card') as HTMLElement;
  const folder = themeFolderMap[theme];

  const pattern = cardBtn.querySelector('.img-pattern') as HTMLImageElement;
  const content = cardBtn.querySelector('.img-content') as HTMLImageElement;
  
  pattern.src = `/assets/imgs/${folder}/cards/${theme}-front.png`;
  content.src = `/assets/imgs/${folder}/cards/${theme}-${val}.png`;

  cardBtn.onclick = () => cardBtn.classList.toggle('is-flipped');

  return cardBtn;
}

function initGame(theme: string, size: number) {
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