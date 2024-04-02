// Label constructor
// Parameters:
// - text: string - The text to be displayed by the label. Optional, default is an empty string.
// - position: Vector2 - The position of the label on the canvas. Optional, default is Vector2.zero.
// - origin: Vector2 - The origin of the label for rotation and scaling. Optional, default is Vector2.zero.
// - color: Color - The color of the label text. Optional, default is Color.black.
// - textAlign: string - The alignment of the label text. Optional, default is "top".
// - fontname: string - The name of the font for the label text. Optional, default is "Courier New".
// - fontsize: string - The size of the font for the label text. Optional, default is "20px".
function Label(text, position, origin, color, textAlign, fontname, fontsize){

    this.text = typeof text !== 'undefined' ? text : '';
    this.position = typeof position !== 'undefined' ? position : Vector2.zero;
    this.origin = typeof origin !== 'undefined' ? origin : Vector2.zero;
    this.color = typeof color !== 'undefined' ? color : Color.black;
    this.textAlign = typeof textAlign !== 'undefined' ? textAlign : "top";
    this.fontname = typeof fontname !== 'undefined' ? fontname : "Courier New";
    this.fontsize = typeof fontsize !== 'undefined' ? fontsize : "20px";
}

// Draws the label on the canvas using the specified properties.
Label.prototype.draw = function(){

    Canvas2D.drawText(
        this.text, 
        this.position,
        this.origin,
        this.color,
        this.textAlign,
        this.fontname,
        this.fontsize
    );

}
