"use strict";

const LightStrip = require('./lightStrip');
const Colour = require('./colour');
const crossfade = require('./strategies/crossfade');

let christmasLights = new LightStrip(300);

process.on('SIGINT', function () {
    christmasLights.reset();
    process.nextTick(process.exit);
});

let index = 0;
function frameGenerator(callback) {
    let frames = [
        [ new Colour('red'), new Colour('green'), new Colour('blue') ],
        [ new Colour('blue'), new Colour('red'), new Colour('green') ],
        [ new Colour('green'), new Colour('blue'), new Colour('red') ]
    ];
    callback(null, {
        frame: frames[index],
        repeat: true,
        strategy: crossfade
    });
    index = (index + 1) % frames.length;
}

christmasLights.setAnimation(frameGenerator, 200);