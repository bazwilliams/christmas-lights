"use strict";

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const mockery = require('mockery');

describe('AWS Iot Interface', () => {
    let awsIot, sut, numberOfLeds, mockThing, eventHandlers;
    beforeEach(() => {
        eventHandlers = {};
        mockThing = {
                register: sinon.spy((id, options, callback) => {
                            callback();
                        }),
                get: sinon.stub().returns("clientToken"),
                on: (eventName, callback) => eventHandlers[eventName] = callback,
                update: sinon.spy()
            };
        awsIot = {
            thingShadow: sinon.stub().returns(mockThing)
        };
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });
        mockery.registerMock('./config', { iotThingClientId: 'testThing' });
        mockery.registerMock('aws-iot-device-sdk', awsIot);
        sut = require('../iotLights');
    });
    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
    it('Should connect to AWS Iot', () => {
        expect(awsIot.thingShadow).to.be.have.been.called;
    });
    describe('When initialised', () => {
        let lightstrip;
        beforeEach(() => {
            lightstrip = {
                setPattern: sinon.spy(),
                reset: sinon.spy()
            }
            sut.init(lightstrip);
        });
        it('Should call register', () => {
            expect(mockThing.register).to.have.been.calledWith('testThing');
        });
        it('Should request the current state of the shadow', () => {
            expect(mockThing.get).to.have.been.calledWith('testThing');
        });
        describe('when status event rejected with correct token', () => {
            beforeEach(() => {
                eventHandlers.status('testThing', 'rejected', 'clientToken', { code: 404 });
            });
            it('Should update thing shadow with a default settings', () => {
                expect(mockThing.update).to.have.been.calledWith('testThing', { state: { reported: { colours: [ "black" ], repeat: true }, desired: null } });
            });
        });
        describe('when delta event recieved', () => {
            let deltaDocument;
            beforeEach(() => {
                deltaDocument = {
                    state: {
                        colours: [ "yellow" ]
                    }
                };
                eventHandlers.delta('testThing', deltaDocument);
            });
            it('Should set the state of the lightStrip', () => {
                expect(lightstrip.setPattern).to.have.been.called;
                expect(lightstrip.setPattern.args[0][0].frame[0].getUIntValue()).to.be.eql(0xFFFF00);
                expect(lightstrip.setPattern.args[0][0].repeat).to.be.true;
            });
            it('Should update thing shadow with a confirmed state', () => {
                expect(mockThing.update).to.have.been.calledWith('testThing', { state: { reported: { colours: [ "yellow" ], repeat: true }, desired: null } });
            });
        });
        describe('when thing shadow is deleted', () => {
            beforeEach(() => {
                eventHandlers.foreignStateChange('testThing', 'delete', {});
            });
            it('Should reset lightstrip', () => {
                expect(lightstrip.reset).to.have.been.called;
            });
        });
        describe('when status event accepted with correct token', () => {
            let shadowDocument;
            beforeEach(() => {
                shadowDocument = {
                    state: {
                        reported: {
                            colours: [ "red" ],
                            repeat: true
                        }
                    }
                };
                eventHandlers.status('testThing', 'accepted', 'clientToken', shadowDocument);
            });
            it('Should set the state of the lightStrip', () => {
                expect(lightstrip.setPattern).to.have.been.called;
                expect(lightstrip.setPattern.args[0][0].frame[0].getUIntValue()).to.be.eql(0xFF0000);
                expect(lightstrip.setPattern.args[0][0].repeat).to.be.true;
            });
            it('Should update thing shadow with a confirmed state', () => {
                expect(mockThing.update).to.have.been.calledWith('testThing', { state: { reported: { colours: [ "red" ], repeat: true }, desired: null } });
            });
        });
        describe('when status event accepted with outstanding delta and correct token', () => {
            let shadowDocument;
            beforeEach(() => {
                shadowDocument = {
                    state: {
                        reported: {
                            colours: [ "red" ],
                            repeat: true
                        },
                        desired: {
                            colours: [ "blue" ],
                            repeat: false
                        }
                    }
                };
                eventHandlers.status('testThing', 'accepted', 'clientToken', shadowDocument);
            });
            it('Should set the state of the lightStrip', () => {
                expect(lightstrip.setPattern).to.have.been.calledTwice;
                expect(lightstrip.setPattern.args[1][0].frame[0].getUIntValue()).to.be.eql(0x0000FF);
                expect(lightstrip.setPattern.args[1][0].repeat).to.be.false;
            });
            it('Should update thing shadow with a confirmed state', () => {
                expect(mockThing.update).to.have.been.calledWith('testThing', { state: { reported: { colours: [ "blue" ], repeat: false }, desired: null } });
            });
        });
        describe('when status event accepted with partial delta and correct token', () => {
            let shadowDocument;
            beforeEach(() => {
                shadowDocument = {
                    state: {
                        reported: {
                            colours: [ "red" ],
                            repeat: true
                        },
                        desired: {
                            repeat: false
                        }
                    }
                };
                eventHandlers.status('testThing', 'accepted', 'clientToken', shadowDocument);
            });
            it('Should set the state of the lightStrip', () => {
                expect(lightstrip.setPattern).to.have.been.calledTwice;
                expect(lightstrip.setPattern.args[1][0].frame[0].getUIntValue()).to.be.eql(0xFF0000);
                expect(lightstrip.setPattern.args[1][0].repeat).to.be.false;
            });
            it('Should update thing shadow with a confirmed state', () => {
                expect(mockThing.update).to.have.been.calledWith('testThing', { state: { reported: { colours: [ "red" ], repeat: false }, desired: null } });
            });
        });
    });
});