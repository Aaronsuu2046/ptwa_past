// import * as constVarlue from './constant';

const GAME_FILE = 'FILE'
const GAME_ALIVE = 'ALIVE'
const GAME_WIN = 'WIN'
const LAST_BTN = 'lastBtn'
const START_BTN = 'startBtn'
const NEXT_BTN = 'nextBtn'
const HINT_BTN = 'hintBtn'
const canvas = document.querySelector(`canvas`);
const gameBtn = [...document.querySelectorAll(`.gameBtn *`)];
const gameRule = document.querySelector('.gameRule');
const topic = document.querySelector('.topic');
const levelLimit = document.querySelector('.levelBtn').children.length;
const firework_sound = document.getElementById('win');
const fireworkContainer = document.querySelector('#firework-container');
const fireworksUrl = './assets/images/fireworks.gif';
let level = 0;
let act = '';
let gameState = GAME_FILE;
let winLevelArr = [];
let topic_explan = {1: `毫升連公升`
                    , 2: `公升連毫升`
                    , 3: `毫公升連連看`,}


gameBtn.forEach((item) => {
    item.addEventListener('click', (e) => {
        let className = e.target.parentElement.classList.value;
        if (className.includes(`levelBtn`)){
            level = parseInt(e.target.textContent);
            changeLevel();
        }
        else{
            act = e.target.id;
            if (act === LAST_BTN){
                backLevel();
            }
            else if (act === NEXT_BTN){
                goLevel();
            }
            else if (act === START_BTN){
                startGame();
            }
            else if (act === HINT_BTN){
                showHint();
            }
        }
    });
});

function backLevel() {
    if (level<=1) {
        level = levelLimit;
    }
    else {
        level -= 1;
    }
    changeLevel();
}

function goLevel() {
    if (level>=levelLimit) {
        level = 1;
    }
    else {
        level += 1;
    }
    changeLevel();
}

function startGame() {
    if (gameState===GAME_ALIVE){
        return
    }
    if (level===0){
        level = 1;
        $(gameBtn[0]).addClass('active');
    }
    gameState = GAME_ALIVE;
    gameRule.style.display = 'none';
    getTopic();
}

function checkAnswer() {
    if (gameState !== GAME_ALIVE){
        return
    }
    if (win===true){
        gameState = GAME_WIN;
        winLevelArr.push(level);
        document.getElementById('correct').play();
        document.getElementById('bingo').style.display = 'block';
        set_off_fireworks();
        setTimeout(()=>{document.getElementById('bingo').style.display = 'none';}, 2500);
    }
    else {
        document.getElementById('wrong').play();
        document.getElementById('dada').style.display = 'block';
        setTimeout(()=>{document.getElementById('dada').style.display = 'none';}, 2500);
        $(gameBtn[level-1]).removeClass('bingo');
        winLevelArr.pop(level);
        $(gameBtn[level-1]).addClass('active');}
}

function changeLevel() {
    if (level === 1){
    }
    else if (level === 2){
    }
    else if (level === 3){
    }
    else if (level === 4){
    }
    else if (level === 5){
    }
    resetGame();
}

function resetGame(){
    gameState = GAME_FILE;
    gameBtn.forEach((item, index)=>{
        $(item).removeClass('active');
        if ($.inArray(index+1, winLevelArr) !== -1) {
            $(item).addClass('bingo');
        }
        else if (index+1 === level){
            $(item).addClass('active');
        }
    })
    gameRule.style.display = 'block'
}

function showHint(){

}

function getTopic(){
    topic.textContent = topic_explan[level];
}
function set_off_fireworks(){
    firework_sound.currentTime = 1.5;
    firework_sound.play();
    fireworkContainer.style.display = 'block';
    showFirework();
    setTimeout(()=>{firework_sound.pause()}, 3000);
    let count = 0;
    while (count < 2500){
        let milliseconds =  Math.floor(Math.random() * (800 - 400 + 1)) + 400;
        count += milliseconds;
        setTimeout(showFirework, count)
    }
    setTimeout(() => {
        fireworkContainer.style.display = 'none';
    }, count)
} 

function showFirework() {
    for (let i = 0; i < 5; i++) {
        let width = 100 * (Math.random()*2.5);
        const fireworksElement = document.createElement('img');
        fireworksElement.src = fireworksUrl;
        fireworksElement.style.position = 'absolute';
        fireworksElement.style.width = `${width}px`;
        fireworksElement.style.height = 'auto';
        fireworksElement.style.left = Math.floor(Math.random() * (fireworkContainer.clientWidth-width)) + 'px';
        fireworksElement.style.top = Math.floor(Math.random() * (fireworkContainer.clientHeight-width*1.5)) + 'px';
        fireworkContainer.appendChild(fireworksElement);
    }
    setTimeout(removeFirework, 1194);
}  

function removeFirework() {
    for (let i = 0; i < 5; i++) {
        fireworkContainer.removeChild(fireworkContainer.children[0]);
	}
}

function getRandomNumber() {
    const range = Math.ceil((end - start) / tolerance);
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * (range + 1));
    } while (start + randomIndex * tolerance === 0)
    return start + randomIndex * tolerance;
  }
  