// setting
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ctx2 = canvas.getContext('2d');
const distance = 2;
const backgroundWidth = 400;
const backgroundHeight = 400;
const backgroundPosX = 0;
const backgroundPosY = 0;
let offsetX = 0;
let offsetY = 0;

function setting() {
    canvas.width = backgroundWidth + distance;
    canvas.height = backgroundHeight + distance;
}
setting();

class Background {
    constructor(backgroundPosX, backgroundPosY, backgroundWidth, backgroundHeight) {
        this.width = backgroundWidth;
        this.height = backgroundHeight;
        this.posX = backgroundPosX;
        this.posY = backgroundPosY;
        this.offsetX = 0;
        this.offsetY = 0;
        this.posXWithOffset = 0;
        this.posYWithOffset = 0;
        // console.log(this.posX + ',' + this.posY);
    }

    draw() {
        const distance = 2;
        // FILL RECTANGLE
        ctx.fillStyle = "#8FBC8F";
        ctx.fillRect(this.posX, this.posY, this.width + distance, this.height + distance);

        // debug
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.strokeRect(this.posX, this.posY, this.width + distance, this.height + distance);

        // const text = this.posX + ", " + this.posY + ", " + this.offsetX + ", " + this.offsetY;
        // ctx.fillStyle = "#000000";
        // ctx.font = "20px Georgia";
        // ctx.fillText(text, this.posX + 2, this.posY + 13);
    }

    update() {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.posXWithOffset = this.posX + this.offsetX;
        this.posYWithOffset = this.posY + this.offsetY;
    }
}
const background = new Background(backgroundPosX, backgroundPosY, backgroundWidth, backgroundHeight);

class Block {
    constructor(posX, posY, index, offsetX, offsetY, row, column) {
        this.posX = posX;
        this.posY = posY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.posXWithOffset = posX + offsetX;
        this.posYWithOffset = posY + offsetY;
        this.width = 100;
        this.height = 100;
        this.index = index;
        this.row = row;
        this.column = column;
        this.puzzle = null;
    }

    draw() {
        // const distance = 2;
        // ctx.fillStyle = "#DEB887";
        // ctx.fillRect(this.posX + distance, this.posY + distance, this.width - distance, this.height - distance);
        if (this.puzzle != null) {
            this.puzzle.draw();
        }
    }

    update() {
        if (this.puzzle != null) {
            this.puzzle.update();
        }
        this.posXWithOffset = this.posX + this.offsetX;
        this.posYWithOffset = this.posY + this.offsetY;
    }
}

class Puzzle {
    constructor(posX, posY, index, text) {
        this.posX = posX;
        this.posY = posY;
        this.width = 100;
        this.height = 100;
        this.index = index;
        this.text = text;
    }

    draw() {
        const distance = 2;
        ctx.fillStyle = "#DEB887";
        ctx.fillRect(this.posX + distance, this.posY + distance, this.width - distance, this.height - distance);

        ctx.fillStyle = "#aa0000";
        ctx.font = "bold 38px Oswald";
        let textPosX = this.posX + (this.width/2);
        let textPosY = this.posY + (this.height/2);
        if (this.text > 9) {
            ctx.fillText(this.text, textPosX - 20, textPosY + 10);
        } else {
            ctx.fillText(this.text, textPosX - 10, textPosY + 10);
        }
    }

    update() {

    }
}

// run
let start = false;
let isWin = false;
let blocks = [];
let puzzles = [];
totalblocksX = backgroundWidth/100;
totalblocksY = backgroundHeight/100;
totalblocks = totalblocksX * totalblocksY;
function initGame() {
    let indexRandom = [];
    let posX = background.posX;
    let posY = background.posY;
    let count = 0;
    let row = 0;
    for (i = 0; i < totalblocks; i++) {
        let block = new Block(posX, posY, i, background.posXWithOffset, background.posYWithOffset, row, count);
        let puzzle = null;
        if (i < totalblocks - 1) {
            let random = Math.floor(Math.random() * totalblocks);
            while (indexRandom.includes(random)) {
                random = Math.floor(Math.random() * totalblocks);
            }
            indexRandom[i] = random;
            let text = random + 1;
            puzzle = new Puzzle(posX, posY, random, text);
            // let text = i+1;
            // puzzle = new Puzzle(posX, posY, i, text);
            puzzles[i] = puzzle;
        }
        block.puzzle = puzzle;

        blocks[i] = block;
        posX += block.width;
        if (count === (totalblocksX - 1)) {
            posY += block.height;
            posX = backgroundPosX;
            count = 0;
            row++;
        } else {
            count++;
        }
    }
    // console.log(blocks);
}

