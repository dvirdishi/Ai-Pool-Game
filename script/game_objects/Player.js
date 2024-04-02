/**
 * Player object constructor function
 */

function Player(matchScore, totalScore){
    // Color of the player's ball
    this.color = undefined;

    // The current match score for the player
    this.matchScore = matchScore;

    // The total score for the player across all matches
    this.totalScore = totalScore;
}