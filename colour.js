"use strict";

const uint32 = require('uint32');

function intChannel(channel) {
    return Math.floor(channel * 255);
}

function getUIntValue(color)
{
      return uint32.shiftLeft(intChannel(color.red), 16) | uint32.shiftLeft(intChannel(color.green), 8) | uint32.shiftLeft(intChannel(color.blue), 0);
}

function constructor(red, green, blue) {
    this.red = red || 0;
    this.green = green || 0;
    this.blue = blue || 0;
    this.getUIntValue = () => getUIntValue(this);
}

module.exports = constructor;