function setBackGroundOffset(offsetX, offsetY) {
    background.offsetX = offsetX;
    background.offsetY = offsetY;
    background.update();
}

let hours = 0;
let minutes = 0;
let second = 0;
let time;
function timeSlap() {
    time = setInterval(function updateDateTime() {
        second++;
        if (second === 60) {
            second = 0;
            minutes++;
        }
        if(minutes === 60) {
            minutes = 0;
            hours++;
        }
        const timer = 'Time: ' + hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + second.toString().padStart(2, '0');
        document.getElementById('timer').textContent = timer;
    }, 1000);
}

window.addEventListener('click', function (e) {
    // console.log(e.x, e.y);
    if (isWin) {
        return;
    }
    let flag = false;
    [...blocks].forEach(block => {
        if (e.x >= block.posXWithOffset && e.x <= (block.posXWithOffset + block.width) && e.y >= block.posYWithOffset && e.y <= (block.posYWithOffset + block.height)) {
            if (block.puzzle != null && flag === false) {
                if (start === false) {
                    start = true;
                    timeSlap();
                }
                if(block.column > 0 && blocks[block.index - 1].puzzle === null) { // left block
                    block.puzzle.posX = blocks[block.index - 1].posX;
                    block.puzzle.posY = blocks[block.index - 1].posY;
                    blocks[block.index - 1].puzzle = block.puzzle;
                    block.puzzle = null;
                    flag = true;
                    // console.log(blocks[block.index - 1]);
                } else if (block.column < totalblocksX - 1 && blocks[block.index + 1].puzzle === null) { // right block
                    block.puzzle.posX = blocks[block.index + 1].posX;
                    block.puzzle.posY = blocks[block.index + 1].posY;
                    blocks[block.index + 1].puzzle = block.puzzle;
                    block.puzzle = null;
                    flag = true;
                    // console.log(blocks[block.index + 1]);
                } else if (block.row > 0 && blocks[block.index - totalblocksX].puzzle === null) { // up block
                    block.puzzle.posX = blocks[block.index - totalblocksX].posX;
                    block.puzzle.posY = blocks[block.index - totalblocksX].posY;
                    blocks[block.index - totalblocksX].puzzle = block.puzzle;
                    block.puzzle = null;
                    flag = true;
                    // console.log(blocks[block.index - maxPuzzle]);
                } else if (block.row < totalblocksY - 1 && blocks[block.index + totalblocksX].puzzle === null) { // down block
                    block.puzzle.posX = blocks[block.index + totalblocksX].posX;
                    block.puzzle.posY = blocks[block.index + totalblocksX].posY;
                    blocks[block.index + totalblocksX].puzzle = block.puzzle;
                    block.puzzle = null;
                    flag = true;
                    // console.log(blocks[block.index + maxPuzzle]);
                }
                if (checkWin()) {
                    isWin = true;
                    clearInterval(time);
                }
            }
            // console.log(block);
        }
    });
    // console.log(flag);
});

function checkWin() {
    let count = 0;
    [...blocks].forEach(block => {
        if (block.puzzle !== null && block.index === block.puzzle.index) {
            count++;
        }
    });
    if (count === blocks.length - 1) {
        return true;
    }
    return false;
}

function reset() {
    // reset Game
    second = 0;
    minutes = 0;
    hours = 0;
    isWin = false;
    start = false;
    blocks = [];
    puzzles = [];
    clearInterval(time);
    const timer = 'Time: ' + hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + second.toString().padStart(2, '0');
    document.getElementById('timer').textContent = timer;
    initGame();
}

function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas clear
    background.draw();
    background.update();
    [...blocks].forEach(block => block.draw());
    [...blocks].forEach(block => block.update());
    const id = requestAnimationFrame(animate);
    if (isWin) {
        const text = "Congratulation!!!";
        ctx2.fillStyle = "#008080";
        ctx2.font = "bold 38px Georgia";
        ctx2.fillText(text, (background.posX + background.width)/10, (background.posY + background.height)/2);
        cancelAnimationFrame(id);
    }
}

window.onload = function() {
    const rect = document.getElementById("editor_canvas").getBoundingClientRect();
    offsetX = rect.left;
    offsetY = rect.top;
    // console.log("offsetX:" + offsetX + " - offsetY: " + offsetY);
    setBackGroundOffset(offsetX, offsetY);
    initGame();
    animate(0);
};