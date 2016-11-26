"use strict";

function Repeat(repitition) {
    return (existingFrame, requestedFrame, renderFrame) => Array(repitition).fill(existingFrame).forEach(renderFrame);
}

module.exports = Repeat;