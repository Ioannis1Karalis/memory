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

const homeScreen = document.getElementById('home-screen');
const settingsScreen = document.getElementById('settings-screen');
const playBtn = document.getElementById('start-game');

playBtn?.addEventListener('click', () => {
    homeScreen?.classList.add('hidden');
    settingsScreen?.classList.remove('hidden');
});