"use strict";

const uint32 = require('uint32');

function intChannel(channel) {
    return Math.floor(channel * 255);
}

function constructor() {
    let red, green, blue;

    function init(r, g, b) {
        red = r || 0;
        green = g || 0;
        blue = b || 0;
    }

    if (Array.isArray(arguments[0])) {
        init(arguments[0][0], arguments[0][1], arguments[0][2]);
    } else {
        init(arguments[0], arguments[1], arguments[2]);
    }

    this.getUIntValue = function getUIntValue() {
        return uint32.shiftLeft(intChannel(red), 16) | uint32.shiftLeft(intChannel(green), 8) | uint32.shiftLeft(intChannel(blue), 0);
    }
}

module.exports = constructor;