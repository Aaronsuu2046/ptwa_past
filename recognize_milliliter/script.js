// import * as constVarlue from './constant';

const GAME_FILE = 'FILE'
const GAME_ALIVE = 'ALIVE'
const GAME_WIN = 'WIN'
const LAST_BTN = 'lastBtn'
const START_BTN = 'startBtn'
const NEXT_BTN = 'nextBtn'
const SUBMIT_BTN = 'submitBtn'
const canvas = document.querySelector(`canvas`);
const gameBtn = [...document.querySelectorAll(`.gameBtn *`)];
const water = document.querySelector(`.water`);
const water_scale = document.querySelector(`.water_scale`);
const water_control = document.querySelector('.water_control');
const topic = document.querySelector('.topic');
const scales = document.querySelector('.scales');
const gameRule = document.querySelector('.gameRule');
const firework_sound = document.getElementById('win');
const fireworkContainer = document.querySelector('#firework-container');
const fireworksUrl = './assets/images/fireworks.gif';
let level = 0, milliliter = 5, start = 0, end = 10, tolerance = 1, delay = 40;
let act = '';
let gameState = GAME_FILE;
let answer = getRandomNumber();
let winArr = [];


topic.textContent = answer;

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
            else if (act === SUBMIT_BTN){
                checkAnswer();
            }
        }
    });
});

water_control.addEventListener('wheel', (e) => {
    if (milliliter>end){
        return
    }
    if (e.deltaY<0 && milliliter<end){
        milliliter += tolerance;
    }
    else if (e.deltaY>0 && milliliter>start){
        milliliter -= tolerance;
    }
    water_scale.style.transform = `translate(0%, ${100-((start+milliliter)/end)*100}%)`;
    water.style.height = `${((start+milliliter)/end)*100}%`;
    water_scale.textContent = `${milliliter}`;
});

let active = false;
let lastTouchY, currentTouchY = null;

water_control.addEventListener('touchstart', (e) => {
    lastTouchY = e.touches[0].clientY;
    active = true;
});

water_control.addEventListener('touchmove', (e) => {
    if (active) {
        if (milliliter>end){
            return
        }
        currentTouchY = e.touches[0].clientY;
        if (lastTouchY !== null) {
            const deltaY = currentTouchY - lastTouchY;
            if (deltaY < -delay && milliliter<end) {
                // moved up
                milliliter += tolerance;
                lastTouchY = currentTouchY;
        } else if (deltaY > delay && milliliter>start) {
                // moved down
                milliliter -= tolerance;
                lastTouchY = currentTouchY;
            }
        }

        water_scale.style.transform = `translate(0%, ${100-((start+milliliter)/end)*100}%)`;
        water.style.height = `${((start+milliliter)/end)*100}%`;
        water_scale.textContent = `${milliliter}`;
        }
});

water_control.addEventListener('touchend', () => {
    active = false;
});

function backLevel() {
    if (level<=1) {
        level = 5;
    }
    else {
        level -= 1;
    }
    changeLevel();
}

function goLevel() {
    if (level>=5) {
        level = 1;
    }
    else {
        level += 1;
    }
    changeLevel();
}

function startGame() {
    if (gameState!==GAME_FILE){
        return
    }
    if (level===0){
        level = 1;
        $(gameBtn[0]).addClass('active');
    }
    gameState = GAME_ALIVE;
    gameRule.style.display = 'none';
    mid = (end-start)/2;
    scales.querySelector('.top').textContent=end;
    scales.querySelector('.mid').textContent=mid;
    scales.querySelector('.bottom').textContent=start;
    water_scale.textContent = mid;
    milliliter = mid;
    water_scale.style.transform = `translate(0%, ${100-((start+milliliter)/end)*100}%)`;
    water.style.height = `${((start+milliliter)/end)*100}%`;
    answer = getRandomNumber();
    topic.textContent = answer;
}

function checkAnswer() {
    if (gameState !== GAME_ALIVE){
        return
    }
    if (milliliter === answer){
        gameState = GAME_WIN;
        winArr.push(level);
        document.getElementById('correct').play();
        document.getElementById('bingo').style.display = 'block';
        set_off_fireworks();
        setTimeout(()=>{document.getElementById('bingo').style.display = 'none';}, 2500);
    }
    else {
        document.getElementById('wrong').play();
        document.getElementById('dada').style.display = 'block';
        setTimeout(()=>{document.getElementById('dada').style.display = 'none';}, 2500);
    }
}

function changeLevel() {
    if (level === 1){
        delay = 40;
        end = 10;
        tolerance = 1;
    }
    else if (level === 2){
        delay = 40;
        end = 50;
        tolerance = 5;
    }
    else if (level === 3){
        delay = 10;
        end = 300;
        tolerance = 10;
    }
    else if (level === 4){
        delay = 20;
        end = 1000;
        tolerance = 50;
    }
    else if (level === 5){
        delay = 20;
        end = 2000;
        tolerance = 100;
    }
    resetGame();
}

function resetGame(){
    gameState = GAME_FILE;
    gameBtn.forEach((item, index)=>{
        $(item).removeClass('active');
        if ($.inArray(index+1, winArr) !== -1) {
            $(item).addClass('bingo');
        }
        else if (index+1 === level){
            $(item).addClass('active');
        }
    })
    gameRule.style.display = 'block'
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
  