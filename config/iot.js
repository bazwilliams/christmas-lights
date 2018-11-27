"use strict";

let config = require('12factor-config');
let dotenv = require('dotenv');

dotenv.config({silent: true});

let cfg = config({
    awsRegion : {
        env      : 'awsRegion',
        type     : 'string',
        required : true
    },
    iotThingKeyPath: {
        env      : 'iotThingKeyPath',
        type     : 'string',
        required : true
    },
    iotThingCertPath: {
        env      : 'iotThingCertPath',
        type     : 'string',
        required : true
    },
    iotCaPath: {
        env      : 'iotCaPath',
        type     : 'string',
        required : true
    },
    iotThingClientId: {
        env      : 'iotThingClientId',
        type     : 'string',
        required : true
    },
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
    debugRender: {
        env      : 'debugRender',
        type    : 'boolean',
        default : false
    }
});

module.exports = cfg;