import {getJson} from './function.js';
import {GameController} from './GameController.js';
import {Handler} from './Handler.js';

const optionsBtn = {"lastBtn": "上一關", "startBtn": "遊戲開始", "nextBtn": "下一關", "hintBtn": "提示", "recordBtn": "💾", "submitBtn": "送出答案"}
const levelsArea = $(`.levelBtn`);
const optionsArea = $(`.optionsBtn`);
const closeHintBtn = $(`.hintContainer .closeHintBtn`);
const gameIframe = $('.gameIframe');
const allGameData = await getJson('../../../game_view/game_config.json');
const gameName = 'fractional_connection';

levelsArea.html(getLevels());
$('.context').html(getRule());
optionsArea.html(getOptions());
gameIframe.html(`<iframe id=${gameName} scrolling="no" src=../games/${gameName}></iframe>`)

const game = new GameController(gameName).game;
const btnHandler = new Handler(game);
levelsArea.on('click', (e) => {
    const level = parseInt(e.target.id);
    $(e.target).addClass('active');
    game.changeLevel(level);
})

optionsArea.on('click', (e) => {
    const act = e.target.id;
    btnHandler.handleRequest(act);
})

closeHintBtn.on('click', (e) => {
    game.toggleHint();
})

const jumpBtn = $('.jumpBtn');
jumpBtn.on('animationiteration', ()=>{
    jumpBtn.css('animation-play-state', 'paused');
    setTimeout(()=>{jumpBtn.css('animation-play-state', 'running');}, 2000);
});

function getLevels(){
    let levels = '';
    let i = 1;
    while (i <= allGameData[gameName].game_level){
        levels += `<button id="${i}">${i}</button>`;
        i++;
    }
    return levels;
}
function getRule(){
    let rule = '';
    allGameData[gameName].game_rule.forEach(element => {
        rule += `<h1>${element}</h1>`;
    });
    return rule;
}
function getOptions(){
    let options = '';
    allGameData[gameName].game_option.forEach(option => {
        if (option === 'submitBtn'){
            options += `<button class="jumpBtn" id="${option}">${optionsBtn[option]}</button>`;

        }
        else {
            options += `<button id="${option}">${optionsBtn[option]}</button>`;
        }
    });
    return options;
}