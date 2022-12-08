// game view variables
let IMAGE_PATH = "./asset/image/";
let FONT_STYLE = "bold 35px Courier";
let BLACK = "#000000";
let BLUE = "#48807d";



class Game{
    constructor(){
        // game view setting
        ctx_bg.font = FONT_STYLE;
        ctx_bg.fillStyle = BLACK;
        // game variables
        this.score = 0;
        this.correct = 0;
        this.mistake = 0;
        this.gestures = [];
        this.numbers = [];
        this.topic_points = [];
        this.ans_points = [];
        this.startPosition = {x: 0, y: 0};
        this.lineCoordinates = {x: 0, y: 0};
        this.isDrawStart = false;
        // create objects
        this.npc = new Npc();
        let y = 80;
        for (let i = 1; i < 6; i++){
            this.create_ans(i, y);
            this.create_topic(i, y);
            y += 60;
        }
        this.ready();
    }
    
    ready(){
        ctx_bg.fillStyle = BLUE;
        ctx_bg.fillText('準備好了嗎?', canvas.width/3, canvas.height / 2);
        startBtn.addEventListener('click', (e) => {
            ctx_bg.clearRect(0, 0, canvas.width, canvas.height);
            ctx_bg.fillText('將數字連上正確的手勢吧！', this.npc.x + this.npc.width+this.npc.width/2, this.npc.height);
            this.draw_bg();
        })
    }
    
    animate(){
        this.draw_view();
        requestAnimationFrame(this.animate);
    }

    draw_bg(){
        this.npc.draw();
        for (let i = 0; i < 5; i++){
            this.gestures[i].draw();
            this.numbers[i].draw();
            this.topic_points[i].draw();
            this.ans_points[i].draw();
        }
    }
    draw_view(){  
        this.getClientOffset = (e) => {
            let {pageX, pageY} = e.touches ? e.touches[0] : e;
            let x = pageX - canvas_2.offsetLeft;
            let y = pageY - canvas_2.offsetTop;
        
            return {
               x,
               y
            } 
        }  
        this.drawLine = () => {
           ctx_line.beginPath();
           ctx_line.moveTo(this.startPosition.x, this.startPosition.y);
           ctx_line.lineTo(this.lineCoordinates.x, this.lineCoordinates.y);
           ctx_line.stroke();
        }
        
        this.mouseDownListener = (e) => {
           this.startPosition = this.getClientOffset(e);
           this.isDrawStart = true;
           // TODO: Test before clear or save
           this.clearCanvas();
        }
        
        this.mouseMoveListener = (e) => {
          if(!this.isDrawStart) return;
          
          this.lineCoordinates = this.getClientOffset(e);
          this.drawLine();
        }
        
        this.mouseupListener = (e) => {
          this.isDrawStart = false;
        }
        
        this.clearCanvas = () => {
           ctx_line.clearRect(0, 0, canvas_2.width, canvas_2.height);
        }
        
        canvas_2.addEventListener('mousedown', this.mouseDownListener);
        canvas_2.addEventListener('mousemove', this.mouseMoveListener);
        canvas_2.addEventListener('mouseup', this.mouseupListener);
        
    }
    
    create_ans(i, y){
        let path = IMAGE_PATH + "ans_" + i + ".jpg";
        let gesture = new Gesture(canvas.width, y, path);
        gesture.x -= gesture.width + 50
        this.gestures.push(gesture);
        this.create_point(i, gesture.x-50, gesture.y+25, this.ans_points);
    }
    create_topic(i, y){
        y += 40;
        let number = new Number(i, 50, y, BLACK, 40, true);
        this.numbers.push(number);
        this.create_point(i, number.x+50, number.y-10, this.topic_points);
    }
    create_point(ans, x, y, group){
        let point = new Point(ans, x, y);
        group.push(point);
    }
}



function level1 (){
    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', function(){
        // checkAnswer();
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



