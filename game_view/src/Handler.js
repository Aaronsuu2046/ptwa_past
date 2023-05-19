import * as constant from "./constant.js";


// Handlers
export class Handler {
    constructor(game, levelArea) {
      this.game = game;
      this.levelArea = levelArea;
    }
  
    handleRequest(request) {
      switch (request) {
        case constant.LAST_BTN:
            this.levelArea.children().eq(this.game.level-1).removeClass('active');
            this.game.changeLevel(this.game.level, { isPrevious: true });
            this.changeLevel(this.game.level);
            break;
        case constant.START_BTN:
            this.game.startGame(this.game.level);
            this.changeLevel(this.game.level);
            break;
        case constant.NEXT_BTN:
            this.levelArea.children().eq(this.game.level-1).removeClass('active');
            this.game.changeLevel(this.game.level, { isNext: true });
            this.changeLevel(this.game.level);
            break;
        case constant.HINT_BTN:
            this.game.toggleHint();
            break;
        case constant.RECORD_BTN:
            this.game.loadRecord();
            break;
        case constant.SUBMIT_BTN:
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
        $(`#${constant.NEXT_BTN}`).removeClass("jumpBtn");
    }
}
  