const Mustache = require('mustache');

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
    array: true,
    type: 'String',
    describe: 'Partials'
  })
  .options('json', {
    alias: 'j',
    required: false,
    type: 'String',
    describe: 'JSON containing values'
  })
  .options('input', {
    alias: 'i',
    required: true,
    type: 'String',
    describe: 'Input file'
  })
  .help('help')
  .strict()
  .argv;
