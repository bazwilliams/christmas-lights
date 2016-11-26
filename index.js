"use strict";

const config = require('./config');
const awsIot = require('aws-iot-device-sdk');
const LightStrip = require('./lightStrip');
const Colour = require('./colour');
const Crossfade = require('./strategies/crossfade');
const Repeat = require('./strategies/repeat');
const Shift = require('./strategies/shift');

let device = awsIot.device({
    keyPath: config.iotThingKeyPath,
    certPath: config.iotThingCertPath,
    caPath: config.iotCaPath,
    clientId: config.iotClientId,
    region: config.awsRegion
});

let christmasLights = new LightStrip(300);

process.on('SIGINT', function () {
    christmasLights.reset();
    process.nextTick(process.exit);
});

let index = 0;
function patternGenerator(callback) {
    let pattern = [
        { strategy: Repeat(5)},
        { strategy: Shift() }
    ];
    callback(null, pattern[index]);
    index = (index + 1) % pattern.length;
}

function convert(iotPayload) {
    if (Array.isArray(iotPayload.colours)) {
        return {
            frame: iotPayload.colours.map((colourName) => new Colour(colourName)),
            repeat: iotPayload.repeat
        }
    }
}

device.on('connect', () => {
    console.log(`connected as ${config.iotThingClientId}`);
    device.subscribe(config.iotThingClientId);
});

device.on('message', (topic, payload) => {
    let pattern = convert(JSON.parse(payload));
    if (pattern) {
        christmasLights.setPattern(pattern.frame, pattern.repeat, pattern.strategys);
    } else {
        console.error(`ConversionError: ${payload}`);
    }
});

christmasLights.setPattern([ new Colour('red'), new Colour('black'), new Colour('green'), new Colour('black'), new Colour('blue'), new Colour('black') ], true);
christmasLights.setAnimation(patternGenerator, 50);

//function simulate(frame) {
//    console.log(frame.reduce((memo, colour) => `${memo} ${("0x000000" + colour.getUIntValue().toString(16)).substr(-6)}`, ""));
//}
//christmasLights.on('render', simulate);
