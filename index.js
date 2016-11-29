"use strict";

const config = require('./config');
const iotLights = require('./iotLights');
const chaserPattern = require('./generators/chaser');
const LightStrip = require('./lightStrip');
const christmasLights = new LightStrip(config.numberOfLeds);
const Colour = require('./colour');

iotLights.init(christmasLights);

process.on('SIGINT', function () {
    christmasLights.reset();
    process.nextTick(process.exit);
});

if (config.debugRender) {
    function simulate(frame) {
        process.stdout.clearLine();  // clear current text
        process.stdout.cursorTo(0);  // move cursor to beginning of line
        process.stdout.write(frame.reduce((memo, colour) => `${memo} ${("0x000000" + colour.getUIntValue().toString(16)).substr(-6)}`, ""));
    }
    christmasLights.on('render', simulate);
}

christmasLights.setPattern([new Colour("black")]);
christmasLights.setAnimation(chaserPattern(), config.renderDelay);