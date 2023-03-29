export {Game}
import {getRandomNumber, reorder} from './function.js'


// state
const GAME_FILE = 'FILE'
const GAME_ALIVE = 'ALIVE'
const GAME_WIN = 'WIN'


// set firework
const firework_sound = $('#win')[0];
const fireworkContainer = $('#firework-container');
const fireworksUrl = './assets/images/fireworks.gif';

class Game {
    gameRule = $('.gameRule');
    topic = $('.topic');
    levelBtn = $('.levelBtn');
    bingoGroph = $('#bingo');
    dadaGroph = $('#dada');
    correctSound = $('#correct')[0];
    wrongSound = $('#wrong')[0];
    levelLimit = this.levelBtn.children().length;
    constructor(){
        this.gameState = GAME_FILE;
        this.level = 0;
        this.lives = 3;
        this.record = {'Q': []
                      , 'A': []
                      , 'result': []
                      };
        this.topic_explan = {1: `選擇直角、鈍角和銳角`};
        this.winLevelArr = [];
        this.angle = 90;
    }
    startGame(level) {
        if (this.gameState===GAME_ALIVE){
            return
        }
        if (this.gameState===GAME_WIN){
            this.resetGame();
        }
        if (this.level===0){
            this.level = 1;
            this.levelBtn.children().eq(this.level - 1).addClass('active');
        }
        this.changeLevel(level);
        this.gameState = GAME_ALIVE;
        this.gameRule.css('display', 'none');
        this.getTopic();
        this.setLives(this.lives);
        this.addAngle();
        reorder($('.angles'));
    }
    
    checkAnswer(angle) {
        if (this.gameState !== GAME_ALIVE){
            return
        }
        const answer = this.angle > 90 ? "鈍角" : this.angle === 90 ? "直角" : "銳角"
        this.record.Q.push(this.angle);
        this.record.A.push(answer);
        if (answer === angle){
            this.correctSound.play();
            this.bingoGroph.css('display', 'block');
            this.record.result.push('Ｏ');
            setTimeout(()=>{this.bingoGroph.css('display', 'none');}, 500);
            set_off_fireworks();
            this.winLevelArr.push(this.level);
            this.gameState = GAME_WIN;
        }
        else {
            this.record.result.push('Ｘ');
            this.wrongSound.play();
            this.dadaGroph.css('display', 'block');
            setTimeout(()=>{this.dadaGroph.css('display', 'none');}, 500);
            this.winLevelArr.pop(this.level);
            this.levelBtn.children().eq(this.level - 1).removeClass('bingo');
            this.levelBtn.children().eq(this.level - 1).addClass('active');
        }
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
        this.resetGame();
    }
    
    resetGame(){
        this.gameState = GAME_FILE;
        firework_sound.pause();
        fireworkContainer.css('display', 'none');
        this.levelBtn.children().each((index, child) => {
            const $child = $(child);
            $child.removeClass('active');

            if ($.inArray(index + 1, this.winLevelArr) !== -1) {
                $child.addClass('bingo');
            } else if (index + 1 === this.level) {
                $child.addClass('active');
            }
        })

        this.gameRule.css('display', 'block');
    }
    
    loadRecord(){
        // 設定下載檔案名稱
        const filename = `遊玩紀錄.txt `;
        let textContent = `遊玩紀錄：
        `;
        
        for (let i=0; i<this.record.A.length; i++) {
            textContent += `\t\n第 ${i+1} 次回答，Q: ${this.record.Q[i]} 度，A: ${this.record.A[i]}，結果為 ${this.record.result[i]}`
    
        }
        // 建立一個 Blob 物件
        const blob = new Blob([textContent], {type: 'text/plain'});
    
        // 建立一個下載連結
        const url = URL.createObjectURL(blob);
    
        // 建立一個 <a> 元素，並設定 href 屬性和 download 屬性
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
    
        // 模擬點擊 <a> 元素，開始下載檔案
        a.click();
    
        // 釋放 URL 物件
        URL.revokeObjectURL(url);
    }
    showHint(){
        if (this.lives > 0)return
        overlay.toggle();
    }
    
    getTopic(){
        $(this.topic).text(this.topic_explan[this.level]);
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
    }
    addAngle() {
        const x = $('.question').width()/2;
        const y = $('.question').height()/2;
        this.angle = getRandomNumber(15, 165, 10);
        const rotationAngle = 0;
        const angleGraphic = createAngle(this.angle, rotationAngle, x, y);
        const fanShape = createFanShape(x, y, 30, 360-this.angle, 0)
        $('.question').html(angleGraphic);
        $('.question').append(fanShape);
    }
}

function createAngle(angle, rotationAngle, centerX, centerY) {
    const lineLength = 200;
    angle *= Math.PI / 180;
    rotationAngle *= Math.PI / 180;
    const xA = centerX + lineLength * Math.cos(rotationAngle);
    const yA = centerY - lineLength * Math.sin(rotationAngle);
    const xB = centerX + lineLength * Math.cos(rotationAngle + angle);
    const yB = centerY - lineLength * Math.sin(rotationAngle + angle);

    return `
      <line x1="${centerX}" y1="${centerY}" x2="${xA}" y2="${yA}" stroke="black" stroke-width="4" />
      <line x1="${centerX}" y1="${centerY}" x2="${xB}" y2="${yB}" stroke="black" stroke-width="4" />
    `;
}

function createFanShape(cx, cy, radius, startAngle, endAngle) {
    startAngle *= Math.PI / 180;
    endAngle *= Math.PI / 180;
    const start = {
        x: cx + Math.cos(startAngle) * radius,
        y: cy + Math.sin(startAngle) * radius
    };
    const end = {
        x: cx + Math.cos(endAngle) * radius,
        y: cy + Math.sin(endAngle) * radius
    };

    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "fanShape");
    path.setAttribute("fill", "lightblue");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("d", `
        M ${cx} ${cy}
        L ${start.x} ${start.y}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
        Z
    `);
    return path
}

function set_off_fireworks(){
    firework_sound.currentTime = 1.5;
    firework_sound.play();
    fireworkContainer.css('display', 'block');
    showFirework();
    setTimeout(()=>{firework_sound.pause()}, 2500);
    let count = 0;
    while (count < 2300){
        let milliseconds =  Math.floor(Math.random() * (800 - 400 + 1)) + 400;
        count += milliseconds;
        setTimeout(showFirework, count)
    }
    setTimeout(() => {
        fireworkContainer.css('display', 'none');
    }, count)
} 

function showFirework() {
    for (let i = 0; i < 5; i++) {
        let width = 100 * (Math.random()*2.5);
        const fireworksElement = $('<img>');
        fireworksElement.attr('src', fireworksUrl);
        fireworksElement.css({
            'position': 'absolute',
            'width': `${width}px`,
            'height': 'auto',
            'left': Math.floor(Math.random() * (fireworkContainer.width() - width)) + 'px',
            'top': Math.floor(Math.random() * (fireworkContainer.height() - width * 1.5)) + 'px'
        });
        fireworkContainer.append(fireworksElement);
    }
    setTimeout(removeFirework, 1194);
}  

function removeFirework() {
    for (let i = 0; i < 5; i++) {
        fireworkContainer.children().first().remove();
    }
}
