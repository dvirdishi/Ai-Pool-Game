function AITrainer(){

    // Instantiate a new AIPolicy object.
    this.AIPolicy = new AIPolicy();

}

AITrainer.prototype.init = function(state, gamePolicy){

    // Reset the opponents array and current opponent object, set the iteration count to zero, and set the session status to finished.
    AI.opponents = [];
    AI.currentOpponent = new Opponent();
    AI.finishedSession = true;
    AI.iteration = 0;
    AI.bestOpponentIndex = 0;
    AI.bestOpponentEval = 0;
    
    // Set the white ball to a fixed position if there was a foul in the previous turn.
    if(gamePolicy.foul){
        //TO DO: Pick best position for the white ball.
        state.whiteBall.position.x = 413;
        state.whiteBall.position.y = 413;
        state.whiteBall.inHole = false;
        gamePolicy.foul = false;
    }

    // Store copies of the initial state and game policy state for later use.
    AI.initialState = JSON.parse(JSON.stringify(state));
    AI.initialGamePolicyState = JSON.parse(JSON.stringify(gamePolicy));

    // Set the current state and game policy state.
    AI.state = state;
    AI.gamePolicy = gamePolicy;

}

AITrainer.prototype.train = function(){

    // End the session if the iteration count has reached the maximum.
    if(AI.iteration === TRAIN_ITER){
        AI.finishedSession = true;
        AI.playTurn();
        return;
    }

    // Check if any balls are currently moving.
    let ballsMoving = AI.state.ballsMoving();

    // If no balls are moving, simulate the current opponent's turn.
    if(!ballsMoving){

        // Calculate the current opponent's evaluation and add it to the list of opponents.
        if(AI.iteration !== 0){
            AI.currentOpponent.evaluation = AI.AIPolicy.evaluate(this.state, this.gamePolicy);

            AI.opponents.push(JSON.parse(JSON.stringify(AI.currentOpponent)));

            // Update the best opponent index and evaluation if the current opponent has a higher evaluation than the previous best.
            if(AI.currentOpponent.evaluation > AI.bestOpponentEval){
                AI.bestOpponentEval = AI.currentOpponent.evaluation;
                AI.bestOpponentIndex =  AI.opponents.length - 1;
            }

            // Print debug information to the console.
            if(LOG){
                console.log('-------------'+new Number(AI.iteration+1)+'--------------------');
                console.log('Current evaluation: ' + AI.currentOpponent.evaluation);
                console.log('Current power: ' + AI.currentOpponent.power);
                console.log('Current rotation: ' + AI.currentOpponent.rotation);
                console.log('---------------------------------');
            }
        }

        // Reset the state and game policy state to their initial values, create a new opponent, and simulate the turn.
        AI.state.initiateState(AI.initialState.balls);
        AI.gamePolicy.initiateState(AI.initialGamePolicyState);
        AI.buildNewOpponent();
        AI.simulate();
    }

}

AITrainer.prototype.buildNewOpponent = function(){
    // If the current iteration is a multiple of 10, create a new opponent with random power and rotation
    if(AI.iteration % 10 === 0){
        AI.currentOpponent = new Opponent();
        AI.iteration++;
        return;
    }

    // Otherwise, create a new opponent with power and rotation based on the best opponent found so far
    let bestOpponent = AI.opponents[AI.bestOpponentIndex];

    // Determine the new power for the opponent
    let newPower = bestOpponent.power;
    newPower += + ((Math.random() * 30) - 15);
    newPower = newPower < 20 ? 20 : newPower;
    newPower = newPower > 75 ? 75 : newPower;

    // Determine the new rotation for the opponent
    let newRotation = bestOpponent.rotation;
    if(bestOpponent.evaluation > 0){
        newRotation += (1/bestOpponent.evaluation)*(Math.random() * 2 * Math.PI - Math.PI)
    }
    else{
        newRotation = (Math.random() * 2 * Math.PI - Math.PI);
    }

    // Create the new opponent
    AI.currentOpponent = new Opponent(newPower,newRotation);

    // Increment the iteration count
    AI.iteration++;
}

AITrainer.prototype.simulate = function(){
    // Have the current opponent shoot at the ball
    AI.state.stick.shoot(AI.currentOpponent.power, AI.currentOpponent.rotation);
}

AITrainer.prototype.playTurn = function(){
    // Set the stick rotation to that of the best opponent
    bestOpponent = AI.opponents[AI.bestOpponentIndex];
    Game.gameWorld.stick.rotation = bestOpponent.rotation;
    Game.gameWorld.stick.trackMouse = false;

    // Wait a second before shooting
    setTimeout(() => {
        // Make the stick visible, clear the canvas, and draw the game world
        Game.gameWorld.stick.visible = true;
        Canvas2D.clear();
        Game.gameWorld.draw();

        // Reinitialize the game world and policy states
        Game.sound = true;
        Game.gameWorld.initiateState(AI.initialState.balls);
        Game.policy.initiateState(AI.initialGamePolicyState);

        // Set display to true and start the main loop
        DISPLAY = true;
        requestAnimationFrame(Game.mainLoop);

        // Have the stick shoot at the ball
        Game.gameWorld.stick
        .shoot(
            bestOpponent.power, 
            bestOpponent.rotation
        );

        // Track the mouse again
        Game.gameWorld.stick.trackMouse = true;

    }, 1000);
}

AITrainer.prototype.opponentTrainingLoop = function(){

    // Turn off sound and visual effects
    Game.sound = false;
    DISPLAY = false;

    // If DISPLAY_TRAINING flag is true, display the training session
    if(DISPLAY_TRAINING){
        // Train opponents and update game world until the session is finished
        if(!AI.finishedSession){
            AI.train();
            Game.gameWorld.handleInput(DELTA);
            Game.gameWorld.update(DELTA);
            Canvas2D.clear();
            Game.gameWorld.draw();
            Mouse.reset();
            setTimeout(AI.opponentTrainingLoop,0.00000000001);
        }
    }
    // Otherwise, train opponents without displaying the session
    else{
        while(!AI.finishedSession){
            AI.train();
            Game.gameWorld.handleInput(DELTA);
            Game.gameWorld.update(DELTA);
            Mouse.reset();
        }
    }

}

AITrainer.prototype.startSession = function(){
    // Wait for 1 second before starting the session
    setTimeout(
        ()=>{
            // Hide stick, clear canvas, and draw game world
            Game.gameWorld.stick.visible = false;
            Canvas2D.clear();
            Game.gameWorld.draw();

            // Initialize AI trainer, set finishedSession flag to false, and start training loop
            AI.init(Game.gameWorld, Game.policy);
            AI.finishedSession = false;
            AI.opponentTrainingLoop();
        },
        1000
    );
}

// Create a new instance of AITrainer class
const AI = new AITrainer();
