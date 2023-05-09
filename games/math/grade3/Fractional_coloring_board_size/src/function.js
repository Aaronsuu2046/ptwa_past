export { circleClickEstablish, pearClickEstablish}
import { game } from './Handler.js';

function circleClickEstablish(){
    $('.circleFraction svg').on('click', (e) => {
        if($(e.target).attr('class') === 'uncolored'){
            $(e.target).css('fill', '#dc0073');
            $(e.target).attr('class', 'colored');

            if((e.clientX >= 69 && e.clientX <= 269) && (e.clientY >= 147 && e.clientY <= 347))
                game.clickAmount[0]++;
            else
                game.clickAmount[1]++;
        }
        else{
            $(e.target).css('fill', '#8e8e9c');
            $(e.target).attr('class', 'uncolored');

            if((e.clientX >= 69 && e.clientX <= 269) && (e.clientY >= 147 && e.clientY <= 347))
                game.clickAmount[0]--;
            else
                game.clickAmount[1]--;
        }    
    })
}

function pearClickEstablish(){
    $('.pear img').on('click', (e) => {
        if($(e.target).attr('class') === 'uncolored'){
            if((e.clientX >= 56 && e.clientX <= 281) && (e.clientY >= 160 && e.clientY <= 334))
                game.clickAmount[0]++;
            else
                game.clickAmount[1]++;
            $(e.target).attr('src', 'src/fractionImg/pearColor.png');
            $(e.target).attr('class', 'colored');
        }
        else{
            if((e.clientX >= 56 && e.clientX <= 281) && (e.clientY >= 160 && e.clientY <= 334))
                game.clickAmount[0]--;
            else
                game.clickAmount[1]--;
            $(e.target).attr('src', 'src/fractionImg/pear.png');
            $(e.target).attr('class', 'uncolored');
        }
    })
}