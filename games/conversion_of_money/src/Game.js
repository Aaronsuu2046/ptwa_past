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
        this.answerLimit = this.gameData[this.level-1].length;
        this.currentAnswer = null;
        this.combinationLock = $('.combinationLock')

        this.checkEvent();
    }

    startGame(level) {
        super.startGame(level);
        // create game content
    }

    // The following methods must be overridden
    getGameResult(){
        // juddging
        const incorrectElements = $('.answerInput').filter((i, answer) => {
            return $(answer).data('is_right') === true;
        });
          
        if (incorrectElements.length >= this.answerLimit) {
            this.gameState = constant.GAME_WIN;
            // throw new Error('please define getGameResult');
        }
    }
    correctAnswer(){
        // action
        this.currentAnswer.data({"is_right": true})
        // throw new Error('please define correctAnswer');
    }
    wrongAnswer(){
        // action
        this.currentAnswer.data({"is_right": false})
        // throw new Error('please define wrongAnswer');
    }

    checkEvent() {
        const answerInput = $('.answerInput');

        answerInput.each((i,  answer) => {
            $(answer).on('click', () => {
                this.currentAnswer = $(answer);
                this.combinationLock.toggle();
                if (this.combinationLock.is(':visible')) {
                    this.combinationLock.css('display', 'flex');
                }
            });
        });
        
        const handleNumberInput = (e) => {
            e.preventDefault();
            const input = e.target;
            const step = parseFloat(input.step) || 1;
            const value = parseFloat(input.value) || 0;
            const deltaY = e.originalEvent.deltaY || -e.originalEvent.wheelDelta;
            if (deltaY < 0) {
                input.value = Math.max(input.min, value - step);
            } else {
                input.value = Math.min(input.max, value + step);
            }
        }

        const checkPassword = () => {
            const correctAnswer = "999";
            const inputs = $('input[type="number"]');
            let inputsAnswer = "";
            inputs.each((i, ele) => {
                inputsAnswer += $(ele).val();
            })
    
            this.currentAnswer.text(inputsAnswer);
            this.combinationLock.toggle();

            this.checkAnswer(correctAnswer, inputsAnswer);
        }

        const inputs = $("input[type='number']");
        inputs.each(function() {
            $(this).on("wheel mousewheel", handleNumberInput);
        });
        
        $('.combinationLock button').on('pointerdown', checkPassword);

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
