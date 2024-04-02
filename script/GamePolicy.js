
function GamePolicy(){

    // GamePolicy class that handles game rules and scoring

    this.turn = 0; // Current turn, 0 for player 1, 1 for player 2
    this.firstCollision = true; // Flag to track if the first collision has occurred
    let player1TotalScore = new Score(new Vector2(Game.size.x/2 - 75,Game.size.y/2 - 45)); // Total score object for player 1
    let player2TotalScore = new Score(new Vector2(Game.size.x/2 + 75,Game.size.y/2 - 45)); // Total score object for player 2

    let player1MatchScore = new Score(new Vector2(Game.size.x/2 - 280,108)); // Match score object for player 1
    let player2MatchScore = new Score(new Vector2(Game.size.x/2 + 230,108)); // Match score object for player 2

    this.players = [new Player(player1MatchScore,player1TotalScore), new Player(player2MatchScore,player2TotalScore)]; // Array of players with their respective match and total scores
    this.foul = false; // Flag to track if a foul has occurred
    this.scored = false; // Flag to track if a ball has been scored
    this.won = false; // Flag to track if a player has won
    this.turnPlayed = false; // Flag to track if a turn has been played
    this.validBallsInsertedOnTurn = 0; // Counter to track the number of valid balls inserted on the current turn

    // Border positions
    this.leftBorderX = BORDER_SIZE;
    this.rightBorderX = Game.size.x - BORDER_SIZE;
    this.topBorderY = BORDER_SIZE;
    this.bottomBorderY = Game.size.y - BORDER_SIZE;

    // Hole positions
    this.topCenterHolePos = new Vector2(750,32);
    this.bottomCenterHolePos = new Vector2(750,794);
    this.topLeftHolePos = new Vector2(62,62);
    this.topRightHolePos = new Vector2(1435,62);
    this.bottomLeftHolePos = new Vector2(62,762)
    this.bottomRightHolePos = new Vector2(1435,762);
}

GamePolicy.prototype.reset = function(){

    // Reset the game policy

    this.turn = 0; // Reset turn to player 1
    this.players[0].matchScore.value = 0; // Reset player 1's match score
    this.players[0].color = undefined; // Reset player 1's assigned color
    this.players[1].matchScore.value = 0; // Reset player 2's match score
    this.players[1].color = undefined; // Reset player 2's assigned color
    this.foul = false; // Reset foul flag
    this.scored = false; // Reset scored flag
    this.turnPlayed = false; // Reset turnPlayed flag
    this.won = false; // Reset won flag
    this.firstCollision = true; // Reset firstCollision flag
    this.validBallsInsertedOnTurn = 0; // Reset validBallsInsertedOnTurn counter
}

/**
 * Function to draw scores of players on the canvas.
 */
GamePolicy.prototype.drawScores = function(){
    Canvas2D.drawText("PLAYER " + (this.turn+1), new Vector2(Game.size.x/2 + 40,200), new Vector2(150,0), "#66CCFF", "top", "Impact", "70px");
    this.players[0].totalScore.draw();
    this.players[1].totalScore.draw();

    this.players[0].matchScore.drawLines(this.players[0].color);
    this.players[1].matchScore.drawLines(this.players[1].color);
}

/**
 * Function to check collision validity between two balls and update foul status.
 */
GamePolicy.prototype.checkColisionValidity = function(ball1, ball2){

    let currentPlayerColor = this.players[this.turn].color;

    if(this.players[this.turn].matchScore.value == 7 &&
       (ball1.color == Color.black || ball2.color == Color.black)){
        this.firstCollision = false;
        return;
    }

    if(!this.firstCollision)
        return;

    if(currentPlayerColor == undefined){
        this.firstCollision = false;
        return;
    }

    if(ball1.color == Color.white){
        if(ball2.color != currentPlayerColor){
            this.foul = true;
        }
        this.firstCollision = false;
    }

    if(ball2.color == Color.white){
        if(ball1.color != currentPlayerColor){
            this.foul = true;
        }
        this.firstCollision = false;
    }
}

/**
 * Handles a ball going into a hole during a game. */
