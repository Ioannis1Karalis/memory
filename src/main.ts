import './styles/main.scss'

init()

function init(){
    const fieldRef = document.getElementById("field")
    if(fieldRef){
        fieldRef.addEventListener("click", e =>{
            const card = (e.target as HTMLElement).closest(".card") as HTMLButtonElement
            if(card){
                card.classList.toggle("is-flipped")
            }
        })
    }
}

import './styles/main.scss'

// 1. Variablen & Mapping
const themeImages: Record<string, string> = {
  'code-vibes': '/assets/imgs/code vibes/theme-code-vibes.png',
  'gaming': '/assets/imgs/gaming/theme-gaming.png',
  'foods': '/assets/imgs/foods/theme-foods.png'
};

const [sumTheme, sumPlayer, sumSize] = ['sum-theme', 'sum-player', 'sum-size'].map(id => document.getElementById(id));
const previewImg = document.getElementById('theme-preview') as HTMLImageElement;
const startActualGameBtn = document.getElementById('start-actual-game') as HTMLButtonElement;

const updateSettings = () => {
  const sel = (n: string) => document.querySelector(`input[name="${n}"]:checked`) as HTMLInputElement;
  const [t, p, s] = [sel('theme'), sel('player'), sel('size')];

  if (sumTheme) sumTheme.textContent = t?.parentElement?.querySelector('.radio-text')?.textContent ?? 'Game theme';
  if (sumPlayer) sumPlayer.textContent = p ? `${p.value.charAt(0).toUpperCase() + p.value.slice(1)} Player` : 'Player';
  if (sumSize) sumSize.textContent = s ? `Board-${s.value} Cards` : 'Board size';

  if (previewImg) previewImg.src = t ? themeImages[t.value] : '/assets/preview-placeholder.png';
  startActualGameBtn.disabled = !(t && p && s);
};

document.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', updateSettings));

document.getElementById('start-game')?.addEventListener('click', () => {
  document.getElementById('home-screen')?.classList.add('hidden');
  document.getElementById('settings-screen')?.classList.remove('hidden');
});

document.getElementById('field')?.addEventListener('click', e => {
  const card = (e.target as HTMLElement).closest('.card');
  if (card) card.classList.toggle('is-flipped');
});

updateSettings(); 