NPC_PATH = "./asset/image/npc.png";
<<<<<<< HEAD
LIVES_PATH = "./asset/image/lives.svg";


class Npc {
    constructor(x=10, y=10, is_npc=true){
        this.image = new Image();
        this.image.src = NPC_PATH;
        if (!is_npc){
            this.image.src = LIVES_PATH;
        }
        this.x = x;
        this.y = y;
=======


class Npc {
    constructor(){
        this.image = new Image();
        this.image.src = NPC_PATH;
        this.x = 10;
        this.y = 10;
>>>>>>> new_web_view/main
        this.frame = 0;
        this.width = 50;
        this.height = 58;
    }
    update(){

    }
    draw(){
        ctx_bg.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}
