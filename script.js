$(document).ready(function() {
    $('.link-block').on('click', function() {
        let targetMenu = $(this).data('target');
        $('.collapse').not(targetMenu).collapse('hide');
    });
});