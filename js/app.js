// Enemies our player must avoid
var Enemy = function(x, y, xVelocity) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    /* this.x = -151 instead of 0 to make it appear as the enemy is 
    slowly walking inside the game field instead of just 
    appearing out of nowhere on the first column */
    /* this.y = 60 instead of 0 just to align it to the middle of the row */

    // this.x = -151;
    this.x = x; // this value will be passed in as an argument
    this.y = y + 60; // this value will be passed in as an argument
    this.xVelocity = xVelocity;
    // 101 WIDTH OF THE COLUMN
    this.xMove = 101;

    /* BORDER FOR ENEMY SET AN EXTRA COLUMN AWAY TO THE RIGHT SO 
    AS TO HIDE THE ENEMY AFTER PASSING THROUGH THE GAME FIELD */
    this.border = this.xMove * 5;
    this.startPositionX = -this.xMove;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if(this.x < this.border) {
        this.x += this.xVelocity * dt;
    }
    else {
        // ELSE RESET POSITION
        this.x = this.startPositionX;
    }


};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
    constructor() {
        
        this.sprite = 'images/char-boy.png';
        this.xMove = 101;
        this.yMove = 83;

        // TO MAKE THE PLAYER APPEAR AT THE CENTER WHEN GAME STARTS
        // PLAYER X AXIS START POSITION IS 0 SO 101 x 2 WILL TAKE HIM TO THIRD (MIDDLE) COLUMN
        // PLAYER Y AXIS START POSITION IS 0 SO 83 x 5 WILL TAKE HIM TO FIRST (STARTING) ROW (BOTTOM)
        // VALUES TAKEN FROM ENGINE.JS FILE LINE #137
        this.startPositionX = this.xMove * 2;

        /* this.startPositionY = (this.yMove * 5) - 25; Initially it was this 
        but for collision detection they (both hero and enemy) need to be on the same Y axis so 
        changed the hero Y to 60 which is the same as enemy's Y. 
        Then the player/hero started spawning out of the game field so reduced 
        yMove * 5 to yMove * 4 */

        this.startPositionY = (this.yMove * 4) + 60;
 
        this.x = this.startPositionX;
        this.y = this.startPositionY;

        this.wonGame = false;

    }

    // UPDATE METHOD FOR COLLISION DETECTION

    update() {
        for(let enemy of allEnemies) {
            // COLLISION DETECTION
            // this.y === enemy.y = IF PLAYER AND ENEMY BOTH ARE ON SAME ROW
            // enemy.x + enemy.xMove/2 > this.x && enemy.x < this.x + this.xMove/2 = IF THEY SAME SHARE AXES TO DETECT COLLISION
            // xMove/2 FOR REDUCING THE COLLISION DETECTION AREA

            if(this.y === enemy.y && (enemy.x + enemy.xMove/1.33 > this.x && enemy.x < this.x + this.xMove/1.33)) {
                console.log("collided");
                // alert("collided");
                this.resetGame();
            }
        }

        // GAME COMPLETE CHECK
        // console.log(this.y);
        /* We have added +60 to Y to position the player in the center. 
        Each row = 83 pixels in height. Our startPositionX for player is (83 * 4) + 60. 
        Which is = 332 + 60 = 392.
        Now player needs to move 5 times along Y axis to reach water so (83 * 5) = 415.
        So 392 (initial position) - 415 (final position at water) = -23 */

        if(this.y === -23) {
            modal.style.display = "block";
            this.wonGame = true;
            // console.log("win");
        }



    }

    resetGame() {
        this.x = this.startPositionX;
        this.y = this.startPositionY;
    }



    // RENDER METHOD

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // HANDLE INPUT METHOD FROM EVENT LISTENER

    handleInput(input) {

        // ADD BOUNDARIES TO THE GAME BY LIMITING X & Y AXIS VALUES
        if(input === 'left' && this.x > 0) {
            this.x -= this.xMove;
        }

        else if(input === 'up' && this.y > 0) {
            this.y -= this.yMove;
        }

        else if(input === 'right' && this.x < (this.xMove * 4)) {
            this.x += this.xMove;
        }

        /* DOWN HAS 4 MOVE LIMIT EVEN THOUGH THERE ARE 5 TILES BECAUSE 
        OF THE -25PX WE REDUCED FOR CENTRAL POSITIONING OF PLAYER */ 
        else if(input === 'down' && this.y < (this.yMove * 4)) {
            this.y += this.yMove;
        }
    }

}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// FUNCTION FOR RANDOM ENEMY VELOCITY TAKEN FROM MDN

let randomVelocity = function(min = 180, max = 300) {
    return Math.floor(Math.random() * (max - min)) + min;
};

// ADD 2 ENEMIES TO RANDOM ROWS

let rowsForEnemyArray = [0, 83, 166];
let randomRow;
// TAKEN FROM CSS-TRICKS
function randomizeRow() {
    rowsForEnemyArray = [0, 83, 166];
    return rowsForEnemyArray[Math.floor(Math.random()*rowsForEnemyArray.length)];
}


const player = new Player();
const bug1 = new Enemy(-404, 0, 300);
const bug2 = new Enemy(-101, 83, 275);
const bug3 = new Enemy((-252), 166, randomVelocity());
let bug4 = new Enemy(-101, randomizeRow(), randomVelocity());
let bug5 = new Enemy(-303, randomizeRow(), randomVelocity());

// ARRAY TO HOLD ALL ENEMIES
let allEnemies = [];
allEnemies.push(bug1, bug2, bug3, bug4, bug5);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

