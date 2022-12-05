const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;
const background = new Image();
background.src = "./asset/bg001.png"

let numberOfFishes = 3;

let score = 0;
let gameFrame = 0;
ctx.font = "bold 35px Courier";
ctx.fillStyle = 'black';
const startBtn = document.getElementById('startBtn')

function startScreen(){
    ctx.fillStyle = "#48807d";
    ctx.drawImage(background, 0,0);
    ctx.fillText('準備好了嗎?', 215, canvas.height/2);
    requestAnimationFrame(startScreen);
}
startScreen();

startBtn.addEventListener('click', (e) => {
    console.log(e);
    animate();
})

const npc = new Npc();

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, -1, 0);
    ctx.fillText('將數字連上正確的手勢吧！', 65, 52);
    npc.draw();
    gameFrame++;
    requestAnimationFrame(animate);
}

function level1 (){
    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', function(){
        checkAnswer();
        // update game
    });
}
level1();

function checkAnswer(){
    document.querySelectorAll('button').forEach(e => {
        let id = e.getAttribute('id');
        e.addEventListener('click', function() {
        console.log( id + ' was clicked!');
        if (id === 'Btn3'){
            document.getElementById('correct').play();
            alert('太棒了!!');
            }
            if (id === "Btn1" || id === "Btn2"|| id === "Btn4"|| id === "Btn5"
            || id === "Btn6"|| id === "Btn7"|| id === "Btn8"|| id === "Btn9"){
                document.getElementById('wrong').play();
            }
        });
    });
}


function level2 (){
    const nextLevelBtn = document.getElementById('nextLevel');
    nextLevelBtn.addEventListener('click', function(){
   
        nextLevelBtn.removeEventListener('click', nextLevelBtn, true);
    });
}
level2();




