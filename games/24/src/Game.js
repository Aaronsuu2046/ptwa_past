// Import all you need module in game
import * as constant from "../../../game_view/src/constant.js"
import {
    gameModules
    , helpModules
} from "../../../game_view/src/module.js"
import {
    CombinationLockTemplate
} from "../../../game_view/src/templates/CombinationLockTemplate.js"


// Export your game
export class Game extends CombinationLockTemplate {
    constructor(gameData){
        super(gameData);
        // Initialise game object
        this.topicExplain = Array(this.levelLimit).fill("拖動畫面上的尺，量量看長度幫助回答問題吧！");
        this.ruler = $('.ruler');
        this.positions = {top: this.ruler.position().top, left: this.ruler.position().left};
        this.ruler.draggable();
        this.topic = $('.topArea .topic').children().eq(this.level - 1);
    }

    startGame(level) {
        super.startGame(level);
        // create game content
        this.topic = $('.topArea .topic').children().eq(this.level - 1);
        this.answerData = this.gameData[level-1].answer;
        this.generatorTopicArea();
        this.ruler.animate(this.positions, 0);
    }

    generatorTopicArea() {
        //future
        this.topArea.find('.topic').children().hide();
        this.topic.show();
        this.changeTopic(1);
    }

    changeTopic(correntQuestionIndex) {
        const imgWidthMm = this.gameData[this.level-1].imgSize[correntQuestionIndex-1];
        const imgWidthPercent = (imgWidthMm / 150) * (100-6.5); // 6.5 is distance
        this.topic.css("width", imgWidthPercent + "%");
    }
    
    correctAnswer(){
        // action
        this.recordObj.appendToRecord(constant.recordItem.QUESTION, this.answerData.join('-'));
        this.recordObj.appendToRecord(constant.recordItem.ANSWER, this.currentAnswer.join('-'));
    }
    wrongAnswer(){
        // action
        this.recordObj.appendToRecord(constant.recordItem.QUESTION, this.answerData.join('-'));
        this.recordObj.appendToRecord(constant.recordItem.ANSWER, this.currentAnswer.join('-'));
    }
}

export default Game;

// Read game_config.json file
const gameData = await gameModules.getJson('../../games/24/game_config.json');
// Create game Instance, Must input gameData
const gameInstance = new Game(gameData);
// Post game to game_view
window.getGame = function() {
    return gameInstance;
};

// type must === game filename
parent.postMessage({ type: '24' }, '*');
