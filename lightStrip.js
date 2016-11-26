"use strict";

const ws281x = require('rpi-ws281x-native');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

const Colour = require('./colour');
const black = new Colour();

function LightStrip(numberOfLeds) {
    let pixelState = new Array(numberOfLeds);
    let framebuffer = [];
    let renderInterval;
    let bufferDataInterval;
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
            emitter.emit('render', frame);
        }
    }

    function addToBuffer(error, pattern) {
        let frame = createFrame(pattern.frame, pattern.repeat);
        if (!pattern.strategy) {
            framebuffer.push(frame);
        } else {
            pattern.strategy(framebuffer[framebuffer.length - 1], frame, (frame) => framebuffer.push(frame), 1);
        }
        if (!renderInterval) {
            render();
        }
    }

    function bufferData(patternGenerator) {
        return () => {
            if (framebuffer.length < 50) {
                patternGenerator(addToBuffer);
            }
        }
    }

    this.clearAnimation = () => {
        clearInterval(bufferDataInterval);
        framebuffer.length = 0;
    };

    this.setAnimation = function setAnimation(patternGenerator, delay) {
        bufferDataInterval = setInterval(bufferData(patternGenerator), delay * 0.5);
        renderInterval = setInterval(render, delay);
    };

    this.setPattern = function setPattern(colourArray, repeat, strategy) {
        addToBuffer(null, { frame: colourArray, repeat: repeat, strategy: strategy });
    };

    init();
}

util.inherits(LightStrip, EventEmitter);
module.exports = LightStrip;