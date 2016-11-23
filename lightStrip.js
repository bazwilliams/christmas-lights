"use strict";

const ws281x = require('rpi-ws281x-native');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

const Colour = require('./colour');
const black = new Colour();

function LightStrip(numberOfLeds) {
    let pixelState = new Array(numberOfLeds);
    let framebuffer = [];
    let animationInterval;
    let emitter = this;

    this.reset = function setReset() {
        this.clearAnimation();
        ws281x.reset();
    };

    function init() {
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

    function render() {
        let frame = framebuffer.shift();
        if (frame) {
            pixelState = frame;
            let colours = new Uint32Array(numberOfLeds);
            for(let i=0; i < numberOfLeds; i++) {
                colours[i] = frame[i].getUIntValue();
            }
            ws281x.render(colours);
            ws281x.setBrightness(24);
            emitter.emit('render');
        }
    }

    this.clearAnimation = () => {
        clearInterval(this.patternGenerationInterval);
        framebuffer.length = 0;
    };

    this.setAnimation = function setAnimation(patternGeneratorFunc, delay) {
        this.patternGenerationInterval = setInterval(() => {
            if (framebuffer.length < 50) {
                patternGeneratorFunc((err, pattern) => {
                    this.setPattern(pattern.frame, pattern.repeat, pattern.strategy);
                });
            }
        }, delay * 0.5);
        animationInterval = setInterval(render, delay);
    };

    this.setPattern = function setPattern(colourArray, repeat, strategy) {
        let frame = createFrame(colourArray, repeat);
        if (!strategy) {
            framebuffer.push(frame);
        } else {
            strategy(framebuffer[framebuffer.length - 1], frame, (frame) => framebuffer.push(frame), 1);
        }
        if (!animationInterval) {
            render();
        }
    };

    init();
}

util.inherits(LightStrip, EventEmitter);
module.exports = LightStrip;