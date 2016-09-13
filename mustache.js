const fs = require('fs');
const path = require('path');
const glob = require('glob');
const Mustache = require('mustache');
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
    describe: 'Input'
  })
  .options('output', {
    alias: 'o',
    required: false,
    type: 'String',
    describe: 'Output dir'
  })
  .help('help')
  .strict()
  .argv;

var partialPromise;
if (options.partials) {
  partialPromise = new Promise((resolve, reject) => {
    glob(options.partials, {}, (err, partials) => {
      if (err) {
        reject(err);
      }

      const partialObj = {};
      const partialsPromises = [];

      partials.forEach(partial => {
        const promise = asyncReadFile(partial, 'utf-8');
        partialsPromises.push(promise);
        promise.then(partialContent => partialObj[path.basename(partial)] = partialContent);
      });

      Promise.all(partialsPromises).then(() => resolve(partialObj)).catch(err => reject(err));
    });
  });
} else {
  partialPromise = Promise.resolve({});
}

partialPromise.then(partials => {
  glob(options.template, {}, (err, templates) => {
    if (err) {
      reject(err);
    }

    templates.forEach(template => {
      Promise.all([
        asyncReadFile(path.join(path.dirname(template), 'mustache.json'), 'utf-8'),
        asyncReadFile(template, 'utf-8')
      ]).then(values => console.log(Mustache.render(values[1], JSON.parse(values[0]), partials)));
    });
  });
}).catch(err => console.error(err));
