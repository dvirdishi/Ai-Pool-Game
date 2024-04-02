// Button constructor
// Parameters:
// - sprite: Image - The sprite image of the button.
// - position: Vector2 - The position of the button on the canvas.
// - callback: function - The callback function to be executed when the button is clicked.
// - hoverSprite: Image - Optional sprite image of the button when hovered over by the mouse.

function Button(sprite, position, callback, hoverSprite){

    this.sprite = sprite;
    this.hoverSprite = hoverSprite ? hoverSprite : sprite;
    this.position = position;
    this.callback = callback;
}

// Draws the button on the canvas.
Button.prototype.draw = function(){

    if(this.mouseInsideBorders()){
        Canvas2D.drawImage(this.hoverSprite, this.position, 0, 1);
        Canvas2D._canvas.style.cursor = "pointer";
    }
    else{
        Canvas2D.drawImage(this.sprite, this.position, 0, 0.98);
    }
}

// Handles user input for the button.
Button.prototype.handleInput = function(){

    if(Mouse.left.pressed && this.mouseInsideBorders()){
        this.callback();
    }
}

// Checks if the mouse is inside the button's borders.
// Returns: boolean - True if the mouse is inside the button's borders, false otherwise.
Button.prototype.mouseInsideBorders = function(){
    
    mousePos = Mouse.position;

    if(mousePos.x > this.position.x 
        &&
        mousePos.x < this.position.x + this.sprite.width
        &&
        mousePos.y > this.position.y
        &&
        mousePos.y < this.position.y + this.sprite.height
    ){
        return true;
    }

    return false;
}