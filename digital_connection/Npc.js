class Npc {
    constructor(){
        this.image = new Image();
        this.image.src = './asset/npc.png'
        this.x = 10;
        this.y = 10;
        this.frame = 0;
        this.width = 50;
        this.height = 58;
    }
    update(){

    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}
