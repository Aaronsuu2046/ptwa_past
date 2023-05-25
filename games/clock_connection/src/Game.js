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
        this.topicExplain = Array(this.levelLimit).fill('時鐘上的刻度是幾點幾分呢？');
    
        this.leftArea = $('.gameArea .leftArea');
        this.centerArea = $('.gameArea .centerArea');
        this.rightArea = $('.gameArea .rightArea');
    }

    getCorrectLimit(){
        return this.gameData[this.level-1].thousand.length;
    }

    startGame(level) {
        super.startGame(level);
        this.resetQuestions();
        this.createQuestions();
        this.createHint();
        helpModules.reorder(
            this.leftArea
            , this.centerArea
            , this.rightArea
        );
    }

    creatRecord(recordType, dot){
        const value = dot.data('value');
        console.log(value);
        console.log(this.recordObj.record);
        return `${value}`;
    }

    resetQuestions() {
        this.leftArea.find('*').remove('img');
        this.centerArea.find('*').filter(':hidden').css('display', '');
        this.rightArea.find('*').filter(':hidden').css('display', '');
    }

    createQuestions() {
        const level = this.level - 1;
        const $gameArea = $('.gameArea');
        for (let i = 0; i < 4; i++) {
            const thousand = helpModules.randomNumber(0, this.gameData[level].thousand[i]);
            const hundred = helpModules.randomNumber(0, this.gameData[level].hundred[i]);
            const ten = helpModules.randomNumber(0, this.gameData[level].ten[i]);
            const ones = helpModules.randomNumber(0, this.gameData[level].ones[i]);
            // console.log(area);
            this.createImg(this.leftArea.find('.contentArea').eq(i), "thousand", thousand);
            this.createImg(this.leftArea.find('.contentArea').eq(i), "hundred", hundred);
            this.createImg(this.leftArea.find('.contentArea').eq(i), "ten", ten);
            this.createImg(this.leftArea.find('.contentArea').eq(i), "ones", ones);
            thousand === 0 ? this.centerArea.find('.thousand').eq(i).css('display', 'none') :this.centerArea.find('.thousand .number').eq(i).text(thousand);
            hundred === 0 ? this.centerArea.find('.hundred').eq(i).css('display', 'none') :this.centerArea.find('.hundred .number').eq(i).text(hundred);
            ten === 0 ? this.centerArea.find('.ten').eq(i).css('display', 'none') :this.centerArea.find('.ten .number').eq(i).text(ten);
            ones === 0 ? this.centerArea.find('.ones').eq(i).css('display', 'none') :this.centerArea.find('.ones .number').eq(i).text(ones);
            thousand === 0 ? this.rightArea.find('.thousand').eq(i).css('display', 'none') :this.rightArea.find('.thousand .number').eq(i).text(thousand);
            hundred === 0 ? this.rightArea.find('.hundred').eq(i).css('display', 'none') :this.rightArea.find('.hundred .number').eq(i).text(hundred);
            ten === 0 ? this.rightArea.find('.ten').eq(i).css('display', 'none') :this.rightArea.find('.ten .number').eq(i).text(ten);
            ones === 0 ? this.rightArea.find('.ones').eq(i).css('display', 'none') :this.rightArea.find('.ones .number').eq(i).text(ones);
            if (i<3){
                this.leftArea.find('.questionArea').eq(i).find('.dot').data({'value': `${thousand}${hundred}${ten}${ones}`});
                this.centerArea.find('.questionArea').eq(i).find('.dot').data({'value': `${thousand}${hundred}${ten}${ones}`});
                this.rightArea.find('.questionArea').eq(i).find('.dot').data({'value': `${thousand}${hundred}${ten}${ones}`});
            }
        };
    }

    createImg(unit, imgName, count) {
        if (count < 0){
            unit.css('display', 'none');
            return
        }
        for (let i = 0; i < count; i++) {
            unit.append(this.getImg(imgName));
        }
    }

    getImg(imgName) {
        return $('<img>')
            .attr('src', `./assets/${imgName}.png`)
            .attr('alt', imgName);
    }
      
    createHint() {
        $('.hintContainer .leftArea').html(this.gameArea.find('.leftArea .contentArea').clone());
        $('.hintContainer .centerArea').html(this.gameArea.find('.centerArea .contentArea').clone());
        $('.hintContainer .rightArea').html(this.gameArea.find('.rightArea .contentArea').clone());
    }
}

export default Game;

const gameData = await gameModules.getJson('../../games/clock_connection/game_config.json');
const gameInstance = new Game(gameData);
window.getGame = function() {
    return gameInstance;
};

parent.postMessage({ type: 'clock_connection' }, '*');
