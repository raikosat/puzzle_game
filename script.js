const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;
gameWidth = 400;
gameHeight = 400;
blockWidth = 100;
blockHeight = 100;
totalPuzzles = 15;
maxPuzzle = 4;
isWin = false;
time = 0;

class Background {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.centerX = gameWidth/2 - 200;
        this.centerY = gameHeight/2 - 200;
    }

    draw() {
        // FILL RECTANGLE
        ctx.fillStyle = "#ffd700";
        ctx.fillRect(this.centerX, this.centerY, this.gameWidth, this.gameHeight);
    }

    update() {

    }
}

const background = new Background(gameWidth, gameHeight);

class Block {
    constructor(posX, posY, index) {
        this.posX = posX;
        this.posY = posY;
        this.blockWidth = 100;
        this.blockHeight = 100;
        this.index = index;
        this.puzzle = null;
    }

    draw() {
        // let distant = 2;
        // ctx.fillStyle = "#0000ff";
        // ctx.fillRect(this.posX + distant, this.posY + distant, this.blockWidth - (distant*2), this.blockHeight - (distant*2));
        if (this.puzzle != null) {
            this.puzzle.draw();
        }
    }

    update() {
        if (this.puzzle != null) {
            this.puzzle.update();
        }
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
        let distant = 2;
        let posXCurrent = this.posX + distant;
        let posYCurrent = this.posY + distant;
        let widthCurrent = this.width - (distant*2);
        let heightCurrent = this.height - (distant*2);
        ctx.fillStyle = "#008000";
        ctx.fillRect(posXCurrent, posYCurrent, widthCurrent, heightCurrent);

        ctx.fillStyle = "#aa0000";
        ctx.font = "38px Arial";
        let textPosX = posXCurrent + (widthCurrent/2);
        let textPosY = posYCurrent + (heightCurrent/2);
        if (this.text > 9) {
            ctx.fillText(this.text, textPosX - 20, textPosY + 10);
        } else {
            ctx.fillText(this.text, textPosX - 10, textPosY + 10);
        }
    }

    update() {

    }
}

let blocks = [];
let puzzles = [];
function begin() {
    let indexRandom = [];
    let posX = background.centerX;
    let posY = background.centerY;
    for (i = 0; i <= totalPuzzles; i++) {
        let block = new Block(posX, posY, i);
        let puzzle = null;
        if (i < totalPuzzles) {
            let random = Math.floor(Math.random() * totalPuzzles);
            while (indexRandom.includes(random)) {
                random = Math.floor(Math.random() * totalPuzzles);
            }
            indexRandom[i] = random;
            let text = random + 1;
            puzzle = new Puzzle(posX, posY, random, text);
            puzzles[i] = puzzle;
        }

        block.puzzle = puzzle;
        blocks[i] = block;
        posX += block.blockWidth;
        if (posX >= (background.centerX+background.gameWidth)) {
            posY += block.blockHeight;
            posX = background.centerX;
        }
    }
}
begin();

window.addEventListener('click', function (e) {
    // console.log(e.x, e.y);
    let flag = false;
    [...blocks].forEach(block => {
        if (e.x >= block.posX && e.x <= (block.posX + block.blockWidth) && e.y >= block.posY && e.y <= (block.posY + block.blockHeight)) {
            if (block.puzzle != null && flag === false) {
                if(block.index - 1 >= 0 && blocks[block.index - 1].puzzle === null) {
                    block.puzzle.posX = blocks[block.index - 1].posX;
                    block.puzzle.posY = blocks[block.index - 1].posY;
                    blocks[block.index - 1].puzzle = block.puzzle;
                    block.puzzle = null;
                    flag = true;
                    // console.log(blocks[block.index - 1]);
                } else if (block.index + 1 <= totalPuzzles && blocks[block.index + 1].puzzle === null) {
                    block.puzzle.posX = blocks[block.index + 1].posX;
                    block.puzzle.posY = blocks[block.index + 1].posY;
                    blocks[block.index + 1].puzzle = block.puzzle;
                    block.puzzle = null;
                    flag = true;
                    // console.log(blocks[block.index + 1]);
                } else if (block.index - maxPuzzle >= 0 && blocks[block.index - maxPuzzle].puzzle === null) {
                    block.puzzle.posX = blocks[block.index - maxPuzzle].posX;
                    block.puzzle.posY = blocks[block.index - maxPuzzle].posY;
                    blocks[block.index - maxPuzzle].puzzle = block.puzzle;
                    block.puzzle = null;
                    flag = true;
                    // console.log(blocks[block.index - maxPuzzle]);
                } else if (block.index + maxPuzzle <= totalPuzzles && blocks[block.index + maxPuzzle].puzzle === null) {
                    block.puzzle.posX = blocks[block.index + maxPuzzle].posX;
                    block.puzzle.posY = blocks[block.index + maxPuzzle].posY;
                    blocks[block.index + maxPuzzle].puzzle = block.puzzle;
                    block.puzzle = null;
                    flag = true;
                    // console.log(blocks[block.index + maxPuzzle]);
                }
            }
            // console.log(block);
        }
    });
    // console.log(flag);
});

function animate(timeStamp) {
    if (isWin) {
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw();
    background.update();
    [...blocks].forEach(block => block.draw());
    [...blocks].forEach(block => block.update());
    requestAnimationFrame(animate);
    let count = 0;
    [...blocks].forEach(block => {
        if (block.puzzle != null && block.index === block.puzzle.index) {
            count++;
        }
    });
    if (count === totalPuzzles) {
        isWin = true;
    }
}

animate(0);