export { circleClickEstablish, pearClickEstablish}

function circleClickEstablish(){
    $('.circleFraction svg').on('click', (e) => {
        let nowPearClick = $(e.target).index();
        console.log(nowPearClick);
        if($(e.target).attr('class') === 'uncolored'){
            $(e.target).css('fill', '#dc0073');
            $(e.target).attr('class', 'colored');
        }
        else{
            $(e.target).css('fill', '#8e8e9c');
            $(e.target).attr('class', 'uncolored');
        }    
    })
}

function pearClickEstablish(){
    console.log('test');
    $('.pear img').on('click', (e) => {
        let nowPearClick = $(e.target).index();
        console.log(nowPearClick);
        if($(e.target).attr('class') === 'uncolored'){
            $(e.target).attr('src', 'src/fractionImg/pearColor.png');
            $(e.target).attr('class', 'colored');
        }
        else{
            $(e.target).attr('src', 'src/fractionImg/pear.png');
            $(e.target).attr('class', 'uncolored');
        }
    })
}