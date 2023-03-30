class Number {
<<<<<<< HEAD
    constructor(text, x, y, color, width=100, is_bold=false){
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = text>=10 ? 1.5 : 1;
        this.color = color;
        this.width = width
        this.style = width + "px Courier";
=======
    constructor(text, x, y, color, size=24, is_bold=false){
        this.text = text;
        this.x = x;
        this.y = y;
        this.color = color;
        this.style = size + "px Courier";
>>>>>>> new_web_view/main
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