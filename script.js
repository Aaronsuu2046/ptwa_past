document.getElementById("game1").onclick = function(){
    document.getElementById('frame1').style.display = "block";
    document.getElementById('frame2').style.display = "none";
}

document.getElementById("game2").onclick = function(){
    document.getElementById('frame2').style.display = "block";
    document.getElementById('frame1').style.display = "none";
}
