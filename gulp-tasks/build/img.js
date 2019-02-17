/*!
 * Project:     cv
 * File:        ./gulp-tasks/build/img.js
 * Copyright(c) 2018-nowdays Baltrushaitis Tomas <tbaltrushaitis@gmail.com>
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //

const fs   = require('fs');
const del  = require('del');
const path = require('path');
const utin = require('util').inspect;

const readConfig = require('read-config');
const filter     = require('gulp-filter');
const jimp       = require('gulp-jimp');
const merge      = require('merge-stream');
const vPaths     = require('vinyl-paths');


//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //

let ME = Object.assign({}, global.ME || {});
utin.defaultOptions = Object.assign({}, ME.pkg.options.iopts || {});

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(ME.WD, path.dirname(module.filename));
const confPath = path.join(ME.WD, 'config', path.sep);
const modConfigFile = `${path.join(confPath, modPath, modName)}.json`;
const modConfig = readConfig(modConfigFile, ME.pkg.options.readconf);

ME.Config = Object.assign({}, ME.Config || {}, modConfig || {});

let C = ME.Config.colors;
let L = `\n${C.White}${(new Array(80).join('-'))}${C.NC}\n`;

//  ------------------------------------------------------------------------  //
//  --------------------------------  EXPOSE  ------------------------------  //
//  ------------------------------------------------------------------------  //

module.exports = function (gulp) {
  console.log(`${L}[${new Date().toISOString()}][${C.Yellow}${modPath}/${modName}${C.NC}] with [${modConfigFile}]`);

  //
  //  JIMP - responsible for image processing
  //
  let FROM = path.join(ME.BUILD, 'assets');
  let DEST = path.join(ME.BUILD, 'assets');
  let IMG  = path.join('img');
  let TUMB = path.join('thumbs');
  let SRC  = path.join(FROM, IMG, 'works', '**/*.*');


  let PNGS = gulp.src([SRC])
    .pipe(filter([
      '**/*.png'
    ]))
    .pipe(vPaths(function (p) {
      console.log(`[${new Date().toISOString()}][${C.White}JIMP${C.NC}] Crop PNG: [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(jimp({
      '': {
          autocrop: {
              tolerance: 0.0002
            , cropOnlyFrames: false
          }
        , resize: {
              width: 270
            , height: 180
          }
        , type: 'png'
      }
    }))
    .pipe(gulp.dest(path.join(DEST, IMG, TUMB, 'works')));


  let JPGS = gulp.src(SRC)
    .pipe(filter([
        '**/*.jpg'
      , '**/*.jpeg'
    ]))
    .pipe(vPaths(function (p) {
      console.log(`[${new Date().toISOString()}][${C.White}JIMP${C.NC}] Crop JPEG: [${p}]`);
      return Promise.resolve(p);
    }))
    .pipe(jimp({
      '': {
          autocrop: {
              tolerance: 0.0002
            , cropOnlyFrames: false
          }
        , resize: {
              width: 270
            , height: 180
          }
        , type: 'jpg'
      }
    }))
    .pipe(gulp.dest(path.join(DEST, IMG, TUMB, 'works')));

  return merge(PNGS, JPGS);

};
