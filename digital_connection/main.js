let CANVAS_WIDTH = 600;
let CANVAS_HEIGHT = 400;

const canvas = document.getElementById('canvas1');
const canvas_2 = document.getElementById('canvas2');
const ctx_bg = canvas.getContext('2d');
const ctx_line = canvas_2.getContext('2d');
const startBtn = document.getElementById('startBtn')

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas_2.width = CANVAS_WIDTH;
canvas_2.height = CANVAS_HEIGHT;


let digital_connection = new Game()

// digital_connection.animate();