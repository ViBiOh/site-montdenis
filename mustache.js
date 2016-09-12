const Mustache = require('mustache');
const glob = require('glob')
const fs = require('fs');
const utils = require('js-utils');

const asyncReadFile = utils.asyncifyCallback(fs.readFile);

const options = require('yargs')
  .reset()
  .options('bust', {
    alias: 'b',
    required: false,
    type: 'String',
    describe: 'Cache-buster (commit SHA-1)'
  })
  .options('partials', {
    alias: 'p',
    required: false,
    type: 'String',
    describe: 'Partials'
  })
  .options('template', {
    alias: 't',
    required: true,
    type: 'String',
    describe: 'Input file'
  })
  .help('help')
  .strict()
  .argv;

const partialPromises = [];
const partialsObj = {};
if (options.partials) {
  glob(options.partials, {}, (err, partials) => {
    partials.forEach(partial => {
      const promise = asyncReadFile(partial, 'utf-8');
      partialPromises.push(promise);
      promise.then(partialContent => {
        partial.replace(/([^\/]*?\.html)/gi, (match, name) => {
          partialsObj[name] = partialContent;
        });
      });
    });
  });
}

Promise.all(partialPromises).then(() => {
  glob(options.template, {}, (err, templates) => {
    templates.forEach(template => {
      const allFiles = [];
      allFiles.push(asyncReadFile(template.replace(/[^\/]*?\.html/gmi, 'mustache.json'), 'utf-8'));
      allFiles.push(asyncReadFile(template, 'utf-8'));

      Promise.all(allFiles).then(values => {
        console.log(Mustache.render(values[1], JSON.parse(values[0]), partialsObj));
      });
    });
  });
});
