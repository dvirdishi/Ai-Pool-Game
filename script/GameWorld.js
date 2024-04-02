"use strict";

function GameWorld() {

    // Starting position of the white ball
    this.whiteBallStartingPosition = new Vector2(413,413);

    // Array of red balls with their respective positions
    this.redBalls = [
        new Ball(new Vector2(1056,433),Color.red),//3
        new Ball(new Vector2(1090,374),Color.red),//4
        new Ball(new Vector2(1126,393),Color.red),//8
        new Ball(new Vector2(1126,472),Color.red),//10;
        new Ball(new Vector2(1162,335),Color.red),//11
        new Ball(new Vector2(1162,374),Color.red),//12
        new Ball(new Vector2(1162,452),Color.red)//14
    ];

    // Array of yellow balls with their respective positions
    this.yellowBalls = [
        new Ball(new Vector2(1022,413),Color.yellow),//1
        new Ball(new Vector2(1056,393),Color.yellow),//2
        new Ball(new Vector2(1090,452),Color.yellow),//6
        new Ball(new Vector2(1126,354),Color.yellow),//7
        new Ball(new Vector2(1126,433),Color.yellow),//9
        new Ball(new Vector2(1162,413),Color.yellow),//13
        new Ball(new Vector2(1162,491),Color.yellow)//15
    ];

    // Create the white ball and black ball objects
    this.whiteBall = new Ball(new Vector2(413,413),Color.white);
    this.blackBall = new Ball(new Vector2(1090,413),Color.black);

    // Array of all balls including yellow, red, white and black balls
    this.balls = [
        this.yellowBalls[0],
        this.yellowBalls[1],
        this.redBalls[0],
        this.redBalls[1],
        this.blackBall,
        this.yellowBalls[2],
        this.yellowBalls[3],
        this.redBalls[2],
        this.yellowBalls[4],
        this.redBalls[3],
        this.redBalls[4],
        this.redBalls[5],
        this.yellowBalls[5],
        this.redBalls[6],
        this.yellowBalls[6],
        this.whiteBall
    ];

    // Create the stick object with its starting position
    this.stick = new Stick({ x : 413, y : 413 });
 

    // Set initial game over state as false
    this.gameOver = false;
}

GameWorld.prototype.getBallsSetByColor = function(color){
    // Returns the array of balls of the specified color
    if(color === Color.red){
        return this.redBalls;
    }
    if(color === Color.yellow){
        return this.yellowBalls;
    }
    if(color === Color.white){
        return this.whiteBall;
    }
    if(color === Color.black){
        return this.blackBall;
    }
}

GameWorld.prototype.handleInput = function (delta) {
    // Handles input for the stick
    this.stick.handleInput(delta);
};

GameWorld.prototype.update = function (delta) {
    // Updates the game world state

    // Update the stick
    this.stick.update(delta);

    // Handle ball-to-ball collisions
    for (var i = 0 ; i < this.balls.length; i++){
        for(var j = i + 1 ; j < this.balls.length ; j++){
            this.handleCollision(this.balls[i], this.balls[j], delta);
        }
    }

    // Update all balls
    for (var i = 0 ; i < this.balls.length; i++) {
        this.balls[i].update(delta);
    }

    // Check if balls are not moving and AI session is finished
    if(!this.ballsMoving() && AI.finishedSession){
        // Update turn outcome based on game policy
        Game.policy.updateTurnOutcome();
        // If foul, place ball in hand
        if(Game.policy.foul){
            this.ballInHand();
        }
    }
};

GameWorld.prototype.ballInHand = function(){
    // Places the white ball in hand for the current player's turn

    // If AI is playing and it's AI's turn, return
    if(AI_ON && Game.policy.turn === AI_PLAYER_NUM){
        return;
    }

    // Disable keyboard input and hide the stick
    KEYBOARD_INPUT_ON = false;
    this.stick.visible = false;

    // If left mouse button is not pressed, place white ball at mouse position
    if(!Mouse.left.down){
        this.whiteBall.position = Mouse.position;
    }
    else{
        // Check for overlap with other balls
        let ballsOverlap = this.whiteBallOverlapsBalls();

        // If mouse position is within game borders, not inside a hole, and no overlap with other balls
        if(!Game.policy.isOutsideBorder(Mouse.position,this.whiteBall.origin) &&
            !Game.policy.isInsideHole(Mouse.position) &&
            !ballsOverlap){
            // Enable keyboard input, reset keyboard and mouse, update white ball position
            KEYBOARD_INPUT_ON = true;
            Keyboard.reset();
            Mouse.reset();
            this.whiteBall.position = Mouse.position;
            this.whiteBall.inHole = false;
            Game.policy.foul = false;
            this.stick.position = this.whiteBall.position;
            this.stick.visible = true;
        }
    }
}

GameWorld.prototype.whiteBallOverlapsBalls = function(){
    // Checks if the white ball overlaps with any other balls on the game world

    let ballsOverlap = false;
    for (var i = 0 ; i < this.balls.length; i++) {
        if(this.whiteBall !== this.balls[i]){
            if(this.whiteBall.position.distanceFrom(this.balls[i].position)<BALL_SIZE){
                ballsOverlap = true;
            }
        }
    }

    return ballsOverlap;
}

