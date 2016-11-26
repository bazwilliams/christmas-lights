"use strict";

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const Colour = require('../colour');

describe("Shifting Strategy", () => {
    const Shift = require('../strategies/shift');
    let result;
    describe("When creating with default values", () => {
        let renderFrame, renderedData, sut;
        beforeEach(() => {
            renderedData = [];
            renderFrame = sinon.spy((data) => { renderedData.push(data); });
            sut = new Shift();
        });
        describe("and using", () => {
            beforeEach(() => {
                sut([ new Colour('white'), new Colour('red'), new Colour('red'), new Colour('red')  ], null, renderFrame);
            });
            it('Should invoke render method new frame shifted up once', () => {
                expect(renderFrame).to.have.been.called;
                expect(renderedData).to.have.length(1);
                expect(renderedData[0][0].getUIntValue()).to.be.eql(0xFF0000);
                expect(renderedData[0][1].getUIntValue()).to.be.eql(0xFFFFFF);
                expect(renderedData[0][2].getUIntValue()).to.be.eql(0xFF0000);
                expect(renderedData[0][3].getUIntValue()).to.be.eql(0xFF0000);
            });
        });
    });
});