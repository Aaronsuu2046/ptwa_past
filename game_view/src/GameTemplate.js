import * as constant from "./constant.js"
import * as module from "./module.js"


export class GameTemplate {
    constructor(gameData){
        this.generateAudioElements();
        this.generateResultElements();
        this.generateFireworkElements();
        this.generateBasicElements();
        this.explain = $('.explain');
        this.levelLimit = gameData.length;
        this.topic_explain = new Array(this.levelLimit).fill('遊戲目標');
        this.winLevelSet = new Set();
        this.gameData = gameData;
        this.record = {'q': []
                      , 'a': []
                      , 'result': []
                      };
        this.gameState = constant.GAME_FILE;
        this.level = 1;
    }
    startGame(level) {
        this.gameState =  constant.GAME_ALIVE;
        this.getExplain();
        this.lives = this.gameData[level-1].lives;
        this.setLives(this.lives);
    }
    
    checkAnswer() {
        if (arguments.length === 2){
            const question = arguments[0];
            const answer = arguments[1];
            if (!question || !answer){return}
            if (question === answer){
                this.correctAnswer();
                this.appendToRecordResult("O");
                module.showResultView("O");
            }
            else {
                this.wrongAnswer();
                this.appendToRecordResult("X");
                module.showResultView("X");
                this.winLevelSet.delete(this.level);
            }
        } 
        this.getGameResult();
    }
    getGameResult(){
        // juddging
    }
    getWin(){
        this.winLevelSet.add(this.level);
        this.gameState = constant.GAME_WIN;
        parent.postMessage({ type: this.gameState }, '*');
        this.set_off_fireworks();
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
        this.gameState = constant.GAME_FILE;
        this.removeResultView();
        this.startGame(level);
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

    correctAnswer(){
        // define content
    }
    wrongAnswer(){
        // define content
    }
    appendToRecordQ(question){
        this.record.q.push(question);
    }
    appendToRecordA(answer){
        this.record.a.push(answer);
    }
    appendToRecordResult(result){
        this.record.result.push(result);
    }
    resetRecord(){
        this.record = {
            'q': []
            , 'a': []
            , 'result': []
        };
    }
    toggleHint(){
        if (this.lives > 0)return
        $('.overlay').toggle();
    }
    
    getExplain(){
        this.explain.text(`${this.topic_explain[this.level-1]}`);
    }
    
    setLives(lives){
        const $lives = $('.lives');
        const count = lives - $lives.children().length;
        if (count === 0 || lives < 0) return
        this.lives = lives;
        if (count < 0) {
            $('.lives > :last-child').remove();
            return
        }
        for (let i = 0; i <count; i++){
            const livesImg = $('<img>')
            .attr('src', '../../../assets/images/game_images/lives.svg')
            .attr('alt', 'lives image')
            .attr('width', '60')
            .attr('height', 'auto')
            .css('margin-right', '-30px');
            $lives.append(livesImg);
        }
    }
    
    generateAudioElements() {
        let audioHTML = `
          <div class="audio">
            <audio id="correct" src="../../../assets/sounds/game_sounds/correct_sound_effect.mp3"></audio>
            <audio id="wrong" src="../../../assets/sounds/game_sounds/wrong_sound_effect.mp3"></audio>
            <audio id="win" src="../../../assets/sounds/game_sounds/applause_fireworks.mp3" duration="3"></audio>
          </div>
        `;
        $('body').append(audioHTML);
        this.firework_sound = $('#win')[0];
    }
    generateResultElements() {
        let resultHTML = `
          <div class="result">
            <h1 id="bingo">Ｏ</h1>
            <h1 id="dada">Ｘ</h1>
          </div>
        `;
        $('body').append(resultHTML);
    }
    generateFireworkElements() {
        let fireworkHTML = `
          <div id="firework-container"></div>
        `;
        this.fireworkContainer = $(fireworkHTML).css({
          "position": "absolute",
          "display": "none",
          "z-index": "100",
          "top": "15%",
          "left": "5%",
          "width": "90%",
          "height": "85%"
        });
        $('body').append(this.fireworkContainer);
    }
    generateBasicElements() {
        const basic = `
            <div class="explain"></div>
            <div class="lives"></div>
        `;

        const closeBtn = `
            <span class="closeHintBtn">Ｘ</span>
        `;

        $('body').prepend($(basic));
        $('.overlay').append($(closeBtn));
    }
      
    removeResultView = () =>{
        this.firework_sound.pause();
        this.fireworkContainer.css('display', 'none');
    
    }
    set_off_fireworks = () => {
        this.firework_sound.currentTime = 1.5;
        this.firework_sound.play();
        this.fireworkContainer.css('display', 'block');
        this.showFirework();
      
        setTimeout(() => { this.firework_sound.pause() }, 2500);
        let count = 0;
        while (count < 2300) {
            let milliseconds = Math.floor(Math.random() * (800 - 400 + 1)) + 400;
            count += milliseconds;
            setTimeout(this.showFirework, count);
        }
      
        setTimeout(() => {
            this.fireworkContainer.css('display', 'none');
            }, count);
      }      
    
    showFirework = () => {
        const fireworksUrl = '../../../assets/images/game_images/fireworks.gif';
        const fireworksArea = {"width": this.fireworkContainer.width()
                                , "height": this.fireworkContainer.height()};
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
