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
        renderedData = null;
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
        it('Should not initialise strip', () => {
            expect(ws2812.init).not.to.have.been.called;
        });
        describe('when setting pattern', () => {
            beforeEach(() => {
                sut.setPattern([new Colour(0.3, 0.6, 1), new Colour(1, 0.2, 0.7)]);
            });
            it('Should initialise strip', () => {
                expect(ws2812.init).to.have.been.calledWith(numberOfLeds);
            });
            it('Should render two colours', () => {
                expect(ws2812.render).to.have.been.called;
                expect(renderedData[0]).to.be.eql(0x4c99ff);
                expect(renderedData[1]).to.be.eql(0xff33b2);
                expect(renderedData[2]).to.be.eql(0x000000);
                expect(renderedData[3]).to.be.eql(0x000000);
            });
            describe('and we set another pattern', () => {
                beforeEach(() => {
                    ws2812.init.reset();
                    sut.setPattern([new Colour(0.0, 0.0, 0.0)]);
                });
                it('Should not initialise strip again', () => {
                    expect(ws2812.init).not.to.have.been.called;
                });
            });
            describe('and we reset twice', () => {
                beforeEach(() => {
                    ws2812.init.reset();
                    sut.reset();
                    sut.reset();
                });
                it('Should reset the ws2812 once', () => {
                    expect(ws2812.reset).to.have.been.calledOnce;
                });
            });
        });
        describe('when setting pattern using object', () => {
            beforeEach(() => {
                sut.setPattern({ frame: [new Colour(0.3, 0.6, 1), new Colour(1, 0.2, 0.7)] });
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
            let strategy, initPattern, startFrame, endFrame;
            beforeEach(() => {
                initPattern = [new Colour("black"), new Colour("black"), new Colour("black"), new Colour("black")];
                strategy = sinon.spy((start, end, renderFrame) => {
                    startFrame = start;
                    endFrame = end;
                    renderFrame([new Colour(0.5, 0.5, 0.5), new Colour(0.5, 0.5, 0.5), new Colour(0.5, 0.5, 0.5), new Colour(0.5, 0.5, 0.5)]);
                    renderFrame(end);
                });
                sut.setPattern(initPattern);
                sut.setPattern([new Colour("white")], true, strategy);
            });
            it('Should call strategy', () => {
                expect(strategy).to.have.been.called;
            });
            it('Start frame should be the init frame', () => {
                expect(startFrame[0].getUIntValue()).to.be.eql(0x000000);
            });
            it('End frame should be correct', () => {
                expect(endFrame[0].getUIntValue()).to.be.eql(0xffffff);
            });
            it('Should render inbetween frame', () => {
                expect(renderedData[0]).to.be.eql(0x7f7f7f);
            });
            describe('and we set another pattern', () => {
                beforeEach(() => {
                    sut.setPattern([new Colour(0.0, 0.0, 0.0)], true, strategy);
                });
                it('Start frame should be undefined', () => {
                    expect(startFrame[0].getUIntValue()).to.be.eql(0xffffff);
                });
                it('End frame should be correct', () => {
                    expect(endFrame[0].getUIntValue()).to.be.eql(0x000000);
                });
            });
        });
        describe('when using strategy that takes no frame', () => {
            let strategy, renderedFrame;
            beforeEach(() => {
                strategy = sinon.spy((existingFrame, requestedFrame, addFrame) => {
                    addFrame(Array(4).fill(new Colour(0.3, 0.6, 1)));
                });
                sut.setPattern(strategy);
            });
            it('Should call strategy', () => {
                expect(strategy).to.have.been.called;
            });
            it('Should render expected frame', () => {
                expect(renderedData[0]).to.be.eql(0x4c99ff);
            });
        });
        describe('when using animation', (done) => {
            let pattern, patternGeneratorFunc, generatorCalled;
            beforeEach((done) => {
                pattern = {
                    frame: [ new Colour(1,1,1) ],
                    repeat: true
                };
                patternGeneratorFunc = function* testGenerator() {
                    generatorCalled = true;
                    yield pattern;
                }
                sut.setAnimation(patternGeneratorFunc(), 10);
                sut.once('render', () => {
                    sut.reset();
                    done();
                });
            });
            it('Should call the provided pattern generator func', () => {
                expect(generatorCalled).to.be.true;
            });
            it('Should render the colour from the pattern generator', () => {
                expect(ws2812.render).to.have.been.called;
            });
            describe('then reset and set another animation', (done) => {
                let pattern2, patternGenerator2Func, generator2Called;
                beforeEach((done) => {
                    ws2812.render.reset();
                    sut.reset();
                    pattern2 = {
                        frame: [ new Colour(1,1,1) ],
                        repeat: true
                    };
                    patternGenerator2Func = function* testGenerator() {
                        generator2Called = true;
                        yield pattern2;
                    }
                    sut.setAnimation(patternGenerator2Func(), 10);
                    sut.once('render', () => {
                        sut.reset();
                        done();
                    });
                });
                it('Should call the provided pattern generator func', () => {
                    expect(generator2Called).to.be.true;
                });
                it('Should render the colour from the pattern generator', () => {
                    expect(ws2812.render).to.have.been.called;
                });
            });
        });
    });
});