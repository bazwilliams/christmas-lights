"use strict";

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const Colour = require('../colour');
const mockery = require('mockery');

describe('Light Strip', () => {
    let LightStrip, ws2812, renderedData, numberOfLeds;
    beforeEach(() => {
        numberOfLeds = 4;
        ws2812 = {
            reset: sinon.spy(),
            render: sinon.spy((data) => { renderedData = data }),
            setBrightness: sinon.spy(),
            init: sinon.spy()
        };
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });
        mockery.registerMock('rpi-ws281x-native', ws2812);
        LightStrip = require('../lightStrip');
    });
    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
    describe('When creating', () => {
        let sut;
        beforeEach(() => {
            sut = new LightStrip(numberOfLeds);
        });
        it('Should initialise strip', () => {
            expect(ws2812.init).to.have.been.calledWith(numberOfLeds);
        });
        it('Should set brightness to 0', () => {
            expect(ws2812.setBrightness).to.have.been.calledWith(0);
        });
        describe('when setting pattern', () => {
            beforeEach(() => {
                sut.setPattern([new Colour(0.3, 0.6, 1), new Colour(1, 0.2, 0.7)]);
            });
            it('Should render two colours', () => {
                expect(ws2812.render).to.have.been.called;
                expect(renderedData[0]).to.be.eql(0x4c99ff);
                expect(renderedData[1]).to.be.eql(0xff33b2);
                expect(renderedData[2]).to.be.eql(0x000000);
                expect(renderedData[3]).to.be.eql(0x000000);
            });
        });
        describe('when setting repeating pattern', () => {
            beforeEach(() => {
                sut.setPattern([new Colour(0.3, 0.6, 1), new Colour(1, 0.2, 0.7)], true);
            });
            it('Should render two colours', () => {
                expect(ws2812.render).to.have.been.called;
                expect(renderedData[0]).to.be.eql(0x4c99ff);
                expect(renderedData[1]).to.be.eql(0xff33b2);
                expect(renderedData[2]).to.be.eql(0x4c99ff);
                expect(renderedData[3]).to.be.eql(0xff33b2);
            });
        });
        describe('when setting pattern with a strategy', () => {
            let strategy;
            beforeEach(() => {
                strategy = { process: sinon.spy() };
                sut.setPattern([new Colour(0.3, 0.6, 1), new Colour(1, 0.2, 0.7)], true, strategy);
            });
            it('Should call strategy', () => {
                expect(strategy.process).to.have.been.called;
                expect(renderedData[0]).to.be.eql(0x4c99ff);
                expect(renderedData[1]).to.be.eql(0xff33b2);
                expect(renderedData[2]).to.be.eql(0x4c99ff);
                expect(renderedData[3]).to.be.eql(0xff33b2);
            });
        });
        describe('when reset', () => {
            beforeEach(() => {
                sut.reset();
            });
            it('Should reset the ws2812', () => {
                expect(ws2812.reset).to.have.been.called;
            });
        });
    });
});