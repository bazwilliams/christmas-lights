"use strict";

const LightStrip = require('./lightStrip');
const Colour = require('./colour');
const crossfade = require('./strategies/crossfade');

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

christmasLights.setAnimation((callback) => {
    callback(null, {
        frame: frames[index],
        repeat: true,
        strategy: crossfade
    });
    index = (index + 1) % frames.length;
});