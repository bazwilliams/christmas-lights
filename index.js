"use strict";

const LightStrip = require('./lightStrip');
const Colour = require('./colour');
const Crossfade = require('./strategies/crossfade');
const Repeat = require('./strategies/repeat');
const Shift = require('./strategies/shift');

let christmasLights = new LightStrip(300);

process.on('SIGINT', function () {
    christmasLights.reset();
    process.nextTick(process.exit);
});

let index = 0;
function patternGenerator(callback) {
    let pattern = [
        { frame: [ new Colour('red'), new Colour('black'), new Colour('green'), new Colour('black'), new Colour('blue'), new Colour('black') ], repeat: true },
        { strategy: Repeat(5)},
        { strategy: Shift() }
    ];
    callback(null, pattern[index]);
    index = (index + 1) % (pattern.length - 1) + 1;
}

function simulate(frame) {
    console.log(frame.reduce((memo, colour) => `${memo} ${("0x000000" + colour.getUIntValue().toString(16)).substr(-6)}`, ""));
}

christmasLights.setAnimation(patternGenerator, 200);
// christmasLights.on('render', simulate);