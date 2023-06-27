import * as constant from "../constant.js"
import {gameModules} from "../module.js"
import {GameFramework} from "../GameFramework.js"

// Export your game
export class CombinationLockTemplate extends GameFramework {
    constructor(gameData){
        super(gameData);
        // Initialise game object
        this.bottomArea = new BottomAreaGenerator(this.gameData[this.level-1])
        this.answerLimit = this.gameData[this.level-1].length;
        this.currentAnswer = [];
        this.combinationLock = $('.combinationLock')
    }

    compareAnswer() {
        let currentAnswer = [];
        $('.answerInput').each((i, answer) => {
            let textValue = isNaN(Number($(answer).text()))?$(answer).text():Number($(answer).text());
            let dataValue = isNaN(Number($(answer).attr('data-value')))?$(answer).attr('data-value'):Number($(answer).attr('data-value'));
            let result = false;
    
            if (textValue === dataValue) {
                result = true;
            }
            currentAnswer.push(textValue);
            $(answer).attr('data-isRight', result);
            this.result = result ? constant.BINGO : constant.DADA;
            gameModules.showResultView(this.result);
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
    constructor(gameData) {
        this.gameQuestion = gameData.question;
        this.gameAnswer = gameData.answer;
        this.correctQuestion = 1;
        this.inputLength = gameData.inputLength;
        this.currentAnswer = null;
        const bottomAreaHTML = `
        <div class="bottomArea">
            <button class="lastAnswer">&lt;</button>
            <div class="answerContainer">
                <div class="answerArea">
                </div>
                <div class="combinationLock">
                    <div class="combinationLockContainer">
                    </div>
                    <button>輸入</button>
                </div>
            </div>
            <button class="nextAnswer">&gt;</button>
        </div>
        `;
        $('.gameArea').append(bottomAreaHTML);
        this.generateAnswerArea().generateCombinationLock();
        this.showQuestion();
        this.handleEvent();
        return this;
    }
    generateAnswerArea() {
        this.gameQuestion.forEach((str, index) => {
            let answerAreaHTML = '';
            let parts = str.split('&');
            
            for(let i = 0; i < parts.length; i++){
                let dataCount = Number(parts[i][0]);
                dataCount = isNaN(dataCount) ? 0 : dataCount;
                if(dataCount){
                    let dataValue = this.gameAnswer[index];
    
                    dataValue = dataValue || '';
    
                    let newH1 = $('<h1>', {class: 'answerInput', text: '　'});
    
                    newH1.attr({
                        'data-count': dataCount,
                        'data-value': dataValue,
                        'data-isRight': false
                    });
    
                    answerAreaHTML += newH1.prop('outerHTML');
                    
                    parts[i] = parts[i].substring(1);
                }

                answerAreaHTML += '<h1>' + parts[i] + '</h1>';
            }
            $('.answerArea').append(`<div id="q${index}"> ${answerAreaHTML}</div>`);
            $(`#q${index}`).hide()
        });
    
        return this;
    }
    
    generateCombinationLock() {
        const combinationLockContainer = $('.combinationLockContainer');
        combinationLockContainer.empty();
        
        for (let i = 1; i <= this.inputLength; i++) {
            const inputHTML = `
                <div>
                    <input type="number" id="digit${i}" min="0" max="9" value="0" />
                </div>
            `;
            combinationLockContainer.append(inputHTML);
        }
        
        return this;
    }
    
    changeQuestion(options={}) {
        const {isPrevious=false, isNext=false } = options;
        if (isPrevious){
            this.correctQuestion = this.correctQuestion > 1 ? this.correctQuestion - 1 : $('.answerArea').children().length;
        }
        else if (isNext){
            this.correctQuestion = this.correctQuestion < $('.answerArea').children().length ? this.correctQuestion + 1 : 1;
        }
        this.showQuestion();
    }
    showQuestion() {
        
        $('.answerArea > *').hide();

        $('.answerArea > *').eq(this.correctQuestion-1).show();
    }

    handleEvent() {
        const answerInput = $('.answerInput');
        const combinationLock = $('.combinationLock');

        answerInput.each((i,  answer) => {
            $(answer).on('click', () => {
                this.currentAnswer = $(answer);
                combinationLock.toggle();
                if (combinationLock.is(':visible')) {
                    combinationLock.css('display', 'flex');
                }
            });
        });
        
        const handleNumberInput = (e) => {
            e.preventDefault();
            const input = e.target;
            const step = parseFloat(input.step) || 1;
            const value = parseFloat(input.value) || 0;
            const deltaY = e.originalEvent.deltaY || -e.originalEvent.wheelDelta;
            if (deltaY < 0) {
                input.value = Math.max(input.min, value - step);
            } else {
                input.value = Math.min(input.max, value + step);
            }
        }

        const checkPassword = () => {
            const inputs = $('input[type="number"]');
            let inputsAnswer = "";
            inputs.each((i, ele) => {
                inputsAnswer += $(ele).val();
            })
    
            this.currentAnswer.text(isNaN(Number(inputsAnswer))?inputsAnswer:Number(inputsAnswer));
            combinationLock.toggle();
        }

        const inputs = $("input[type='number']");
        inputs.each(function() {
            $(this).on("wheel mousewheel", handleNumberInput);
        });
        
        $('.combinationLock button').on('pointerdown', checkPassword);
        $('.lastAnswer').on('pointerdown', () => {
            this.changeQuestion({question: this.correctQuestion,isPrevious: true});
        });
        $('.nextAnswer').on('pointerdown', () => {
            this.changeQuestion({question: this.correctQuestion,isNext: true});
        });
    }
}