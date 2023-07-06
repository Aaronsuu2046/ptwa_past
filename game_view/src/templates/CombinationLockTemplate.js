import * as constant from "../constant.js"
import {gameModules} from "../module.js"
import {GameFramework} from "../GameFramework.js"

// Export your game
export class CombinationLockTemplate extends GameFramework {
    constructor(gameData){
        super(gameData);
        // Initialise game object
        this.bottomArea = new Proxy(new BottomAreaGenerator(), {
            set: (target, property, value) => {
                // Check if the changed property is 'correntQuestion'
                if (property === 'correntQuestion') {
                    this.changeTopic(value);
                    $('.questionIndex').text(`${value}/${gameData[this.level-1].question.length}`)
                }
                target[property] = value;
                return true;
            }
        });
        this.drawingGenerator = new DrawingGenerator();
    }
    
    startGame(level) {
        this.bottomArea.initialize(this.gameData[this.level-1]);
        super.startGame(level);
        // create game content
        this.answerLimit = this.gameData[this.level-1].answer.length;
        this.currentAnswer = [];
        this.topArea = $('.topArea')
        this.drawingGenerator.remove();
        if (this.gameData[this.level-1].isDraw === 'true') {
            this.drawingGenerator = new DrawingGenerator();
        }
    }
    
    changeTopic(correntQuesionIndex) {
        // If need that can overwrite this function
    }

    compareAnswer() {
        let currentAnswer = [];
        this.result = constant.BINGO;

        $('.answerInput').each((i, answer) => {
            let textValue = isNaN(Number($(answer).val()))?$(answer).val():Number($(answer).val());
            let dataValue = isNaN(Number($(answer).attr('data-value')))?$(answer).attr('data-value'):Number($(answer).attr('data-value'));
            let result = false;

            if (textValue === dataValue) {
                result = true;
                $(answer).removeClass('redWord');                
                $(answer).addClass('greenWord');
            }
            else {
                this.result = constant.DADA;
                $(answer).removeClass('greenWord');
                $(answer).addClass('redWord');
            }
            currentAnswer.push(textValue);
            $(answer).attr('data-isRight', result);
        });
        this.currentAnswer = currentAnswer;
    }
    

    // The following methods must be overridden
    getGameResult(){
        // juddging
        const incorrectElements = $('.answerInput').filter((i, answer) => {
            return $(answer).attr('data-isRight') === 'true';
        });
          
        if (incorrectElements.length >= this.answerLimit) {
            this.gameState = constant.GAME_WIN;
        }
    }
    correctAnswer(){
        // action
        throw new Error('please define correctAnswer');
    }
    wrongAnswer(){
        // action
        throw new Error('please define wrongAnswer');
    }
}

class BottomAreaGenerator {
    constructor() {
        const bottomAreaHTML = `
        <div class="bottomArea">
            <div class="answerContainer">
                <div class="answerArea">
                </div>
            </div>
            <h3 class="questionIndex"></h3>
        </div>
        `;
        $('.gameArea').append(bottomAreaHTML);
    }
    
    initialize(gameData) {
        if (gameData.question.length > 1) {
            $('.lastAnswer, .nextAnswer').remove();
            $('.bottomArea').prepend(`<button class="lastAnswer">&lt;</button>`);
            $('.bottomArea').append(`<button class="nextAnswer">&gt;</button>`);
        }
        $('.answerArea *').remove();
        this.gameQuestion = [...gameData.question];
        this.gameAnswer = [...gameData.answer];
        this.correntQuestion = 1;
        this.currentAnswer = null;
        this.generateAnswerArea();
        this.showQuestion();
        this.handleEvent();
    }

    generateAnswerArea() {
        this.gameQuestion.forEach((str, index) => {
            let answerAreaHTML = '';
            let parts = str.split('&');
            
            for(let i = 0; i < parts.length; i++){
                let dataCount = Number(parts[i][0]);
                dataCount = isNaN(dataCount) ? 0 : dataCount;
                if(dataCount){
                    
                    for (let j = 0; j < dataCount; j++) {
                        let dataValue = this.gameAnswer.splice(0, 1)[0];
                        dataValue = dataValue || '';
                        const newH1 = $('<input>', {class: 'answerInput', text: '0', type:'number', min: "0", max: "9", value: "0", id: `digit${j}`});
                        newH1.attr({
                            'data-value': dataValue,
                            'data-isRight': false
                        });
                        answerAreaHTML += `
                            <div class="combinationLock">
                                <button class="decrementButton">-</button>
                                ${newH1.prop('outerHTML')}
                                <button class="incrementButton">+</button>
                            </div>
                        `;
                    }
    
                    parts[i] = parts[i].substring(1);
                }

                answerAreaHTML += '<h1>' + parts[i] + '</h1>';
            }
            $('.answerArea').append(`<div id="q${index}"> ${answerAreaHTML}</div>`);
            $(`#q${index}`).hide()
        });
    
        return this;
    }
    
