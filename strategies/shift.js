"use strict";

function Shift() {
    return (existingFrame, requestedFrame, renderFrame) => {
        let newFrame = existingFrame.slice(0);
        newFrame.unshift(newFrame.pop());
        renderFrame(newFrame);
    };
}

module.exports = Shift;