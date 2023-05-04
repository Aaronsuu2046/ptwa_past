import {startBtnHandler, game} from './Handler.js';


const levelsArea = $(`.levelBtn`);
const optionsArea = $(`.optionsBtn`);
const closeHintBtn = $(`.hintContainer .closeHintBtn`);
const jumpBtn = $('.jumpBtn');

levelsArea.on('click', (e) => {
    const level = parseInt(e.target.textContent);
    $(e.target).addClass('active');
    game.changeLevel(level);
})

optionsArea.on('click', (e) => {
    const act = e.target.id;
    if (act === 'startBtn'){
        $('.gameRule').css('display', 'none');
    }
    startBtnHandler.handleRequest(act);
})

closeHintBtn.on('click', (e) => {
    game.toggleHint();
})

jumpBtn.on('animationiteration', ()=>{
    jumpBtn.css('animation-play-state', 'paused');
    setTimeout(()=>{jumpBtn.css('animation-play-state', 'running');}, 2000);
});