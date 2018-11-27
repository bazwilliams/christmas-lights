"use strict";

const config = require('./config');
const mqtt = require('mqtt');
const Colour = require('./colour');
const client = mqtt.connect(config.broker);

client.on('connect', () => {
    client.subscribe('house/livingroom/christmastree');
});

const animations = {
    "chase": require('./generators/chaser'),
    "blink": require('./generators/blink')
}

function init(christmasLights) {
    let currentToken;
    let localState = { animation: 'off' };

    function convert(state) {
        return {
            frame: state.colours.map((colour) => new Colour(colour)),
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
            if (state.animation === 'off' || state.animation && animations[state.animation]) {
                localState.animation = state.animation;
                dirty = true;
            }
        }
        if (localState.animation && localState.animation !== 'off' && Array.isArray(localState.colours)) {
            if (dirty) {
                christmasLights.clearAnimation();
                christmasLights.setAnimation(animations[localState.animation](convert(localState)), config.renderDelay);
            }
        } else {
            christmasLights.reset();
        }
    }

    client.on('message', (topic, data) => {
	let desiredState;
	try {
	    desiredState = JSON.parse(data.toString());
	} catch {
            console.warn("Invalid payload: " + data.toString());
	}
        updateLocalState(desiredState);
    });
}

module.exports = {
    init: init
};
