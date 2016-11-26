"use strict";

function Repeat(repitition) {
    return (existingFrame, requestedFrame, renderFrame) => Array(repitition).fill(requestedFrame).forEach(renderFrame);
}

module.exports = Repeat;