import * as constant from "./constant.js";
import { getJson } from './module.js';
import { Handler } from './Handler.js';

const previousPageBtn = $('.previousPage');

previousPageBtn.on('click', function() {
    history.back();
});

const allGameData = await getJson('../../../game_view/game_config.json');
const optionsBtn = {};
optionsBtn[constant.LAST_BTN] = "上一關";
optionsBtn[constant.START_BTN] = "遊戲開始";
optionsBtn[constant.NEXT_BTN] = "下一關";
optionsBtn[constant.HINT_BTN] = "提示";
optionsBtn[constant.RECORD_BTN] = "💾";
optionsBtn[constant.SUBMIT_BTN] = "送出答案";

const levelsArea = $('.levelBtn');
const optionsArea = $('.optionsBtn');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const gameID = parseInt(urlParams.get('id')) - 11;
const gameName = allGameData[gameID].game_name;

const iframeElement = $('<iframe></iframe>')
  .attr('src', `../games/${gameName}/index.html`)
  .attr('id', 'fractional_connection')
  .attr('scrolling', 'no');

$('.gameIframe').append(iframeElement);
let gameWindow;
let game;

levelsArea.html(getLevels());
$('.context').html(getRule());
optionsArea.html(getOptions());

$(window).on('message', function(event) {
    const message = event.originalEvent.data;
    // console.log(message);

    if (message.type === constant.GAME_WIN) {
        $('#nextBtn').addClass("jumpBtn");
    }
    if (message.type !== gameName) {
        return false;
    }
    gameWindow = $('#' + gameName)[0].contentWindow;
    console.log('Iframe loaded');
    game = gameWindow.getGame();
    levelsArea.on('click', 'button', function(e) {
        const level = parseInt($(this).attr('id'));
        if (!level) {
            return false;
        }
        levelsArea.children().eq(game.level - 1).removeClass('active');
        game.winLevelSet.forEach((value) => 
            levelsArea.children().eq(value - 1).addClass('win')
        );
        $(this).addClass('active');
        game.changeLevel(level);
    });

    const btnHandler = new Handler(game, levelsArea);
    optionsArea.on('click', 'button', function(e) {
        const act = $(this).attr('id');
        if (optionsBtn[act] === optionsBtn.startBtn) {
            const gameRule = $('.gameRule');
            gameRule.css({"display": 'none'});
            $('#' + act).text("重新開始");
        }
        btnHandler.handleRequest(act);
    });
});

const jumpBtn = $('.jumpBtn');
jumpBtn.on('animationiteration', function() {
    $(this).css('animation-play-state', 'paused');
    setTimeout(() => {
        $(this).css('animation-play-state', 'running');
    }, 2000);
});

function getLevels(){
    let levels = '';
    let i = 1;
    while (i <= allGameData[gameID].game_level){
        levels += `<button id="${i}">${i}</button>`;
        i++;
    }
    return levels;
}

function getRule(){
    let rule = '';
    allGameData[gameID].game_rule.forEach(element => {
        rule += `<h1>${element}</h1>`;
    });
    return rule;
}

function getOptions(){
    let options = '';
    allGameData[gameID].game_option.forEach(option => {
        if (option === 'submitBtn'){
            options += `<button class="jumpBtn" id="${option}">${optionsBtn[option]}</button>`;
        }
        else {
            options += `<button id="${option}">${optionsBtn[option]}</button>`;
        }
    });
    return options;
}
