import * as constant from "./constant.js"
import {getJson} from "./function.js"

const gameData = await getJson('./game_config.json');

export class GameTemplate {
    constructor(){
        this.explain = $('.explain');
        this.levelLimit = gameData.length;
        this.topic_explain = new Array(this.levelLimit).fill('遊戲目標');
        this.winLevelArr = [];
        this.gameData = gameData;
        this.record = {'q': []
                      , 'a': []
                      , 'result': []
                      };
        this.gameState = constant.GAME_FILE;
        this.level = 1;
    }
    startGame(level) {
        if (this.gameState=== constant.GAME_ALIVE){
            return
        }
        if (this.gameState=== constant.GAME_WIN){
            this.resetGame(level);
        }
        this.gameState =  constant.GAME_ALIVE;
        this.getExplain();
        this.lives = this.gameData.lives;
        this.setLives(this.gameData.lives);
    }
    
    checkAnswer(question, answer) {
        if (this.gameState !== GAME_ALIVE){
            return
        }
        this.record.q.push(question);
        this.record.a.push(answer);
        if (question === answer){
            this.record.result.push('O');
        }
        else {
            this.record.result.push('X');
            this.lives -= 1;
            setLives(this.lives)
            this.winLevelArr.pop(level);
        }
        this.getGameResult();
    }
    getGameResult(){
        // juddging
    }
    getWin(){
        this.winLevelArr.push(this.level);
        this.gameState = GAME_WIN;
        set_off_fireworks();
    }
    changeLevel(level=1, {...extra}={}) {
        const defaults = {
            isPrevious: false
            , isNext: false
        };
        const settings = { ...defaults, ...extra };
        if (settings.isPrevious){
            level -= 1;
            if (level <= 0){
                level = this.levelLimit;
            }
        }
        else if (settings.isNext){
            level += 1;
            if (level > this.levelLimit){
                level = 1;
            }
        }
        this.level = level;
        this.resetGame(this.level);
    }
    
    resetGame(level){
        this.startGame(level);
        // this.record = {
        //     'q': []
        //     , 'a': []
        //     , 'result': []
        // };
    }
    
    loadRecord() {
        // Set download file name
        const filename = "遊玩紀錄.csv";
        let csvContent = "Times,Question,Answer,Result\n"; // Add CSV headers
    
        let count = 0;
        for (let i = 0; i < this.record.a.length; i++) {
            csvContent += `${i + 1},${this.record.q[i]},${this.record.a[i]},${this.record.result[i]}\n`;
            if (this.record.result[i] === "O") count++;
        }
        csvContent += `\nCorrectRate,${(count / this.record.result.length) * 100}%\n`;
    
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
    toggleHint(){
        if (this.lives > 0)return
        overlay.toggle();
    }
    
    getExplain(){
        this.explain.html(`<h1>${this.topic_explain[this.level-1]}</h1>`);
    }
    
    setLives(lives){
        const count = lives - $('.lives').children().length;
        if (count === 0 || lives < 0) return
        if (count < 0) {
            $('.lives > :last-child').remove();
            return
        }
        for (let i = 0; i <count; i++){
            const livesImg = $('<img>')
            .attr('src', './assets/images/lives.svg')
            .attr('alt', 'lives image')
            .attr('width', '60')
            .attr('height', 'auto')
            .css('margin-right', '-30px');
            $('.lives').append(livesImg);
        }
        this.lives = lives;
    }
}


