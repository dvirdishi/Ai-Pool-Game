function AIPolicy(){
    
}

// This function evaluates the state of the game and returns a score for the AI's move
AIPolicy.prototype.evaluate = function(state, gamePolicy){

    let evaluation = 1;

    // This nested loop calculates the distance between all pairs of balls that are on the table
    // and adds it to the evaluation score. If one of the balls is the white ball or if either
    // ball is in a hole, the loop continues without adding anything to the score.
    for (var i = 0 ; i < state.balls.length; i++){
        for(var j = i + 1 ; j < state.balls.length ; j++){

            let firstBall = state.balls[i];
            let secondBall = state.balls[j];

            if(firstBall === state.whiteBall || secondBall === state.whiteBall 
                || 
                firstBall.inHole || secondBall.inHole){
                continue;
            }
            evaluation += firstBall.position.distanceFrom(secondBall.position);
        }
    }

    // The evaluation score is divided by 5800 to make it more manageable
    evaluation = evaluation/5800;

    // If the AI hasn't hit any balls yet, the evaluation score is increased by 100
    if(!gamePolicy.firstCollision){
        evaluation+= 100;
    }

    // The evaluation score is increased by 2000 times the number of valid balls the AI has hit
    evaluation += 2000 * gamePolicy.validBallsInsertedOnTurn;

    // The game policy updates the turn outcome to determine if the game has been won or if the turn
    // should be switched to the opponent
    gamePolicy.updateTurnOutcome();

    // If the game has been won and no foul has been committed, the evaluation score is increased by 10000.
    // If a foul has been committed, the score is decreased by 10000
    if(gamePolicy.won){
        if(!gamePolicy.foul){
            evaluation += 10000;
        }
        else{
            evaluation -= 10000;
        }
    }

    // If a foul has been committed, the evaluation score is decreased by 3000.
    if(gamePolicy.foul){
        evaluation = evaluation - 3000;
    }

    // The evaluation score is returned
    return evaluation;
}
