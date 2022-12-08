class Gesture {
    constructor(x, y, path){
        this.image = new Image();
        this.image.src = path;
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.used_frame = 0;
    }
    update(){

    }
    draw(){       
        ctx_bg.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}