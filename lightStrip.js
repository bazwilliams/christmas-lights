"use strict";

const ws281x = require('rpi-ws281x-native');
const Colour = require('./colour');

const black = new Colour();

function constructor(numberOfLeds) {
    let pixelState = new Array(numberOfLeds);
    let patterns = [];

    this.reset = function setReset() {
        init();
        ws281x.reset();
    };

    function init() {
        pixelState = createFrame([black], true);
        ws281x.init(numberOfLeds);
        ws281x.setBrightness(0);
    }

    function createFrame(colourArray, repeat) {
        let frame = new Array(numberOfLeds);
        for(let i=0; i < numberOfLeds; i++) {
            if (repeat) {
                frame[i] = colourArray[i % colourArray.length];
            } else {
                frame[i] = colourArray[i]?colourArray[i]:black;
            }
        }
        return frame;
    }

    function render(frame) {
        pixelState = frame;
        let colours = new Uint32Array(numberOfLeds);
        for(let i=0; i < numberOfLeds; i++) {
            colours[i] = frame[i].getUIntValue();
        }
        ws281x.render(colours);
        ws281x.setBrightness(24);
    }

    this.clearAnimation = () => {
        clearInterval(this.patternGenerationInterval);
        clearInterval(this.animationInterval);
    };

    this.setAnimation = function setAnimation(patternGeneratorFunc) {
        this.patternGenerationInterval = setInterval(() => {
            patternGeneratorFunc((err, pattern) => {
                patterns.push(pattern);
                // console.log("Adding: " + patterns.length);
            });
        }, 100);

        this.animationInterval = setInterval(() => {
            let pattern = patterns.shift();
            // console.log("Consuming: " + patterns.length);
            if (pattern) {
                this.setPattern(pattern.frame, pattern.repeat, pattern.strategy);
            }
        }, 25);
    };

    this.setPattern = function setPattern(colourArray, repeat, strategy) {
        let frame = createFrame(colourArray, repeat);
        if (!strategy) {
            render(frame);
        } else {
            strategy(pixelState, frame, render, 1);
        }
    };

    init();
}

module.exports = constructor;