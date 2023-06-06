// Import all you need module in game
import * as constant from "../../../game_view/src/constant.js"
import {
    gameModules
    , helpModules
} from "../../../game_view/src/module.js"
import {
    GameFramework
} from "../../../game_view/src/GameFramework.js"

// Export your game
export class Game extends GameFramework {
    constructor(gameData){
        super(gameData);
        // Initialise game object
        this.topicExplain = this.gameData.map(item => item.topic);
    }

    startGame(level) {
        super.startGame(level);
        // create game content
    }

    // The following methods must be overridden
    getGameResult(){
        // juddging
        throw new Error('please define getGameResult');
    }
    correctAnswer(){
        // action
        throw new Error('please define correctAnswer');
    }
    wrongAnswer(){
        // action
        throw new Error('please define wrongAnswer');
    }
}

export default Game;

// Read game_config.json file
const gameData = await gameModules.getJson('../../games/mouse_click/game_config.json');
// Create game Instance, Must input gameData
const gameInstance = new Game(gameData);
// Post game to game_view
window.getGame = function() {
    return gameInstance;
};

// type must === game filename
parent.postMessage({ type: 'mouse_click' }, '*');
