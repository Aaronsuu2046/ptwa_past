// game view variables
const IMAGE_PATH = "./asset/image/";
const FIREWORK_PATH = Array.from({length: 8}, (_, i) => IMAGE_PATH+"firework_red"+i+".png");
const fireworks_image = new Image();


class Game{
    constructor(){
        // create objects
        this.npc = new Npc();
        
        this.initialize();
        this.addEvent();
    }

    initialize(level=1){
        this.clear_canvas();
        this.score = 0;
        this.correct = [];
        this.topic = [
            {
                "topic": this.reset(getIntArray(5, 1))
                , "ans": this.reset(getIntArray(5, 1))
            }
            ,{
                "topic": this.reset(getIntArray(5, 6))
                , "ans": this.reset(getIntArray(5, 6))
                
            }
        ];
        this.gestures = [];
        this.numbers = [];
        this.topic_points = [];
        this.ans_points = [];
        this.lives = [];
        this.topic_point = 0;
        this.ans_point = 0;
        this.startPosition = {x: 0, y: 0};
        this.lineCoordinates = {x: 0, y: 0};
        this.isDrawStart = false;
        this.status = "FAIL";
        this.level = level; //default level
        this.create_game();
    }
    
    create_game() {
        let x = canvas_bg.width - this.npc.width*4.5;
        for (let i = 0; i < 3; i++) {
            this.create_live(x, 10, this.lives);
            x += this.npc.width/2;
        }
        let y = 80;
        for (let i = 0; i < 5; i++) {
            this.create_topic(this.topic[this.level-1].topic[i], y+40);
            this.create_gesture(this.topic[this.level-1].ans[i], y);
            y += canvas_bg.height/6;
        }
        this.ready();
    }

    ready(){
        // view of ready to start
        ctx_bg.fillStyle = BLUE;
        ctx_bg.font = H1_FONT_STYLE;
        ctx_bg.fillText('準備好了嗎?', canvas_bg.width/3, canvas_bg.height / 2);
    }
    
    addEvent(){
        Btn1.addEventListener('click', (e) => {
            if (this.level!=1){
                this.initialize();
            }
        });
        Btn2.addEventListener('click', (e) => {
            if (this.level!=2){
                this.initialize(2);
            }
        });
        hint.addEventListener('click', this.show_ans);
        startBtn.addEventListener('click', this.start_game); 
        nextLevel.addEventListener('click', this.nextLevel); 
        restart.addEventListener('click', (e) => {this.initialize(this.level)}); 
    }
    nextLevel = (e) => {
        if (this.level >= 6){
            this.initialize();
        }
        else{
            this.initialize(this.level+1);
        }
    }

    start_game = (e) => {
        ctx_bg.fillStyle = BLUE;
        ctx_bg.font = H1_FONT_STYLE;
        ctx_bg.clearRect(0, 0, canvas_bg.width, canvas_bg.height);
        ctx_bg.fillText('將數字連上正確的手勢吧！', this.npc.x + this.npc.width+this.npc.width/2, this.npc.height);
        ctx_bg.fillStyle = RED;
        ctx_bg.font = SCORE_FONT_STYLE;
        ctx_bg.fillText(this.score, canvas_bg.width - 80, 55);
        this.draw_bg();
    }

