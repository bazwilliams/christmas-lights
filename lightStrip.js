"use strict";

const ws281x = require('rpi-ws281x-native');
const Colour = require('./colour');

const black = new Colour();

function constructor(numberOfLeds) {
    let pixelState = new Uint32Array(numberOfLeds);

    this.reset = function setReset() {
        ws281x.reset();
    };

    function createFrame(colourArray, repeat) {
        let frame = new Uint32Array(numberOfLeds);
        for(let i=0; i < numberOfLeds; i++) {
            if (repeat) {
                frame[i] = colourArray[i % colourArray.length].getUIntValue();
            } else {
                frame[i] = colourArray[i]?colourArray[i].getUIntValue():black.getUIntValue();
            }
        }
        return frame;
    }

    function render(frame) {
        pixelState = frame;
        ws281x.render(pixelState);
        ws281x.setBrightness(24);
    }

    this.setPattern = function setPattern(colourArray, repeat, strategy) {
        let frame = createFrame(colourArray, repeat);
        if (!strategy) {
            render(frame);
        } else {
            strategy.process(pixelState, frame, render, 1);
        }
    };

    ws281x.init(numberOfLeds);
    ws281x.setBrightness(0);
}

module.exports = constructor;