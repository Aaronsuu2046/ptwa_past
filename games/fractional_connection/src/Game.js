import * as constant from "../../../game_view/src/constant.js"
import {getJson, reorder, getNewLine} from "../../../game_view/src/module.js"
import {GameTemplate} from "../../../game_view/src/GameTemplate.js"


const gameData = await getJson('../../games/fractional_connection/game_config.json');

export class Game extends GameTemplate {
    constructor(gameData){
        super(gameData);
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
        $('.closeHintBtn').on('click', this.toggleHint);
    }
    startGame(level) {
        if (this.gameState=== constant.GAME_ALIVE){
            return
        }
        if (this.gameState=== constant.GAME_WIN){
            this.resetGame(level);
        }
        super.startGame(level);
        this.drawingArea.html('');
        this.line = $(getNewLine()).addClass('line')[0];
        this.drawingArea.append($(this.line));
        this.record = {'q': []
                    , 'a': []
                    , 'result': []
                    };
        this.createQuestions();
        this.createHint();
        reorder(this.gameArea.find('.left'));
        reorder(this.gameArea.find('.right'));
    }

    resetGame(level){
        super.resetGame(level);
        $('.overlay').css('display', 'none');
    }

    correctAnswer(){
        $('.line:last').addClass('correctLine');
        this.line = $(getNewLine()).addClass('line')[0];
        this.drawingArea.append($(this.line));
    }

    wrongAnswer(){
        this.setLives(this.lives-1);
        $('.line:last').addClass('wrongLine');
    }
    getGameResult(){
        const correct_record = new Set(
            this.record.a.map((_, i) => this.record.a[i]).filter((_, i) => this.record.result[i] === 'O')
        );
          
        if (correct_record.size >= this.gameData.length){
            this.getWin();
        }
    }
    drawView() {
        const getDotPos = (event, parentName) => {
            const dot = $(event.target).closest(`.${parentName}`).find('.dot');
            if (parentName=="questionArea"){
                this.appendToRecordQ(`${dot.data('top')}/${dot.data('bottom')}`)
            }
            else if (parentName=="answerArea"){
                this.appendToRecordA(`${dot.data('top')}/${dot.data('bottom')}`)
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
            const pos = getDotPos(event, "questionArea");
            if ($(this.line).hasClass('wrongLine')){
                $(this.line).removeClass('wrongLine');
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
            const {offsetX, offsetY} = event.touches ? event.touches[0] : event;
            this.line.setAttribute("x2", offsetX);
            this.line.setAttribute("y2", offsetY+5);
        }
    
        const mouseupListener = (event) => {
            if (!this.isDrawing) return;
            this.isDrawing = false;
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

export default Game;

const gameInstance = new Game(gameData);
window.getGame = function() {
    return gameInstance;
};

window.addEventListener('load', function() {
    parent.postMessage({ type: 'iframeLoaded' }, '*');
  });
  