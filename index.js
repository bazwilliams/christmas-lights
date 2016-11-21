"use strict";

const LightStrip = require('./lightStrip');
const Colour = require('./colour');

let christmasLights = new LightStrip(300);

process.on('SIGINT', function () {
    christmasLights.reset();
    process.nextTick(process.exit);
});

let colourArray = [ new Colour(1, 0, 0), new Colour(0, 1, 0), new Colour(0, 0, 1) ];

christmasLights.setPattern(colourArray, true);