    show_ans = (e) => {
        if (!this.lives.length) {
            for (let i = 0; i < this.ans_points.length; i++) {
                this.create_ans(this.ans_points[i].ans, this.ans_points[i].x + 5
                    , this.ans_points[i].y - 20)
            }
        }
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
        this.clear_canvas("current");
        ctx_stay.fillStyle = RED;
        ctx_stay.font = H1_FONT_STYLE;
        ctx_stay.fillText("恭喜過關！", canvas_current.width/3, canvas_current.height / 2);
        set_off_eworks(FIREWORK_PATH, canvas_current.width/3, canvas_current.height / 2, 100, 100);
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
        for (let i = 0; i < this.gestures.length; i++){
            this.gestures[i].draw();
            this.numbers[i].draw();
            this.topic_points[i].draw();
            this.ans_points[i].draw();
        }
        this.draw_lives();
    }
    draw_lives(){
        for (let i = 0; i < this.lives.length; i++){
            this.lives[i].draw();
        }
        if (!this.lives.length){
            ctx_bg.fillStyle = RED;
            ctx_bg.font = 30+"px Courier";
            ctx_bg.fillText("↑點提示", canvas_bg.width - this.npc.width*4.5, 35);
            ctx_bg.fillText(" 看答案", canvas_bg.width - this.npc.width*4.5, 65);
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
                this.addScore(20);
                ctx_current.fillStyle = GREEN;
                ctx_current.font = HINT_FONT_STYLE;
                ctx_current.fillText("Ｏ", canvas_current.width/2-(HINT_SIZE/2), canvas_current.height / 2+(HINT_SIZE/2));
                this.correct.push(this.ans_point);
            }
            else {
                document.getElementById('wrong').play();
                this.draw_wrong_line();
                ctx_current.fillStyle = RED;
                ctx_current.font = HINT_FONT_STYLE;
                ctx_current.fillText("Ｘ", canvas_current.width/2-(HINT_SIZE/2), canvas_current.height / 2+(HINT_SIZE/2));
                if (this.lives){
                    this.lives.pop();
                    this.clear_canvas("bg", canvas_bg.width - this.npc.width*4.5, 10, this.npc.width*2, this.npc.height);
                }
                this.draw_lives();
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
    
    clear_canvas(canvas, x=0, y=0, width=canvas_current.width, height=canvas_current.height) {
        if (canvas === "current"){
            ctx_current.clearRect(x, y, width, height);
        }
        else if (canvas === "stay"){
            ctx_stay.clearRect(x, y, width, height);
            console.log("clear stay");
        }
        else if (canvas === "bg"){
            ctx_bg.clearRect(x, y, width, height);
            console.log("clear bg");
        }
        else {
            ctx_current.clearRect(x, y, width, height);
            ctx_stay.clearRect(x, y, width, height);
            ctx_bg.clearRect(x, y, width, height);
            console.log("clear all");
        }
    }

    addScore(score){
        this.score += score;
        ctx_bg.clearRect(canvas_bg.width - 100, 5, 100, 50);
        ctx_bg.fillStyle = GREEN;
        ctx_bg.font = SCORE_FONT_STYLE;
        ctx_bg.fillText(this.score, canvas_bg.width - SCORE_SIZE*2, 55);
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

    create_gesture(num, y){
        let path = IMAGE_PATH + "gesture_" + num + ".png";
        let width = 100;
        let x = canvas_bg.width- 150
        if (num>=6){
            width *= 2;
            x -= 70;
        }let gesture = new Gesture(x, y, width, path);
        this.gestures.push(gesture);
        this.create_point(num, gesture.x-20, gesture.y+gesture.height/2, this.ans_points);
    }
    create_topic(num, y){
        let x = 50;
        if (num>=10){
            x /= 2;
        }
        y += 40;
        let number = new Number(num, x, y, BLACK, 100, true);
        this.numbers.push(number);
        this.create_point(num, number.x+number.width*number.size, number.y-number.width/3, this.topic_points);
    }
    create_ans(num, x, y){
        if (num>=10){
            x -= SCORE_SIZE/2;
        }
        let number = new Number(num, x, y, DARKGREY, SCORE_SIZE, true);
        number.draw();
    }
    create_point(ans, x, y, group){
        let point = new Point(ans, x, y);
        group.push(point);
    }
    create_live(x, y, group){
        let live = new Npc(x, y);
        group.push(live);
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

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

function getIntArray(len, start) {
    return Array.from({length: len}, (_, i) => i+start);
  }
  