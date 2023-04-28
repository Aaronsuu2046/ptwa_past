import { GameTemplate as Game} from "./GameTemplate.js"
import { Game as FractionalConnection } from "../../games/fractional_connection/src/Game.js"
// option btn
const fractionalConnection = 'fractional_connection'


export class GameController {
    constructor(gameName) {
      this.gameName = gameName;
      this.game = this.getGame(gameName);
    }
  
    getGame(gameName) {
        switch (gameName) {
            case fractionalConnection:
                return new FractionalConnection();
        default:
            break;
        }
    }
}
  