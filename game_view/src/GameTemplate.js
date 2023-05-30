import * as constant from "./constant.js"
import {gameModules, svgModules} from "./module.js"


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
        $('.closeHintBtn').on('click', this.toggleHint);
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
        if (this.gameState === constant.GAME_ALIVE) return;
        if (this.gameState === constant.GAME_WIN) this.resetGame(level);
        this.gameState =  constant.GAME_ALIVE;
        this.getExplain();
        this.lives = (this.gameData[level - 1].lives) ? this.gameData[level - 1].lives : 0;
        this.setLives(this.lives);
    }
    
    checkAnswer(question, answer) {
        const result = question === answer ? constant.BINGO : constant.DADA;
        this.updateGameResult(result);
        this.getGameResult();
        if (this.gameState === constant.GAME_WIN) this.getWin();
    }

    updateGameResult(result) {
        if (result === constant.BINGO) {
            this.correctAnswer();
        } else {
            this.wrongAnswer();
            this.winLevelSet.delete(this.level);
        }
        this.recordObj.appendToRecord(constant.recordItim.RESULT, result);
        gameModules.showResultView(result);
    }

    getGameResult(){
        // juddging
        throw new Error('please define getGameResult');
    }

    getWin(){
        this.winLevelSet.add(this.level);
        parent.postMessage({ type: this.gameState }, '*');
        this.setFireworks();
    }
    
    correctAnswer(){
        throw new Error('please define correctAnswer');
    }
    wrongAnswer(){
        throw new Error('please define wrongAnswer');
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
        this.hideFirework();
        $('.overlay').css('display', 'none');
        this.startGame(level);
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
            this.hideFirework();
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

    hideFirework() {
        this.fireworkSound.pause();
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

  
export class ConnectionGame extends GameTemplate {
    constructor(gameData){
        super(gameData);
        this.gameArea = $('.gameArea');
        this.drawingArea = $('.drawingArea');
        this.correctLimit = this.getCorrectLimit();
        this.svgRect = this.drawingArea.length > 0 ? this.drawingArea[0].getBoundingClientRect() : null;
        this.isDrawing = false;
        this.line = $('.line:last')[0];
        this.drawView();
    }

    getCorrectLimit(){
        throw new Error('please return getCorrectLimit');
    }

    drawView() {
        const getDotPos = (event, parentName) => {
            const dot = $(event.target).closest(`.${parentName}`).find('.dot');
            console.log(dot);
            const recordType = parentName === constant.gameHTML.QUESTION_AREA ? constant.recordItim.QUESTION : constant.recordItim.ANSWER;
            const recordData = this.creatRecord(recordType, dot);
            this.recordObj.appendToRecord(recordType, recordData);
            if (event.type === 'touchstart') {
                mouseMoveListener(event);
            }
            const offset = dot.offset();
            const width = dot.width();
            const height = dot.height();
            const x = (offset.left + width / 2);
            const y = (offset.top + height / 2);
            return { x, y };
        }
        const mouseDownListener = (event) => {
            event.preventDefault();
            const pos = getDotPos(event, constant.gameHTML.QUESTION_AREA);
            if ($(this.line).hasClass('wrongLine')){
                $(this.line).removeClass('wrongLine');
            }
            this.line.setAttribute("x1", pos.x);
            this.line.setAttribute("y1", pos.y);
            this.line.setAttribute("x2", pos.x);
            this.line.setAttribute("y2", pos.y);
            this.isDrawing = true;
        }
        
        const mouseMoveListener = (event) => {
            event.preventDefault();
            if (!this.isDrawing) return;
            const { offsetX, offsetY } = event.touches ? event.touches[0] : event;
            this.line.setAttribute("x2", offsetX);
            this.line.setAttribute("y2", offsetY + 5);
        }
    
        const mouseupListener = (event) => {
            if (!this.isDrawing) return;
            this.isDrawing = false;
            const pos = getDotPos(event, constant.gameHTML.ANSWER_AREA);
            this.line.setAttribute("x2", pos.x);
            this.line.setAttribute("y2", pos.y);
            const lastQuestion = this.recordObj.getLastRecord(constant.recordItim.QUESTION);
            const lastAnswer = this.recordObj.getLastRecord(constant.recordItim.ANSWER);
            this.checkAnswer(lastQuestion, lastAnswer);
        };
        this.gameArea.on("mousedown", (e) => {
            if (checkQuestionArea(e)){
                mouseDownListener(e);
            }
        });
        this.drawingArea.on("mousemove", mouseMoveListener);
        this.gameArea.on("mouseup", (e) => {
            if (checkAnswerArea(e)){
                mouseupListener(e);
            }
        });
        const checkQuestionArea = (e) => {
            return $(e.target).closest(`.${constant.gameHTML.QUESTION_AREA}`).length > 0;
        };

        const checkAnswerArea = (e) => {
            return $(e.target).closest(`.${constant.gameHTML.ANSWER_AREA}`).length > 0;
        };
    };

    creatRecord(recordType, dot){
        throw new Error('please return creatRecord');
    }

    startGame(level) {
        super.startGame(level);
        this.line = $(svgModules.getNewLine()).addClass('line')[0];
        this.drawingArea.html($(this.line));
        this.recordObj.initRecord();
    }

    correctAnswer(){
        $('.line:last').addClass('correctLine');
        this.line = $(svgModules.getNewLine()).addClass('line')[0];
        this.drawingArea.append($(this.line));
    }

    wrongAnswer(){
        this.setLives(this.lives-1);
        $('.line:last').addClass('wrongLine');
    }

    getGameResult(){
        const correctRecords = this.recordObj.getRecord(constant.recordItim.ANSWER).filter((_, i) => this.recordObj.getRecord(constant.recordItim.RESULT)[i] === 'O');
        const correctRecordSet = new Set(correctRecords);
        if (correctRecordSet.size >= this.correctLimit) {
            this.gameState = constant.GAME_WIN;
        }
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

    // TODO how to use
    generateDot(...args) {
        let targetElement;
        const dotDiv = $('<div>').addClass('dot');
      
        if (typeof args[0] === 'object') {
            const argObject = args[0];
            Object.entries(argObject).forEach(([className, parent]) => {
                const elements = $(className);
                elements.each(function() {
                    const clonedElement = $(this).clone();
                    const parentElement = $(parent);
                    parentElement.append(clonedElement);
                    dotDiv.append(clonedElement);
                });
                targetElement = parent;
            });
        } else {
            const classNames = args;
            classNames.forEach(className => {
                    const elements = $(className);
                    elements.each(function() {
                    dotDiv.append($(this).clone());
                });
                targetElement = classNames.length === 1 ? '.gameArea' : className;
            });
        }
      
        $(targetElement).append(dotDiv);
    }
  }


class GameRecord {
    constructor() { 
        this.initRecord();
    }

    initRecord(){
        this.record = {
            [constant.recordItim.QUESTION]: [],
            [constant.recordItim.ANSWER]: [],
            [constant.recordItim.RESULT]: []
        };
    }
  
    getRecord(recordType){
        return this.record[recordType];
    }
    getLastRecord(recordType){
        return this.record[recordType].slice(-1)[0];
    }
    
    appendToRecord(recordType, value) {
        this.record[recordType].push(value);
    }

    loadRecord() {
        // Set download file name
        const filename = "遊玩紀錄.csv";
        let csvContent = "Times,Question,Answer,Result\n"; // Add CSV headers
    
        let count = 0;
        const questionArr = this.getRecord(constant.recordItim.QUESTION);
        const answerArr = this.getRecord(constant.recordItim.ANSWER);
        const resultArr = this.getRecord(constant.recordItim.RESULT);
        for (let i = 0; i < this.getRecord(constant.recordItim.ANSWER).length; i++) {
            csvContent += `${i + 1},${questionArr[i]},${answerArr[i]},${resultArr[i]}\n`;
            if (resultArr[i] === constant.BINGO) count++;
        }
        csvContent += `\nCorrectRate,${(count / resultArr.length) * 100}%\n`;
    
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
}
