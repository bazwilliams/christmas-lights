"use strict";

const chai = require('chai');
const expect = chai.expect;
const Colour = require('../colour');

describe("When creating as default", () => {
    let sut, result;
    beforeEach(() => {
        sut = new Colour();
        result = sut.getUIntValue();
    });
    it('Should return 0x000000', () => {
        expect(result).to.be.eql(0x000000);
    });
});
describe("When creating with array", () => {
    let sut, result;
    beforeEach(() => {
        sut = new Colour([1, 0, 1]);
        result = sut.getUIntValue();
    });
    it("Should return 0xff00ff", () => {
        expect(result).to.be.eql(0xff00ff);
    });
});
describe("When creating as red", () => {
    let sut, result;
    beforeEach(() => {
        sut = new Colour(1,0,0);
        result = sut.getUIntValue();
    });
    it('Should return 0xff0000', () => {
        expect(result).to.be.eql(0xff0000);
    });
});
describe("When creating as green", () => {
    let sut, result;
    beforeEach(() => {
        sut = new Colour(0,1,0);
        result = sut.getUIntValue();
    });
    it('Should return 0x00ff00', () => {
        expect(result).to.be.eql(0x00ff00);
    });
});
describe("When creating as blue", () => {
    let sut, result;
    beforeEach(() => {
        sut = new Colour(0,0,1);
        result = sut.getUIntValue();
    });
    it('Should return 0x0000ff', () => {
        expect(result).to.be.eql(0x0000ff);
    });
});
describe("When creating as white", () => {
    let sut, result;
    beforeEach(() => {
        sut = new Colour(1,1,1);
        result = sut.getUIntValue();
    });
    it('Should return 0xffffff', () => {
        expect(result).to.be.eql(0xffffff);
    });
});
describe("When creating as mid grey", () => {
    let sut, result;
    beforeEach(() => {
        sut = new Colour(0.5,0.5,0.5);
        result = sut.getUIntValue();
    });
    it('Should return 0x7f7f7f', () => {
        expect(result).to.be.eql(0x7f7f7f);
    });
});