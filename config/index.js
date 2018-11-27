"use strict";

let config = require('12factor-config');
let dotenv = require('dotenv');

dotenv.config({silent: true});

let cfg = config({
    numberOfLeds: {
        env      : 'numberOfLeds',
        type     : 'integer',
        required : true
    },
    renderDelay: {
        env      : 'renderDelay',
        type     : 'integer',
        required : true
    },
    broker: {
        env      : 'broker',
	type     : 'string',
	required : true
    }
});

module.exports = cfg;
