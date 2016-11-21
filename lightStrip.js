"use strict";

const ws281x = require('rpi-ws281x-native');
const Colour = require('./colour');

const black = new Colour();

function constructor(numberOfLeds) {
    let pixelState = new Uint32Array(numberOfLeds);
    
    function refresh() {
        ws281x.render(pixelState);
        ws281x.setBrightness(24);
    }

    this.reset = function setReset() {
        ws281x.reset();
    };

    this.setPattern = function setPattern(colourArray, repeat) {
        for(let i =0; i < numberOfLeds; i++) {
            if (repeat) {
                pixelState[i] = colourArray[i % colourArray.length].getUIntValue();
            } else {
                pixelState[i] = colourArray[i]?colourArray[i].getUIntValue():black;
            }
        }
        
        refresh();
    };

    ws281x.init(numberOfLeds);
    ws281x.setBrightness(0);
}

module.exports = constructor;