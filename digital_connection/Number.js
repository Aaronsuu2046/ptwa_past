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
        ctx_bg.font = this.font;
        ctx_bg.fillStyle = this.color;
        ctx_bg.fillText(this.text, this.x, this.y);      
    }
}