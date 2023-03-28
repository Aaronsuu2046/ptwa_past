import {startBtnHandler, game} from './Handler.js';


const levelsArea = document.querySelector(`.levelBtn`);
const optionsArea = document.querySelector(`.optionsBtn`);
const anglesArea = document.querySelector(`.angles`);

levelsArea.addEventListener('click', (e) => {
    const level = parseInt(e.target.id);
    $(e.target).addClass('active');
    game.changeLevel(level);
})

optionsArea.addEventListener('click', (e) => {
    const act = e.target.id;
    startBtnHandler.handleRequest(act);
})

anglesArea.addEventListener('click', (e) => {
    const angle = e.target.textContent;
    game.checkAnswer(angle);
})
