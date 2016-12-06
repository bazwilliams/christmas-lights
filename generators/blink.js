"use strict";

const Repeat = require('../strategies/repeat');
const Colour = require('../colour');

function* blink(initialFrame) {
    yield {
        frame: initialFrame.frame,
        repeat: initialFrame.repeat
    };
    let index = 0;
    while (true) {
        let pattern = [
            { frame: initialFrame.frame, repeat: initialFrame.repeat},
            { strategy: Repeat(5) },
            { frame: [ new Colour("black") ], repeat: true},
            { strategy: Repeat(5) }
        ];
        yield pattern[index];
        index = (index + 1) % pattern.length;
    }
}

module.exports = blink;
