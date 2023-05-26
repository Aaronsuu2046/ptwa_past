import * as constant from "./constant.js";
import { gameModules } from './module.js';
import { Handler } from './Handler.js';

async function init() {
    const allGameData = await gameModules.getJson('../../../game_view/game_config.json');
    const gameID = getGameID();
    const gameData = allGameData[gameID];
    const gameGrade = gameData.game_grade;
    const gameName = gameData.game_name;

    const levelsArea = $('.levelBtn');
    const optionsArea = $('.optionsBtn');

    const iframeElement = createIframeElement(gameName);
    $('.gameIframe').append(iframeElement);
    updateLevels(gameData, levelsArea);
    $('.context').html(getRule(gameData));
    updateOptions(gameData);

    setupEventListeners(gameData, levelsArea, optionsArea);
    setupAnimation();
    setupGameColor(constant.GAME_COLOR[gameGrade]);
}

function getGameID() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return parseInt(urlParams.get('id')) - 11;
}

function createIframeElement(gameName) {
    return $('<iframe></iframe>', {
        src: `../games/${gameName}/index.html`,
        id: gameName,
        scrolling: 'no'
    });
}

function updateLevels(gameData, levelsArea) {
    const currentLevelCount = levelsArea.children('button').length;
    const targetLevelCount = gameData.game_level;

    if (currentLevelCount > targetLevelCount) {
        levelsArea.children('button:gt(' + (targetLevelCount - 1) + ')').remove();
    } else if (currentLevelCount < targetLevelCount) {
        const newButtons = Array.from(
            { length: targetLevelCount - currentLevelCount },
            (_, i) => $('<button>', {
                id: currentLevelCount + i + 1,
                text: currentLevelCount + i + 1
            })
        );
        levelsArea.append(newButtons);
    }
}

function getRule(gameData) {
    return gameData.game_rule.map(element => `<h1>${element}</h1>`).join('');
}

function updateOptions(gameData) {
    const options = gameData.game_option;
    $('.optionsBtn button').filter((index, element) => {
        return !options.includes($(element).attr('id'));
    }).remove();
}

function setupEventListeners(gameData, levelsArea, optionsArea) {
    const gameName = gameData.game_name;
    const gameKind = gameData.game_kind;
    const gameGrade = gameData.game_grade;
    $(window).on('message', handleGameMessage);

    function handleGameMessage(e) {
        const message = e.originalEvent.data;

        if (message.type === constant.GAME_WIN) {
            $('#nextBtn').addClass("jumpBtn");
        }
        if (message.type !== gameName) {
            return false;
        }
        const gameWindow = $('#' + gameName)[0].contentWindow;
        const game = gameWindow.getGame();

        levelsArea.on('click', 'button', handleLevelButtonClick);
        optionsArea.on('click', 'button', handleOptionsButtonClick);

        function handleLevelButtonClick(e) {
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
        };

        const btnHandler = new Handler(game, levelsArea);
        function handleOptionsButtonClick(e) {
            const act = $(this).attr('id');
            if (act === constant.optionsBtn.START_BTN) {
                const gameRule = $('.gameRule');
                gameRule.css({"display": 'none'});
                $('#' + act).text("重新開始");
            }
            btnHandler.handleRequest(act);
        };
    };

    const previousPageBtn = $('.previousPage');
    previousPageBtn.on('click', () => {
        window.location.href = `../../games/${gameKind}/grade${gameGrade}/`;
    });
}

function setupAnimation() {
    const jumpBtn = $('.jumpBtn');
    jumpBtn.on('animationiteration', function(e) {
        $(this).css('animation-play-state', 'paused');
        setTimeout(() => {
            $(this).css('animation-play-state', 'running');
        }, 2000);
    });
}

function setupGameColor(color) {
    const bgElement = ['.active', '.optionsBtn *']
    const borderElement = ['.previousPage', '.myCanvas', '.gameBtn *']
    const hoverBGElement = ['.previousPage', '.levelBtn *']
    bgElement.forEach((ele) => {
        $(ele).css('background-color', color)
    })
    borderElement.forEach((ele) => {
        $(ele).css('border-color', color);
    })
    
    hoverBGElement.forEach((ele) => {
        var colorStyle = $('<style>');
        colorStyle.text(`
        ${ele}:hover {
            background-color: ${color};
        }
        `);
        $('head').append(colorStyle);
    })

}
$(document).ready(init);
