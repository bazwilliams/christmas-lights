"use strict";

const Colour = require('../colour');

function process(start, end, renderFrame, inbetweeningSteps) {
    if (!inbetweeningSteps) {
        renderFrame(start);
        renderFrame(end);
    } else {
        renderFrame(start);
        renderFrame(calculateInbetweenFrame(start, end));
        renderFrame(end);
    }
}

function calculateInbetweenFrame(start, end) {
    let mid = [];
    for (let i = 0; i < end.length; i++) {
        let m = Colour.avg(start[i], end[i]);
        mid.push(m);
    }
    return mid;
}

module.exports = process;