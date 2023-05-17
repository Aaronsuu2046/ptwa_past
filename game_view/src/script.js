import * as constant from "./constant.js"
import {getJson} from './module.js';
import {Handler} from './Handler.js';

const optionsBtn = {"lastBtn": "上一關", "startBtn": "遊戲開始", "nextBtn": "下一關", "hintBtn": "提示", "recordBtn": "💾", "submitBtn": "送出答案"}
const levelsArea = $(`.levelBtn`);
const optionsArea = $(`.optionsBtn`);

const allGameData = await getJson('../../../game_view/game_config.json');

const gameName = 'fractional_connection';
const iframeElement = document.getElementById(gameName);
const iframeWindow = iframeElement.contentWindow;

iframeElement.addEventListener('load', function() {
    const game = iframeWindow.getGame();
    // console.log(game); if rm this will error
    levelsArea.html(getLevels());
    $('.context').html(getRule());
    optionsArea.html(getOptions());
    
    levelsArea.on('click', (e) => {
        const level = parseInt(e.target.id);
        $(e.target).addClass('active');
        game.changeLevel(level);
    })
    
    const btnHandler = new Handler(game, levelsArea);
    optionsArea.on('click', (e) => {
        const act = e.target.id;
        if (optionsBtn[act] === optionsBtn.startBtn){
            const gameRule = $('.gameRule');
            gameRule.css({"display": 'none'});
        }
        btnHandler.handleRequest(act);
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
});
  
