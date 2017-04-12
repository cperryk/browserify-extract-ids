const through2 = require('through2'),
  fs = require('fs-extra');

function extractIds(opts) {
  const outputFile = opts && opts.outputFile || './bundle-ids.json',
    ids = {};

  return through2.obj(function (item, enc, next) {
    ids[item.file] = item.id;
    this.push(item);
    next();
  })
  .on('end', ()=>{
    if (opts.outputFile) {
      fs.outputJsonSync(outputFile, ids);
    }
    if (opts.callback) {
      opts.callback(null, ids);
    }
  });
}

/**
 * A Browserify plugin to extract a bundle's module deps ids to a file.
 * @param  {object}  b Browserify instance
 * @param  {object}  [opts] Configuration options
 * @param  {string}  [opts.outputFile] File path of output file. Default: './bundle-ids.json'
 * @param  {function} [opts.callback] Callback function with signature <err, result: object>
 */
function extractIdsPlugin(b, opts) {

  if (!opts || (!opts.outputFile && !opts.callback)) {
    throw new Error('browserify-extract-ids requires either "outputFile" or "callback" options to be set');
  }

  b.pipeline.get('emit-deps').push(extractIds(opts));
}

module.exports = extractIdsPlugin;
