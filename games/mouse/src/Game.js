import {getGameConfig, getRandomNumberArr, randomNumber} from './function.js'
export {Game}


// state
const GAME_FILE = 'FILE'
const GAME_ALIVE = 'ALIVE'
const GAME_WIN = 'WIN'

// set firework
const firework_sound = $('#win')[0];
const fireworkContainer = $('#firework-container');
const fireworksUrl = './assets/images/fireworks.gif';
const gameData = await getGameConfig();

let i = 1;
while (i<gameData.length){
    i++;
    const level = document.querySelector('.level').cloneNode(true);
    level.textContent = i;
    document.querySelector('.levelBtn').appendChild(level);
}


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
        this.gameData = gameData;
        this.gameArea = $('.game_area')
        this.fishArea = $('.fishArea')
        this.level = 1;
        this.lives = 3;
        this.record = {'q': []
                        , 'a': []
                        , 'result': []
                      };
        this.winLevelArr = [];
        this.topic_explan = [];
        this.score = 0;
        this.time = $('.time');
        $(this.gameData).each((index, value)=>{
            this.topic_explan.push(this.gameData[index].explain)
        })
        this.gameArea.on('mousemove touchmove', (e) => {
            if (this.timeCount <= 0){
                return false;
            }
            const mouseX = e.pageX || e.originalEvent.touches[0].pageX;
            const mouseY = e.pageY || e.originalEvent.touches[0].pageY;
            const player = $('img[data-name="player"]');
            const playerWidth = player.width();
            const playerHeight = player.height();
            const playerLeft = mouseX - playerWidth / 2;
            const playerTop = mouseY - playerHeight * 1.5;
            const gameAreaWidth = this.gameArea.width();
            const gameAreaHeight = this.gameArea.height();
          
            const checkOutOfBounds = (value, min, max) => {
              return value < min ? min : (value + playerWidth > max ? max - playerWidth : value);
            };
          
            player.css({
              'position': 'absolute',
              'left': checkOutOfBounds(playerLeft, 0, gameAreaWidth),
              'top': checkOutOfBounds(playerTop, 0, gameAreaHeight),
            });
            this.checkCollision();
          });
    }

    startGame(level) {
        if (this.gameState===GAME_ALIVE){
            return
        }
        if (this.gameState===GAME_WIN){
            this.resetGame(level-1);
        }
        this.level = level;
        this.levelBtn.children().eq(this.level-1).addClass('active');
        this.gameState = GAME_ALIVE;
        this.getTopic();
        this.lives = 3;
        this.setLives(this.lives);
        this.record = {'q': []
                    , 'a': []
                    , 'result': []
                    };
        
        this.timeCount = this.gameData[this.level-1].countDown;
        this.time.text(this.timeCount)
        this.fishArea.html("");
        this.addFish(5);
        this.stopCountID = setInterval(()=>{this.countDown()}, 1000);
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
        this.resetGame(this.level);
    }
    
    resetGame(level){
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
        this.startGame(level);

    }
    
    countDown() {
        if (this.timeCount <= 0){
            clearInterval(this.stopCountID);
            return false;
        }
        this.timeCount -= 1;
        this.time.text(this.timeCount);
    }
    checkCollision(){
        const fish1s = $('img[data-name="fish1"]');
        const fish2s = $('img[data-name="fish2"]');

        this.checkFish(fish1s, "fish1");
        this.checkFish(fish2s, "fish2");
    }

    checkFish(fishArray, fishName) {
        const player = $('img[data-name="player"]');
        fishArray.each((index, fish) => {
            const $fish = $(fish);
            const overlap = !(
              player.offset().left + player.width() < $fish.offset().left ||
              player.offset().left > $fish.offset().left + $fish.width() ||
              player.offset().top + player.height() < $fish.offset().top ||
              player.offset().top > $fish.offset().top + $fish.height()
            );
            if (!overlap) {
                return true;
            }
            if (fishName === "fish1"){
                this.score += 1;
                $fish.remove();
                this.addFish(1);
                $('.score').text(this.score);
            }
            if (fishName === "fish2"){
                this.lives -= 1;
                this.setLives(this.lives)
            }
        });
    }

    addFish(times) {
        for (let i = 0; i < times; i++){
            const fish = this.createFish();
            this.fishArea.append(fish)
            this.swimming(fish);
        }
    }

    createFish(){
        let imgURL = ["./assets/images/fish1.gif"]
        let fishName = ["fish1"];
        if (this.gameData[this.level-1].q === "dodge"){
            imgURL = ["./assets/images/fish2.gif"]
            fishName = ["fish2"];
        }
        else if (this.gameData[this.level-1].q === "mix"){
            imgURL.push("./assets/images/fish2.gif")
            fishName = ["fish1", "fish2"];
        }
        const fishElement = $('<img>');
        const fishNumber = randomNumber(0, imgURL.length);
        fishElement.attr('src', imgURL[fishNumber]);
        const width = randomNumber(100, 200);
        fishElement
            .css({
                'position': 'absolute',
                'width': `${width}px`,
                'height': 'auto',
                'left':  `${this.fishArea.width()+randomNumber(100, 1000)}px`,
                'top': randomNumber(0, this.fishArea.height()-width) + 'px'
            })
            .attr({
                'data-speed': this.gameData[this.level-1].speed
                ,'data-name': fishName[fishNumber]
            });
        return fishElement;
    }

    swimming = (fish) => {
        const screenWidth = this.fishArea.width();
        const screenHeight = this.fishArea.height();
        const imgWidth = fish.width();
        const animateTime = 8000 / fish.data('speed');
        const currentTop = parseInt(fish.css('top'));

        fish.animate({
            left: -imgWidth
            , top: `${0 + randomNumber(0, screenHeight)}px`
        }, animateTime, 'linear', () => {
            const width = randomNumber(100, 200);
            fish.css({
                'left': screenWidth + width + randomNumber(0, 500)
                , 'width': `${width}px`
                , 'top': randomNumber(0, screenHeight-fish.height()) + 'px'
            });
            this.swimming(fish);
        });

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
        $(this.topic).text(this.topic_explan[this.level-1]);
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
            .attr('src', './assets/images/heart.png')
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
