
// Generates an array of Label objects for a main menu with a header text and a copyright label.
// Parameters:
// - headerText: string - The text to be displayed as the header. Required.
// Returns:
// - Array of Label objects - An array of Label objects for the main menu with the header text and a copyright label.
function generateMainMenuLabels(headerText){

    // Create an array of Label objects
    let labels = [

        // Header label
        new Label(
            headerText, 
            new Vector2(100,30),
            Vector2.zero,
            "white",
            "left",
            "Bookman",
            "100px"
        ),

        // Copyright label
        new Label(
            "© Dvir Dishi", 
            new Vector2(1300,800),
            Vector2.zero,
            "white",
            "left",
            "Bookman",
            "20px"
        )
    ];

    // Return the array of Label objects
    return labels;
}


// Main Menu - Player vs Computer Mode
function generateMainMenuButtons(inGame){
    let buttons = [];
    let dev = 0;
    if(inGame){
        dev = 200;
        buttons.push(
            new Button
                (
                    // CONTINUE BUTTON
                    sprites.continueButton, 
                    new Vector2(200,200),
                    function(){
                        Game.mainMenu.active = false;
                        GAME_STOPPED = false;
                        setTimeout(Game.continueGame,200);
                        sounds.fadeOut(Game.mainMenu.sound);
                    },
                    sprites.continueButtonHover
                )
        )
    }

    let muteSprite = sprites.muteButton;
    let muteSpriteHover = sprites.muteButtonHover;

    if(Game.mainMenu.sound && Game.mainMenu.sound.volume === 0){
        muteSprite = sprites.muteButtonPressed;
        muteSpriteHover = sprites.muteButtonPressedHover;
    }


    let muteButton = new Button
    (
        // MUTE BUTTON
        muteSprite, 
        new Vector2(1430,10),
        function(){
            if(Game.mainMenu.sound.volume == 0){
                SOUND_ON = true;
                Game.mainMenu.sound.volume = 0.8;
                this.sprite = sprites.muteButton;
                this.hoverSprite = sprites.muteButtonHover;
            }
            else{
                SOUND_ON = false;
                Game.mainMenu.sound.volume = 0.0;
                this.sprite = sprites.muteButtonPressed;
                this.hoverSprite = sprites.muteButtonPressedHover;
            }
        },
        muteSpriteHover
    );


    let beginnerModeSprite = sprites.beginnerModeSwitchOff;

    if(Game.beginnerMode ){
        beginnerModeSprite = sprites.beginnerModeSwitchOn;
    }
    else{
        beginnerModeSprite = sprites.beginnerModeSwitchOff;
    }


    let beginnerModeButton = new Button
    (
        // BEGGINER MODE BUTTON
        beginnerModeSprite, 
        new Vector2(1250,10),
        function(){
            if(beginnerModeSprite == sprites.beginnerModeSwitchOff){
                    Game.beginnerMode=true;
                    this.sprite = sprites.beginnerModeSwitchOn;
                    this.hoverSprite=sprites.beginnerModeSwitchOn;
                    beginnerModeSprite = sprites.beginnerModeSwitchOn;
            }
            else{
                    Game.beginnerMode=false;
                    this.sprite = sprites.beginnerModeSwitchOff;
                    this.hoverSprite = sprites.beginnerModeSwitchOff;
                    beginnerModeSprite = sprites.beginnerModeSwitchOff;

            }
        },beginnerModeSprite
    );

    let backButton = new Button
    (
        //BACK
        sprites.backButton, 
        new Vector2(100,150),
        function(){
            Game.mainMenu.labels = generateMainMenuLabels("Classic 8-Ball");
            Game.mainMenu.buttons = generateMainMenuButtons(inGame);
            Game.mainMenu.background = sprites.mainMenuBackground;
        },
        sprites.backButtonHover
    );

    buttons = buttons.concat([
        new Button
        (
            //  vs PLAYER
            sprites.twoPlayersButton, 
            new Vector2(200,dev+150),
            function(){
                AI_ON = false;
                Game.mainMenu.active = false;
                GAME_STOPPED = false;
                setTimeout(Game.startNewGame,200);
                sounds.fadeOut(Game.mainMenu.sound);
            },
            sprites.twoPlayersButtonHover
        ),
        new Button
        (
            // PLAYER vs COMPUTER
            sprites.onePlayersButton, 
            new Vector2(200,dev+300),
            function(){
                Game.mainMenu.labels = generateMainMenuLabels("Choose Difficulty");

                Mouse.reset();
                Game.mainMenu.buttons = [
                    new Button
                    (
                        //EASY
                        sprites.easyButton, 
                        new Vector2(200,150),
                        function(){
                            AI_PLAYER_NUM = 1;
                            AI_ON = true;
                            TRAIN_ITER = 10;
                            Game.mainMenu.active = false;
                            GAME_STOPPED = false;
                            setTimeout(Game.startNewGame,200);
                            sounds.fadeOut(Game.mainMenu.sound);
                        },
                        sprites.easyButtonHover
                    ),
                    new Button
                    (
                        //MEDIUM
                        sprites.mediumButton, 
                        new Vector2(200,300),
                        function(){
                            AI_PLAYER_NUM = 1;
                            AI_ON = true;
                            TRAIN_ITER = 30;
                            Game.mainMenu.active = false;
                            GAME_STOPPED = false;
                            setTimeout(Game.startNewGame,200);
                            sounds.fadeOut(Game.mainMenu.sound);
                        },
                        sprites.mediumButtonHover
                    ),
                    new Button
                    (
                        //HARD
                        sprites.hardButton, 
                        new Vector2(200,450),
                        function(){
                            AI_PLAYER_NUM = 1;
                            AI_ON = true;
                            TRAIN_ITER = 50;
                            Game.mainMenu.active = false;
                            GAME_STOPPED = false;
                            setTimeout(Game.startNewGame,200);
                            sounds.fadeOut(Game.mainMenu.sound);
                        },
                        sprites.hardButtonHover
                    ),
                    new Button
                    (
                        //INSANE
                        sprites.insaneButton, 
                        new Vector2(200,600),
                        function(){
                            AI_PLAYER_NUM = 0;
                            AI_ON = true;
                            TRAIN_ITER = 700;
                            Game.mainMenu.active = false;
                            GAME_STOPPED = false;
                            setTimeout(Game.startNewGame,200);
                            sounds.fadeOut(Game.mainMenu.sound);
                        },
                        sprites.insaneButtonHover
                    ),
                    muteButton,
                    backButton,
                    beginnerModeButton

                ];
            },
            sprites.onePlayersButtonHover
        ),        new Button
        (
            // Instructions
            sprites.beginnerButton, 
            new Vector2(200,dev+450),
            function(){
                Game.mainMenu.labels = generateMainMenuLabels("");

                Mouse.reset();
                Game.mainMenu.background=sprites.instructions;
                Game.mainMenu.buttons = [

                    muteButton,
                    backButton
                    

                ];
            },
            sprites.beginnerButtonHover
        ),
        muteButton,
        beginnerModeButton
    ]);

    return buttons;
}