GamePolicy.prototype.handleBallInHole = function(ball){

    setTimeout(function(){ball.out();}, 100);

    let currentPlayer = this.players[this.turn];
    let secondPlayer = this.players[(this.turn+1)%2];

    // Check ball color and update game state accordingly
    if(currentPlayer.color == undefined){
        // If current player has no color, set color based on ball color
        if(ball.color === Color.red){
            currentPlayer.color = Color.red;
            secondPlayer.color = Color.yellow;
        }
        else if(ball.color === Color.yellow){
            currentPlayer.color = Color.yellow;
            secondPlayer.color = Color.red;
        }
        else if(ball.color === Color.black){
            // If ball color is black, current player has won with a foul
            this.won = true; 
            this.foul = true;
        }
        else if(ball.color === Color.white){
            // If ball color is white, it's a foul
            this.foul = true;
        }
    }

    if(currentPlayer.color === ball.color){
        // If current player's color matches the ball color, increment match score
        currentPlayer.matchScore.increment();
        this.scored = true;
        this.validBallsInsertedOnTurn++;
    }
    else if(ball.color === Color.white){
        if(currentPlayer.color != undefined){
            // If ball color is white and current player has a color, it's a foul

            let ballsSet = Game.gameWorld.getBallsSetByColor(currentPlayer.color);

            let allBallsInHole = true;

            for (var i = 0 ; i < ballsSet.length; i++){
                if(!ballsSet[i].inHole){
                    allBallsInHole = false;
                }
            }

            if(allBallsInHole){
                // If all balls of current player's color are in the hole, current player has won
                this.won = true;
            }
        }
    }
    else if(ball.color === Color.black){
        if(currentPlayer.color != undefined){
            // If ball color is black and current player has a color, it's a foul

            let ballsSet = Game.gameWorld.getBallsSetByColor(currentPlayer.color);

            for (var i = 0 ; i < ballsSet.length; i++){
                if(!ballsSet[i].inHole){
                    this.foul = true;
                }
            }
            
            this.won = true;
        }
    }
    else{
        // If none of the above conditions are met, it's a foul for the second player
        secondPlayer.matchScore.increment();
        this.foul = true;
    }
}


/**
 * Switches turns between players in the game.
 * This function increments the turn counter by 1 and uses modulo operation to ensure it loops between 0 and 1,
 * effectively switching the turn between the two players.
 */
GamePolicy.prototype.switchTurns = function(){
    this.turn++;
    this.turn %= 2;
}


/**
 * Updates the outcome of the current turn in the game.
 * This function is responsible for updating various game state variables and scores based on the outcome of the turn,
 * including handling fouls, wins, switching turns, and resetting game state.
 */
GamePolicy.prototype.updateTurnOutcome = function(){
    
    // If turn was not played, return
    if(!this.turnPlayed){
        return;
    }

    // Handle foul if first collision occurred
    if(this.firstCollision === true){
        this.foul = true;
    }

    // Handle win condition
    if(this.won){
        
        if(!this.foul){
            // Increment total score of current player if no foul
            this.players[this.turn].totalScore.increment();
            
            // Reset game and game world after a delay if AI finished session
            if(AI.finishedSession){
                this.reset();
                setTimeout(function(){
                    Game.gameWorld.reset();
                }, 1000);
            }
        }
        else{
            // Increment total score of opposing player if foul
            this.players[(this.turn+1)%2].totalScore.increment();
            
            // Reset game and game world after a delay if AI finished session
            if(AI.finishedSession){
                this.reset();
                setTimeout(function(){
                    Game.gameWorld.reset();
                }, 1000);
            }
        }
        return;
    }

    // Switch turns if no score or foul occurred
    if(!this.scored || this.foul){
        this.switchTurns();
    }

    // Reset various game state variables
    this.scored = false;
    this.turnPlayed = false;
    this.firstCollision = true;
    this.validBallsInsertedOnTurn = 0;

    // Make white ball visible after a delay
    setTimeout(function(){
        Game.gameWorld.whiteBall.visible = true;
    }, 200);

    // Start AI session after turn switch if AI is enabled and it's AI player's turn and AI finished session
    if(AI_ON && this.turn === AI_PLAYER_NUM && AI.finishedSession){
        AI.startSession();
    }
}


