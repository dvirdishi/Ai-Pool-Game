"use strict";

// handleKeyDown - Event handler for keydown event.
function handleKeyDown(evt) {
    var code = evt.keyCode;
    if (code < 0 || code > 255)
        return;
    if (!Keyboard._keyStates[code].down)
        Keyboard._keyStates[code].pressed = true;
    Keyboard._keyStates[code].down = true;
}

// handleKeyUp - Event handler for keyup event.
function handleKeyUp(evt) {
    var code = evt.keyCode;
    if (code < 0 || code > 255)
        return;
    Keyboard._keyStates[code].down = false;
}

// Keyboard_Singleton - Represents a singleton instance for keyboard input handling.
function Keyboard_Singleton() {
    // _keyStates: Array of ButtonState objects representing the state of each key.
    this._keyStates = [];

    // Initialize _keyStates with ButtonState objects for each key.
    for (var i = 0; i < 256; ++i)
        this._keyStates.push(new ButtonState());

    // Attach event handlers for keydown and keyup events.
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
}

// reset - Resets the pressed state of all keys.
Keyboard_Singleton.prototype.reset = function () {
    for (var i = 0; i < 256; ++i)
        this._keyStates[i].pressed = false;
};

// pressed - Returns true if the specified key was just pressed in the current frame.
Keyboard_Singleton.prototype.pressed = function (key) {
    return this._keyStates[key].pressed;
};

// down - Returns true if the specified key is currently being held down.
Keyboard_Singleton.prototype.down = function (key) {
    return this._keyStates[key].down;
};

// Keyboard - Singleton instance of Keyboard_Singleton for handling keyboard input.
var Keyboard = new Keyboard_Singleton();
