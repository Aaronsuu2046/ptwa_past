export {Game}


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
        this.record = {'q': []
                      , 'a': []
                      , 'result': []
                      };
        this.topic_explan = {1: `遊戲目標`};
        this.winLevelArr = [];

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
        this.lives = 3;
        this.setLives(this.lives);
        this.record = {'q': []
                    , 'a': []
                    , 'result': []
                    };
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
            set_off_fireworks();
            this.winLevelArr.push(this.level);
            this.gameState = GAME_WIN;
        }
        else {
            this.record.result.push('X');
            this.wrongSound.play();
            this.dadaGroph.css('display', 'block');
            this.lives -= 1;
            setLives(this.lives)
            setTimeout(()=>{
            this.dadaGroph.css('display', 'none');}, 500);
            this.winLevelArr.pop(level);
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
