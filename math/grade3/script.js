const allGameIframe = document.querySelectorAll('iframe');

$(".previousPage").on('click', (e) => {
    hideFrames();
    $(".previousPage").css("display", "none");
    $('.gameArea').toggle()
})
$("h3").on('click', (e) => {
    hideFrames(e.target.id);
    $('.gameArea').css({'display': 'none'});
})


function hideFrames(number=0) {
    [...allGameIframe].forEach((item) => {
        item.style.display = "none";
    });
    if (number) {
        $(".previousPage").css("display", "block");
        allGameIframe[number-1].style.display = "block";
    }
}
  