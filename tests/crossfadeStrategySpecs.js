"use strict";

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const Colour = require('../colour');

describe("Crossfade Strategy", () => {
    const Crossfade = require('../strategies/crossfade');
    let result;
    describe("When using", () => {
        let renderFrame, renderedData;
        beforeEach(() => {
            renderedData = [];
            renderFrame = sinon.spy((data) => { renderedData.push(data); });
        });
        describe("in default configuration", () => {
            beforeEach(() => {
                Crossfade([new Colour(0, 0, 0)], [new Colour(1, 1, 1)], renderFrame);
            });
            it('Should invoke render method', () => {
                expect(renderFrame).to.have.been.called;
                expect(renderedData).to.have.length(1);
                expect(renderedData[0][0].getUIntValue()).to.be.eql(0xFFFFFF);
            });
        });
        describe("with 1 inbetweening steps", () => {
            beforeEach(() => {
                Crossfade([ new Colour(0, 0, 0) ], [ new Colour(1, 1, 1)], renderFrame, 1);
            });
            it('Should invoke render method', () => {
                expect(renderFrame).to.have.been.called;
                expect(renderedData).to.have.length(2);
                expect(renderedData[0][0].getUIntValue()).to.be.eql(0x7F7F7F);
                expect(renderedData[1][0].getUIntValue()).to.be.eql(0xFFFFFF);
            });
        });
        xdescribe("with 2 inbetweening steps", () => {
            beforeEach(() => {
                Crossfade([ new Colour(0, 0, 0) ], [ new Colour(1, 1, 1)], renderFrame, 2);
            });
            it('Should invoke render method', () => {
                expect(renderFrame).to.have.been.called;
                expect(renderedData).to.have.length(5);
                expect(renderedData[0][0].getUIntValue()).to.be.eql(0x000000);
                expect(renderedData[1][0].getUIntValue()).to.be.eql(0x3F3F3F);
                expect(renderedData[1][0].getUIntValue()).to.be.eql(0x7F7F7F);
                expect(renderedData[1][0].getUIntValue()).to.be.eql(0xBFBFBF);
                expect(renderedData[2][0].getUIntValue()).to.be.eql(0xFFFFFF);
            });
        });
    });
});