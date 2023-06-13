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
        this.updateIntervalIds = [];
        this.time = 30;
        this.score = 0;
        let lastClickTime = 0;
        $('.level img').click((e) => {
            const currentTime = new Date().getTime();
            const clickInterval = currentTime - lastClickTime;
            if (clickInterval < 300) {
                console.log('Double click!');
            }
            $(e.target).hide();
            this.updateScore(10);
        });
        $('.gameArea').on("mousemove", (e) => {
            let $cursor = $(".cursor");
            
            let x = this.level === 2 ? e.pageX : e.pageX - $cursor.width() / 2;
            let y = e.pageY - $cursor.height() / 2;

            if (this.level === 1) {
                $cursor.find("img").attr("src", "./assets/target.png");
            } else if (this.level === 2) {
                $cursor.find("img").attr("src", "./assets/farmera.png");
            } else {
                $cursor.hide();
                return;
            }
            
            $cursor.css("transform", `translate(${x}px, ${y}px)`);
            $cursor.show();
        });
          
          
    }

    startGame(level) {
        if (!super.startGame(level)) return false;
        // create game content
        $(`#level-${level}`).toggle();
        for (let i = 0; i < this.updateIntervalIds.length; i++) {
            clearInterval(this.updateIntervalIds[i]);
        }
        this.updateScore(-this.score);
        this.hideAllImages();
        this.createGameView();
        this.updateTime(this.gameData[level-1].time);
    }

    resetGame(level) {
        super.resetGame(level);
        $(`.level`).hide();
    }
    // The following methods must be overridden
    getGameResult(){
        // juddging
        this.gameState = constant.GAME_WIN;
    }
    correctAnswer(){
        // action
        this.recordObj.appendToRecord(constant.recordItim.QUESTION, this.time);
        this.recordObj.appendToRecord(constant.recordItim.ANSWER, this.score);
    }
    wrongAnswer(){
        // action
    }

    updateScore(score) {
        this.score += score;
        $('.score').text(this.score);
    }

    hideAllImages() {
        $('.level img').hide();
    }
    createGameView() {
        const cdTime = this.getRandomDisplayTime(1000, 1500);
        const gameUpdateID = setInterval(() => {
            this.showRandomImage();
        }, cdTime);
        this.updateIntervalIds.push(gameUpdateID);
    }

    getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    
    showRandomImage() {
        const hiddenImages = $(`#level-${this.level} img:hidden`);
        if (hiddenImages.length === 0 || this.time <= 0) {
          return;
        }
    
        const randomImage = this.getRandomElement(hiddenImages);
        this.updateImagePosition(randomImage);
        $(randomImage).fadeIn(500);
    
        setTimeout(() => {
          $(randomImage).fadeOut(500, () => {
            this.showRandomImage();
          });
        }, this.getRandomDisplayTime(3000, 5000));

    }
    
    getRandomDisplayTime(start, end, index) {
        if (typeof index === 'undefined') {
            return Math.floor(Math.random() * (end - start + 1)) + start;
        } else {
            const randomNumber = Math.floor(Math.random() * ((end - start) / index + 1));
            return randomNumber * index + start;
        }
    }
    
    getRandomPosition() {
        const $level = $(`#level-${this.level}`);
        const parentWidth = $level.outerWidth();
        const parentHeight = $level.outerHeight();
        const imageWidth = $('.level img').width();
        const imageHeight = $('.level img').height();
    
        const maxX = parentWidth - imageWidth;
        const maxY = parentHeight - imageHeight;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
    
        return { top: randomY, left: randomX };
    }
    
    updateImagePosition(image) {
        const position = this.getRandomPosition();
        $(image).css({ top: position.top, left: position.left});
    }

    updateTime(time) {
        this.time = time;
        const timeUpdateID = setInterval(() => {
            if (this.time <= 0) {
                this.checkAnswer();
                clearInterval(timeUpdateID);
                return
            }
            this.time -= 1;
            $('.countDown').text(this.time);
        }, 1000);
        this.updateIntervalIds.push(timeUpdateID);
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