    changeQuestion(options={}) {
        const {isPrevious=false, isNext=false } = options;
        if (isPrevious){
            this.correntQuestion = this.correntQuestion > 1 ? this.correntQuestion - 1 : $('.answerArea').children().length;
        }
        else if (isNext){
            this.correntQuestion = this.correntQuestion < $('.answerArea').children().length ? this.correntQuestion + 1 : 1;
        }
        this.showQuestion();
    }
    
    showQuestion() {
        $('.answerArea > *').hide();

        $('.answerArea > *').eq(this.correntQuestion-1).show();
    }

    handleEvent() {
        const handleNumberInput = (e) => {
            e.preventDefault();
            const input = e.target;
            const step = parseFloat(input.step) || 1;
            const value = parseFloat(input.value) || 0;
            const deltaY = e.originalEvent.deltaY || -e.originalEvent.wheelDelta;
            if (deltaY < 0) {
                input.value = Math.min(input.max, value + step);
            } else {
                input.value = Math.max(input.min, value - step);
            }
        }

        const combinationLocks = $(".combinationLock");
        combinationLocks.each((i, combinationLock) => {
            const $combinationLock = $(combinationLock);
            const $input = $combinationLock.find('input');
            $input.on("wheel mousewheel", handleNumberInput);
            const incrementButton = $combinationLock.find(".incrementButton");
            const decrementButton = $combinationLock.find(".decrementButton");
            
            const increment = function() {
                const value = +$input.val();
                $input.val(parseInt(Math.min(value + 1, 9)));
            };
            
            const decrement = function() {
                const value = +$input.val();
                $input.val(parseInt(Math.max(value-1, 0)));
            };
            
            incrementButton.on('click', increment);
            decrementButton.on('click', decrement);
        });
        
        $('.lastAnswer').on('pointerdown', () => {
            this.changeQuestion({question: this.correntQuestion,isPrevious: true});
        });
        $('.nextAnswer').on('pointerdown', () => {
            this.changeQuestion({question: this.correntQuestion,isNext: true});
        });

    }
}

class DrawingGenerator {
    constructor() {
        const drawingTool = `
            <div class="cursor cursor-eraser"></div>
            <div class="drawingTool">
                <button id="pencil" class="icon clicked-bg">畫筆</button>
                <button id="eraser" class="icon">橡皮擦</button>
            </div>
        `
        $('.gameArea').prepend(drawingTool);
        $('.topArea').prepend(`<canvas id="drawArea"></canvas>`);
        $('.cursor-eraser').hide();

        this.canvas = document.getElementById('drawArea');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    
        this.context.strokeStyle = "#000000";
        this.context.lineWidth = 5;
    
        this.drawing = false;
        let offset = $('#drawArea').offset();

        $('#drawArea').on('pointerdown touchstart', (e) => {
            e.preventDefault();
            this.drawing = true;
            this.context.beginPath();
            const {pageX, pageY} = e.touches ? e.touches[0] : e;
            this.context.moveTo(pageX - offset.left, pageY - offset.top);
        }).on('pointermove', (e) => {
            if (this.drawing) {
                const {pageX, pageY} = e.touches ? e.touches[0] : e;
                this.context.lineTo(pageX - offset.left, pageY - offset.top);
                this.context.stroke();
                $('.cursor').css({
                    left:  pageX-10,
                    top:   pageY-10
                });
            }
        }).on('pointerup', () => {
            this.drawing = false;
        }).on('pointerleave', () => {
            this.drawing = false;
        });
    
        $('.drawingTool').click((e) => {
            if (e.target.id === 'pencil') {
                this.context.globalCompositeOperation = "source-over";
                this.context.lineWidth = 5;
                $('#eraser').removeClass('clicked-bg');
                $('.cursor-eraser').hide();
            }
            else if (e.target.id === 'eraser') {
                this.context.globalCompositeOperation = "destination-out";
                this.context.lineWidth = 20;
                $('#pencil').removeClass('clicked-bg');
                $('.cursor-eraser').show();
            }
            else return
            $(`#${e.target.id}`).toggleClass('clicked-bg');
        });
    }

    remove() {
        $('.drawingTool').remove();
        $('#drawArea').remove();
    }
}