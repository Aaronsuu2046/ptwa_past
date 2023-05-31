import * as constant from "../../../game_view/src/constant.js"
import {
    gameModules
    , helpModules
} from "../../../game_view/src/module.js"
import {
    ConnectionGame
} from "../../../game_view/src/GameTemplate.js"


export class Game extends ConnectionGame {
    constructor(gameData){
        super(gameData);
        this.topicExplain = Array(this.levelLimit).fill('剩下多少水量呢？請連線告訴我吧！');
    }

    getCorrectLimit(){
        return this.gameData[this.level-1].top.length;
    }

    startGame(level) {
        super.startGame(level);
        this.createQuestions();
        this.createHint();
        helpModules.reorder(
            this.gameArea.find('.left')
            , this.gameArea.find('.right'));
    }

    // TODO force flow
    creatRecord(recordType, dot){
        const value = `${dot.data('top')}/${dot.data('bottom')}`
        if (recordType === constant.recordItim.QUESTION) {
            this.lastQuestion = value;
        }
        else {
            this.lastAnswer = value;
        }
        const prefix = dot.closest('.leftArea').length ? '水杯' : '分數';
        return `${prefix} ${value}`;
    }

    createQuestions() {
        const level = this.level - 1;
        const $gameArea = $('.gameArea');
        $gameArea.find('.scalls').each((index, value) => {
            let $value = $(value);
            let bottom = this.gameData[level].bottom[index];
            let top = this.gameData[level].top[index];
            const dot = $value.parent('.topicArea').siblings('.dot');
            dot.data({'top': top, 'bottom': bottom});
            $value.siblings('.water').css({ "height": `${top/bottom*100}%` });
            $value.html('<li></li>'.repeat(bottom + 1));
            const fraction = $gameArea.find('.fraction');
            fraction.siblings('.dot').eq(index).data({'top': top, 'bottom': bottom});
            fraction.find('.top').eq(index).html(`<h1>${top}</h1>`);
            fraction.find('.bottom').eq(index).html(`<h1>${bottom}</h1>`);
        });
    }
      
    createHint() {
        $('.hintContainer .left').html(this.gameArea.find('.left .topicArea').clone());
        $('.hintContainer .right').html(this.gameArea.find('.right .fraction').clone());
    }
}

export default Game;

const gameData = await gameModules.getJson('../../games/fractional_connection/game_config.json');
const gameInstance = new Game(gameData);
window.getGame = function() {
    return gameInstance;
};

parent.postMessage({ type: 'fractional_connection' }, '*');
