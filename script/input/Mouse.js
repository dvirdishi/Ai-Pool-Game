"use strict";

// Handles mouse move event
function handleMouseMove(evt){
    var canvasScale = Canvas2D.scale;
    var canvasOffset = Canvas2D.offset;
    var mx = (evt.pageX - canvasOffset.x) / canvasScale.x;
    var my = (evt.pageY - canvasOffset.y) / canvasScale.y;
    Mouse._position = new Vector2(mx, my);
}

// Handles mouse down event
function handleMouseDown(evt) {
    handleMouseMove(evt);

    if (evt.which === 1) {
        if (!Mouse._left.down)
            Mouse._left.pressed = true;
        Mouse._left.down = true;
    } else if (evt.which === 2) {
        if (!Mouse._middle.down)
            Mouse._middle.pressed = true;
        Mouse._middle.down = true;
    } else if (evt.which === 3) {
        if (!Mouse._right.down)
            Mouse._right.pressed = true;
        Mouse._right.down = true;
    }
}

// Handles mouse up event
function handleMouseUp(evt) {
    handleMouseMove(evt);

    if (evt.which === 1)
        Mouse._left.down = false;
    else if (evt.which === 2)
        Mouse._middle.down = false;
    else if (evt.which === 3)
        Mouse._right.down = false;
}
// Mouse Singleton constructor
function Mouse_Singleton() {
    // Properties for mouse state
    this._position = Vector2.zero;
    this._left = new ButtonState();
    this._middle = new ButtonState();
    this._right = new ButtonState();

    // Event handlers for mouse events
    document.onmousemove = handleMouseMove;
    document.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
}

// Getters for mouse state properties
Object.defineProperty(Mouse_Singleton.prototype, "left", {
    get: function () {
        return this._left;
    }
});

Object.defineProperty(Mouse_Singleton.prototype, "middle", {
    get: function () {
        return this._middle;
    }
});

Object.defineProperty(Mouse_Singleton.prototype, "right", {
    get: function () {
        return this._right;
    }
});

Object.defineProperty(Mouse_Singleton.prototype, "position", {
    get: function () {
        return this._position;
    }
});

// Reset mouse state
Mouse_Singleton.prototype.reset = function () {
    this._left.pressed = false;
    this._middle.pressed = false;
    this._right.pressed = false;
};

// Check if mouse is contained within a rectangle during mouse down
Mouse_Singleton.prototype.containsMouseDown = function (rect) {
    return this._left.down && rect.contains(this._position);
};

// Check if mouse is contained within a rectangle during mouse press
Mouse_Singleton.prototype.containsMousePress = function (rect) {
    return this._left.pressed && rect.contains(this._position);
};

// Create a Mouse Singleton instance
var Mouse = new Mouse_Singleton();
