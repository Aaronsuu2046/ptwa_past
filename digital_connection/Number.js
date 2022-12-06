class Number {
    constructor(text, x, y, color, size=24, is_bold=false){
        this.text = text;
        this.x = x;
        this.y = y;
        this.color = color;
        this.style = size + "px Courier";
        this.font = is_bold ? "bold "+ this.style : this.style;
    }
    update(){

    }
    draw(){ 
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);      
    }
}