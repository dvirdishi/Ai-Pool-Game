"use strict";

// Score class constructor function
function Score(position) {
    // The position of the score on the canvas
    this.position = position;
    // The origin of the score text on the canvas
    this.origin = new Vector2(47, 82);
    // The value of the score
    this.value = 0;
}

// Resets the score to its default state
Score.prototype.reset = function () {
    // Reset the position of the score on the canvas
    this.position = position;
    // Reset the origin of the score text on the canvas
    this.origin = new Vector2(30, 0);
    // Reset the value of the score
    this.value = 0;
};

// Draws the score on the canvas
Score.prototype.draw = function () {
    // Draw the score text on the canvas
    Canvas2D.drawText(
        this.value,
        this.position,
        this.origin,
        "#66CCFF",
        "top",
        "Impact",
        "200px"
    );
};

// Draws lines to represent the score on the canvas
Score.prototype.drawLines = function (color) {
    // Iterate over the value of the score and draw a line for each point
    for (let i = 0; i < this.value; i++) {
        let pos = this.position.add(new Vector2(i * 15, 0));
        Canvas2D.drawText(
            "I",
            pos,
            this.origin,
            color,
            "top",
            "Arial",
            "20px"
        );
    }
};

// Increments the value of the score by 1
Score.prototype.increment = function () {
    this.value++;
};
