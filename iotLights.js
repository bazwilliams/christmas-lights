"use strict";

const config = require('./config');
const awsIot = require('aws-iot-device-sdk');
const Colour = require('./colour');

const thingShadows = awsIot.thingShadow({
    keyPath: config.iotThingKeyPath,
    certPath: config.iotThingCertPath,
    caPath: config.iotCaPath,
    clientId: config.iotClientId,
    region: config.awsRegion
});

function init(christmasLights) {
    let currentToken;
    
    let localState = { colours: [ "black" ], repeat: true }
    
    function updateThingShadow() {
        thingShadows.update(`${config.iotThingClientId}`, { state: { reported: localState, desired: null }});
    }

    function convert(state) {
        return {
            frame: state.colours.map((colourName) => new Colour(colourName)),
            repeat: state.repeat
        }
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
    }

    thingShadows.register(`${config.iotThingClientId}`, {}, () => {
        currentToken = thingShadows.get(`${config.iotThingClientId}`);
    });

    thingShadows.on('delta', (thingName, stateObject) => {
        updateLocalState(stateObject.state);
        updateThingShadow();
    });

    thingShadows.on('status', (thingName, stat, clientToken, stateObject) => {
        if (clientToken === currentToken) {
            if (stat === 'rejected' && stateObject.code === 404) {
                updateThingShadow();
            } else if (stat === 'accepted') {
                updateLocalState(stateObject.state.reported);
                updateLocalState(stateObject.state.desired);
                updateThingShadow();
            } else {
                console.err(JSON.stringify(stateObject));
            }
        }
    });

    thingShadows.on('foreignStateChange', (thingName, operation, stateObject) => {
        if (operation === 'delete') {
            christmasLights.reset();
        }
    });
}

module.exports = {
    init: init
};