GameWorld.prototype.ballsMoving = function(){
    // Checks if any of the balls in the game world are currently moving

    var ballsMoving = false;

    for (var i = 0 ; i < this.balls.length; i++) {
        if(this.balls[i].moving){
            ballsMoving = true;
        }
    }

    return ballsMoving;
}

GameWorld.prototype.handleCollision = function(ball1, ball2, delta){
    // Handles collision between two balls

    // If either ball is in a hole, return
    if(ball1.inHole || ball2.inHole)
        return;

    // If both balls are not moving, return
    if(!ball1.moving && !ball2.moving)
        return;

    // Calculate new positions of ball1 and ball2 after collision
    var ball1NewPos = ball1.position.add(ball1.velocity.multiply(delta));
    var ball2NewPos = ball2.position.add(ball2.velocity.multiply(delta));

    // Calculate distance between the new positions
    var dist = ball1NewPos.distanceFrom(ball2NewPos);

    // If balls are colliding
    if(dist<BALL_SIZE){
        // Check collision validity according to game policy
        Game.policy.checkColisionValidity(ball1, ball2);

        // Calculate collision power based on velocities of both balls
        var power = (Math.abs(ball1.velocity.x) + Math.abs(ball1.velocity.y)) + 
                    (Math.abs(ball2.velocity.x) + Math.abs(ball2.velocity.y));
        power = power * 0.00482;

        // Play collision sound with volume based on collision power
        if(Game.sound && SOUND_ON){
            var ballsCollide = sounds.ballsCollide.cloneNode(true);
            ballsCollide.volume = (power/(20))<1?(power/(20)):1;
            ballsCollide.play();
        }

        // Calculate collision rotation and update velocities of ball1 and ball2
        var opposite = ball1.position.y - ball2.position.y;
        var adjacent = ball1.position.x - ball2.position.x;
        var rotation = Math.atan2(opposite, adjacent);

        ball1.moving = true;
        ball2.moving = true;

        var velocity2 = new Vector2(90*Math.cos(rotation + Math.PI)*power,90*Math.sin(rotation + Math.PI)*power);
        ball2.velocity = ball2.velocity.addTo(velocity2);

        ball2.velocity.multiplyWith(0.97);

        var velocity1 = new Vector2(90*Math.cos(rotation)*power,90*Math.sin(rotation)*power);
        ball1.velocity = ball1.velocity.addTo(velocity1);

        ball1.velocity.multiplyWith(0.97);
    }
}

GameWorld.prototype.ballsMoving = function(){

    // Check if any ball is currently moving
    var ballsMoving = false;

    for (var i = 0 ; i < this.balls.length; i++) {
        if(this.balls[i].moving){
            ballsMoving = true;
        }
    }

    return ballsMoving;
}

GameWorld.prototype.handleCollision = function(ball1, ball2, delta){

    // Handle collision between two balls

    if(ball1.inHole || ball2.inHole)
        return;

    if(!ball1.moving && !ball2.moving)
        return;

    var ball1NewPos = ball1.position.add(ball1.velocity.multiply(delta));
    var ball2NewPos = ball2.position.add(ball2.velocity.multiply(delta));

    var dist = ball1NewPos.distanceFrom(ball2NewPos);

    if(dist<BALL_SIZE){
        Game.policy.checkColisionValidity(ball1, ball2);

        var power = (Math.abs(ball1.velocity.x) + Math.abs(ball1.velocity.y)) + 
                    (Math.abs(ball2.velocity.x) + Math.abs(ball2.velocity.y));
        power = power * 0.00482;

        if(Game.sound && SOUND_ON){
            var ballsCollide = sounds.ballsCollide.cloneNode(true);
            ballsCollide.volume = (power/(20))<1?(power/(20)):1;
            ballsCollide.play();
        }

        var opposite = ball1.position.y - ball2.position.y;
        var adjacent = ball1.position.x - ball2.position.x;
        var rotation = Math.atan2(opposite, adjacent);

        ball1.moving = true;
        ball2.moving = true;

        var velocity2 = new Vector2(90*Math.cos(rotation + Math.PI)*power,90*Math.sin(rotation + Math.PI)*power);
        ball2.velocity = ball2.velocity.addTo(velocity2);

        ball2.velocity.multiplyWith(0.97);

        var velocity1 = new Vector2(90*Math.cos(rotation)*power,90*Math.sin(rotation)*power);
        ball1.velocity = ball1.velocity.addTo(velocity1);

        ball1.velocity.multiplyWith(0.97);
    }

}

GameWorld.prototype.draw = function () {

    // Draw the game world

    Canvas2D.drawImage(sprites.background);
    Game.policy.drawScores();

    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].draw();
    }

    this.stick.draw();
};

GameWorld.prototype.reset = function () {

    // Reset the game world

    this.gameOver = false;

    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].reset();
    }

    this.stick.reset();

    if(AI_ON && AI_PLAYER_NUM === 0){
        AI.startSession();
    }
};

GameWorld.prototype.initiateState = function(balls){
    
    // Initialize the game state with given ball positions
    
    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].position.x = balls[i].position.x;
        this.balls[i].position.y = balls[i].position.y;
        this.balls[i].visible = balls[i].visible;
        this.balls[i].inHole = balls[i].inHole;
    }

    this.stick.position = this.whiteBall.position;
}
