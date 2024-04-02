"use strict";

function Canvas2D_Singleton() {
    this._canvas = null; // initialize _canvas to null
    this._canvasContext = null; // initialize _canvasContext to null
    this._canvasOffset = Vector2.zero; // initialize _canvasOffset to Vector2.zero
}

Object.defineProperty(Canvas2D_Singleton.prototype, "offset",
    {
        get: function () {
            return this._canvasOffset; // getter function for _canvasOffset property
        }
    });

Object.defineProperty(Canvas2D_Singleton.prototype, "scale",
    {
        get: function () {
            return new Vector2(this._canvas.width / Game.size.x,
                this._canvas.height / Game.size.y); // getter function for _scale property
        }
    });

Canvas2D_Singleton.prototype.initialize = function (divName, canvasName) {
    this._canvas = document.getElementById(canvasName); // get the canvas element by id
    this._div = document.getElementById(divName); // get the div element by id

    if (this._canvas.getContext) // check if canvas context exists
        this._canvasContext = this._canvas.getContext('2d'); // get the 2D canvas context
    else {
        alert('Your browser is not HTML5 compatible.!'); // alert user if browser is not HTML5 compatible
        return;
    }
    window.onresize = Canvas2D_Singleton.prototype.resize; // add window resize event handler
    this.resize(); // resize the canvas on initialization
};

Canvas2D_Singleton.prototype.clear = function () {
    this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height); // clear the canvas
};



Canvas2D_Singleton.prototype.resize = function () {
    // Get references to the game canvas and its containing element
    var gameCanvas = Canvas2D._canvas;
    var gameArea = Canvas2D._div;

    // Calculate the aspect ratio of the game
    var widthToHeight = Game.size.x / Game.size.y;

    // Get the new dimensions of the browser window
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;

    // Calculate the aspect ratio of the browser window
    var newWidthToHeight = newWidth / newHeight;

    // Adjust the new dimensions to preserve the game's aspect ratio
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
    } else {
        newHeight = newWidth / widthToHeight;
    }

    // Set the dimensions of the game's containing element
    gameArea.style.width = newWidth + 'px';
    gameArea.style.height = newHeight + 'px';

    // Center the game's containing element within the browser window
    gameArea.style.marginTop = (window.innerHeight - newHeight) / 2 + 'px';
    gameArea.style.marginLeft = (window.innerWidth - newWidth) / 2 + 'px';
    gameArea.style.marginBottom = (window.innerHeight - newHeight) / 2 + 'px';
    gameArea.style.marginRight = (window.innerWidth - newWidth) / 2 + 'px';

    // Resize the game canvas
    gameCanvas.width = newWidth;
    gameCanvas.height = newHeight;

    // Calculate the offset of the game canvas within its containing element
    var offset = Vector2.zero;
    if (gameCanvas.offsetParent) {
        do {
            offset.x += gameCanvas.offsetLeft;
            offset.y += gameCanvas.offsetTop;
        } while ((gameCanvas = gameCanvas.offsetParent));
    }
    // Set the offset of the game canvas within the Canvas2D_Singleton object
    Canvas2D._canvasOffset = offset;
};

// Defines a function to draw an image onto the canvas
Canvas2D_Singleton.prototype.drawImage = function (sprite, position, rotation, scale, origin) {

    // Get the current canvas scale
    var canvasScale = this.scale;

    // Set default values for position, rotation, scale, and origin
    position = typeof position !== 'undefined' ? position : Vector2.zero;
    rotation = typeof rotation !== 'undefined' ? rotation : 0;
    scale = typeof scale !== 'undefined' ? scale : 1;
    origin = typeof origin !== 'undefined' ? origin : Vector2.zero;

    // Save the current context settings
    this._canvasContext.save();

    // Scale the canvas by the current scale
    this._canvasContext.scale(canvasScale.x, canvasScale.y);

    // Translate the context to the specified position
    this._canvasContext.translate(position.x, position.y);

    // Rotate the context by the specified angle
    this._canvasContext.rotate(rotation);

    // Draw the sprite onto the canvas
    this._canvasContext.drawImage(sprite, 0, 0,
        sprite.width, sprite.height,
        -origin.x * scale, -origin.y * scale,
        sprite.width * scale, sprite.height * scale);

    // Restore the saved context settings
    this._canvasContext.restore();
};

// Defines a function to draw text onto the canvas
Canvas2D_Singleton.prototype.drawText = function (text, position, origin, color, textAlign, fontname, fontsize) {

    // Get the current canvas scale
    var canvasScale = this.scale;

    // Set default values for position, origin, color, text alignment, font name, and font size
    position = typeof position !== 'undefined' ? position : Vector2.zero;
    origin = typeof origin !== 'undefined' ? origin : Vector2.zero;
    color = typeof color !== 'undefined' ? color : Color.black;
    textAlign = typeof textAlign !== 'undefined' ? textAlign : "top";
    fontname = typeof fontname !== 'undefined' ? fontname : "sans-serif";
    fontsize = typeof fontsize !== 'undefined' ? fontsize : "20px";

    // Save the current context settings
    this._canvasContext.save();

    // Scale the canvas by the current scale
    this._canvasContext.scale(canvasScale.x, canvasScale.y);

    // Translate the context to the specified position minus the origin
    this._canvasContext.translate(position.x - origin.x, position.y - origin.y);

    // Set the text baseline to top
    this._canvasContext.textBaseline = 'top';

    // Set the font to the specified font name and size
    this._canvasContext.font = fontsize + " " + fontname;

    // Set the fill style to the specified color
    this._canvasContext.fillStyle = color.toString();

    // Set the text alignment to the specified alignment
    this._canvasContext.textAlign = textAlign;

    // Draw the text onto the canvas
    this._canvasContext.fillText(text, 0, 0);

    // Restore the saved context settings
    this._canvasContext.restore();
};

Canvas2D_Singleton.prototype.drawLine = function (startPos, endPos, lineWidth=2, strokeStyle ="#FFFFFF") {
    // Save the current context settings
    this._canvasContext.save();

    // Get the current canvas scale
    var canvasScale = this.scale;

    // Scale the canvas by the current scale
    this._canvasContext.scale(canvasScale.x, canvasScale.y);

    // Set the line width and stroke style
    this._canvasContext.lineWidth = lineWidth;
    this._canvasContext.strokeStyle = strokeStyle;

    // Move the context to the starting position
    this._canvasContext.moveTo(startPos.x, startPos.y);

    // Draw a line to the end position
    this._canvasContext.beginPath();
    this._canvasContext.moveTo(startPos.x, startPos.y);
    this._canvasContext.lineTo(endPos.x, endPos.y);
    this._canvasContext.stroke();

    // Stroke the line
    this._canvasContext.stroke();

    // Restore the saved context settings
    this._canvasContext.restore();
};




// Creates a new instance of the Canvas2D_Singleton object and assigns it to the variable Canvas2D
var Canvas2D = new Canvas2D_Singleton();
