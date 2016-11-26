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

    function createFrame(colourArray, repeat) {
        let frame = null;
        if (colourArray && colourArray.length) {
            frame = new Array(numberOfLeds);
            for(let i=0; i < numberOfLeds; i++) {
                if (repeat) {
                    frame[i] = colourArray[i % colourArray.length];
                } else {
                    frame[i] = colourArray[i]?colourArray[i]:black;
                }
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
        if (frame) {
            if (!pattern.strategy) {
                framebuffer.push(frame);
            } else {
                pattern.strategy(framebuffer[framebuffer.length - 1], frame, (frame) => framebuffer.push(frame), 1);
            }
        }
    }

    function bufferData(patternGenerator) {
        return () => {
            if (framebuffer.length < 50) {
                patternGenerator(addToBuffer);
            }
        }
    }

    this.reset = () => {
        this.clearAnimation();
        ws281x.reset();
    };

    this.clearAnimation = () => {
        clearInterval(bufferDataInterval);
        clearInterval(renderInterval);
        framebuffer.length = 0;
    };

    this.setAnimation = (patternGenerator, delay) => {
        bufferDataInterval = setInterval(bufferData(patternGenerator), delay * 0.5);
        renderInterval = setInterval(render, delay);
    };

    this.setPattern = (arg0, repeat, strategy) => {
        if (Array.isArray(arg0)) {
            addToBuffer(null, { frame: arg0, repeat: repeat, strategy: strategy });
        } else {
            addToBuffer(null, { strategy: arg0 });
        }
        if (!renderInterval) {
            render();
        }
    };

    ws281x.init(numberOfLeds);
    ws281x.setBrightness(0);
}

util.inherits(LightStrip, EventEmitter);
module.exports = LightStrip;