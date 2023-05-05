$(document).ready(function() {
    $('.link-block').on('click', function() {
        let targetMenu = $(this).data('target');
        $('.collapse').not(targetMenu).collapse('hide');
    });
});

function changeImage() {
    var image = document.getElementById("myImage");
    if (image.src.match("assets/images/grade_btn/mand.png")) {
      image.src = "assets/images/grade_btn/mand_after.png";
    } else {
      image.src = "assets/images/grade_btn/mand.png";
    }
}

function changeImage2() {
    var image = document.getElementById("myImage2");
    if (image.src.match("assets/images/grade_btn/math.png")) {
      image.src = "assets/images/grade_btn/math_after.png";
    } else {
      image.src = "assets/images/grade_btn/math.png";
    }
}

function changeImage3() {
    var image = document.getElementById("myImage3");
    if (image.src.match("assets/images/grade_btn/tech.png")) {
      image.src = "assets/images/grade_btn/tech_after.png";
    } else {
      image.src = "assets/images/grade_btn/tech.png";
    }
}
