"use strict";

const LightStrip = require('./lightStrip');
const Colour = require('./colour');
const Crossfade = require('./strategies/crossfade');

let christmasLights = new LightStrip(300);

process.on('SIGINT', function () {
    christmasLights.reset();
    process.nextTick(process.exit);
});

let frames = [
    [ new Colour(1, 0, 0), new Colour(0, 1, 0), new Colour(0, 0, 1) ],
    [ new Colour(0, 1, 0), new Colour(0, 0, 1), new Colour(1, 0, 0) ],
    [ new Colour(0, 0, 1), new Colour(1, 0, 0), new Colour(0, 1, 0) ]
];

let index = 0;

setInterval(() => {
    christmasLights.setPattern(frames[index], true, Crossfade);
    index = (index + 1) % frames.length;
}, 250);