#!/usr/bin/env node

const glob = require('glob');
const path = require('path');
const mkdirp = require('mkdirp');
const jpegtran = require('jpegtran-bin');
const utils = require('js-utils');
const execFile = require('child_process').execFile;

const promiseMkdirP = utils.asyncifyCallback(mkdirp);

const options = require('yargs')
  .reset()
  .options('input', {
    alias: 'i',
    required: true,
    type: 'String',
    describe: 'Input',
  })
  .options('output', {
    alias: 'o',
    required: true,
    type: 'String',
    describe: 'Output',
  })
  .help('help')
  .strict()
  .argv;

const OUTPUT_INDEX_SCHEMA = Math.max(0, options.input.indexOf('*'));

function handleError(error, reject) {
  if (error) {
    reject(error);
  }
}

function displaySuccess(output) {
  console.log(output);
}

function displayError(error) {
  if (error instanceof Error) {
    console.error(error.stack);
  } else {
    console.error(error);
  }
  process.exit(1);
}

function jpegPromise(image) {
  return new Promise((resolve, reject) => {
    const outputFile = path.join(options.output, image.substring(OUTPUT_INDEX_SCHEMA));
    promiseMkdirP(path.dirname(outputFile))
      .then(() => {
        execFile(jpegtran, ['-optimize', '-progressive', '-copy', 'none', '-outfile', outputFile, image], (err) => {
          if (err) {
            handleError(err, reject);
            return;
          }
          resolve(image);
        });
      }).catch(reject);
  });
}

new Promise((resolve, reject) => {
  glob(options.input, {}, (error, images) => {
    handleError(error, reject);

    Promise.all(images.map(image => jpegPromise(image)))
      .then(values => resolve(values.join('\n')))
      .catch(reject);
  });
}).then(displaySuccess).catch(displayError);
