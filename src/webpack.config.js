const backgroundConfig = require('./webpack-pipeline/background.config');
const optionsConfig = require('./webpack-pipeline/options.config');
const popupConfig = require('./webpack-pipeline/popup.config');
const dkbContentConfig = require('./webpack-pipeline/dkbContent.config');

module.exports = [backgroundConfig, optionsConfig, popupConfig, dkbContentConfig];
