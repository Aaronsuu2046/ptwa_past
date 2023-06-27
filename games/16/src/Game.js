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
        this.topicExplain = Array(this.levelLimit).fill("拖動圖形比對方格圖，答案是幾平方公分呢？");
        $( ".topic img" ).draggable();
    }

    startGame(level) {
        super.startGame(level);
        // create game content
        this.answerData = this.gameData[level-1].answer;
        this.generatorTopicArea();
    }

    generatorTopicArea() {
        this.topArea.find('.topic').children().hide();
        this.topArea.find('.topic').children().eq(this.level - 1).show();
    }

    correctAnswer(){
        // action
        this.recordObj.appendToRecord(constant.recordItim.QUESTION, this.answerData);
        this.recordObj.appendToRecord(constant.recordItim.ANSWER, this.currentAnswer);
    }
    wrongAnswer(){
        // action
        this.recordObj.appendToRecord(constant.recordItim.QUESTION, this.answerData);
        this.recordObj.appendToRecord(constant.recordItim.ANSWER, this.currentAnswer);
    }

}

export default Game;

// Read game_config.json file
const gameData = await gameModules.getJson('../../games/16/game_config.json');
// Create game Instance, Must input gameData
const gameInstance = new Game(gameData);
// Post game to game_view
window.getGame = function() {
    return gameInstance;
};

// type must === game filename
parent.postMessage({ type: '16' }, '*');
