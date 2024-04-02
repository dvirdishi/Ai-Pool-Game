function Opponent(power, rotation){
    // Constructor function for an Opponent object
    // Sets the power and rotation properties of the opponent, or sets them to random values if none are given as parameters
    this.power = power || (Math.random() * 75 + 1); // Sets the power to a random number between 1 and 75 if no power is given
    this.rotation = rotation || (Math.random()*6.283)-3.141; // Sets the rotation to a random angle between -π and π if no rotation is given
    this.evaluation = 0; // Initializes the evaluation property to 0
}