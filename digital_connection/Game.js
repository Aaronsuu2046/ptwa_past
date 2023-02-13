// game view variables
const IMAGE_PATH = "./asset/image/";
const FIREWORK_PATH = Array.from({length: 8}, (_, i) => IMAGE_PATH+"firework_red"+i+".png");
const fireworks_image = new Image();


class Game{
    constructor(){
        // game variables
        this.sentence = {
            "good": ["答對了！", "很棒喔！", "你是對的！", "沒錯！"]
            , "bad": ["好可惜，", "差一點點，", "快對了～", "加油！"]
        };
        this.score = 0;
        this.correct = [];
        this.topic = {
            "level_1": {
                "topic": this.reset(getIntArray(5, 1)),
                "ans": this.reset(getIntArray(5, 1))
                },
            "level_2": {
                "topic": this.reset(getIntArray(5, 6)),
                "ans": this.reset(getIntArray(5, 6))
                }
            };
        this.gestures = [];
        this.numbers = [];
        this.topic_points = [];
        this.ans_points = [];
        this.topic_point = 0;
        this.ans_point = 0;
        this.startPosition = {x: 0, y: 0};
        this.lineCoordinates = {x: 0, y: 0};
        this.isDrawStart = false;
        this.status = "FAIL";
        // create objects
        this.npc = new Npc();
        this.create_game(this.topic.level_1);
        this.ready();
    }
    
    create_game(level) {
        let y = 80;
        for (let i = 0; i < 5; i++) {
            this.create_topic(level.ans[i], y);
            this.create_ans(level.topic[i], y);
            y += 60;
        }
    }

    create_level_2(){
        this.create_game(this.topic.level_2);
        this.ready();
    }

    ready(){
        // view of ready to start
        ctx_bg.fillStyle = BLUE;
        ctx_bg.font = H1_FONT_STYLE;
        ctx_bg.fillText('準備好了嗎?', canvas_bg.width/3, canvas_bg.height / 2);
        startBtn.addEventListener('click', (e) => {
            ctx_bg.fillStyle = BLUE;
            ctx_bg.font = H1_FONT_STYLE;
            ctx_bg.clearRect(0, 0, canvas_bg.width, canvas_bg.height);
            ctx_bg.fillText('將數字連上正確的手勢吧！', this.npc.x + this.npc.width+this.npc.width/2, this.npc.height);
            ctx_bg.fillStyle = RED;
            ctx_bg.font = SCORE_FONT_STYLE;
            ctx_bg.fillText(this.score, canvas_bg.width - 80, 55);
            this.draw_bg();
        })
    }
    
    animate(){
        this.draw_view();
        this.get_result();
        next_level_btn.addEventListener('click', (e) => {
            this.clear_canvas();
            this.create_level_2();
        });
        requestAnimationFrame(()=>this.animate());
    }

    get_result(){
        if (this.score !== 100) {
            return
        }
        this.clear_canvas("current");
        ctx_current.fillStyle = RED;
        ctx_current.font = H1_FONT_STYLE;
        ctx_current.fillText("恭喜過關！", canvas_current.width/3, canvas_current.height / 2);
        set_off_fireworks(FIREWORK_PATH, canvas_current.width/3, canvas_current.height / 2, 100, 100);
        fireworks_image.src = FIREWORK_PATH[0];
        console.log(fireworks_image.src);
        ctx_bg.drawImage(fireworks_image, canvas_current.width/3, canvas_current.height / 2, 100, 100);
        if(this.status !== "GAME_WIN"){
        }
        this.status = "GAME_WIN";
        this.score = 0;
    }

    reset(array){
        // Fisher-Yates shuffle algorithm
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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
                this.clear_canvas("current");
            }
        }
        
        this.mouseMoveListener = (e) => {
            if(!this.isDrawStart) return;
            
            this.lineCoordinates = this.getClientOffset(e);
            this.clear_canvas("current");
            this.drawLine();
        }
        
        this.mouseupListener = (e) => {
            this.isDrawStart = false;
            this.ans_point = this.collide_with_ans_point(this.lineCoordinates);
            if (!this.topic_point || !this.ans_point) {
                return;
            }
            if (this.topic_point === this.ans_point){
                document.getElementById('correct').play();
                this.draw_correct_line();
                this.add_score(20);
                ctx_current.fillStyle = GREEN;
                ctx_current.font = H1_FONT_STYLE;
                ctx_current.fillText(getRandomElement(this.sentence.good)+"這是 "+this.ans_point+" ～", canvas_current.width/4, canvas_current.height / 2);
                this.correct.push(this.ans_point);
            }
            else {
                document.getElementById('wrong').play();
                this.draw_wrong_line();
                ctx_current.fillStyle = RED;
                ctx_current.font = H1_FONT_STYLE;
                ctx_current.fillText(getRandomElement(this.sentence.bad)+"這是 "+this.ans_point+"～", canvas_current.width/4, canvas_current.height / 2);
            }
            this.startPosition = 0;
            this.lineCoordinates = 0;
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
    
    clear_canvas(canvas) {
        if (canvas === "current"){
            ctx_current.clearRect(0, 0, canvas_current.width, canvas_current.height);
        }
        else if (canvas === "stay"){
            ctx_stay.clearRect(0, 0, canvas_stay.width, canvas_stay.height);
            console.log("clear stay");
        }
        else if (canvas === "bg"){
            ctx_bg.clearRect(0, 0, canvas_bg.width, canvas_bg.height);
            console.log("clear bg");
        }
        else {
            ctx_current.clearRect(0, 0, canvas_current.width, canvas_current.height);
            ctx_stay.clearRect(0, 0, canvas_stay.width, canvas_stay.height);
            ctx_bg.clearRect(0, 0, canvas_bg.width, canvas_bg.height);
            console.log("clear all");
        }
    }

    add_score(score){
        this.score += score;
        ctx_bg.clearRect(canvas_bg.width - 100, 5, 100, 50);
        ctx_bg.fillStyle = GREEN;
        ctx_bg.font = SCORE_FONT_STYLE;
        ctx_bg.fillText(this.score, canvas_bg.width - 80, 55);
        this.clear_canvas("current");
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
            if (!this.correct.includes(point.ans) && this.collide_with_x(startPosition, point) && this.collide_with_y(startPosition, point)){
                return point.ans;
            }
        }
        return 0;
    }

    collide_with_x(mos_pos, point){
        if (mos_pos.x >= point.x - point.radius && mos_pos.x <= point.x + point.radius){
            return true;
        }
        return false;
    }
    
    collide_with_y(mos_pos, point){
        if (mos_pos.y >= point.y - point.radius && mos_pos.y <= point.y + point.radius){
            return true;
        }
        return false;
    }

    create_ans(i, y){
        let path = IMAGE_PATH + "gesture_" + i + ".png";
        let gesture = new Gesture(canvas_bg.width, y, path);
        gesture.x -= gesture.width + 50
        this.gestures.push(gesture);
        this.create_point(i, gesture.x-20, gesture.y+gesture.height/2, this.ans_points);
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

function set_off_fireworks(images_path, x, y, width, height){
    firework_sound = document.getElementById('firework');
    firework_sound.currentTime = 1.5;
    firework_sound.play();
    setTimeout(function(){ firework_sound.pause(); }, 2000);
    // for (let i = 0; i < images_path.length; i++) {
    //     console.log(images_path[i]);
    // }
    // fireworks_image.src = images_path[0];
    // ctx_bg.drawImage(fireworks_image, x, y, width, height);
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

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

function getIntArray(len, start) {
    return Array.from({length: len}, (_, i) => i+start);
  }
  