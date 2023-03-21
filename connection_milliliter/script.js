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
const leftContainer = document.querySelector('.left');
const rightContainer = document.querySelector('.right');
const milliliterContainer = document.querySelector('.milliliter_container');
const litersContainer = document.querySelector('.right>.water_container');
let i = 0;
while (i<4){
    const clonedMilliliterContainer = milliliterContainer.cloneNode(true);
    const clonedLitersContainer = litersContainer.cloneNode(true);
    leftContainer.appendChild(clonedMilliliterContainer);
    rightContainer.appendChild(clonedLitersContainer);
    i++;
}
const leftWater = [...document.querySelectorAll(`.milliliter_container .water_container .water`)];
const rightWater = [...document.querySelectorAll(`.right .water_container .water`)];
const milliliterDots = [...document.querySelectorAll(`.milliliterDots li`)];
const literDots = [...document.querySelectorAll(`.literDots li`)];

const firework_sound = document.getElementById('win');
const fireworkContainer = document.querySelector('#firework-container');
const fireworksUrl = './assets/images/fireworks.gif';
let level = 0;
let act = '';
let gameState = GAME_FILE;
let winLevelArr = [];
let topic_explan = {1: `毫升連公升`
                    , 2: `公升連毫升`
                    , 3: `毫公升連連看`,};
let liters, milliliters = [];

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
    liters = getRandomNumber(0, 2000, 100, 5);
    milliliters = [];
    shuffle([...liters]).forEach((item, index) =>{
        if (item > 1000){
            milliliters.push(1000);
            milliliters.push(item-1000);
        }
        else{
            milliliters.push(0);
            milliliters.push(item);
        }
        $(milliliterDots[index]).addClass(`${item}`);
    })

    rightWater.forEach((water, index)=>{
        const liter = liters[index];
        water.style.height = `${((liter)/ 2000)*100}%`;
        $(literDots[index]).addClass(`${liter}`)
    })
    leftWater.forEach((water, inedx)=>{
        water.style.height = `${((milliliters[inedx])/ 1000)*100}%`;
    })
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

window.onload = function () {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
  
    let drawing = false;
    let startPoint = { x: 0, y: 0 };
  
    function onMouseDown(e) {
      drawing = true;
      startPoint.x = e.clientX - canvas.getBoundingClientRect().left;
      startPoint.y = e.clientY - canvas.getBoundingClientRect().top;
    }
  
    function onMouseMove(e) {
      if (!drawing) return;
      const x = e.clientX - canvas.getBoundingClientRect().left;
      const y = e.clientY - canvas.getBoundingClientRect().top;
      drawLine(startPoint.x, startPoint.y, x, y);
    }
  
    function onMouseUp(e) {
      drawing = false;
    }
  
    function drawLine(x1, y1, x2, y2) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);
};
  

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

function getRandomNumber(start, end, tolerance, times=1) {
    let result = new Set();
    while(result.size < times) {
        const range = Math.ceil((end - start) / tolerance);
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * (range + 1));
        } while (start + randomIndex * tolerance === 0)
        if (times === 1){
            return start + randomIndex * tolerance;
        }
        const number = start + randomIndex * tolerance;
        result.add(number)
    }
    return [...result]
  }

  function shuffle(originArray){
    // Fisher-Yates shuffle algorithm
    let array = [...originArray]
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
  