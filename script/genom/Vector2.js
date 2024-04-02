"use strict";

// Vector2 - A 2D vector class for representing points or directions in 2D space.
function Vector2(x, y) {
    this.x = typeof x !== 'undefined' ? x : 0;
    this.y = typeof y !== 'undefined' ? y : 0;
}

// Properties:

// x - The x-coordinate of the vector.
// y - The y-coordinate of the vector.
Object.defineProperty(Vector2, "zero",
    {
        get: function () {
            // zero - A read-only property that represents a zero vector (0,0).
            return new Vector2();
        }
    });

Object.defineProperty(Vector2.prototype, "isZero",
    {
        get: function () {
            // isZero - A read-only property that indicates whether the vector is a zero vector.
            return this.x === 0 && this.y === 0;
        }
    });

Object.defineProperty(Vector2.prototype, "length",
    {
        get: function () {
            // length - A read-only property that represents the length of the vector.
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
    });

// Methods:

// addTo(v) - Adds a vector or a scalar value to this vector.
Vector2.prototype.addTo = function (v) {
    if (v.constructor === Vector2) {
        this.x += v.x;
        this.y += v.y;
    }
    else if (v.constructor === Number) {
        this.x += v;
        this.y += v;
    }
    return this;
};

// add(v) - Creates a new vector that is the result of adding a vector or a scalar value to this vector.
Vector2.prototype.add = function (v) {
    var result = this.copy();
    return result.addTo(v);
};

// subtractFrom(v) - Subtracts a vector or a scalar value from this vector.
Vector2.prototype.subtractFrom = function (v) {
    if (v.constructor === Vector2) {
        this.x -= v.x;
        this.y -= v.y;
    }
    else if (v.constructor === Number) {
        this.x -= v;
        this.y -= v;
    }
    return this;
};

// subtract(v) - Creates a new vector that is the result of subtracting a vector or a scalar value from this vector.
Vector2.prototype.subtract = function (v) {
    var result = this.copy();
    return result.subtractFrom(v);
};

// divideBy(v) - Divides this vector by a vector or a scalar value.
Vector2.prototype.divideBy = function (v) {
    if (v.constructor === Vector2) {
        this.x /= v.x;
        this.y /= v.y;
    }
    else if (v.constructor === Number) {
        this.x /= v;
        this.y /= v;
    }
    return this;
};

// divide(v) - Creates a new vector that is the result of dividing this vector by a vector or a scalar value.
Vector2.prototype.divide = function (v) {
    var result = this.copy();
    return result.divideBy(v);
};

// multiplyWith(v) - Multiplies this vector by a vector or a scalar value.
Vector2.prototype.multiplyWith = function (v) {
    if (v.constructor === Vector2) {
        this.x *= v.x;
        this.y *= v.y;
    }
    else if (v.constructor === Number) {
        this.x *= v;
        this.y *= v;
    }
    return this;
};

// multiply(v) - Multiplies this vector with another vector.
Vector2.prototype.multiply = function (v) {
    var result = this.copy();
    return result.multiplyWith(v);
};

// toString() - Returns a string representation of this vector.
Vector2.prototype.toString = function () {
    return "(" + this.x + ", " + this.y + ")";
};

// normalize() - Normalizes this vector to have a length of 1.
Vector2.prototype.normalize = function () {
    var length = this.length;
    if (length === 0)
        return;
    this.divideBy(length);
};

// copy() - Creates a new vector that is a copy of this vector.
Vector2.prototype.copy = function () {
    return new Vector2(this.x, this.y);
};

// equals(obj) - Checks if this vector is equal to another vector.
Vector2.prototype.equals = function (obj) {
    return this.x === obj.x && this.y === obj.y;
};

// distanceFrom(obj) - Computes the Euclidean distance between this vector and another vector.
Vector2.prototype.distanceFrom = function(obj){
    return Math.sqrt((this.x-obj.x)*(this.x-obj.x) + (this.y-obj.y)*(this.y-obj.y));
};