GamePolicy.prototype.handleFoul = function(){
    // Function to handle foul event, repositioning white ball if necessary
    if(!Mouse.left.down){
        Game.gameWorld.whiteBall.position = Mouse.position;
    }
}

GamePolicy.prototype.isXOutsideLeftBorder = function(pos, origin){
    // Function to check if the x-coordinate of a position is outside the left border
    return (pos.x - origin.x) < this.leftBorderX;
}

GamePolicy.prototype.isXOutsideRightBorder = function(pos, origin){
    // Function to check if the x-coordinate of a position is outside the right border
    return (pos.x + origin.x) > this.rightBorderX;
}

GamePolicy.prototype.isYOutsideTopBorder = function(pos, origin){
    // Function to check if the y-coordinate of a position is outside the top border
    return (pos.y - origin.y) < this.topBorderY;
}

GamePolicy.prototype.isYOutsideBottomBorder = function(pos , origin){
    // Function to check if the y-coordinate of a position is outside the bottom border
    return (pos.y + origin.y) > this.bottomBorderY;
}

GamePolicy.prototype.isOutsideBorder = function(pos,origin){
    // Function to check if a position is outside the game table borders
    return this.isXOutsideLeftBorder(pos,origin) || this.isXOutsideRightBorder(pos,origin) || 
    this.isYOutsideTopBorder(pos, origin) || this.isYOutsideBottomBorder(pos , origin);
}

GamePolicy.prototype.isInsideTopLeftHole = function(pos){
    // Function to check if a position is inside the top left hole
    return this.topLeftHolePos.distanceFrom(pos) < HOLE_RADIUS;
}

GamePolicy.prototype.isInsideTopRightHole = function(pos){
    // Function to check if a position is inside the top right hole
    return this.topRightHolePos.distanceFrom(pos) < HOLE_RADIUS;
}

GamePolicy.prototype.isInsideBottomLeftHole = function(pos){
    // Function to check if a position is inside the bottom left hole
    return this.bottomLeftHolePos.distanceFrom(pos) < HOLE_RADIUS;
}

GamePolicy.prototype.isInsideBottomRightHole = function(pos){
    // Function to check if a position is inside the bottom right hole
    return this.bottomRightHolePos.distanceFrom(pos) < HOLE_RADIUS;
}

GamePolicy.prototype.isInsideTopCenterHole = function(pos){
    // Function to check if a position is inside the top center hole
    return this.topCenterHolePos.distanceFrom(pos) < (HOLE_RADIUS + 6);
}

GamePolicy.prototype.isInsideBottomCenterHole = function(pos){
    // Function to check if a position is inside the bottom center hole
    return this.bottomCenterHolePos.distanceFrom(pos) < (HOLE_RADIUS + 6);
}


// Check if a position is inside any of the holes on the game table
GamePolicy.prototype.isInsideHole = function(pos){
    return this.isInsideTopLeftHole(pos) || this.isInsideTopRightHole(pos) || 
           this.isInsideBottomLeftHole(pos) || this.isInsideBottomRightHole(pos) ||
           this.isInsideTopCenterHole(pos) || this.isInsideBottomCenterHole(pos);
}

// Initialize the game policy state based on the provided policy state
GamePolicy.prototype.initiateState = function(policyState){

    this.turn = policyState.turn; // Set current turn
    this.firstCollision = policyState.firstCollision; // Set flag for first collision
    this.foul = policyState.foul; // Set flag for foul
    this.scored = policyState.scored; // Set flag for scoring
    this.won = policyState.won; // Set flag for winning
    this.turnPlayed = policyState.turnPlayed; // Set flag for turn played
    this.validBallsInsertedOnTurn = policyState.validBallsInsertedOnTurn; // Set number of valid balls inserted on current turn

    this.players[0].totalScore.value = policyState.players[0].totalScore.value; // Set total score for player 1
    this.players[1].totalScore.value = policyState.players[1].totalScore.value; // Set total score for player 2

    this.players[0].matchScore.value = policyState.players[0].matchScore.value; // Set match score for player 1
    this.players[0].color = policyState.players[0].color; // Set color for player 1
    this.players[1].matchScore.value = policyState.players[1].matchScore.value; // Set match score for  2
    this.players[1].color = policyState.players[1].color; // Set color for player 2

}


  
