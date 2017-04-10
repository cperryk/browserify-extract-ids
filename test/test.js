'use strict';
const expect = require('chai').expect,
  fs = require('fs-extra'),
  browserify = require('browserify'),
  bl = require('bl'),
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

  it ('Exports the correct ids to the specified path', function (done) {
    browserify()
      .add(entryPath)
      .plugin(lib, {outputFile: outputFile})
      .bundle()
      .pipe(bl((err) => {
        const ids = fs.readJsonSync(path.join(__dirname, 'out.json'));

        expect(err).to.be.null;
        expect(ids).to.deep.equal(expectedIds);
        done();
      }));
  });

  it ('If "callback" is defined, passes ids file as second argument to it', function (done) {
    browserify()
      .add(entryPath)
      .plugin(lib, {
        callback: (err, result)=>{
          expect(err).to.be.null;
          expect(result).to.deep.equal(expectedIds);
        }})
      .bundle()
      .pipe(bl((err) => {
        expect(err).to.be.null;
        done();
      }));
  });


});
