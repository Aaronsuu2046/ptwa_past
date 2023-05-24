import * as constant from "./constant.js"
import {gameModules} from "./module.js"


export class GameTemplate {
    constructor(gameData){
        this.levelLimit = gameData.length;
        this.topicExplain = new Array(this.levelLimit).fill('遊戲目標');
        this.winLevelSet = new Set();
        this.gameData = gameData;
        this.recordObj = new GameRecord();
        this.gameState = constant.GAME_FILE;
        this.level = 1;
        this.createElements();
}
    createElements() {
        const elementGenerator = new ElementGenerator();
        elementGenerator
            .generateAudio()
            .generateResult()
            .generateFirework()
            .generateBasic()
            .generateLives(3);

        this.fireworkSound = $('#win')[0];
        this.fireworkContainer = $('#firework-container');
        this.explain = $('.explain');
    }
    startGame(level) {
        this.gameState =  constant.GAME_ALIVE;
        this.getExplain();
        this.lives = (this.gameData[level - 1].lives) ? this.gameData[level - 1].lives : 0;
        this.setLives(this.lives);
    }
    
    checkAnswer(question, answer) {
        const result = question === answer ? constant.BINGO : constant.DADA;
        this.updateGameResult(result);
        this.getGameResult();
    }

    updateGameResult(result) {
        if (result === constant.BINGO) {
            this.correctAnswer();
        } else {
            this.wrongAnswer();
            this.winLevelSet.delete(this.level);
        }
        this.recordObj.appendToRecord("result", result);
        gameModules.showResultView(result);
    }

    getGameResult(){
        // juddging
    }

    getWin(){
        this.winLevelSet.add(this.level);
        this.gameState = constant.GAME_WIN;
        parent.postMessage({ type: this.gameState }, '*');
        this.setFireworks();
    }

    changeLevel(level=1, options={}) {
        const { isPrevious=false, isNext=false } = options;
        if (isPrevious){
            level = level > 1 ? level - 1 : this.levelLimit;
        }
        else if (isNext){
            level = level < this.levelLimit ? level + 1 : 1;
        }
        this.level = level;
        this.resetGame(this.level);
    }
    
    resetGame(level){
        this.gameState = constant.GAME_FILE;
        this.removeResultView();
        this.startGame(level);
    }
    
    correctAnswer(){
        // define content
    }
    wrongAnswer(){
        // define content
    }

    toggleHint(){
        if (this.lives > 0) return
        $('.overlay').toggle();
    }
    
    getExplain(){
        this.explain.text(`${this.topicExplain[this.level-1]}`);
    }
    
    setLives(lives) {
        if (lives < 0) return
        this.lives = lives;
        const $lives = $('.lives').children();
        $lives.slice(0, lives).css('display', 'inline-block');
        $lives.slice(lives).css('display', 'none');
    }

    createLivesElement() {
        return $('<img>')
            .attr('src', '../../../assets/images/game_images/lives.svg')
            .attr('alt', 'lives image')
            .attr('width', '60')
            .attr('height', 'auto')
            .css('margin-right', '-30px');
    }
    
    removeResultView(){
        this.fireworkSound.pause();
        this.fireworkContainer.css('display', 'none');
    
    }
    setFireworks() {
        this.playFireworkSound();
        this.displayFireworkContainer();
      
        setTimeout(() => {
            this.fireworkSound.pause()
        }, 2500);
        
        let count = 0;
        while (count < 2300) {
            count += this.getRandomDelay();
            setTimeout(this.showFirework, count);
        }

        setTimeout(() => {
            this.hideFireworkContainer();
        }, count);
    }

    getRandomDelay() {
        return Math.floor(Math.random() * (800 - 400 + 1)) + 400;
    }

    playFireworkSound() {
        this.fireworkSound.currentTime = 1.5;
        this.fireworkSound.play();
    }

    displayFireworkContainer() {
        this.fireworkContainer.css('display', 'block');
        this.showFirework();
    }

    hideFireworkContainer() {
        this.fireworkContainer.css('display', 'none');
    }      
    
