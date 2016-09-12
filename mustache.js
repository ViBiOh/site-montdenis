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

const partials = options.partials ? glob.sync(options.partials) : [];

glob(options.template, {}, (err, templates) => {
  templates.forEach(template => {
    const allFiles = [];
    allFiles.push(asyncReadFile(template.replace(/[^\/]*?\.html/gmi, 'mustache.json'), 'utf-8'));
    allFiles.push(asyncReadFile(template, 'utf-8'));

    Promise.all(allFiles).then(values => {
      console.log(Mustache.render(values[1], values[0]));
    });
  });
});
