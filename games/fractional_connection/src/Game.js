import * as constant from "../../../game_view/src/constant.js"
import {
    gameModules
    , helpModules
    , svgModules
} from "../../../game_view/src/module.js"
import {
    GameTemplate
} from "../../../game_view/src/GameTemplate.js"


export class Game extends GameTemplate {
    constructor(gameData){
        super(gameData);
        this.gameArea = $('.gameArea');
        this.topicExplain = Array(this.levelLimit).fill('剩下多少水量呢？請連線告訴我吧！');
        this.drawingArea = $('.drawingArea');
        this.svgRect = this.drawingArea.length > 0 ? this.drawingArea[0].getBoundingClientRect() : null;
        this.isDrawing = false;
        this.drawView();
        this.line = $('.line:last')[0];
        $('.closeHintBtn').on('click', this.toggleHint);
    }
    startGame(level) {
        if (this.gameState === constant.GAME_ALIVE) return;
        if (this.gameState === constant.GAME_WIN) this.resetGame(level);
        super.startGame(level);
        this.drawingArea.html('');
        this.line = $(svgModules.getNewLine()).addClass('line')[0];
        this.drawingArea.append($(this.line));
        this.recordObj.record = this.recordObj.createEmptyRecord();
        this.createQuestions();
        this.createHint();
        helpModules.reorder(this.gameArea.find('.left'));
        helpModules.reorder(this.gameArea.find('.right'));
    }

    resetGame(level){
        super.resetGame(level);
        $('.overlay').css('display', 'none');
    }

    correctAnswer(){
        $('.line:last').addClass('correctLine');
        this.line = $(svgModules.getNewLine()).addClass('line')[0];
        this.drawingArea.append($(this.line));
    }

    wrongAnswer(){
        this.setLives(this.lives-1);
        $('.line:last').addClass('wrongLine');
    }
    getGameResult(){
        const correctRecords = this.recordObj.record.a.filter((_, i) => this.recordObj.record.result[i] === 'O');
        const correctRecordSet = new Set(correctRecords);
        if (correctRecordSet.size >= this.gameData.length) {
            this.getWin();
        }
    }
    drawView() {
        const getDotPos = (event, parentName) => {
            const dot = $(event.target).closest(`.${parentName}`).find('.dot');
            const recordType = parentName === "questionArea" ? "q" : "a";
            const top = dot.data('top');
            const bottom = dot.data('bottom');
            this.recordObj.appendToRecord(recordType, `${top}/${bottom}`);
            if (event.type === 'touchstart') {
                mouseMoveListener(event);
            }
            const offset = dot.offset();
            const width = dot.width();
            const height = dot.height();
            const x = (offset.left + width / 2);
            const y = (offset.top + height / 2);
            return { x, y };
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
            const { offsetX, offsetY } = event.touches ? event.touches[0] : event;
            this.line.setAttribute("x2", offsetX);
            this.line.setAttribute("y2", offsetY + 5);
        }
    
        const mouseupListener = (event) => {
            if (!this.isDrawing) return;
            this.isDrawing = false;
            const pos = getDotPos(event, "answerArea");
            this.line.setAttribute("x2", pos.x);
            this.line.setAttribute("y2", pos.y);
            const lastQuestion = this.recordObj.record.q[this.recordObj.record.q.length - 1];
            const lastAnswer = this.recordObj.record.a[this.recordObj.record.a.length - 1];
            this.checkAnswer(lastQuestion, lastAnswer);
        };
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
            return $(e.target).closest('.questionArea').length > 0;
        };

        const checkAnswerArea = (e) => {
            return $(e.target).closest('.answerArea').length > 0;
        };
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

const gameData = await gameModules.getJson('../../games/fractional_connection/game_config.json');
const gameInstance = new Game(gameData);
window.getGame = function() {
    return gameInstance;
};

parent.postMessage({ type: 'fractional_connection' }, '*');
