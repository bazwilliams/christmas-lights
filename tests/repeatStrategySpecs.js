"use strict";

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const Colour = require('../colour');

describe("Repeat Strategy", () => {
    const Repeat = require('../strategies/repeat');
    let result;
    describe("When creating with a repeat of 4", () => {
        let renderFrame, renderedData, sut;
        beforeEach(() => {
            renderedData = [];
            renderFrame = sinon.spy((data) => { renderedData.push(data); });
            sut = new Repeat(4);
        });
        describe("and using", () => {
            beforeEach(() => {
                sut([ new Colour(1, 1, 1) ], null, renderFrame);
            });
            it('Should invoke render method 4 times with provided colour', () => {
                expect(renderFrame).to.have.been.called;
                expect(renderedData).to.have.length(4);
                expect(renderedData[1][0].getUIntValue()).to.be.eql(0xFFFFFF);
            });
        });
    });
});