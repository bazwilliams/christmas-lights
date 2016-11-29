"use strict";

const config = require('./config');
const awsIot = require('aws-iot-device-sdk');
const LightStrip = require('./lightStrip');
const Colour = require('./colour');
const chaserPattern = require('./generators/chaser');

const thingShadows = awsIot.thingShadow({
    keyPath: config.iotThingKeyPath,
    certPath: config.iotThingCertPath,
    caPath: config.iotCaPath,
    clientId: config.iotClientId,
    region: config.awsRegion
});

const christmasLights = new LightStrip(config.numberOfLeds);

let currentToken;
let localState = { colours: [ "black" ], repeat: true };

function convert(state) {
    return {
        frame: state.colours.map((colourName) => new Colour(colourName)),
        repeat: state.repeat
    }
}

function updateThingShadow() {
    thingShadows.update(`${config.iotThingClientId}`, { state: { reported: localState, desired: null }});
}

function updateLocalState(state) {
    let dirty = false;
    if (state) {
        if (Array.isArray(state.colours)) {
            localState.colours = state.colours;
            dirty = true;
        }
        if (typeof state.repeat === 'boolean') {
            localState.repeat = state.repeat;
            dirty = true;
        }
    }
    if (dirty) {
        christmasLights.setPattern(convert(localState));
    }
    updateThingShadow();
}

process.on('SIGINT', function () {
    christmasLights.reset();
    process.nextTick(process.exit);
});

thingShadows.register(`${config.iotThingClientId}`, {}, () => {
    currentToken = thingShadows.get(`${config.iotThingClientId}`);
});

thingShadows.on('status', (thingName, stat, clientToken, stateObject) => {
    if (clientToken === currentToken) {
        if (stat === 'rejected' && stateObject.code === 404) {
            updateThingShadow();
        } else if (stat === 'accepted') {
            updateLocalState(stateObject.state.reported);
            updateLocalState(stateObject.state.desired);
        } else {
            console.err(JSON.stringify(stateObject));
        }
    }
});

thingShadows.on('delta', (thingName, stateObject) => {
    updateLocalState(stateObject.state);
});

thingShadows.on('foreignStateChange', (thingName, operation, stateObject) => {
    if (operation === 'delete') {
        christmasLights.reset();
        process.nextTick(process.exit);
    }
});

if (config.debugRender) {
    function simulate(frame) {
        process.stdout.clearLine();  // clear current text
        process.stdout.cursorTo(0);  // move cursor to beginning of line
        process.stdout.write(frame.reduce((memo, colour) => `${memo} ${("0x000000" + colour.getUIntValue().toString(16)).substr(-6)}`, ""));
    }
    christmasLights.on('render', simulate);
}

christmasLights.setPattern(convert(localState));
christmasLights.setAnimation(chaserPattern(), config.renderDelay);