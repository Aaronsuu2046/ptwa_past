// import * as constVarlue from './constant';

const gameBtn = [...document.querySelectorAll(`.gameBtn *`)];
const water = document.querySelector(`.water`);
const water_scale = document.querySelector(`.water_scale`);
const water_control = document.querySelector('.water_control');
const topic = document.querySelector('.topic');
let level = 1, milliliter = 5, start = 1, end = 10, tolerance = 1;
let act = '';
let answer = Math.floor(Math.random() * end)+start;


topic.textContent = answer;

gameBtn.forEach((item) => {
    item.addEventListener('click', (e) => {
        let className = e.target.parentElement.classList.value;
        if (className.includes(`levelBtn`)){
            level = e.target.textContent;
        }
        else{
            act = e.target.textContent;
        }
    });
});

water_control.addEventListener('wheel', (e) => {
    if (milliliter>10){
        return
    }
    if (e.deltaY<0 && milliliter<10){
        milliliter += 1;
    }
    else if (e.deltaY > 0 && milliliter>0){
        milliliter -= 1;
    }
    water_scale.style.transform = `translate(0%, ${100-milliliter*10}%)`;
    water.style.height = `${milliliter}0%`
    water_scale.textContent = `${milliliter} ml`
});

console.log(act);
if (milliliter === topic){
    document.getElementById('correct').play();
    console.log('win');
}
