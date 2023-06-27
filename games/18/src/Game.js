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
        this.topicExplain = Array(this.levelLimit).fill("對的選 1，錯的選 0");
        $( ".topic img" ).draggable();
    }

    startGame(level) {
        super.startGame(level);
        // create game content
        this.answerData = this.gameData[level-1].answer;
        this.generatorTopicArea();
    }

    generatorTopicArea() {
        //future
        this.topArea.children().hide();
        this.topArea.children().eq(this.level - 1).show();
    }

    correctAnswer(){
        // action
        this.recordObj.appendToRecord(constant.recordItim.QUESTION, this.answerData.join('-'));
        this.recordObj.appendToRecord(constant.recordItim.ANSWER, this.currentAnswer.join('-'));
    }
    wrongAnswer(){
        // action
        this.recordObj.appendToRecord(constant.recordItim.QUESTION, this.answerData.join('-'));
        this.recordObj.appendToRecord(constant.recordItim.ANSWER, this.currentAnswer.join('-'));
    }

}

export default Game;

// Read game_config.json file
const gameData = await gameModules.getJson('../../games/18/game_config.json');
// Create game Instance, Must input gameData
const gameInstance = new Game(gameData);
// Post game to game_view
window.getGame = function() {
    return gameInstance;
};

// type must === game filename
parent.postMessage({ type: '18' }, '*');
