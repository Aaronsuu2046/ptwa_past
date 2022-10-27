window.addEventListener('load', function(){

    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    CANVAS_WIDTH = canvas.width = 550;
    CANVAS_HEIGHT = canvas.height = 350;
    const numberOfEnemies = 6;
    const enemiesArray = [];

    
    const background = new Image();
    background.src = "./asset/background2.png";

    let score = 0;
    let gameFrame = 0;
    // let gameOver = false;
    //遊戲開始區塊
    function startScreen(){
        ctx.fillStyle = "#003D79";
        ctx.font ="bold 30px Courier";
        ctx.drawImage(background, 0,0);
        ctx.fillText('準備好了嗎?', 190, canvas.height/2);
        requestAnimationFrame(startScreen);
    }
    startScreen();

    const startBtn = document.getElementById('startBtn')
    startBtn.addEventListener('click', (e) => {
        console.log(e);
        animate();
    })
    

    class Player{
        constructor(){
            this.image = new Image();
            this.image.src = './asset/player.png';
            this.x = 0;
            this.y = 0;
            this.width = 50;
            this.height = 50;
        }
        update(){
            
        }
        draw(){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        }
    }

    const player = new Player();

    let canvasPosition = canvas.getBoundingClientRect();
    canvas.addEventListener("mousemove", function(event){
        player.x = event.x - canvasPosition.left;
        player.y = event.y - canvasPosition.top;
        if (player.x + 50 > canvas.width)
            player.x = canvas.width - 50 ;
        if (player.y + player.height > canvas.height)
            player.y = canvas.height - 50;
        
    })

    class Enemy {
        constructor(){
            this.image = new Image();
            this.image.src = './asset/testframe.png';
            this.speedx = (Math.random() *  -4) - 1;
            this.speedy = 0;
            this.spriteWidth = 840;
            this.spriteHeight = 631;
            this.width = this.spriteWidth / 8;
            this.height = this.spriteHeight / 8;
            this.x = (canvas.width + this.width);
            this.y = Math.random() * (canvas.height - this.height);
            this.frame = 0;
            this.angle = 0;
            this.counted = false;        
        }
        update(){
            this.x += this.speedx;
            this.y += Math.sin(this.angle);
            this.angle += 0.1;
            //this.y += this.speedy;
            if (this.x + this.width < 0) this.x = canvas.width;
            if (gameFrame % 8 === 0){
                this.frame > 4 ? this.frame = 0 : this.frame++;
            }
            // 矩形碰撞
            // if (player.x < this.x + this.width && player.x + player.width > this.x
            //     && player.y + player.height > this.y && player.y < this.y + this.height){ 
            //     gameOver = true};
            const dx = player.x - this.x -20;
            const dy = player.y - this.y -10;
            const distancce = Math.sqrt(dx * dx + dy * dy);
            if (distancce < player.width/2 + this.width/2 &&
                distancce < player.height/2.2 + this.height/2.2){
                if (!this.counted){
                    this.counted = true;
                    score +=1;
                    
                }
                //gameOver = true
            };
        }
        draw(){
            //test for collision
            // ctx.strokeStyle = 'white' ; 
            // ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.beginPath();
            ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, 
            this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);
        }
    };

    function handleEnemies(){
        if (gameFrame % 300 == 0){
            enemiesArray.push(new Enemy());
            console.log(enemiesArray.length);
        }
        for (let i = 0; i < enemiesArray.length; i++){
            enemiesArray[i].update();
            enemiesArray[i].draw();
        }
        if (enemiesArray.length > 5){
            enemiesArray.splice(0);
        }
    };


   
    function animate(){                 
        ctx.drawImage(background, 0, 0);  
        player.draw();
        player.update();
        handleEnemies();
        ctx.font ="30px Verdana"
        ctx.fillText('Score: ' + score, canvas.width - 150, 40);
        // enemiesArray.forEach(enemy => {
        //     enemy.update();
        //     enemy.draw();
        // });
        gameFrame ++;
      
        requestAnimationFrame(animate);
    };


}); 