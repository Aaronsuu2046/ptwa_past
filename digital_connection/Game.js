// game view variables
let IMAGE_PATH = "./asset/image/";



class Game{
    constructor(){
        // game variables
        this.score = 0;
        this.correct = {start:[], end:[]};
        this.mistake = {start:[], end:[]};
        this.gestures = [];
        this.numbers = [];
        this.topic_points = [];
        this.ans_points = [];
        this.startPosition = {x: 0, y: 0};
        this.lineCoordinates = {x: 0, y: 0};
        this.isDrawStart = false;
        this.isDrawEnd = false;
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
        // view of ready to start
        ctx_bg.fillStyle = BLUE;
        ctx_bg.font = FONT_STYLE;
        ctx_bg.fillText('準備好了嗎?', canvas.width/3, canvas.height / 2);
        startBtn.addEventListener('click', (e) => {
            ctx_bg.clearRect(0, 0, canvas.width, canvas.height);
            ctx_bg.fillText('將數字連上正確的手勢吧！', this.npc.x + this.npc.width+this.npc.width/2, this.npc.height);
            this.draw_bg();
        })
    }
    
    animate(){
        this.draw_view();
        requestAnimationFrame(()=>this.animate());
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
            let x = pageX - canvas_3.offsetLeft;
            let y = pageY - canvas_3.offsetTop;
        
            return {
               x,
               y
            } 
        }  
        this.drawLine = () => {
            ctx_line.strokeStyle = BLACK;
            ctx_line.lineWidth = 3;
            ctx_line.beginPath();
            ctx_line.moveTo(this.startPosition.x, this.startPosition.y);
            ctx_line.lineTo(this.lineCoordinates.x, this.lineCoordinates.y);
            ctx_line.stroke();
        }
        
        this.mouseDownListener = (e) => {
            this.startPosition = this.getClientOffset(e);
            if (this.collide_with_topic_point(this.startPosition)){
                this.isDrawStart = true;
                this.lineCoordinates = null;
            }
            else{
                this.clearCanvas();
            }
        }
        
        this.mouseMoveListener = (e) => {
            if(!this.isDrawStart) return;
            
            this.lineCoordinates = this.getClientOffset(e);
            this.clearCanvas();
            this.drawLine();
        }
        
        this.mouseupListener = (e) => {
            this.isDrawStart = false;
            this.isDrawEnd = true;
            // TODO: refactor be only for one time
            if (!this.collide_with_topic_point(this.startPosition) || !this.collide_with_ans_point(this.lineCoordinates)) {
                return;
            }

            if (this.collide_with_topic_point(this.startPosition) === this.collide_with_ans_point(this.lineCoordinates)){
                // TODO: Test before clear or save
                this.draw_correct_line();
                this.isDrawEnd = false;
                this.clearCanvas();
            }
            else if (this.collide_with_topic_point(this.startPosition) !== this.collide_with_ans_point(this.lineCoordinates)) {
                this.draw_wrong_line();
            }
        }
        
        this.clearCanvas = () => {
           ctx_line.clearRect(0, 0, canvas_3.width, canvas_3.height);
        }
           
        this.draw_correct_line = () => {
            if (!this.isDrawEnd) return;
            ctx_correct_line.strokeStyle = GREEN;
            ctx_correct_line.lineWidth = 5;
            ctx_correct_line.beginPath();
            ctx_correct_line.moveTo(this.startPosition.x, this.startPosition.y);
            ctx_correct_line.lineTo(this.lineCoordinates.x, this.lineCoordinates.y);
            ctx_correct_line.stroke();
        }
        this.draw_wrong_line = () => {
            if (!this.isDrawEnd) return;
            ctx_line.strokeStyle = 'red';
            ctx_line.lineWidth = 5;
            ctx_line.beginPath();
            ctx_line.moveTo(this.startPosition.x, this.startPosition.y);
            ctx_line.lineTo(this.lineCoordinates.x, this.lineCoordinates.y);
            ctx_line.stroke();
        }
        canvas_3.addEventListener('mousedown', this.mouseDownListener);
        canvas_3.addEventListener('mousemove', this.mouseMoveListener);
        canvas_3.addEventListener('mouseup', this.mouseupListener);
    }
    

    collide_with_topic_point(startPosition){
        for (let i = 0; i < this.topic_points.length; i++) {
            let point = this.topic_points[i]
            if (this.collide_with_x(startPosition, point) && this.collide_with_y(startPosition, point)){
                return point.ans;
            }
        }
        return false;
    }

    collide_with_ans_point(startPosition){
        for (let i = 0; i < this.ans_points.length; i++) {
            let point = this.ans_points[i]
            if (this.collide_with_x(startPosition, point) && this.collide_with_y(startPosition, point)){
                return point.ans;
            }
        }
        return false;
    }

    collide_with_x(mos_pos, point){
        if (mos_pos.x >= point.x && mos_pos.x <= point.x + point.radius * 2){
            return true;
        }
        return false;
    }
    
    collide_with_y(mos_pos, point){
        if (mos_pos.y >= point.y && mos_pos.y <= point.y + point.radius * 2){
            return true;
        }
        return false;
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



