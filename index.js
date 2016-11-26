"use strict";

const LightStrip = require('./lightStrip');
const Colour = require('./colour');
const Crossfade = require('./strategies/crossfade');
const Repeat = require('./strategies/repeat');

let christmasLights = new LightStrip(300);

process.on('SIGINT', function () {
    christmasLights.reset();
    process.nextTick(process.exit);
});

let index = 0;
function patternGenerator(callback) {
    let pattern = [
        { frame: [ new Colour('red'), new Colour('green'), new Colour('blue') ], repeat: true, strategy: Crossfade() },
        { strategy: Repeat(20)},
        { frame: [ new Colour('blue'), new Colour('red'), new Colour('green') ], repeat: true, strategy: Crossfade() },
        { strategy: Repeat(20) },
        { frame: [ new Colour('green'), new Colour('blue'), new Colour('red') ], repeat: true, strategy: Crossfade() },
        { strategy: Repeat(20) }
    ];
    callback(null, pattern[index]);
    index = (index + 1) % pattern.length;
}

christmasLights.setAnimation(patternGenerator, 40);
//christmasLights.on('render', console.log);