#!/usr/bin/env node

/**
 * Compiles src YAML translation files to JSON in the www directory
 */
var YAML = require('yamljs'),
  fs = require('fs');

var
  I18N_SRC_DIR = 'src/assets/i18n/',
  I18N_DST_DIR = 'www/assets/i18n/';

var files = fs.readdirSync('src/assets/i18n/');

files.forEach(function(ymlFile) {
  try {
    var obj = YAML.load(I18N_SRC_DIR + ymlFile);
    var jsonFile = ymlFile.replace('.yml','.json');
    fs.writeFileSync(I18N_DST_DIR + jsonFile, JSON.stringify(obj),  'utf8');
    fs.unlinkSync(I18N_DST_DIR + ymlFile);
  } catch (e) {
    console.log(e);
  }

});
