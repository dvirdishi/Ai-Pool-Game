"use strict";

var sprites = {};
var sounds = {};

// A function to load a sprite from a file path
var loadSprite = function (sprite) {
    return Game.loadSprite("assets/sprites/" + sprite);
};

// A function to load a sound from a file path
var loadSound = function (sound) {
    return new Audio("assets/sounds/" + sound);
};

// Load all of the game's assets
Game.loadAssets = function () {

    // Load all of the game's sprites
    sprites.mainMenuBackground = loadSprite("main_menu_background.png");
    sprites.background = loadSprite("spr_background6.png");
    sprites.ball = loadSprite("spr_ball2.png");
    sprites.redBall = loadSprite("spr_redBall2.png");
    sprites.yellowBall = loadSprite("spr_yellowBall2.png");
    sprites.blackBall = loadSprite("spr_blackBall2.png");
    sprites.stick = loadSprite("spr_stick.png");
    sprites.twoPlayersButton = loadSprite("2_players_button.png");
    sprites.twoPlayersButtonHover = loadSprite("2_players_button_hover.png");
    sprites.onePlayersButton = loadSprite("1_player_button.png");
    sprites.onePlayersButtonHover = loadSprite("1_player_button_hover.png");
    sprites.muteButton = loadSprite("mute_button.png");
    sprites.muteButtonHover = loadSprite("mute_button_hover.png");
    sprites.muteButtonPressed = loadSprite("mute_button_pressed.png");
    sprites.muteButtonPressedHover = loadSprite("mute_button_pressed_hover.png");
    sprites.easyButton = loadSprite("easy_button.png");
    sprites.easyButtonHover = loadSprite("easy_button_hover.png");
    sprites.mediumButton = loadSprite("medium_button.png");
    sprites.mediumButtonHover = loadSprite("medium_button_hover.png");
    sprites.hardButton = loadSprite("hard_button.png");
    sprites.hardButtonHover = loadSprite("hard_button_hover.png");
    sprites.backButton = loadSprite("back_button.png");
    sprites.backButtonHover = loadSprite("back_button_hover.png");
    sprites.continueButton = loadSprite("continue_button.png");
    sprites.continueButtonHover = loadSprite("continue_button_hover.png");
    sprites.insaneButton = loadSprite("insane_button.png");
    sprites.insaneButtonHover = loadSprite("insane_button_hover.png");
    sprites.aboutButton = loadSprite("about_button.png");
    sprites.aboutButtonHover = loadSprite("about_button_hover.png");
    sprites.controls = loadSprite("controls.png");
    sprites.instructions = loadSprite("Instructions.png");
    sprites.beginnerButton = loadSprite("beginner_button.png");
    sprites.beginnerButtonHover = loadSprite("beginner_button_hover.png");
    sprites.beginnerModeSwitchOff = loadSprite("switch-off.png");
    sprites.beginnerModeSwitchOn = loadSprite("switch-on.png");

    // Load all of the game's sounds
    sounds.side = loadSound("Side.wav");
    sounds.ballsCollide = loadSound("BallsCollide.wav");
    sounds.strike = loadSound("Strike.wav");
    sounds.hole = loadSound("Hole.wav");
    sounds.jazzTune = loadSound("Bossa Antigua.mp3");
}

// A function to fade out a sound over time
sounds.fadeOut = function(sound) {

    // Set an interval to gradually decrease the sound's volume
    var fadeAudio = setInterval(function () {

        // If the game has stopped, return without doing anything
        if(GAME_STOPPED)
            return;

        // Only fade if past the fade out point or not at zero already
        if ((sound.volume >= 0.05)) {
            sound.volume -= 0.05;
        }
        // Once the sound is completely faded out, pause it and clear the interval
        else{
            sound.pause();
            clearInterval(fadeAudio);
        }
    }, 400);
}
