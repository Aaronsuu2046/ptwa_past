import * as constant from "../../../game_view/src/constant.js"
import {getJson, reorder, createLine} from "../../../game_view/src/function.js"
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

    drawView() {
        const line = $('.line')[0];
        const getDotPos = (event, parentName) => {
            const dot = $(event.target).closest(`.${parentName}`).find('.dot');
            const offset = dot.offset();
            const width = dot.width();
            const height = dot.height();
            const x = (offset.left + width / 2);
            const y = (offset.top + height / 2);
            return {x, y};
        }
        const mouseDownListener = (event) => {
            event.preventDefault();
            const pos = getDotPos(event, "questionArea");
            if (line.className.baseVal.includes('wrongLine')){
                $(line).removeClass('wrongLine');
            }
            else{
                createLine();
                $(line).addClass('line');
            }
            line.setAttribute("x1", pos.x);
            line.setAttribute("y1", pos.y);
            line.setAttribute("x2", pos.x);
            line.setAttribute("y2", pos.y);
            this.isDrawing = true;
        }
        
        const mouseMoveListener = (event) => {
            event.preventDefault();
            if (!this.isDrawing) return;
            const {offsetX, offsetY} = event.touches ? event.touches[0] : event;
            line.setAttribute("x2", offsetX);
            line.setAttribute("y2", offsetY+5);
        }
    
        const mouseupListener = (event) => {
            if (!this.isDrawing) return;
            this.isDrawing = false;
            const pos = getDotPos(event, "answerArea");
            line.setAttribute("x2", pos.x);
            line.setAttribute("y2", pos.y);
            // this.checkAnswer();
        }
        this.gameArea.on("mousedown", (e) => {
            if (checkQuestionArea(e)){
                mouseDownListener(e);
            }
        });
        this.gameArea.on("touchstart", (e) => {
            if (checkQuestionArea(e)){
                mouseDownListener(e);
            }
        });
        this.drawingArea.on("mousemove", mouseMoveListener);
        this.gameArea.on("touchmove", (e) => {
            mouseMoveListener(e);
        });
        this.gameArea.on("mouseup", (e) => {
            if (checkAnswerArea(e)){
                mouseupListener(e);
                console.log("up")
            }
        });
        this.gameArea.on("touchend", (e) => {
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
            $value.siblings('.water').css({ "height": `${top/bottom*100}%` });
            $value.html('<li></li>'.repeat(bottom + 1));
            $gameArea.find('.fraction .top').eq(index).html(`<h1>${top}</h1>`);
            $gameArea.find('.fraction .bottom').eq(index).html(`<h1>${bottom}</h1>`);
        });
    }
      
    createHint() {
        $('.hintContainer .left').html(this.gameArea.find('.left .topicArea').clone());
        $('.hintContainer .right').html(this.gameArea.find('.right .fraction').clone());
    }
}


// TODO why gameIframe.contentWindow.game is undifined 
window.game = new Game();

const game = new Game();