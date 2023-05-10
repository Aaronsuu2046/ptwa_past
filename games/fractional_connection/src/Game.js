import * as constant from "../../../game_view/src/constant.js"
import {getJson, reorder, getNewLine} from "../../../game_view/src/module.js"
import {GameTemplate} from "../../../game_view/src/GameTemplate.js"


const gameData = await getJson('../../games/fractional_connection/game_config.json');

export class Game extends GameTemplate {
    constructor(){
        super();
        this.levelLimit = gameData.length;
        this.gameArea = $('.gameArea');
        this.topic_explain = new Array(this.levelLimit).fill('剩下多少水量呢？請連線告訴我吧！');
        this.drawingArea = $('.drawingArea');
        if (this.drawingArea.length !== 0){
            this.svgRect = this.drawingArea[0].getBoundingClientRect();
        }
        this.isDrawing = false;
        this.drawView();
        this.gameData = gameData;
        this.line = $('.line:last')[0];
    }
    startGame(level) {
        if (this.gameState=== constant.GAME_ALIVE){
            return
        }
        if (this.gameState=== constant.GAME_WIN){
            this.resetGame(level);
        }
        super.startGame(level);
        this.record = {'q': []
                    , 'a': []
                    , 'result': []
                    };
        this.createQuestions();
        this.createHint();
        reorder(this.gameArea.find('.left'));
        reorder(this.gameArea.find('.right'));
    }

    correctAnswer(){
        $('.line:last').addClass('correctLine');
        const line = getNewLine();
        this.drawingArea.append($(line).addClass('line'));
    }

    wrongAnswer(){
        this.setLives(this.lives-1);
        $('.line:last').addClass('wrongLine');
    }

    drawView() {
        const getDotPos = (event, parentName) => {
            const dot = $(event.target).closest(`.${parentName}`).find('.dot');
            if (parentName=="questionArea"){
                this.record.a.push(`${dot.data('top')}/${dot.data('bottom')}`);
            }
            else if (parentName=="answerArea"){
                this.record.q.push(`${dot.data('top')}/${dot.data('bottom')}`);
            }
            if (event.type === 'touchstart') {
                mouseMoveListener(event);
                // console.log(event);
            }
            const offset = dot.offset();
            const width = dot.width();
            const height = dot.height();
            const x = (offset.left + width / 2);
            const y = (offset.top + height / 2);
            return {x, y};
        }
        const mouseDownListener = (event) => {
            event.preventDefault();
            this.line = $('.line:last')[0];
            const pos = getDotPos(event, "questionArea");
            if ($(this.line).hasClass('wrongLine')){
                $(this.line).removeClass('wrongLine');
            }
            else{
                getNewLine();
                $(this.line).addClass('line');
            }
            this.line.setAttribute("x1", pos.x);
            this.line.setAttribute("y1", pos.y);
            this.line.setAttribute("x2", pos.x);
            this.line.setAttribute("y2", pos.y);
            this.isDrawing = true;
        }
        
        const mouseMoveListener = (event) => {
            event.preventDefault();
            if (!this.isDrawing) return;
            this.line = $('.line:last')[0];
            const {offsetX, offsetY} = event.touches ? event.touches[0] : event;
            this.line.setAttribute("x2", offsetX);
            this.line.setAttribute("y2", offsetY+5);
        }
    
        const mouseupListener = (event) => {
            if (!this.isDrawing) return;
            this.isDrawing = false;
            this.line = $('.line:last')[0];
            const pos = getDotPos(event, "answerArea");
            this.line.setAttribute("x2", pos.x);
            this.line.setAttribute("y2", pos.y);
            this.checkAnswer(
                this.record.q[this.record.q.length-1]
                , this.record.a[this.record.a.length-1]);
        }
        this.gameArea.on("mousedown", (e) => {
            if (checkQuestionArea(e)){
                mouseDownListener(e);
            }
        });
        this.drawingArea.on("mousemove", mouseMoveListener);
        this.gameArea.on("mouseup", (e) => {
            if (checkAnswerArea(e)){
                mouseupListener(e);
            }
        });
        const checkQuestionArea = (e) => {
            if ($(e.target).closest('.questionArea').length) {
                return true;
              }
        }
        const checkAnswerArea = (e) => {
            if ($(e.target).closest('.answerArea').length) {
                return true;
              }
        }
    };

    createQuestions() {
        const level = this.level - 1;
        const $gameArea = $('.gameArea');
        $gameArea.find('.scalls').each((index, value) => {
            let $value = $(value);
            let bottom = this.gameData[level].bottom[index];
            let top = this.gameData[level].top[index];
            const dot = $value.parent('.topicArea').siblings('.dot');
            dot.data({'top': top, 'bottom': bottom});
            $value.siblings('.water').css({ "height": `${top/bottom*100}%` });
            $value.html('<li></li>'.repeat(bottom + 1));
            const fraction = $gameArea.find('.fraction');
            fraction.siblings('.dot').eq(index).data({'top': top, 'bottom': bottom});
            fraction.find('.top').eq(index).html(`<h1>${top}</h1>`);
            fraction.find('.bottom').eq(index).html(`<h1>${bottom}</h1>`);
        });
    }
      
    createHint() {
        $('.hintContainer .left').html(this.gameArea.find('.left .topicArea').clone());
        $('.hintContainer .right').html(this.gameArea.find('.right .fraction').clone());
    }
}


// TODO why gameIframe.contentWindow.game is undifined 
window.game = new Game();

export function getGame(){
    return new Game();
}