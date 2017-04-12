'use strict';
const expect = require('chai').expect,
  fs = require('fs-extra'),
  browserify = require('browserify'),
  path = require('path'),
  lib = require('./../index');

describe('browserify-extract-ids', function () {
  const outputFile = path.join(__dirname, 'out.json'),  
    entryPath = path.join(__dirname, 'entry.js'),
    expectedIds = ['a.js', 'b.js', 'c.js', 'entry.js'].reduce((prev, curr, index) => {
      prev[path.resolve(path.join(__dirname, curr))] = index + 1;
      return prev;
    }, {});

  beforeEach(function () {
    fs.removeSync(outputFile);
  });
  afterEach(function () {
    fs.removeSync(outputFile);
  });

  it ('exports the correct ids to the specified path', function (done) {
    browserify()
      .add(entryPath)
      .plugin(lib, {outputFile: outputFile})
      .bundle((err) => {
        const ids = fs.readJsonSync(path.join(__dirname, 'out.json'));

        expect(err).to.be.null;
        expect(ids).to.deep.equal(expectedIds);
        done();
      });
  });

  it ('passes ids to second argument to callback if it is defined', function (done) {
    browserify()
      .add(entryPath)
      .plugin(lib, {
        callback: (err, result)=>{
          expect(err).to.be.null;
          expect(result).to.deep.equal(expectedIds);
        }})
      .bundle((err) => {
        expect(err).to.be.null;
        done();
      });
  });

  it ('throws error if neither outputFile nor callback is defined', function () {
    expect(()=>{
      browserify().plugin(lib);
    }).to.throw(Error);
  });


});
