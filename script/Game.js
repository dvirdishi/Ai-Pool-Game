"use strict";

var requestAnimationFrame = (function () {
    // This function is used to get the requestAnimationFrame method from the appropriate browser, if available, and fallback to setTimeout if it's not available.
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function Game_Singleton() {
    // These properties will hold values once they are initialized.
    this.size = undefined;
    this.spritesStillLoading = 0;
    this.gameWorld = undefined;
    this.sound = true;
    this.beginnerMode = false;

    // This creates a new Menu object for the main menu.
    this.mainMenu = new Menu();
}

Game_Singleton.prototype.start = function (divName, canvasName, x, y) {
    // This initializes the Game_Singleton instance with the size, Canvas2D context and asset loading.
    this.size = new Vector2(x,y);
    Canvas2D.initialize(divName, canvasName);
    this.loadAssets();
    this.assetLoadingLoop();
};

Game_Singleton.prototype.initialize = function () {
    // This creates new GameWorld and GamePolicy objects, initializes the menus, and initializes AI with the GameWorld and GamePolicy objects.
    this.gameWorld = new GameWorld();
    this.policy = new GamePolicy();
    
    this.initMenus();

    AI.init(this.gameWorld, this.policy);
};

Game_Singleton.prototype.initMenus = function(inGame){
    // This generates and initializes the main menu with its labels, buttons, and background.
    let labels = generateMainMenuLabels("Classic 8-Ball");

    let buttons = generateMainMenuButtons(inGame);

    this.mainMenu.init
    (
        sprites.mainMenuBackground,
        labels,
        buttons,
        sounds.jazzTune
    );
}

Game_Singleton.prototype.loadSprite = function (imageName) {
    // This loads an image for use as a sprite and increments the spritesStillLoading counter.
    console.log("Loading sprite: " + imageName);
    var image = new Image();
    image.src = imageName;
    this.spritesStillLoading += 1;
    image.onload = function () {
        Game.spritesStillLoading -= 1;
    };
    return image;
};

Game_Singleton.prototype.assetLoadingLoop = function () {
    // This is the asset loading loop, which checks if all the sprites have been loaded, and initializes the main menu if so.
    if (!this.spritesStillLoading > 0)
        requestAnimationFrame(Game.assetLoadingLoop);
    else {
        Game.initialize();
        requestAnimationFrame(this.mainMenu.load.bind(this.mainMenu));
    }
};

// Define a method for handling input
Game_Singleton.prototype.handleInput = function(){

    // If the Escape key is down
    if(Keyboard.down(Keys.escape)){
        // Set the GAME_STOPPED flag to true
        GAME_STOPPED = true;
        // Initialize the game menus
        Game.initMenus(true);
        // Load the main menu using a callback function
        requestAnimationFrame(Game.mainMenu.load.bind(this.mainMenu));
    }
}

// Define a method for starting a new game
Game_Singleton.prototype.startNewGame = function(){
    // Set the mouse cursor to default
    Canvas2D._canvas.style.cursor = "auto";

    // Create a new game world and policy
    Game.gameWorld = new GameWorld();
    Game.policy = new GamePolicy();

    // Clear the canvas and draw the controls
    Canvas2D.clear();
    Canvas2D.drawImage(
        sprites.controls, 
        new Vector2(Game.size.x/2,Game.size.y/2), 
        0, 
        1, 
        new Vector2(sprites.controls.width/2,sprites.controls.height/2)
    );

    // Initialize the AI
    setTimeout(()=>{
        AI.init(Game.gameWorld, Game.policy);

        // If AI is enabled and the AI player number is 0
        if(AI_ON && AI_PLAYER_NUM == 0){
            // Start the AI session
            AI.startSession();
        }
        // Start the main game loop
        Game.mainLoop();
    },5000);
}

// Define a method for continuing a game
Game_Singleton.prototype.continueGame = function(){
    // Set the mouse cursor to default
    Canvas2D._canvas.style.cursor = "auto";

    // Request a new animation frame for the main loop
    requestAnimationFrame(Game.mainLoop);
}

// Define the main game loop method
Game_Singleton.prototype.mainLoop = function () {
    
    // If the game is being displayed and not stopped
    if(DISPLAY && !GAME_STOPPED){
        // Handle input for the game world with the time delta
        Game.gameWorld.handleInput(DELTA);
        // Update the game world with the time delta
        Game.gameWorld.update(DELTA);
        // Clear the canvas
        Canvas2D.clear();
        // Draw the game world
        Game.gameWorld.draw();
        // Reset the mouse input
        Mouse.reset();
        // Handle input for the game
        Game.handleInput();
        // Request a new animation frame for the main loop
        requestAnimationFrame(Game.mainLoop);
    }
};

// Create a new instance of the Game_Singleton
var Game = new Game_Singleton();
