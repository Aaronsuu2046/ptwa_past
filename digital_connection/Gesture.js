class Gesture {
<<<<<<< HEAD
    constructor(x, y, width=100, num, path){
=======
    constructor(x, y, path){
>>>>>>> new_web_view/main
        this.image = new Image();
        this.image.src = path;
        this.x = x;
        this.y = y;
<<<<<<< HEAD
        this.width = width;
        this.height = 90;
        this.used_frame = 0;
        this.num = num;
        this.chi = CHINESE[num-1];
=======
        this.width = 50;
        this.height = 50;
        this.used_frame = 0;
>>>>>>> new_web_view/main
    }
    update(){

    }
    draw(){       
        ctx_bg.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}