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
        this.topic_point = 0;
        this.ans_point = 0;
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
        // view of ready to start
        ctx_bg.fillStyle = BLUE;
        ctx_bg.font = H1_FONT_STYLE;
        ctx_bg.fillText('準備好了嗎?', canvas_bg.width/3, canvas_bg.height / 2);
        startBtn.addEventListener('click', (e) => {
            ctx_bg.clearRect(0, 0, canvas_bg.width, canvas_bg.height);
            ctx_bg.fillText('將數字連上正確的手勢吧！', this.npc.x + this.npc.width+this.npc.width/2, this.npc.height);
            ctx_bg.fillStyle = RED;
            ctx_bg.font = SCORE_FONT_STYLE;
            ctx_bg.fillText(this.score, canvas_bg.width - 80, 50);
            this.draw_bg();
        })
    }
    
    animate(){
        this.draw_view();
        this.get_result();
        requestAnimationFrame(()=>this.animate());
    }

    get_result(){
        if (this.score !== 100) {
            return
        }
        ctx_current.fillStyle = RED;
        ctx_current.font = H1_FONT_STYLE;
        ctx_current.fillText("恭喜過關！", canvas_current.width/3, canvas_current.height / 2);
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
            let x = pageX - canvas_current.offsetLeft;
            let y = pageY - canvas_current.offsetTop;
        
            return {
               x,
               y
            } 
        }  
        this.drawLine = () => {
            ctx_current.strokeStyle = BLACK;
            ctx_current.lineWidth = 3;
            ctx_current.beginPath();
            ctx_current.moveTo(this.startPosition.x, this.startPosition.y);
            ctx_current.lineTo(this.lineCoordinates.x, this.lineCoordinates.y);
            ctx_current.stroke();
        }
        
        this.mouseDownListener = (e) => {
            this.startPosition = this.getClientOffset(e);
            this.topic_point = this.collide_with_topic_point(this.startPosition);
            if (this.topic_point){
                this.isDrawStart = true;
            }
            else{
                this.clear_current_canvas();
            }
        }
        
        this.mouseMoveListener = (e) => {
            if(!this.isDrawStart) return;
            
            this.lineCoordinates = this.getClientOffset(e);
            this.clear_current_canvas();
            this.drawLine();
        }
        
        this.mouseupListener = (e) => {
            this.isDrawStart = false;
            this.ans_point = this.collide_with_ans_point(this.lineCoordinates);
            if (!this.topic_point || !this.ans_point) {
                return;
            }
            if (this.topic_point === this.ans_point){
                this.draw_correct_line();
                this.add_score(20);
                document.getElementById('correct').play();
            }
            else {
                this.draw_wrong_line();
                document.getElementById('wrong').play();
            }
            this.topic_point = 0;
            this.ans_point = 0;
        }
        
        this.clear_current_canvas = () => {
           ctx_current.clearRect(0, 0, canvas_current.width, canvas_current.height);
        }
           
        this.draw_correct_line = () => {
            ctx_stay.strokeStyle = GREEN;
            ctx_stay.lineWidth = 5;
            ctx_stay.beginPath();
            ctx_stay.moveTo(this.startPosition.x, this.startPosition.y);
            ctx_stay.lineTo(this.lineCoordinates.x, this.lineCoordinates.y);
            ctx_stay.stroke();
        }
        this.draw_wrong_line = () => {
            ctx_current.strokeStyle = RED;
            ctx_current.lineWidth = 5;
            ctx_current.beginPath();
            ctx_current.moveTo(this.startPosition.x, this.startPosition.y);
            ctx_current.lineTo(this.lineCoordinates.x, this.lineCoordinates.y);
            ctx_current.stroke();
        }
        canvas_current.addEventListener('mousedown', this.mouseDownListener);
        canvas_current.addEventListener('mousemove', this.mouseMoveListener);
        canvas_current.addEventListener('mouseup', this.mouseupListener);
    }
    
    add_score(score){
        this.score += score;
        ctx_bg.clearRect(canvas_bg.width - 100, 0, 100, 100);
        ctx_bg.fillStyle = GREEN;
        ctx_bg.font = SCORE_FONT_STYLE;
        ctx_bg.fillText(this.score, canvas_bg.width - 80, 50);
        this.clear_current_canvas();
    }

    check_next_level(){
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

    collide_with_topic_point(startPosition){
        for (let i = 0; i < this.topic_points.length; i++) {
            let point = this.topic_points[i]
            if (this.collide_with_x(startPosition, point) && this.collide_with_y(startPosition, point)){
                return point.ans;
            }
        }
        return 0;
    }

    collide_with_ans_point(startPosition){
        for (let i = 0; i < this.ans_points.length; i++) {
            let point = this.ans_points[i]
            if (this.collide_with_x(startPosition, point) && this.collide_with_y(startPosition, point)){
                return point.ans;
            }
        }
        return 0;
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
        let gesture = new Gesture(canvas_bg.width, y, path);
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

function level2 (){
    const nextLevelBtn = document.getElementById('nextLevel');
    nextLevelBtn.addEventListener('click', function(){
   
        nextLevelBtn.removeEventListener('click', nextLevelBtn, true);
    });
}
level2();



