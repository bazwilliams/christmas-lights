"use strict";

const config = require('./config/');
const lights = require('./mqttLights');
const LightStrip = require('./lightStrip');

const christmasLights = new LightStrip(config.numberOfLeds);
lights.init(christmasLights);

process.on('SIGINT', function () {
    christmasLights.reset();
    process.nextTick(process.exit);
});
