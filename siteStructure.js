#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const utils = require('js-utils');

const promiseReadFile = utils.asyncifyCallback(fs.readFile);
const promiseWriteFile = utils.asyncifyCallback(fs.writeFile);

const options = require('yargs')
  .reset()
  .options('json', {
    alias: 'j',
    required: true,
    type: 'String',
    describe: 'Input',
  })
  .options('sitemap', {
    alias: 's',
    required: true,
    type: 'String',
    describe: 'Sitemap path',
  })
  .help('help')
  .strict()
  .argv;

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

function jsonPromise(json) {
  return new Promise((resolve, reject) => {
    promiseReadFile(json, 'utf-8')
      .then((content) => {
        resolve(JSON.parse(content));
      }).catch(reject);
  });
}

function sitemapConverter(data) {
  return `<url>
     <loc>${data.url}</loc>
     <changefreq>weekly</changefreq>
     <priority>1.00</priority>
   </url>`;
}

function sitemapStructure(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                  http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
     ${urls}
   </urlset>`;
}

new Promise((resolve, reject) => {
  glob(options.json, {}, (error, jsons) => {
    handleError(error, reject);

    Promise.all(jsons.map(jsonPromise))
      .then(pages => {
          promiseWriteFile(options.sitemap, sitemapStructure(pages.map(sitemapConverter).join('')))
            .then(() => resolve(jsons.join('\n')))
            .catch(reject);
      }).catch(reject);
  });
}).then(displaySuccess).catch(displayError);
