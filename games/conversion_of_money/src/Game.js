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
    }

    startGame(level) {
        super.startGame(level);
        // create game content
    }

    correctAnswer(){
        // action
        const level = this.level-1;
        this.recordObj.appendToRecord(constant.recordItim.QUESTION, this.gameData[level].answer.map(Number).join('-'));
        this.recordObj.appendToRecord(constant.recordItim.ANSWER, this.currentAnswer.map(Number).join('-'));
    }
    wrongAnswer(){
        // action
        const level = this.level-1;
        this.recordObj.appendToRecord(constant.recordItim.QUESTION, this.gameData[level].answer.map(Number).join('-'));
        this.recordObj.appendToRecord(constant.recordItim.ANSWER, this.currentAnswer.map(Number).join('-'));
    }

}

export default Game;

// Read game_config.json file
const gameData = await gameModules.getJson('../../games/conversion_of_money/game_config.json');
// Create game Instance, Must input gameData
const gameInstance = new Game(gameData);
// Post game to game_view
window.getGame = function() {
    return gameInstance;
};

// type must === game filename
parent.postMessage({ type: 'conversion_of_money' }, '*');
