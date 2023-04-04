import {startBtnHandler, game} from './Handler.js';


const levelsArea = $(`.levelBtn`);
const optionsArea = $(`.optionsBtn`);
const closeHintBtn = $(`.hintContainer .closeHintBtn`);

levelsArea.on('click', (e) => {
    const level = parseInt(e.target.id);
    $(e.target).addClass('active');
    game.changeLevel(level);
})

optionsArea.on('click', (e) => {
    const act = e.target.id;
    startBtnHandler.handleRequest(act);
})

closeHintBtn.on('click', (e) => {
    game.toggleHint();
})
