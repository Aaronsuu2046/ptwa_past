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
        this.rightArea = $('.gameArea .rightArea');
    }

    getCorrectLimit(){
        return this.gameData[this.level-1].hour.length;
    }

    startGame(level) {
        super.startGame(level);
        this.createQuestions();
        this.createHint();
        helpModules.reorder(
            this.leftArea
            , this.rightArea
        );
    }

    creatRecord(recordType, dot){
        const value = dot.data('value');
        return `${value}`;
    }

    createQuestions() {
        const level = this.level - 1;
        for (let i = 0; i < this.correctLimit; i++) {
            let hour = helpModules.randomNumber(1, this.gameData[level].hour[i]);
            let minute = helpModules.randomNumber(1, this.gameData[level].minute[i]);
            this.setTime(hour, minute, this.leftArea.find('.contentArea').eq(i));
            hour = hour < 10 ? `0${hour}` : hour;
            minute = minute < 10 ? `0${minute}` : minute;
            this.rightArea.find('.contentArea').eq(i).find('.hour').text(hour);
            this.rightArea.find('.contentArea').eq(i).find('.minute').text(minute);
            this.leftArea.find('.questionArea').eq(i).find('.dot').data({'value': `${hour}:${minute}`});
            this.rightArea.find('.answerArea').eq(i).find('.dot').data({'value': `${hour}:${minute}`});
        };
    }

    setTime(hour, minute, targetElement) {
        // 計算指針的角度
        const hoursDegree = (hour / 12) * 360;
        const minutesDegree = (minute / 60) * 360;
      
        // 旋轉指針
        targetElement.find('.hour').css('transform', `rotate(${hoursDegree}deg)`);
        targetElement.find('.minute').css('transform', `rotate(${minutesDegree}deg)`);
      }
      
    createHint() {
        $('.hintContainer .leftArea').html(this.gameArea.find('.leftArea .contentArea').clone());
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
