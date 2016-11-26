"use strict";

function Repeat(repitition) {
    return (existingFrame, requestedFrame, addFrame) => Array(repitition).fill(existingFrame).forEach(addFrame);
}

module.exports = Repeat;