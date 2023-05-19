import * as constant from "./constant.js";
import { getJson } from './module.js';
import { Handler } from './Handler.js';

const optionsBtn = {};
optionsBtn[constant.LAST_BTN] = "上一關";
optionsBtn[constant.START_BTN] = "遊戲開始";
optionsBtn[constant.NEXT_BTN] = "下一關";
optionsBtn[constant.HINT_BTN] = "提示";
optionsBtn[constant.RECORD_BTN] = "💾";
optionsBtn[constant.SUBMIT_BTN] = "送出答案";

const levelsArea = $(`.levelBtn`);
const optionsArea = $(`.optionsBtn`);

document.addEventListener('DOMContentLoaded', async function() {
    const gameName = 'fractional_connection';
    const iframeElement = document.getElementById(gameName);
    console.log('DOMContentLoaded');

    window.addEventListener('message', function(event) {
        if (event.source !== iframeElement.contentWindow) {
            return;
        }

        const message = event.data;
        // console.log(message);

        if (message.type === constant.GAME_WIN) {
            $(`#nextBtn`).addClass("jumpBtn");
        }
        if (message.type !== 'iframeLoaded') {return false}
        console.log('Iframe loaded');

        const game = iframeElement.contentWindow.getGame();

        levelsArea.html(getLevels());
        $('.context').html(getRule());
        optionsArea.html(getOptions());

        levelsArea.on('click', (e) => {
            const level = parseInt(e.target.id);
            if (!level){return false}
            levelsArea.children().eq(game.level-1).removeClass('active');
            game.winLevelSet.forEach((value) => 
                levelsArea.children().eq(value-1).addClass('win')
            )
            $(e.target).addClass('active');
            game.changeLevel(level);
        });

        const btnHandler = new Handler(game, levelsArea);
        optionsArea.on('click', (e) => {
            const act = e.target.id;
            if (optionsBtn[act] === optionsBtn.startBtn) {
                const gameRule = $('.gameRule');
                gameRule.css({"display": 'none'});
                $(`#${act}`).text("重新開始");
            }
            btnHandler.handleRequest(act);
        });

        const jumpBtn = $('.jumpBtn');
        jumpBtn.on('animationiteration', () => {
            jumpBtn.css('animation-play-state', 'paused');
            setTimeout(() => {
                jumpBtn.css('animation-play-state', 'running');
            }, 2000);
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

    const allGameData = await getJson('../../../game_view/game_config.json');
});

