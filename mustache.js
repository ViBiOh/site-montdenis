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
  .options('css', {
    alias: 'c',
    required: false,
    type: 'String',
    describe: 'Inline CSS',
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
    if (typeof reject !== 'function') {
      throw err;
    }
    reject(err);
  }
}

function inline(pattern) {
  if (pattern) {
    return new Promise((resolve, reject) => {
      glob(pattern, {}, (error, files) => {
        handleError(error, reject);

        Promise.all(files.map(file => asyncReadFile(file, 'utf-8')))
          .then(contents => resolve(contents.join('')))
          .catch(err => handleError(err, reject));
      });
    });
  }
  return Promise.resolve('');
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

      Promise.all(partialsPromises)
        .then(() => resolve(partialObj))
        .catch(err => handleError(err, reject));
    });
  }));
} else {
  requiredPromises.push(Promise.resolve({}));
}

requiredPromises.push(inline(options.js));
requiredPromises.push(inline(options.css));

Promise.all(requiredPromises).then((required) => {
  const partials = required[0];
  partials.inlineJs = `<script type="text/javascript">${required[1]}</script>`;
  partials.inlineCss = `<style type="text/css">${required[2]}</script>`;

  glob(options.template, {}, (error, templates) => {
    handleError(error);

    templates.forEach((template) => {
      const mutachePath = path.join(path.dirname(template), 'mustache.json');

      Promise.all([
        asyncReadFile(template, 'utf-8'),
        new Promise((resolve, reject) => {
          fs.access(mutachePath, (err) => {
            if (err) {
              resolve('{}');
              console.warn(`No 'mustache.json' found for ${template}`);
            }
            asyncReadFile(mutachePath, 'utf-8').then(resolve, reject);
          });
        }),
      ]).then((values) => {
        const data = JSON.parse(values[1]);
        if (options.bust) {
          data.version = options.bust;
        }

        const rendered = Mustache.render(values[0], data, partials);
        if (options.output) {
          const outputFile = path.join(options.output, template.substring(outputIndexSchema));
          mkdirp(path.dirname(outputFile), (err) => {
            handleError(err);
            fs.writeFile(outputFile, rendered, handleError);
          });
        } else {
          console.log(rendered);
        }
      }).catch(handleError);
    });
  });
}).catch(error => console.log(error));
