// import * as constVarlue from './constant';

const LAST_BTN = 'lastBtn'
const START_BTN = 'startBtn'
const NEXT_BTN = 'nextBtn'
const SUBMIT_BTN = 'submitBtn'
const gameBtn = [...document.querySelectorAll(`.gameBtn *`)];
const water = document.querySelector(`.water`);
const water_scale = document.querySelector(`.water_scale`);
const water_control = document.querySelector('.water_control');
const topic = document.querySelector('.topic');
const scales = document.querySelector('.scales');
let level = 1, milliliter = 5, start = 0, end = 10, tolerance = 1;
let act = '';
let answer = getRandomNumber();


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


function backLevel() {
    if (level<=1) {
        level = 5;
    }
    else {
        level -= 1;
    }
}

function goLevel() {
    if (level>=5) {
        level = 1;
    }
    else {
        level += 1;
    }
}

function startGame() {
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
    if (milliliter === answer){
        document.getElementById('correct').play();
    }
}

function changeLevel() {
    if (level === 1){
        start = 0;
        end = 10;
        tolerance = 1;
    }
    else if (level === 2){
        start = 0;
        end = 50;
        tolerance = 5;
    }
    else if (level === 3){
        start = 0;
        end = 300;
        tolerance = 10;
    }
    else if (level === 4){
        start = 0;
        end = 1000;
        tolerance = 50;
    }
    else if (level === 5){
        start = 0;
        end = 2000;
        tolerance = 100;
    }
    resetGame();
}

function resetGame(){
    mid = (end-start)/2;
    startGame();
}

function getRandomNumber() {
    const range = Math.ceil((end - start) / tolerance);
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * (range + 1));
    } while (start + randomIndex * tolerance === 0)
    return start + randomIndex * tolerance;
  }
  