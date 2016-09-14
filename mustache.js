#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');
const Mustache = require('mustache');
const utils = require('js-utils');

const asyncReadFile = utils.asyncifyCallback(fs.readFile);

const options = require('yargs')
  .reset()
  .options('template', {
    alias: 't',
    required: true,
    type: 'String',
    describe: 'Input',
  })
  .options('bust', {
    alias: 'b',
    required: false,
    type: 'String',
    describe: 'Cache-buster (commit SHA-1)',
  })
  .options('partials', {
    alias: 'p',
    required: false,
    type: 'String',
    describe: 'Partials',
  })
  .options('js', {
    alias: 'j',
    required: false,
    type: 'String',
    describe: 'Inline JavaScript',
  })
  .options('output', {
    alias: 'o',
    required: false,
    type: 'String',
    describe: 'Output',
  })
  .help('help')
  .strict()
  .argv;

function handleError(err, reject) {
  if (err) {
    if (reject) {
      reject(err);
    }
    throw err;
  }
}

const outputIndexSchema = Math.max(0, options.template.indexOf('*'));
const requiredPromises = [];

if (options.partials) {
  requiredPromises.push(new Promise((resolve, reject) => {
    glob(options.partials, {}, (error, partials) => {
      handleError(error, reject);

      const partialObj = {};
      const partialsPromises = [];

      partials.forEach((partial) => {
        const promise = asyncReadFile(partial, 'utf-8');
        partialsPromises.push(promise);
        promise.then((partialContent) => {
          partialObj[path.basename(partial)] = partialContent;
        });
      });

      Promise.all(partialsPromises).then(() => resolve(partialObj)).catch(err => handleError(err, reject));
    });
  }));
} else {
  requiredPromises.push(Promise.resolve({}));
}

if (options.js) {
  requiredPromises.push(new Promise((resolve, reject) => {
    glob(options.js, {}, (error, jsFiles) => {
      handleError(error, reject);

      const jsPromises = [];

      jsFiles.forEach((inlinedJs) => {
        jsPromises.push(asyncReadFile(inlinedJs, 'utf-8'));
      });

      Promise.all(jsPromises).then(js => resolve(js.join(''))).catch(err => handleError(err, reject));
    });
  }));
} else {
  requiredPromises.push(Promise.resolve(''));
}

Promise.all(requiredPromises).then((required) => {
  const partials = required[0];
  partials.inlineJs = `<script type="text/javascript">${required[1]}</script>`;

  glob(options.template, {}, (error, templates) => {
    handleError(error);

    templates.forEach((template) => {
      Promise.all([
        asyncReadFile(path.join(path.dirname(template), 'mustache.json'), 'utf-8'),
        asyncReadFile(template, 'utf-8'),
      ]).then((values) => {
        const data = JSON.parse(values[0]);
        if (options.bust) {
          data.version = options.bust;
        }

        const rendered = Mustache.render(values[1], data, partials);
        if (options.output) {
          const outputFile = path.join(options.output, template.substring(outputIndexSchema));
          mkdirp(path.dirname(outputFile), (err) => {
            handleError(err);
            fs.writeFile(outputFile, rendered, handleError);
          });
        } else {
          console.log(rendered);
        }
      });
    });
  });
}).catch(error => console.error(error));
