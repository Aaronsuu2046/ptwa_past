let CANVAS_WIDTH = 600;
let CANVAS_HEIGHT = 400;
let BLACK = "#000000";
let BLUE = "#48807d";
let GREEN = "#008800";
let RED = "#ff0000";
let H1_FONT_STYLE = "bold 35px Courier";
let SCORE_FONT_STYLE = "bold 30px Courier";

const canvas_bg = document.getElementById('canvas1');
const ctx_bg = canvas_bg.getContext('2d');
const canvas_stay = document.getElementById('canvas2');
const ctx_stay = canvas_stay.getContext('2d');
const canvas_current = document.getElementById('canvas3');
const ctx_current = canvas_current.getContext('2d');
ctx_current.fillStyle = BLACK;
const startBtn = document.getElementById('startBtn')

canvas_bg.width = CANVAS_WIDTH;
canvas_bg.height = CANVAS_HEIGHT;
canvas_stay.width = CANVAS_WIDTH;
canvas_stay.height = CANVAS_HEIGHT;
canvas_current.width = CANVAS_WIDTH;
canvas_current.height = CANVAS_HEIGHT;


let digital_connection = new Game()

digital_connection.animate();