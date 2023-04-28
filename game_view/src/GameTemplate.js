import {getJson} from "./function.js"
// state
const GAME_FILE = 'FILE'
const GAME_ALIVE = 'ALIVE'
const GAME_WIN = 'WIN'
const gameData = await getJson('./game_config.json');

export class GameTemplate {
    gameRule = $('.gameRule');
    topic = $('.topic');
    levelBtn = $('.levelBtn');
    bingoGroph = $('#bingo');
    dadaGroph = $('#dada');
    correctSound = $('#correct')[0];
    wrongSound = $('#wrong')[0];
    firework_sound = $('#win')[0];
    fireworkContainer = $('#firework-container');
    fireworksUrl = './assets/images/fireworks.gif';
    constructor(){
        this.levelLimit = this.levelBtn.children().length;
        this.topic_explain = new Array(this.levelLimit).fill('遊戲目標');
        this.winLevelArr = [];
        this.gameData = gameData;
        this.record = {'q': []
                      , 'a': []
                      , 'result': []
                      };
        this.init(1);
    }
    init(level) {
        this.gameState = GAME_FILE;
        this.level = level;
        this.lives = this.gameData.lives;
        this.firework_sound.pause();
        this.fireworkContainer.css('display', 'none');
    }
    startGame(level) {
        if (this.gameState===GAME_ALIVE){
            return
        }
        if (this.gameState===GAME_WIN){
            this.resetGame();
        }
        this.gameState = GAME_ALIVE;
        this.getTopic();
        this.changeLevel(level);
        this.levelBtn.children().eq(this.level).addClass('active');
        this.setLives(this.gameData.lives);
    }
    
    checkAnswer(question, answer) {
        if (this.gameState !== GAME_ALIVE){
            return
        }
        this.record.q.push(question);
        this.record.a.push(answer);
        if (question === answer){
            this.correctSound.play();
            this.bingoGroph.css('display', 'block');
            this.record.result.push('O');
            setTimeout(()=>{this.bingoGroph.css('display', 'none');}, 500);
        }
        else {
            this.record.result.push('X');
            this.wrongSound.play();
            this.dadaGroph.css('display', 'block');
            this.lives -= 1;
            setLives(this.lives)
            setTimeout(()=>{this.dadaGroph.css('display', 'none');}, 500);
            this.winLevelArr.pop(level);
            this.levelBtn.children().eq(this.level - 1).removeClass('bingo');
            this.levelBtn.children().eq(this.level - 1).addClass('active');
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
        this.levelBtn.children().eq(this.level - 1).removeClass('active');
        this.levelBtn.children().eq(level - 1).addClass('active');
        this.level = level;
        this.resetGame(this.level);
    }
    
    resetGame(level){
        this.init(level);
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
    
    getTopic(){
        $(this.topic).text(this.topic_explain[this.level-1]);
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
    set_off_fireworks(){
        this.firework_sound.currentTime = 1.5;
        this.firework_sound.play();
        this.fireworkContainer.css('display', 'block');
        showFirework();
        setTimeout(()=>{this.firework_sound.pause()}, 2500);
        let count = 0;
        while (count < 2300){
            let milliseconds =  Math.floor(Math.random() * (800 - 400 + 1)) + 400;
            count += milliseconds;
            setTimeout(this.showFirework, count)
        }
        setTimeout(() => {
            this.fireworkContainer.css('display', 'none');
        }, count)
    } 
    
    showFirework() {
        for (let i = 0; i < 5; i++) {
            let width = 100 * (Math.random()*2.5);
            const fireworksElement = $('<img>');
            fireworksElement.attr('src', this.fireworksUrl);
            fireworksElement.css({
                'position': 'absolute',
                'width': `${width}px`,
                'height': 'auto',
                'left': Math.floor(Math.random() * (this.fireworkContainer.width() - width)) + 'px',
                'top': Math.floor(Math.random() * (this.fireworkContainer.height() - width * 1.5)) + 'px'
            });
            this.fireworkContainer.append(fireworksElement);
        }
        setTimeout(this.removeFirework, 1194);
    }  
    
    removeFirework() {
        for (let i = 0; i < 5; i++) {
            this.fireworkContainer.children().first().remove();
        }
    }
}