    showFirework = () => {
        const fireworksUrl = '../../../assets/images/game_images/fireworks.gif';
        const fireworksArea = {
            "width": this.fireworkContainer.width(),
            "height": this.fireworkContainer.height()
        };
        for (let i = 0; i < 5; i++) {
            let width = 100 * (Math.random()*2.5);
            const fireworksElement = $('<img>');
            fireworksElement.attr('src', fireworksUrl);
            fireworksElement.css({
                'position': 'absolute',
                'width': `${width}px`,
                'height': 'auto',
                'left': Math.floor(Math.random() * (fireworksArea.width - width)) + 'px',
                'top': Math.floor(Math.random() * (fireworksArea.height - width * 1.5)) + 'px'
            });
            this.fireworkContainer.append(fireworksElement);
        }
        setTimeout(this.removeFirework, 1194);
    }  
    
    removeFirework = () => {
        this.fireworkContainer.children().slice(0, 5).remove();
    }
}

class ElementGenerator {
    generateAudio() {
        const audioHTML = `
            <div class="audio">
                <audio id="correct" src="../../../assets/sounds/game_sounds/correct_sound_effect.mp3"></audio>
                <audio id="wrong" src="../../../assets/sounds/game_sounds/wrong_sound_effect.mp3"></audio>
                <audio id="win" src="../../../assets/sounds/game_sounds/applause_fireworks.mp3" duration="3"></audio>
            </div>
        `;
        $('body').append(audioHTML);
        return this;
    }
    generateResult() {
        const resultHTML = `
            <div class="result">
                <h1 id="bingo">Ｏ</h1>
                <h1 id="dada">Ｘ</h1>
            </div>
        `;
        $('body').append(resultHTML);
        return this;
    }
    generateFirework() {
        const fireworkHTML = `
            <div id="firework-container"></div>
        `;
        const fireworkContainer = $(fireworkHTML).css({
            "position": "absolute",
            "display": "none",
            "z-index": "100",
            "top": "15%",
            "left": "5%",
            "width": "90%",
            "height": "85%"
        });
        $('body').append(fireworkContainer);
        return this;
    }
    generateBasic() {
        const basic = `
            <div class="explain"></div>
            <div class="lives"></div>
        `;

        const closeBtn = `
            <span class="closeHintBtn">Ｘ</span>
        `;

        $('body').prepend($(basic));
        $('.overlay').append($(closeBtn));
        return this;
    }

    generateLives(livesCount) {
        const $lives = $('.lives');
        for (let i = 0; i < livesCount; i++) {
            $lives.append(this.createLifeElement());
        }
        return this;
    }

    createLifeElement() {
        return $('<img>')
            .attr('src', '../../../assets/images/game_images/lives.svg')
            .attr('alt', 'lives image')
            .attr('width', '60')
            .attr('height', 'auto')
            .css('margin-right', '-30px');
    }
  }
  
class GameRecord {
    constructor() { 
        this.record = {
            'q': [],
            'a': [],
            'result': []
        };
    }
  
    appendToRecord(recordType, value) {
        this.record[recordType].push(value);
    }

    loadRecord() {
        // Set download file name
        const filename = "遊玩紀錄.csv";
        let csvContent = "Times,Question,Answer,Result\n"; // Add CSV headers
    
        let count = 0;
        for (let i = 0; i < this.record.a.length; i++) {
            csvContent += `${i + 1},${this.record.q[i]},${this.record.a[i]},${this.record.result[i]}\n`;
            if (this.record.result[i] === constant.BINGO) count++;
        }
        csvContent += `\nCorrectRate,${(count / this.record.result.length) * 100}%\n`;
    
        csvContent = '\ufeff'+csvContent; // 添加 BOM
        // Create a Blob object
        const blob = new Blob([csvContent], { type: "text/csv" });
    
        // Create a download link
        const url = URL.createObjectURL(blob);
    
        // Create an <a> element and set href and download attributes
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
    
        // Simulate clicking the <a> element to start the download
        a.click();
    
        // Release the URL object
        URL.revokeObjectURL(url);
    }

    createEmptyRecord() {
        return {
            'q': []
            , 'a': []
            , 'result': []
        };
    }
}
