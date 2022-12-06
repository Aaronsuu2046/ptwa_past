class Point {
    constructor(ans, x, y){
        this.x = x;
        this.y = y;
        this.ans = ans;
        this.radius = 10;
    }
    update(){

    }
    draw(){   
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
    }
}