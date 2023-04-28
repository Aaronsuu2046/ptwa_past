// option btn
const LAST_BTN = 'lastBtn'
const START_BTN = 'startBtn'
const NEXT_BTN = 'nextBtn'
const HINT_BTN = 'hintBtn'
const RECORD_BTN = 'recordBtn'
const SUBMIT_BTN = 'submitBtn'


// Handlers
export class Handler {
    constructor(game) {
      this.game = game;
    }
  
    handleRequest(request) {
      switch (request) {
        case LAST_BTN:
            this.game.changeLevel(this.game.level, { isPrevious: true });
            break;
        case START_BTN:
            this.game.startGame(this.game.level);
            break;
        case NEXT_BTN:
            this.game.changeLevel(this.game.level, { isNext: true });
            break;
        case HINT_BTN:
            this.game.loadRecord();
            break;
        case RECORD_BTN:
            this.game.toggleHint();
            break;
        case SUBMIT_BTN:
            this.game.checkAnswer();
            break;
        default:
            break;
        }
    }
}
  