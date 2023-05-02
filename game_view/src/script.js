import {Game} from '../../games/fractional_connection/src/Game.js'
import * as constant from "./constant.js"
import {getJson} from './function.js';
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
const game = window.game;
levelsArea.on('click', (e) => {
    const level = parseInt(e.target.id);
    $(e.target).addClass('active');
    game.changeLevel(level);
})

const btnHandler = new Handler(game, levelsArea);
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

const gameRule = $('.gameRule');
gameRule.css({display: 'none'});
function showResultView(options){
    if (options === constant.BINGO){
        playCorrect();
    }
    else {
        playWrong();
    }
}

function playCorrect(){
    const bingoGroph = $('#bingo');
    const correctSound = $('#correct')[0];
    bingoGroph.css('display', 'block');
    correctSound.play();
    setTimeout(()=>{bingoGroph.css('display', 'none');}, 500);
}
function playWrong(){
    const dadaGroph = $('#dada');
    const wrongSound = $('#wrong')[0];
    dadaGroph.css('display', 'block');
    wrongSound.play();
    setTimeout(()=>{dadaGroph.css('display', 'none');}, 500);
}

const firework_sound = $('#win')[0];
const fireworkContainer = $('#firework-container');
const fireworksUrl = './assets/images/fireworks.gif';
function removeResultView(){
    firework_sound.pause();
    fireworkContainer.css('display', 'none');

}
function set_off_fireworks(){
    firework_sound.currentTime = 1.5;
    firework_sound.play();
    fireworkContainer.css('display', 'block');
    showFirework();
    setTimeout(()=>{firework_sound.pause()}, 2500);
    let count = 0;
    while (count < 2300){
        let milliseconds =  Math.floor(Math.random() * (800 - 400 + 1)) + 400;
        count += milliseconds;
        setTimeout(showFirework, count)
    }
    setTimeout(() => {
        fireworkContainer.css('display', 'none');
    }, count)
} 

function showFirework() {
    for (let i = 0; i < 5; i++) {
        let width = 100 * (Math.random()*2.5);
        const fireworksElement = $('<img>');
        fireworksElement.attr('src', fireworksUrl);
        fireworksElement.css({
            'position': 'absolute',
            'width': `${width}px`,
            'height': 'auto',
            'left': Math.floor(Math.random() * (fireworkContainer.width() - width)) + 'px',
            'top': Math.floor(Math.random() * (fireworkContainer.height() - width * 1.5)) + 'px'
        });
        fireworkContainer.append(fireworksElement);
    }
    setTimeout(removeFirework, 1194);
}  

function removeFirework() {
    for (let i = 0; i < 5; i++) {
        fireworkContainer.children().first().remove();
    }
}