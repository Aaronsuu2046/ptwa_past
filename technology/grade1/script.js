const allGameIframe = document.querySelectorAll('iframe');

$(".previousPage").on('click', (e) => {
    hideFrames();
    $(".previousPage").css("display", "none");
    $('.gameBlock').toggle()
})
$(".game").on('click', function(e) {
    const id = $(this).attr('id');
    console.log(id);
    hideFrames(id);
    $('.gameBlock').css({'display': 'none'});
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
  