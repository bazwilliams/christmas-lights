"use strict";

const uint32 = require('uint32');
const colourNames = require('color-name');

function intChannel(channel) {
    return Math.floor(channel * 255);
}

function Colour() {
    let red, green, blue, white;

    function init(r, g, b, w) {
        red = r || 0;
        green = g || 0;
        blue = b || 0;
	white = w || 0;
    }

    if (typeof arguments[0] === 'string') {
        let rgb = colourNames[arguments[0]];
        if (rgb) {
            init(rgb[0]/255, rgb[1]/255, rgb[2]/255, 0);
        } else {
            init();
        }
    } else if (Array.isArray(arguments[0])) {
        init(arguments[0][0], arguments[0][1], arguments[0][2], arguments[0][3]);
    } else {
        init(arguments[0], arguments[1], arguments[2], arguments[3]);
    }

    this.getUIntValue = function getUIntValue() {
        return uint32.shiftLeft(intChannel(white), 24) |
            uint32.shiftLeft(intChannel(red), 16) |
            uint32.shiftLeft(intChannel(green), 8) |
            uint32.shiftLeft(intChannel(blue), 0);
    };

    this.red = () => red;

    this.green = () => green;

    this.blue = () => blue;

    this.white = () => white;
}

Colour.avg = function(colour1, colour2) {
    let r = 0.5 * (colour1.red() + colour2.red());
    let g = 0.5 * (colour1.green() + colour2.green());
    let b = 0.5 * (colour1.blue() + colour2.blue());
    let w = 0.5 * (colour1.white() + colour2.white());
    return new Colour(r, g, b, w);
};

module.exports = Colour;
