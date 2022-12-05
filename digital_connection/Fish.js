class Fish {
    constructor(){
        this.image = new Image();
        this.image.src = './asset/image/bee.png';
        this.spriteWidth = 470;
        this.spriteHeight = 375;
        this.width = this.spriteHeight/5;
        this.height = this.spriteHeight/5;
        // wait for fixed
        this.x = Math.floor(Math.random() * 20  - this.width) ;
        this.y = Math.floor(Math.random() * 250 + this.height);
        // this.x = x;
        // this.y = y;
        this.frame = 0;
        this.speedx = Math.floor(Math.random() * 5 + 2) ;
    }
    update(){
        this.x += this.speedx;
        if (this.x > canvas.width)
            this.speedx = 0;
        if (gameFrame % 20 === 0){
            this.frame > 3 ? this.frame = 0 : this.frame++;
        }      
    }
    draw(){       
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, 
            this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);
        }
}