let CANVAS_WIDTH = 600;
let CANVAS_HEIGHT = 400;
let BLACK = "#000000";
let BLUE = "#48807d";
let GREEN = "#008800";
let FONT_STYLE = "bold 35px Courier";

const canvas = document.getElementById('canvas1');
const ctx_bg = canvas.getContext('2d');
const canvas_2 = document.getElementById('canvas2');
const ctx_correct_line = canvas_2.getContext('2d');
const canvas_3 = document.getElementById('canvas3');
const ctx_line = canvas_3.getContext('2d');
ctx_line.fillStyle = BLACK;
const startBtn = document.getElementById('startBtn')

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas_2.width = CANVAS_WIDTH;
canvas_2.height = CANVAS_HEIGHT;
canvas_3.width = CANVAS_WIDTH;
canvas_3.height = CANVAS_HEIGHT;


let digital_connection = new Game()

digital_connection.animate();