// option btn
const LAST_BTN = 'lastBtn'
const START_BTN = 'startBtn'
const NEXT_BTN = 'nextBtn'
const HINT_BTN = 'hintBtn'
const RECORD_BTN = 'recordBtn'
const SUBMIT_BTN = 'submitBtn'


// Handlers
export class Handler {
    constructor(game, levelArea) {
      this.game = game;
      this.levelArea = levelArea;
    }
  
    handleRequest(request) {
      switch (request) {
        case LAST_BTN:
            this.levelArea.children().eq(this.game.level-1).removeClass('active');
            this.game.changeLevel(this.game.level, { isPrevious: true });
            this.changeLevel(this.game.level);
            break;
        case START_BTN:
            this.game.startGame(this.game.level);
            this.changeLevel(this.game.level);
            break;
        case NEXT_BTN:
            this.levelArea.children().eq(this.game.level-1).removeClass('active');
            this.game.changeLevel(this.game.level, { isNext: true });
            this.changeLevel(this.game.level);
            break;
        case HINT_BTN:
            this.game.toggleHint();
            break;
        case RECORD_BTN:
            this.game.loadRecord();
            break;
        case SUBMIT_BTN:
            this.game.checkAnswer();
            break;
        default:
            break;
        }
    }
    changeLevel(level){
        this.game.winLevelSet.forEach((value) => 
            this.levelArea.children().eq(value-1).addClass('win')
        )
        this.levelArea.children().eq(level-1).addClass('active').removeClass('win');
    }
}
  