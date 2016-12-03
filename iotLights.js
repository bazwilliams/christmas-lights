"use strict";

const config = require('./config');
const awsIot = require('aws-iot-device-sdk');
const Colour = require('./colour');
const chaserPattern = require('./generators/chaser');

const thingShadows = awsIot.thingShadow({
    keyPath: config.iotThingKeyPath,
    certPath: config.iotThingCertPath,
    caPath: config.iotCaPath,
    clientId: config.iotClientId,
    region: config.awsRegion
});

function init(christmasLights) {
    let currentToken;
    let localState = {};

    function fetchThingShadow() {
        currentToken = thingShadows.get(`${config.iotThingClientId}`);
    }

    function updateThingShadow() {
        thingShadows.update(`${config.iotThingClientId}`, { state: { reported: localState, desired: null }});
    }

    function createThingShadow() {
        localState = { animation: 'off' };
        updateThingShadow();
        fetchThingShadow();
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
            if (state.animation) {
                localState.animation = state.animation;
                dirty = true;
            }
        }
        if (localState.animation && localState.animation !== 'off' && Array.isArray(localState.colours)) {
            if (dirty) {
                christmasLights.setPattern(convert(localState));
                christmasLights.setAnimation(chaserPattern(), config.renderDelay);
            }
        } else {
            christmasLights.reset();
        }
    }

    function register() {
        thingShadows.register(`${config.iotThingClientId}`, {}, () => {
            fetchThingShadow();
        });
    }

    function unregister() {
        thingShadows.unregister(`${config.iotThingClientId}`);
    }

    thingShadows.on('delta', (thingName, stateObject) => {
        updateLocalState(stateObject.state);
        updateThingShadow();
    });

    thingShadows.on('status', (thingName, stat, clientToken, stateObject) => {
        if (clientToken === currentToken) {
            if (stat === 'rejected' && stateObject.code === 404) {
                createThingShadow();
            } else if (stat === 'accepted') {
                updateLocalState(stateObject.state.reported);
                updateLocalState(stateObject.state.desired);
                updateThingShadow();
            } else {
                console.err(`${thingName}: ${stat}: ${clientToken} ${JSON.stringify(stateObject)}`);
            }
        }
    });

    thingShadows.on('foreignStateChange', (thingName, operation, stateObject) => {
        if (operation === 'delete') {
            unregister();
            register();
            createThingShadow();
        }
    });

    register();
}

module.exports = {
    init: init
};