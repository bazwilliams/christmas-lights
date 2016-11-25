"use strict";

const Colour = require('../colour');

function Crossfade() {
    return function (existingFrame, requestedFrame, renderFrame) {
        if (existingFrame) {
            renderFrame(calculateInbetweenFrame(existingFrame, requestedFrame));
        }
        renderFrame(requestedFrame);
    };
}

function calculateInbetweenFrame(start, end) {
    let mid = [];
    for (let i = 0; i < end.length; i++) {
        let m = Colour.avg(start[i], end[i]);
        mid.push(m);
    }
    return mid;
}

module.exports = Crossfade;