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
    let channel;

    function createFrame(colourArray, repeat) {
        let frame = void 0;
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
            if (!channel) {
                channel = ws281x(numberOfLeds, { stripType: 'sk6812-grbw', brightness: 24 });
            }
            for(let i=0; i < channel.count; i++) {
                channel.array[i] = frame[i].getUIntValue();
            }
            ws281x.render();
            emitter.emit('render', frame);
        }
    }

    function existingFrame() {
        return framebuffer[framebuffer.length - 1] || pixelState;
    }

    function addToBuffer(pattern) {
        let requestedFrame = createFrame(pattern.frame, pattern.repeat);
        if (!pattern.strategy) {
            framebuffer.push(requestedFrame);
        } else {
            pattern.strategy(existingFrame(), requestedFrame, (frame) => framebuffer.push(frame));
        }
    }

    function bufferData(patternGenerator) {
        return () => {
            if (framebuffer.length < 50) {
                let pattern = patternGenerator.next().value;
                if (pattern) {
                    addToBuffer(pattern);
                }
            }
        }
    }

    this.reset = () => {
        if (channel) {
            this.clearAnimation();
            try {
                ws281x.reset();
            } catch (err) {
                console.error(err);
            }
            emitter.emit('reset');
            channel = void 0;
        }
    };

    this.clearAnimation = () => {
        clearInterval(bufferDataInterval);
        clearInterval(renderInterval);
        framebuffer.length = 0;
        bufferDataInterval = void 0;
        renderInterval = void 0;
    };

    this.setAnimation = (patternGenerator, delay) => {
        if (!bufferDataInterval) {
            bufferDataInterval = setInterval(bufferData(patternGenerator), delay * 0.5);
        }
        if (!renderInterval) {
            renderInterval = setInterval(render, delay);
        }
    };

    this.setPattern = (arg0, repeat, strategy) => {
        if (arg0.frame && Array.isArray(arg0.frame)) {
            addToBuffer(arg0);
        } else if (Array.isArray(arg0)) {
            addToBuffer({ frame: arg0, repeat: repeat, strategy: strategy });
        } else {
            addToBuffer({ strategy: arg0 });
        }
        if (!renderInterval) {
            render();
        }
    };
}

util.inherits(LightStrip, EventEmitter);
module.exports = LightStrip;
