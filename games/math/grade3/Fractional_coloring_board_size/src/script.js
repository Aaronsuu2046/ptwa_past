import {startBtnHandler, game} from './Handler.js';


const levelsArea = $(`.levelBtn`);
const optionsArea = $(`.optionsBtn`);
const closeHintBtn = $(`.hintContainer .closeHintBtn`);
const jumpBtn = $('.jumpBtn');
const comparisonSymbol = $('.answerDisplay');

levelsArea.on('click', (e) => {
    const level = parseInt(e.target.id);
    $(e.target).addClass('active');
    game.changeLevel(level);
})

optionsArea.on('click', (e) => {
    const act = e.target.id;
    startBtnHandler.handleRequest(act);
})

closeHintBtn.on('click', (e) => {
    $('.overlay').css('display', 'none');
})

jumpBtn.on('animationiteration', ()=>{
    jumpBtn.css('animation-play-state', 'paused');
    setTimeout(()=>{jumpBtn.css('animation-play-state', 'running');}, 2000);
});

$('.circleFraction svg').on('click', (e) => {
    let nowPearClick = $(e.target).index();
    console.log(nowPearClick);
    if($(e.target).attr('class') === 'uncolored'){
        $(e.target).css('fill', '#dc0073');
        $(e.target).attr('class', 'colored');
    }
    else{
        $(e.target).css('fill', '#8e8e9c');
        $(e.target).attr('class', 'uncolored');
    }    
})

$('.pear img').on('click', (e) => {
    let nowPearClick = $(e.target).index();
    console.log(nowPearClick);
    if($(e.target).attr('class') === 'uncolored'){
        $(e.target).attr('src', 'src/fractionImg/pearColor.png');
        $(e.target).attr('class', 'colored');
    }
    else{
        $(e.target).attr('src', 'src/fractionImg/pear.png');
        $(e.target).attr('class', 'uncolored');
    }
})

comparisonSymbol.on('mousedown', (e) =>{
    let initX = e.clientX, initY = e.clientY;
    if(e.target.className !== 'answerDisplay'){
        $('body').on('mousemove', (event) => {
            //左下角:(349, 492) 右上角:(449, 394)
            $('.' + e.target.className).css('transform', 'translate(' 
            + (event.clientX - initX) + 'px,' + (event.clientY - initY) +'px)');
        })

        $('body').on('mouseup', (temp) => {
            let endPositionX = temp.clientX, endPositionY = temp.clientY;
            // console.log(endPositionX, endPositionY); //用來鎖定答案框範圍
            $('.' + e.target.className).off();
            $('body').off();
            $('.' + e.target.className).css('transform', 'translate(0px, 0px)');
            if((parseInt(endPositionX) >= 345 && parseInt(endPositionX) <= 450) 
            && (parseInt(endPositionY) <= 495 && parseInt(endPositionY) >= 390)){
                game.symbolDisplay(temp.target.className);
            }
        })
    }
})