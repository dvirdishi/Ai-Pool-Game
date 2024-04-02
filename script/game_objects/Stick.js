"use strict";



// Stick class constructor
function Stick(position){
    this.position = position;
    this.origin = new Vector2(970,11);
    this.shotOrigin = new Vector2(950,11);
    this.shooting = false;
    this.visible = true;
    this.rotation = 0;
    this.power = 0;
    this.trackMouse = true;
    this.beginnerMode = Game.beginnerMode;
}

// Handle input method for the Stick class
Stick.prototype.handleInput = function (delta) {
    // If it's the AI's turn, exit the function
    if(AI_ON && Game.policy.turn === AI_PLAYER_NUM)
      return;

    // If the turn has already been played, exit the function
    if(Game.policy.turnPlayed)
      return;

    // If the 'W' key is pressed, increase the power of the shot
    if(Keyboard.down(Keys.W) && KEYBOARD_INPUT_ON){
      if(this.power < 75){
        this.origin.x+=2;
        this.power+=1.2;
      }
    }

    // If the 'S' key is pressed, decrease the power of the shot
    if(Keyboard.down(Keys.S) && KEYBOARD_INPUT_ON){
      if(this.power>0){
        this.origin.x-=2;
        this.power-=1.2;
      }
    }

    // If the left mouse button is pressed and the power is greater than 0, shoot the ball
    else if (this.power>0 && Mouse.left.down){
      // Play the sound of the strike
      var strike = sounds.strike.cloneNode(true);
      strike.volume = (this.power/(10))<1?(this.power/(10)):1;
      strike.play();

      // Mark the turn as played and set the shooting flag to true
      Game.policy.turnPlayed = true;
      this.shooting = true;
      this.origin = this.shotOrigin.copy();

      // Shoot the white ball and hide the stick after half a second
      Game.gameWorld.whiteBall.shoot(this.power, this.rotation);
      var stick = this;
      setTimeout(function(){stick.visible = false;}, 500);
    }
    // If the trackMouse flag is true, track the mouse position to rotate the stick
    else if(this.trackMouse){
      var opposite = Mouse.position.y - this.position.y;
      var adjacent = Mouse.position.x - this.position.x;
      this.rotation = Math.atan2(opposite, adjacent);
    }
};

// Shoot method for the Stick class
Stick.prototype.shoot = function(power, rotation){
  this.power = power;
  this.rotation = rotation;

  // Play the sound of the strike
  if(Game.sound && SOUND_ON){
    var strike = sounds.strike.cloneNode(true);
    strike.volume = (this.power/(10))<1?(this.power/(10)):1;
    strike.play();
  }

  // Mark the turn as played and set the shooting flag to true
  Game.policy.turnPlayed = true;
  this.shooting = true;
  this.origin = this.shotOrigin.copy();

  // Shoot the white ball and hide the stick after half a second
  Game.gameWorld.whiteBall.shoot(this.power, this.rotation);
  var stick = this;
  setTimeout(function(){stick.visible = false;}, 500);
}

// Update method for the Stick class
Stick.prototype.update = function(){
  // If the white ball has stopped moving and the shooting flag is set to true, reset the stick
  if(this.shooting && !Game.gameWorld.whiteBall.moving)
    this.reset();
};

Stick.prototype.reset = function(){
  // Reset position to white ball's position
  this.position.x = Game.gameWorld.whiteBall.position.x;
  this.position.y = Game.gameWorld.whiteBall.position.y;

  // Reset origin, shooting, visible, and power properties
  this.origin = new Vector2(970,11);
  this.shooting = false;
  this.visible = true;
  this.power = 0;
};

Stick.prototype.draw = function () {
  // If not visible, do nothing
  if(!this.visible)
    return;

  // Draw stick image on canvas
  Canvas2D.drawImage(sprites.stick, this.position, this.rotation, 1, this.origin);
  this.beginnerMode = Game.beginnerMode;
  if (!Mouse.left.down && !Game.gameWorld.whiteBall.moving && this.beginnerMode){
    
    // Get the predicted ball path vector
    var predictedPath = new Vector2(Game.gameWorld.whiteBall.position.x, Game.gameWorld.whiteBall.position.y);
    var directionVector = new Vector2(Math.cos(this.rotation), Math.sin(this.rotation));
    var velocityVector = directionVector.multiply(this.power);
    var velocity = Math.sqrt(Math.pow(velocityVector.x, 2) + Math.pow(velocityVector.y, 2));
    var time = 0;
    var deltaT = 0.03;
    var friction = 0.05;
    while(velocity > 0){
      predictedPath = predictedPath.add(velocityVector.multiply(deltaT));
      velocity -= friction;
      velocityVector = directionVector.multiply(velocity);
      time += deltaT;
    }

    // Draw the predicted ball path vector on the canvas
    Canvas2D.drawLine(Game.gameWorld.whiteBall.position, predictedPath);

  }
};