var challenge_now = 0, //紀錄當前關卡位置
start = false, //紀錄遊戲是否已經開始
clear = [,false, false, false, false, false], //紀錄哪些關卡已經通關
resetCheck = false, //紀錄是否開放reset按鈕
nowChallengeExcute = true; //紀錄是否要顯示圈圈及叉叉

function begining(){
    if(!start){//遊戲開始前只開放遊戲開始鍵
        let challenge_1 = document.querySelector(".challenge_1");
        let start_screen = document.querySelector(".start_screen");
        start_screen.style.display = "none";//隱藏說明畫面
        challenge_1.style.display = "block";//顯示第一關
        challenge_now += 1;//設定當前關卡為第一關
        start = true;//關閉遊戲開始鍵並開啟上一關、下一關按鍵
    }
    if(!clear[challenge_now]){//若當前所在關卡尚未通關，將關卡圖標改變顏色
        let level = document.querySelector(".level_" + challenge_now);
        level.style.background = "lightblue";
    }
}

function next(){//下一關函式
    if(!clear[challenge_now]){//將當前所在關卡圖標變回白色
        let level = document.querySelector(".level_" + challenge_now);
        level.style.background = "white";
    }
    if(start){
        let now = document.querySelector(".challenge_" + challenge_now);//
        challenge_now += 1;
        if(challenge_now > 5)//關卡數只有5因此若紀錄大於5則重設為1
            challenge_now = 1;
        let next = document.querySelector(".challenge_" + challenge_now);
        now.style.display = "none";
        next.style.display = "block";
    }
    if(!clear[challenge_now]){//將要跳轉到的關卡圖標變為藍色
        let level = document.querySelector(".level_" + challenge_now);
        level.style.background = "lightblue";
    }
    nowChallengeExcute = true;
}

function last(){//上一關函式
    if(!clear[challenge_now]){//將當前所在關卡圖標變回白色
        let level = document.querySelector(".level_" + challenge_now);
        level.style.background = "white";
    }
    if(start){
        let now = document.querySelector(".challenge_" + challenge_now);
        challenge_now -= 1;
        if(challenge_now == 0)//關卡數只有5因此若紀錄等於0則重設為5
            challenge_now = 5;
        let next = document.querySelector(".challenge_" + challenge_now);
        now.style.display = "none";
        next.style.display = "block";
    }
    if(!clear[challenge_now]){//將要跳轉到的關卡圖標變為藍色
        let level = document.querySelector(".level_" + challenge_now);
        level.style.background = "lightblue";
    }
    nowChallengeExcute = true;
}

function correct(){
    if(nowChallengeExcute){
        let circle = document.querySelector(".circle");//抓取圈圈
        circle.style.display = "block";//顯示圈圈
        setTimeout(()=> {
            console.log(circle.style.display = "none");
        }, 1000);//圈圈顯示後一秒關閉它
        clear[challenge_now] = true;//紀錄關卡通關

        let level = document.querySelector(".level_" + challenge_now);//抓取關卡圖標
        level.style.background = "green";//將關卡圖標在通關後改成綠色

        var i = 1;
        for(i = 1; i <= 5; i++){
            if(!clear[i])
                break
        }
        if(i == 6){
            resetCheck = true;//i = 6代表clear[1~5]皆為true 代表關卡全部通關 因此開放reset按鈕
        }
        nowChallengeExcute = false; //此關除非重置、重試、重新跳轉否則不再顯示圈圈及叉叉
    }
}

function mistake(){
    if(nowChallengeExcute){
        let fork = document.querySelector(".fork");//抓取叉叉
        fork.style.display = "block";//顯示叉叉
        setTimeout(()=> {//叉叉顯示後一秒關閉它
            console.log(fork.style.display = "none");
        }, 1000);
    }
}

function reset(){
    if(resetCheck){
        for(let i = 1; i <= 5; i++){//隱藏所有關卡、重置關卡圖標顏色並重置紀錄關卡是否通關的陣列
            let now = document.querySelector(".challenge_" + i);
            now.style.display = "none";
            let level = document.querySelector(".level_" + i);
            level.style.background = "white";
            clear[i] = false;
        }

        let screen = document.querySelector(".start_screen");//抓取說明畫面
        screen.style.display = "block";//顯示說明畫面

        challenge_now = 0;//重置所有變數
        start = false;
        nowChallengeExcute = true;
        resetCheck = false;
    }
}

function again(){
    if(start && clear[challenge_now]){//當前關卡通關後才開啟再試一次按鈕
        clear[challenge_now] = false;//重置當前關卡通關紀錄
        let level = document.querySelector(".level_" + challenge_now);
        level.style.background = "lightblue";//重置圖標顏色(綠色變回藍色)
        nowChallengeExcute = true;//重新打開顯示圈圈叉叉的效果
        resetCheck = false;//關閉reset按鈕
    }
}

function jump(self){
    nowChallengeExcute = true;
    if(start){
        if(self.className == "level_1"){
            jumpExecute(1, self);
        }
        else if(self.className == "level_2"){
            jumpExecute(2, self);
        }
        else if(self.className == "level_3"){
            jumpExecute(3, self);
        }
        else if(self.className == "level_4"){
            jumpExecute(4, self);
        }
        else if(self.className == "level_5"){
            jumpExecute(5, self);
        }
    }
}

function jumpExecute(toLevel, self){
    let now = document.querySelector(".challenge_" + challenge_now);
    if(self.className == "level_" + toLevel){
        if(!clear[challenge_now]){
            let level = document.querySelector(".level_" + challenge_now);
            level.style.background = "white";
        }
        let jump = document.querySelector(".challenge_" + toLevel);
        now.style.display = "none";
        jump.style.display = "block";
        challenge_now = toLevel;
        if(!clear[challenge_now]){
            let level = document.querySelector(".level_" + challenge_now);
            level.style.background = "lightblue";
        } 
    }
}
