document.getElementById("game1").onclick = function(){
    hideFrames(1);
}

document.getElementById("game2").onclick = function(){
    hideFrames(2);
}

document.getElementById("game3").onclick = function(){
    hideFrames(3);

}

document.getElementById("game7").onclick = function(){
    hideFrames(7);
}

document.getElementById("game8").onclick = function(){
    hideFrames(8);
}
document.getElementById("game9").onclick = function(){
    hideFrames(9);
}

function hideFrames(number) {
    [...document.querySelectorAll('.body-container iframe')].forEach((item) => {
      item.style.display = "none";
    });
    document.getElementById('frame4').style.display = "none";
    document.getElementById(`frame${number}`).style.display = "block";
  }
  