function Menu(){}

Menu.prototype.init = function
(
    backgroundSprite,
    labels,
    buttons,
    sound
){  
    this.background = backgroundSprite; // Background sprite for the menu
    this.labels = labels || []; // Array of labels to display on the menu
    this.buttons = buttons || []; // Array of buttons to interact with in the menu
    this.sound = sound ? sound : undefined; // Sound to play when menu is active, if provided

    this.active = false; // Flag to indicate if the menu is currently active
}

Menu.prototype.load = function(){
    this.sound.currentTime = 0; // Reset sound to start
    this.active = true; // Set menu as active

    // Add event listener for user interaction
    document.addEventListener("click", function() {
        if(SOUND_ON){
            this.sound.volume = 0.8; // Adjust volume if sound is enabled
        }
        this.sound.play(); // Play the sound associated with the menu
    }.bind(this));

    requestAnimationFrame(this.menuLoop.bind(this)); // Start the menu loop
}

Menu.prototype.draw = function(){

    Canvas2D._canvas.style.cursor = "auto"; // Reset cursor style to default

    // Draw the background sprite
    Canvas2D.drawImage(
        this.background, 
        Vector2.zero, 
        0, 
        1, 
        Vector2.zero
    );

    // Draw all the labels in the menu
    for(let i = 0 ; i < this.labels.length ; i++){
        this.labels[i].draw();
    }

    // Draw all the buttons in the menu
    for(let i = 0 ; i < this.buttons.length ; i++){
        this.buttons[i].draw();
    }
}

Menu.prototype.handleInput = function(){

    // Handle input for all the buttons in the menu
    for(let i = 0 ; i < this.buttons.length ; i++){
        this.buttons[i].handleInput();
    }
}

Menu.prototype.menuLoop = function(){

    if(this.active){
        this.handleInput(); // Handle input for buttons
        Canvas2D.clear(); // Clear the canvas
        this.draw(); // Draw the menu
        Mouse.reset(); // Reset mouse state
        requestAnimationFrame(this.menuLoop.bind(this)); // Request next animation frame for menu loop
    }

}
