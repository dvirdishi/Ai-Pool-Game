"use strict"; // Enforces strict mode in the script.

function Ball(initPos,color){ // Creates a Ball object with the provided initial position and color.
	this.initPos = initPos; // Stores the initial position of the ball.
    this.position = initPos.copy(); // Creates a copy of the initial position to track the ball's position during the game.
    this.origin = new Vector2(25,25); // Stores the origin point of the ball.
    this.velocity = Vector2.zero; // Initializes the ball's velocity to zero.
    this.color = color; // Stores the color of the ball.
    this.moving = false; // Indicates whether the ball is currently moving.
    this.visible = true; // Indicates whether the ball is visible.
    this.inHole = false; // Indicates whether the ball is in a hole.
}

Object.defineProperty(Ball.prototype, "color", // Defines the "color" property of the Ball object.
    {
    	get: function(){ // Returns the color of the ball based on its sprite.
    		if(this.sprite == sprites.redBall){
    			return Color.red;
    		}
    		else if(this.sprite == sprites.yellowBall){
    			return Color.yellow;
    		}
			else if(this.sprite == sprites.blackBall){
    			return Color.black;
    		}
    		else{
    			return Color.white;
    		}
    	},
        set: function (value) { // Sets the sprite of the ball based on its color.
            if (value === Color.red){
                this.sprite = sprites.redBall;
            }
            else if(value == Color.yellow){
            	this.sprite = sprites.yellowBall;
            }
			else if(value == Color.black){
            	this.sprite = sprites.blackBall;
            }
            else{
            	this.sprite = sprites.ball;
            }
        }
    });

Ball.prototype.shoot = function(power, angle){ // Applies the specified power and angle to the ball.
    if(power <= 0)
        return;

    this.moving = true;

    this.velocity = calculateBallVelocity(power,angle); // Calculates the velocity of the ball based on the provided power and angle.
}

var calculateBallVelocity = function(power, angle){ // Calculates the velocity of the ball based on the provided power and angle.

    return new Vector2(100*Math.cos(angle)*power,100*Math.sin(angle)*power); // Returns the velocity vector of the ball.
}

Ball.prototype.update = function(delta){ // Updates the position and velocity of the ball based on the specified delta time.

    this.updatePosition(delta);

    this.velocity.multiplyWith(0.98); // Multiplies the ball's velocity by 0.98 to simulate friction.

	if(this.moving && Math.abs(this.velocity.x) < 1 && Math.abs(this.velocity.y) < 1){ // If the ball is moving and has a velocity less than 1, stop the ball.
        this.stop();
    }
}

Ball.prototype.updatePosition = function(delta) {
    // If the ball is not moving or in the hole, do nothing
    if (!this.moving || this.inHole)
        return;
    
    // Store a reference to the ball and calculate its new position based on the current velocity and delta time
    var ball = this;
    var newPos = this.position.add(this.velocity.multiply(delta));
    
    // If the ball is inside a hole, handle it accordingly
    if (Game.policy.isInsideHole(newPos)) {
        // If sound is enabled, play a hole sound
        if (Game.sound && SOUND_ON) {
            var holeSound = sounds.hole.cloneNode(true);
            holeSound.volume = 0.5;
            holeSound.play();
        }
        
        // Update the ball's position and set its state to inHole
        this.position = newPos;
        this.inHole = true;
        
        // Set a timeout to hide the ball and reset its velocity after 100 milliseconds, and call the policy's handleBallInHole function
        setTimeout(function() {
            ball.visible = false;
            ball.velocity = Vector2.zero;
        }, 100);
        Game.policy.handleBallInHole(this);
        
        return;
    }
    
    // If the ball is not inside a hole, check for collisions and update its position and velocity accordingly
    var collision = this.handleCollision(newPos);
    
    if (collision) {
        // If there was a collision, reduce the ball's velocity by 5%
        this.velocity.multiplyWith(0.95);
    } else {
        // Otherwise, update the ball's position
        this.position = newPos;
    }
};

Ball.prototype.handleCollision = function(newPos) {
    // Check for collisions with the borders of the canvas
    var collision = false;
    
    if (Game.policy.isXOutsideLeftBorder(newPos, this.origin)) {
        // If the ball collided with the left border, reverse its horizontal velocity and move it to the edge of the border
        this.velocity.x = -this.velocity.x;
        this.position.x = Game.policy.leftBorderX + this.origin.x;
        collision = true;
    } else if (Game.policy.isXOutsideRightBorder(newPos, this.origin)) {
        // If the ball collided with the right border, reverse its horizontal velocity and move it to the edge of the border
        this.velocity.x = -this.velocity.x;
        this.position.x = Game.policy.rightBorderX - this.origin.x;
        collision = true;
    }
    
    if (Game.policy.isYOutsideTopBorder(newPos, this.origin)) {
        // If the ball collided with the top border, reverse its vertical velocity and move it to the edge of the border
        this.velocity.y = -this.velocity.y;
        this.position.y = Game.policy.topBorderY + this.origin.y;
        collision = true;
    } else if (Game.policy.isYOutsideBottomBorder(newPos, this.origin)) {
        // If the ball collided with the bottom border, reverse its vertical velocity and move it to the edge of the border
        this.velocity.y = -this.velocity.y;
        this.position.y = Game.policy.bottomBorderY - this.origin.y;
        collision = true;
    }
    
    // Return true if there was a collision, false otherwise
    return collision;
};

Ball.prototype.stop = function() {
    // Stop the ball by setting its moving state to false and resetting its velocity
    this.moving = false;
    this.velocity = Vector2.zero;
};

Ball.prototype.reset = function(){
    // Reset the state of the ball
	this.inHole = false;
	this.moving = false;
	this.velocity = Vector2.zero;
    // Reset the position to the initial position of the ball
	this.position = this.initPos;
    // Set the ball as visible
	this.visible = true;
}

Ball.prototype.out = function(){
    // Move the ball to an out-of-bounds position
	this.position = new Vector2(0, 900);
    // Set the ball as not visible
	this.visible = false;
    // Set the ball as in hole
	this.inHole = true;
}

Ball.prototype.draw = function () {
    // If the ball is not visible, don't draw it
    if(!this.visible)
        return;

    // Draw the ball sprite at the current position
	Canvas2D.drawImage(this.sprite, this.position, 0, 1, new Vector2(25,25));
};
